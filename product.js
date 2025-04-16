import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  signOut
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
      alert("Please select brand and product.");
    }
  });

  document.getElementById("predict-stock-btn").addEventListener("click", () => {
    const brand = brandSelect.value;
    const product = productSelect.value;
    const prediction = getPrediction(brand, product);
    if (prediction.stock !== null) {
      document.getElementById("stock").value = prediction.stock;
    } else {
      alert("Please select brand and product.");
    }
  });

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      signInAnonymously(auth).catch(err => console.error("Anonymous sign-in failed:", err));
      return;
    }

    const userId = user.uid;

    document.getElementById("add-product-btn").addEventListener("click", () => {
      const brand = brandSelect.value;
      const product = productSelect.value;
      const description = document.getElementById("description").value.trim();
      const price = parseFloat(document.getElementById("price").value);
      const discount = document.getElementById("discount").value.trim();
      const specs = document.getElementById("specs").value.trim();
      const feature = document.getElementById("feature").value.trim();
      const stock = parseInt(document.getElementById("stock").value);

      if (!brand || !product || !description || isNaN(price)) {
        alert("Please fill out brand, product, description, and price.");
        return;
      }

      const productData = {
        rating: window.generatedRating || 3.5,
        price,
        stock: isNaN(stock) ? null : stock,
        description,
        discount: discount || null,
        specs,
        feature,
        createdAt: new Date()
      };

      document.getElementById("modal-content").innerHTML = `
        <p><strong>Brand:</strong> ${brand}</p>
        <p><strong>Product:</strong> ${product}</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Price:</strong> ₱${price}</p>
        <p><strong>Stock:</strong> ${stock}</p>
        <p><strong>Specs:</strong> ${specs}</p>
        <p><strong>Feature:</strong> ${feature}</p>
        <p><strong>Rating:</strong> ${productData.rating} ${renderStars(productData.rating)}</p>
        <div style="margin-top: 15px;">
          <button id="confirm-add-btn">Confirm</button>
          <button id="edit-btn" style="margin-left: 10px;">Edit</button>
        </div>
      `;
      document.getElementById("confirm-modal").style.display = "block";

      document.getElementById("confirm-add-btn").onclick = async () => {
        try {
          const cartRef = doc(db, "cart", userId, brand, product);
          await setDoc(cartRef, productData);
          document.getElementById("confirm-modal").style.display = "none";
          alert(`Product "${product}" from "${brand}" added to your cart!`);
          window.location.href = "home.html";
        } catch (err) {
          console.error("Firestore error:", err);
          alert("Failed to add product.");
        }
      };

      document.getElementById("edit-btn").onclick = () => {
        document.getElementById("confirm-modal").style.display = "none";
      };
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
