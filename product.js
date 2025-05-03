import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const params = new URLSearchParams(window.location.search);
const urlBrand = params.get('brand');
const urlProduct = params.get('product');

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.25 && rating % 1 < 0.75;
  return "★".repeat(full) + (half ? "☆" : "") + "☆".repeat(5 - full - (half ? 1 : 0));
}

const predictedData = {
  "Samsung Smartphones": { price: 29368.33, stock: 235 },
  "Sony Smartphones": { price: 30567.06, stock: 233 },
  "HP Laptops": { price: 34460.74, stock: 232 },
  "Sony Tablets": { price: 30694.29, stock: 232 },
  "Sony Smart Watches": { price: 24788.04, stock: 230 },
  "Other Brands Smartphones": { price: 28637.24, stock: 230 },
  "Apple Smartphones": { price: 48419.10, stock: 230 },
  "HP Tablets": { price: 29060.67, stock: 230 },
  "Samsung Headphones": { price: 18887.70, stock: 229 },
  "Apple Laptops": { price: 52822.96, stock: 229 },
  "Apple Tablets": { price: 47766.73, stock: 228 },
  "Other Brands Smart Watches": { price: 26634.55, stock: 228 },
  "Other Brands Headphones": { price: 26911.56, stock: 226 },
  "Apple Smart Watches": { price: 30969.19, stock: 226 },
  "Samsung Laptops": { price: 43594.67, stock: 225 },
  "Other Brands Laptops": { price: 30463.09, stock: 225 },
  "Samsung Smart Watches": { price: 25302.95, stock: 224 },
  "Samsung Tablets": { price: 32463.03, stock: 224 },
  "HP Headphones": { price: 15886.79, stock: 223 },
  "Sony Headphones": { price: 20862.44, stock: 223 },
  "Other Brands Tablets": { price: 28273.81, stock: 223 },
  "Sony Laptops": { price: 36947.13, stock: 223 },
  "Apple Headphones": { price: 25417.70, stock: 222 },
  "HP Smartphones": { price: 22740.73, stock: 222 },
  "HP Smart Watches": { price: 18022.98, stock: 219 }
};

function getPrediction(brand, product) {
  return predictedData[`${brand} ${product}`] || { price: null, stock: null };
}

function updateProductImage() {
  const brand = document.getElementById("brand").value;
  const product = document.getElementById("category").value;
  const imageElement = document.getElementById("product-image");

  if (brand === "Select Brand" || product === "Select Product" || !brand || !product) {
    imageElement.style.display = "none";
    return;
  }

  const format = str => str.toLowerCase().replace(/\s+/g, '_');
  const imageName = `${format(brand)}-${format(product)}.jpg`;
  const imagePath = `images/${imageName}`;
  imageElement.src = imagePath;
  imageElement.style.display = "block";
}

document.getElementById("image-upload").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.getElementById("product-image");
      img.src = e.target.result;
      img.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById("show-suggested-photo-btn").addEventListener("click", () => {
  const brand = document.getElementById("brand").value;
  const product = document.getElementById("category").value;

  if (brand === "" || product === "") {
    Swal.fire({
      title: "Error loading image",
      text: "Please select Brand and Product",
      icon: "error",
      timer: 2000,
      showConfirmButton: false
    });
    return;
  }

  updateProductImage();
});


window.addEventListener('DOMContentLoaded', () => {
  const brandSelect = document.getElementById("brand");
  const productSelect = document.getElementById("category");
  const rating = parseFloat((Math.random() * 4 + 1).toFixed(1));
  window.generatedRating = rating;

  if (urlBrand) brandSelect.value = urlBrand;
  if (urlProduct) productSelect.value = urlProduct;

  document.getElementById("rating-number").textContent = rating;
  document.getElementById("rating-stars").textContent = renderStars(rating);

  document.getElementById("predict-btn").addEventListener("click", () => {
    const brand = brandSelect.value;
    const product = productSelect.value;
    const prediction = getPrediction(brand, product);
    if (prediction.price !== null) {
      document.getElementById("price").value = prediction.price;
    } else {
      Swal.fire({
        title: "Error Predicting Price",
        text: "Please select Brand and Product",
        icon: "error",
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }
  });

  document.getElementById("predict-stock-btn").addEventListener("click", () => {
    const brand = brandSelect.value;
    const product = productSelect.value;
    const prediction = getPrediction(brand, product);
    if (prediction.stock !== null) {
      document.getElementById("stock").value = prediction.stock;
    } else {
      Swal.fire({
        title: "Error Predicting Stocks",
        text: "Please select Brand and Product",
        icon: "error",
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }
  });

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      signInAnonymously(auth).catch(err => console.error("Anonymous sign-in failed:", err));
      return;
    }

    const userId = user.uid;

    document.getElementById("add-product-btn").addEventListener("click", async () => {
      const brand = brandSelect.value;
      const product = productSelect.value;
      const description = document.getElementById("description").value.trim();
      const modelname = document.getElementById("modelname").value.trim();
      const price = parseFloat(document.getElementById("price").value);
      const discount = document.getElementById("discount").value.trim();
      const specs = document.getElementById("specs").value.trim();
      const feature = document.getElementById("feature").value.trim();
      const stock = parseInt(document.getElementById("stock").value);
    
      if (!brand || !product || !description || !modelname || isNaN(price) || !specs || !feature || isNaN(stock)) {
        Swal.fire({
          icon: 'error',
          title: 'Missing Information',
          text: 'Please fill out all of the information.'
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
    
      const imageElement = document.getElementById("product-image");
      const imageSrc = imageElement.style.display === "block" ? imageElement.src : null;
      const finalprice = Math.round(price - (price * discount / 100));

      if (!imageSrc || imageSrc.includes("upload-photo.jpg")) {
        hideLoadingSpinner();
        Swal.fire({
          icon: 'error',
          title: 'Missing Product Image',
          text: 'Please upload a product image before submitting.'
        });
        return;
      }
    
      const productData = {
        rating: window.generatedRating || 3.5,
        price,
        stock: isNaN(stock) ? null : stock,
        description,
        modelname: modelname,
        discount: discount ? parseFloat(discount) : 0,
        finalPrice: finalprice,
        specs,
        feature,
        image: imageSrc || null,
        createdAt: new Date()
      };
    
      showLoadingSpinner();
    
      try {
        const cartRef = doc(db, "cart", userId, brand, product);
        await setDoc(cartRef, productData);

        const notificationMessage = `✅ "${brand} ${modelname}" was added to your cart for ₱${finalprice} with stocks of ${stock}.`;

        // Add the notification to the user's notification logs sub-collection
        const notificationRef = doc(db, "notifications", userId, "logs", new Date().toISOString());  // Unique ID for notification
        await setDoc(notificationRef, {
          message: notificationMessage,
          timestamp: new Date(),
          read: "no"
        });
        
        hideLoadingSpinner();
        await Swal.fire({
          title: "Success!",
          text: `Product "${product}" from "${brand}" added to your cart!`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });

        window.location.href = "cart.html";
      } catch (err) {
        hideLoadingSpinner();
        console.error("Firestore error:", err);
        await Swal.fire({
          title: "Error!",
          text: "Failed to add product.",
          icon: "error",
          timer: 3000,
          showConfirmButton: false
        });
      }
    });    
  });
});

// Logout
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
      await Swal.fire({
        title: "Logged Out",
        text: "You have been logged out successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
      window.location.href = "index.html";
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

function showLoadingSpinner() {
  Swal.fire({
      title: "Saving...",
      text: "Please Wait...",
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
          Swal.showLoading();
      }
  });
}

function hideLoadingSpinner() {
  Swal.close();
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

  try {
    const querySnapshot = await getDocs(notificationsRef);

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