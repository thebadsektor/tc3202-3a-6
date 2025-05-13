import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  writeBatch,
  doc,
  getDoc,
  query, orderBy,
  updateDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBf4xDYf1i5UDAc9jpB33Cein_sgATriyw",
  authDomain: "techforecastinitial.firebaseapp.com",
  projectId: "techforecastinitial",
  storageBucket: "techforecastinitial.firebasestorage.app",
  messagingSenderId: "1022311444244",
  appId: "1:1022311444244:web:ef464c4c03285bb351dc01",
  measurementId: "G-G421TQ07R4"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let currentUser = null;
let originalProductData = null;

// Get product info from query params
const params = new URLSearchParams(window.location.search);
const brand = params.get("brand");
const productId = params.get("id");

if (!brand || !productId) {
  alert("Missing brand or product ID in the URL.");
  throw new Error("Missing brand or productId");
}

onAuthStateChanged(auth, async (user) => {
  showLoadingSpinner();
  if (!user) {
    alert("You must be signed in.");
    return;
  }

  currentUser = user;

  const ref = doc(db, "cart", currentUser.uid, brand, productId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    alert("Product not found.");
    return;
  }

  const data = snap.data();

  originalProductData = {
    brand,
    productId,
    modelname: data.modelname || "",
    description: data.description || "",
    price: parseFloat(data.price || 0),
    discount: parseFloat(data.discount || 0),
    specs: data.specs || "",
    feature: data.feature || "",
    stock: parseInt(data.stock || 1)
  };

  document.getElementById("modal-product-image").src = data.image || "images/default.png";
  document.getElementById("brand").value = brand;
  document.getElementById("category").value = productId;
  document.getElementById("modelname").value = data.modelname || "";
  document.getElementById("description").value = data.description || "";
  document.getElementById("price").value = data.price || 0;
  document.getElementById("discount").value = data.discount || 0;
  document.getElementById("specs").value = data.specs || "";
  document.getElementById("features").value = data.feature || "";
  document.getElementById("stock").value = data.stock || 1;

  hideLoadingSpinner();

  document.getElementById("edit-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    saveProduct();
  });
});

// Function to save the updated product
async function saveProduct() {
  const productId = document.getElementById("category").value;
  const brand = document.getElementById("brand").value;
  const modelname = document.getElementById("modelname").value;
  const description = document.getElementById("description").value;
  const price = parseFloat(document.getElementById("price").value);
  const discount = parseFloat(document.getElementById("discount").value);
  const specs = document.getElementById("specs").value;
  const feature = document.getElementById("features").value;
  const stock = parseInt(document.getElementById("stock").value);

  const productRef = doc(db, "cart", currentUser.uid, brand, productId);
  const finalPrice = Math.round(price - (price * discount / 100));

  const hasChanges =
    modelname !== originalProductData.modelname ||
    description !== originalProductData.description ||
    price !== originalProductData.price ||
    discount !== originalProductData.discount ||
    specs !== originalProductData.specs ||
    feature !== originalProductData.feature ||
    stock !== originalProductData.stock;

  if (!hasChanges) {
    Swal.fire({
      title: "No Changes Detected",
      text: "You haven't modified any product information.",
      icon: "info",
      timer: 2500,
      showConfirmButton: false
    });
    return;
  }

  if (!modelname || !description || !price || !specs || !feature || !stock) {
    Swal.fire({
      icon: 'error',
      title: 'Missing Information',
      text: 'Please fill out all of the informations.'
    });
    return;
  }

  if (discount > 50) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Discount',
      text: 'Discount cannot be greater than 50%.'
    });
    return;
  }

  try {
    showsavingspinner();
    const docSnap = await getDoc(productRef);
    if (docSnap.exists()) {
      await updateDoc(productRef, {
        modelname,
        description,
        price,
        discount,
        finalPrice,
        specs,
        feature,
        stock
      });

      if (stock <= 20) {
        const userId = currentUser.uid;
        const notificationMessage = `✅ The stocks for "${brand} ${modelname}" has running low.`;
        const notificationRef = doc(db, "notifications", userId, "logs", new Date().toISOString());
  
        await setDoc(notificationRef, {
          message: notificationMessage,
          timestamp: new Date(),
          read: "no"
        });
      }

      hideLoadingSpinner();
      Swal.fire({
        title: "Updated",
        text: "Product updated successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        window.location.href = "cart.html"; // Redirect or refresh page
      });
    } else {
      hideLoadingSpinner();
      Swal.fire({
        title: "Error",
        text: "Product not found. Cannot update a non-existing item.",
        icon: "error",
        timer: 3000,
        showConfirmButton: false
      });
    }
  } catch (error) {
    hideLoadingSpinner();
    console.error("Error updating product:", error);
    Swal.fire({
      title: "Error",
      text: `An error occurred while updating the product: ${error.message}`,
      icon: "error",
      timer: 3000,
      showConfirmButton: false
    });
  }
}

// ✅ Hide Loading Spinner
function hideLoadingSpinner() {
    Swal.close(); // Closes the loading alert before showing a new one
  }

  function showLoadingSpinner() {
    Swal.fire({
        title: "Loading...",
        text: "Please Wait...",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading();
        }
    });
}
  
  function showsavingspinner() {
    Swal.fire({
        title: "Saving Changes...",
        text: "Please wait...",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading();
        }
    });
  }

window.logoutUser = async function () {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "Do you really want to log out?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, log out",
    cancelButtonText: "No, stay",
    reverseButtons: true
  });

  if (result.isConfirmed) {
    try {
      await signOut(auth);
      Swal.fire({
        title: "Logged Out",
        text: "You have been logged out successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        window.location.href = "index.html";
      });
    } catch (error) {
      console.error("Logout error:", error);
      Swal.fire({
        title: "Logout Error",
        text: "An error occurred while logging out.",
        icon: "error",
        timer: 3000,
        showConfirmButton: false
      });
    }
  }
};

async function checkNotificationStatus(userId) {
  try {
    const bellImage = document.querySelector('.notification-bell');
    bellImage.src = "img_svg/load.jpg";

    const notificationsRef = collection(db, "notifications", userId, "logs");
    const querySnapshot = await getDocs(notificationsRef);

    let isUnread = false;

    querySnapshot.forEach((doc) => {
      const notification = doc.data();
      if (notification.read === "no") {
        isUnread = true;
      }
    });

    bellImage.src = isUnread ? "img_svg/notificationwith.jpg" : "img_svg/notification.jpg";
  } catch (error) {
    console.error("Error checking notification status:", error);
    const bellImage = document.querySelector('.notification-bell');
    bellImage.src = "img_svg/notification.jpg";
  }
}

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    checkNotificationStatus(user.uid);
  }
});

// Function to toggle the visibility of notifications when the bell is clicked
function toggleNotifications() {
  const notificationContainer = document.getElementById("notification-container");
  notificationContainer.style.display = (notificationContainer.style.display === "none" || notificationContainer.style.display === "") ? "block" : "none";
  
  // Fetch and display notifications if they are not already loaded
  if (notificationContainer.style.display === "block") {
      fetchNotifications();
  }
}

async function fetchNotifications() {
  const user = auth.currentUser;
  if (!user) {
    console.error("No user is signed in.");
    return;
  }

  const userId = user.uid;
  const notificationsRef = collection(db, "notifications", userId, "logs");
  const q = query(notificationsRef, orderBy("timestamp", "desc"));

  try {
    const querySnapshot = await getDocs(q);

    const notificationList = document.getElementById("notifications-list");
    notificationList.innerHTML = "";

    // 👉 Check if there are no notifications
    if (querySnapshot.empty) {
      notificationList.innerHTML = `<div class="notification empty">Empty notification</div>`;
      return;
    }

    // Display each notification
    querySnapshot.forEach(doc => {
      const notification = doc.data();
      const notificationElement = document.createElement("div");
      notificationElement.classList.add("notification");

      if (notification.read === "no") {
        notificationElement.classList.add("unread");
      } else {
        notificationElement.classList.add("read");
      }

      notificationElement.innerHTML = `
        <p>${notification.message}</p>
        <span class="timestamp">${new Date(notification.timestamp.seconds * 1000).toLocaleString()}</span>
      `;

      notificationList.appendChild(notificationElement);
    });

  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
}

window.toggleNotifications = function () {
  const notificationContainer = document.getElementById("notification-container");
  notificationContainer.style.display = (notificationContainer.style.display === "none" || notificationContainer.style.display === "") ? "block" : "none";
  
  // Fetch and display notifications if container is shown
  if (notificationContainer.style.display === "block") {
      fetchNotifications();
  }
};

async function deleteAllNotifications() {
  const user = auth.currentUser;
  if (!user) return;

  const userId = user.uid;
  const logsRef = collection(db, "notifications", userId, "logs");

  const snapshot = await getDocs(logsRef);
  const batch = writeBatch(db);

  snapshot.forEach(doc => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  document.getElementById("notifications-list").innerHTML = "";
  location.reload(); // Refresh the page to update bell image and UI
}

async function markAllAsRead() {
  const user = auth.currentUser;
  if (!user) return;

  const userId = user.uid;
  const logsRef = collection(db, "notifications", userId, "logs");

  const snapshot = await getDocs(logsRef);
  const batch = writeBatch(db);

  snapshot.forEach(doc => {
    batch.update(doc.ref, { read: "yes" });
  });

  await batch.commit();
  fetchNotifications(); // Optional: update UI
  location.reload();    // Refresh the page to update the bell image
}

window.markAllAsRead = markAllAsRead;
window.deleteAllNotifications = deleteAllNotifications;

document.addEventListener("DOMContentLoaded", function () {

  const path = window.location.pathname;
  if (path.includes("edit-product.html")) {
    const editproductbtn = document.getElementById("editproductbtn");
    if (editproductbtn) {
      editproductbtn.classList.add("active");
    }
  }

});