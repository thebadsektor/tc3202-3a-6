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
  getDoc
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
      rating = 3.5,
      price = 0,
      description = "No description.",
      stock = 1
    } = item;

    const productElement = document.createElement("div");
    productElement.classList.add("product");

    productElement.innerHTML = `
      <img src="image.png" alt="${product}">
      <div class="details">
        <strong>${brand}</strong>
        <span>${product}</span>
        <div class="stars">${renderStars(parseFloat(rating))}</div>
        <div>₱${price.toLocaleString()}</div>
        <div>Description: ${description}</div>
        <div class="stock-control">
          <button>-</button>
          <span>${stock}</span>
          <button>+</button>
        </div>
      </div>
    `;

    cartContainer.appendChild(productElement);
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
