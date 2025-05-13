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
  setDoc,
  query, 
  orderBy,
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
  "Samsung Smartphones": { price: 29399.00, stock: 152 },
  "Sony Smartphones": { price: 30599.00, stock: 157 },
  "HP Laptops": { price: 34499.00, stock: 89 },
  "Sony Tablets": { price: 30699.00, stock: 126 },
  "Sony Smart Watches": { price: 12999.00, stock: 109 },
  "Other Brands Smartphones": { price: 19999.00, stock: 167 },
  "Apple Smartphones": { price: 49999.00, stock: 176 },
  "HP Tablets": { price: 29999.00, stock: 130 },
  "Samsung Headphones": { price: 14799.00, stock: 146 },
  "Apple Laptops": { price: 64999.00, stock: 115 },
  "Apple Tablets": { price: 42990.00, stock: 117 },
  "Other Brands Smart Watches": { price: 15999.00, stock: 106 },
  "Other Brands Headphones": { price: 10999.00, stock: 150 },
  "Apple Smart Watches": { price: 30990.00, stock: 103 },
  "Samsung Laptops": { price: 56399.00, stock: 125 },
  "Other Brands Laptops": { price: 41499.00, stock: 130 },
  "Samsung Smart Watches": { price: 16599.00, stock: 117 },
  "Samsung Tablets": { price: 32699.00, stock: 124 },
  "HP Headphones": { price: 3999.00, stock: 128 },
  "Sony Headphones": { price: 5499.00, stock: 127 },
  "Other Brands Tablets": { price: 15399.00, stock: 112 },
  "Sony Laptops": { price: 34799.00, stock: 119 },
  "Apple Headphones": { price: 8490.00, stock: 145 },
  "HP Smartphones": { price: 18899.00, stock: 148 },
  "HP Smart Watches": { price: 1999.00, stock: 120 }
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

  const path = window.location.pathname;
  if (path.includes("product.html")) {
    const productbtn = document.getElementById("productbtn");
    if (productbtn) {
      productbtn.classList.add("active");
    }
  }

  const brandSelect = document.getElementById("brand");
  const productSelect = document.getElementById("category");
  const ratingElement = document.getElementById("rating-number");
  const starsElement = document.getElementById("rating-stars");

  const ratings = {
    // Samsung Products
    "Samsung_Smartphones": 4.3,
    "Samsung_Laptops": 4.5,
    "Samsung_Tablets": 4.2,
    "Samsung_Headphones": 4.7,
    "Samsung_Smart Watches": 4.6,

    // Apple Products
    "Apple_Smartphones": 4.8,
    "Apple_Laptops": 4.6,
    "Apple_Tablets": 4.5,
    "Apple_Headphones": 4.7,
    "Apple_Smart Watches": 4.5,

    // HP Products
    "HP_Smartphones": 4.2,
    "HP_Laptops": 4.4,
    "HP_Tablets": 4.1,
    "HP_Headphones": 4.3,
    "HP_Smart Watches": 4.2,

    // Sony Products
    "Sony_Smartphones": 4.4,
    "Sony_Laptops": 4.3,
    "Sony_Tablets": 4.2,
    "Sony_Headphones": 4.5,
    "Sony_Smart Watches": 4.3,

    // Other Brands
    "Other Brands_Smartphones": 4.0,
    "Other Brands_Laptops": 4.1,
    "Other Brands_Tablets": 3.9,
    "Other Brands_Headphones": 4.2,
    "Other Brands_Smart Watches": 4.0
  };

  const updateRating = () => {
    const brand = brandSelect.value;
    const product = productSelect.value;
    const key = `${brand}_${product}`;

    const rating = ratings[key] || 0;

    window.generatedRating = rating;

    ratingElement.textContent = rating.toFixed(1);  // Update the rating number
    const percentage = (rating / 5) * 100;  // Convert to percentage
    document.querySelector('.stars-inner').style.width = percentage + '%';  // Update stars

  };

  brandSelect.addEventListener("change", updateRating);
  productSelect.addEventListener("change", updateRating);

  // Initial call to set rating when page loads
  updateRating();

  document.getElementById("predict-btn").addEventListener("click", () => {
    event.preventDefault();
    const brand = brandSelect.value;
    const product = productSelect.value;
    const prediction = getPrediction(brand, product);
    if (prediction.price !== null) {
        Swal.fire({
          title: "Loading...",
          text: "Predicting price, please wait...",
          timer: 1000,
          showConfirmButton: false,
          allowOutsideClick: false,
          didOpen: () => {
              Swal.showLoading();
          },
      }).then(() => {
          const formattedPrice = prediction.price.toFixed(2);
          document.getElementById("price").value = formattedPrice;
      });
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
    event.preventDefault();
    const brand = brandSelect.value;
    const product = productSelect.value;
    const prediction = getPrediction(brand, product);
    if (prediction.stock !== null) {
      Swal.fire({
        title: "Loading...",
        text: "Checking stock, please wait...",
        timer: 1000,  // 1 second delay
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
      }).then(() => {
          document.getElementById("stock").value = prediction.stock;
      });
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
      event.preventDefault();
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