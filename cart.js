import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signOut
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  getDoc,
  writeBatch
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

// Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Render stars
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  let stars = "★".repeat(fullStars);
  if (halfStar) stars += "☆";
  stars += "☆".repeat(5 - stars.length);
  return stars;
}

// Load cart items by looping brands
async function loadCartItems(userId) {
  const brands = ["Apple", "Samsung", "Sony", "HP", "Other Brands"];
  const cartContainer = document.getElementById("cart-container");
  cartContainer.innerHTML = "<p>Loading your cart...</p>";

  const items = [];

  for (const brand of brands) {
    const brandRef = collection(db, "cart", userId, brand);
    const snapshot = await getDocs(brandRef);

    snapshot.forEach(doc => {
      items.push({
        id: doc.id,
        brand,
        ...doc.data()
      });
    });
  }

  if (items.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cartContainer.innerHTML = "";
  for (const item of items) {
    const {
      id: product,
      brand,
      modelname,
      rating = 3.5,
      price = 0,
      finalPrice = price,
      discount = 0,
      stock = 1,
      image: imageUrl = "default.png"
    } = item;

    const productElement = document.createElement("div");
    productElement.classList.add("product");

    const priceSection = discount === 0
    ? `<div>Price : ₱${price.toLocaleString()}</div>`
    : `
      <div>
        <span style="text-decoration: line-through; color: red;">₱${price.toLocaleString()}</span> 
        <span style="color: black; font-weight: bold;">₱${finalPrice.toLocaleString()}</span>
        <span style="color: green;">(${discount}% off)</span>
      </div>
    `;

    productElement.innerHTML = `
      <img src="${imageUrl}" alt="${product}" style="max-width:200px;">
      <div class="details">
        <strong>${brand} - ${product}</strong>
        <span>Model Name : ${modelname}</span>
        <div class="rating-display">
        <div class="stars-outer">
          <div class="stars-inner" style="width: ${parseFloat(rating) / 5 * 100}%"></div>
        </div>
        <span class="rating-number">${parseFloat(rating).toFixed(1)}</span>
        </div>
        ${priceSection}
        <div class="stock-control">
          <span>Stock : ${stock}</span>
        </div>
        <div class="action-buttons">
          <button class="edit-btn" data-id="${product}" data-brand="${brand}">Edit</button>
          <button class="delete-btn" data-id="${product}" data-brand="${brand}">Delete</button>
        </div>
      </div>
    `;

    cartContainer.appendChild(productElement);
  }

  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', handleEditProduct);
  });

  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', handleDeleteProduct);
  });
}

let originalProductData = {};

function handleEditProduct(event) {
  const productId = event.currentTarget.getAttribute('data-id');
  const brand = event.currentTarget.getAttribute('data-brand');
  window.location.href = `edit-product.html?brand=${brand}&id=${productId}`;
}

document.addEventListener("DOMContentLoaded", function () {

  const path = window.location.pathname;
  if (path.includes("cart.html")) {
    const cartbtn = document.getElementById("cartbtn");
    if (cartbtn) {
      cartbtn.classList.add("active");
    }
  }


  document.getElementById("save-btn").addEventListener("click", saveProduct);
  document.getElementById("exit-btn").addEventListener("click", closeEditModal);
});

// Function to close the modal
function closeEditModal() {
  document.getElementById("edit-modal").style.display = "none";
}

// Function to save the updated product
async function saveProduct() {
  const productId = document.getElementById("category").value; // Get product ID from hidden input or data attribute
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
  // 🔍 Check if any changes were made
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

  if(!modelname || !description ||!price || !specs || !feature || !stock){
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
    // Update the product data in Firestore
    const docSnap = await getDoc(productRef)
    if (docSnap.exists()) {
      await updateDoc(productRef, {
        modelname,
        description,
        price,
        discount,
        finalPrice,
        finalPrice,
        specs,
        feature,
        stock
      });
    
    hideLoadingSpinner();
    Swal.fire({
      title: "Updated",
      text: "Product updated successfully.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      closeEditModal();
      loadCartItems(currentUser.uid); // Reload the cart to reflect changes
    });
  }else {
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

let currentUser = null; // Declare a global variable to store the user object

// Auth and user info display
onAuthStateChanged(auth, async (user) => {
  const userNameEl = document.getElementById("userName");

  if (!user) {
    await signInAnonymously(auth);
    return;
  }

  // Store the user object globally
  currentUser = user; // Store the user globally for later use

  // Load cart items
  loadCartItems(user.uid);
  // Load user name
  const userDocRef = doc(db, "users", user.uid);
  // You can load additional user info here if needed
});

// Handle Delete product
async function handleDeleteProduct(event) {
  if (!currentUser) {
    console.error("User not authenticated.");
    return;
  }

  const productId = event.target.getAttribute('data-id');
  const brand = event.target.getAttribute('data-brand');
  const productElement = event.target.closest(".product"); // Get the product container

  const result = await Swal.fire({
    title: "Are you sure?",
    text: "Do you really want to delete this product from your cart?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "No, keep it",
    reverseButtons: true
  });

  if (result.isConfirmed) {
    try {
      showloginLoadingSpinner();
      // Check if the productId, brand, and currentUser.uid are correct
      console.log("Deleting product with ID:", productId);
      console.log("Brand:", brand);
      console.log("User ID:", currentUser.uid);

      const productRef = doc(db, "cart", currentUser.uid, brand, productId);
      console.log("Firestore path:", productRef.path); // Log the Firestore path to check correctness

      await deleteDoc(productRef);

      // Remove the product element from DOM
      productElement.remove();

      hideLoadingSpinner();

      Swal.fire({
        title: "Deleted",
        text: "Product deleted successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      hideLoadingSpinner();
      console.error("Error deleting product:", error.message);
      Swal.fire({
        title: "Error",
        text: `An error occurred while deleting the product: ${error.message}`,
        icon: "error",
        timer: 3000,
        showConfirmButton: false
      });
    }
  }
}

// Auth and user info display
onAuthStateChanged(auth, async (user) => {
  const userNameEl = document.getElementById("userName");

  if (!user) {
    await signInAnonymously(auth);
    return;
  }

  // Load cart
  loadCartItems(user.uid);
  // Load user name
  const userDocRef = doc(db, "users", user.uid);

});

// Logout handler
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

// ✅ Hide Loading Spinner
function hideLoadingSpinner() {
  Swal.close(); // Closes the loading alert before showing a new one
}

function showloginLoadingSpinner() {
  Swal.fire({
      title: "Deleting...",
      text: "Please wait...",
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