import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {
  getFirestore,
  doc,
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

// Init services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Get brand/product from URL
const params = new URLSearchParams(window.location.search);
const brand = params.get('brand');
const product = params.get('product');

// Star render helper
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.25 && rating % 1 < 0.75;
  return "★".repeat(full) + (half ? "☆" : "") + "☆".repeat(5 - full - (half ? 1 : 0));
}

// Load brand, product, and rating
window.addEventListener('DOMContentLoaded', () => {
  if (!brand || !product) {
    document.body.innerHTML = "<h2>Invalid product details.</h2>";
    return;
  }

  document.getElementById("brand").value = brand;
  document.getElementById("category").value = product;

  // Generate and show rating
  const rating = parseFloat((Math.random() * 4 + 1).toFixed(1));
  document.getElementById("rating-number").textContent = rating.toFixed(1);
  document.getElementById("rating-stars").textContent = renderStars(rating);
  window.generatedRating = rating; // Save globally
});

// Show predicted price
document.getElementById("predict-btn").addEventListener("click", () => {
  const predicted = Math.floor(Math.random() * (50000 - 3000 + 1)) + 3000;
  document.getElementById("price").value = predicted;
});

// Add to Firestore
onAuthStateChanged(auth, (user) => {
  if (!user) {
    signInAnonymously(auth).catch(err => console.error("Anon sign-in failed:", err));
    return;
  }

  const userId = user.uid;

  document.getElementById("add-product-btn").addEventListener("click", async () => {
    const description = document.getElementById("description").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const discount = document.getElementById("discount").value.trim();
    const specs = document.getElementById("specs").value.trim();
    const feature = document.getElementById("feature").value.trim();

    if (!description || isNaN(price)) {
      alert("Please fill out required fields: description and price.");
      return;
    }

    const productData = {
      rating: window.generatedRating,
      price,
      stock: Math.floor(Math.random() * 50) + 1,
      description,
      discount: discount || null,
      specs,
      feature,
      createdAt: new Date()
    };

    try {
      const cartRef = doc(db, "cart", userId, brand, product);
      await setDoc(cartRef, productData);
      alert(`Product "${product}" from "${brand}" added to your cart!`);
    } catch (err) {
      console.error("Error adding to Firestore:", err);
      alert("Failed to add product.");
    }
  });
});
