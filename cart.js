import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {
  getFirestore,
  collectionGroup,
  getDocs
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

function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  let stars = "★".repeat(fullStars);
  if (halfStar) stars += "☆";
  stars += "☆".repeat(5 - stars.length);
  return stars;
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    await signInAnonymously(auth);
    return;
  }

  const userId = user.uid;
  const cartContainer = document.getElementById("cart-container");
  cartContainer.innerHTML = "";

  try {
    const brandGroups = await getDocs(collectionGroup(db, userId));

    if (brandGroups.empty) {
      cartContainer.innerHTML = "<p>No products in cart.</p>";
      return;
    }

    for (const brandDoc of brandGroups.docs) {
      const data = brandDoc.data();
      const brand = brandDoc.ref.parent.parent.id;
      const product = brandDoc.id;
      const rating = data.rating || "3.5";
      const price = data.price || 0;
      const description = data.description || "No description.";
      const stock = data.stock || 1;

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
  } catch (err) {
    console.error("Error loading cart:", err);
    cartContainer.innerHTML = "<p>Error loading cart.</p>";
  }
});
