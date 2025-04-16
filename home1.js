

document.addEventListener("DOMContentLoaded", function () {
    const products = document.querySelectorAll(".product");

    // Static product click listener
    products.forEach(product => {
        product.addEventListener("click", () => {
            const brand = product.getAttribute("data-brand");
            const productName = product.getAttribute("data-product");

            //window.location.href = `product.html?brand=${encodeURIComponent(brand)}&product=${encodeURIComponent(productName)}`;
        });
    });

    fetch("http://127.0.0.1:5000/predict-top-trending")
    .then(response => response.json())
    .then(data => {
        const trendingContainer = document.querySelector(".trending-products");
        if (!trendingContainer || !data.top_25_trending_products) return;

        const top7 = data.top_25_trending_products.slice(0, 7);

        top7.forEach((product) => {
            const productDiv = document.createElement("div");
            productDiv.className = "product";

            // Check if the product starts with "Other Brands" and handle it
            let brand, productName;
            if (product.Product.startsWith("Other Brands")) {
                brand = "Other Brands";
                productName = product.Product.replace("Other Brands ", "");
            } else {
                const [brandPart, ...productParts] = product.Product.split(" ");
                brand = brandPart;
                productName = productParts.join(" ");
            }

            const brandSlug = brand.toLowerCase().replace(/\s+/g, "_");
            const categorySlug = productName.toLowerCase().replace(/\s+/g, "_");

            const imageSrc = `images/${brandSlug}-${categorySlug}.jpg`;

            productDiv.setAttribute("data-brand", brand);
            productDiv.setAttribute("data-product", productName);

            const img = document.createElement("img");
            img.src = imageSrc;
            img.alt = `${brand} ${productName}`;
            img.onerror = function () {
                this.src = "images/default.png"; // fallback image
            };

            const nameDiv = document.createElement("div");
            nameDiv.className = "product-name";
            nameDiv.textContent = `${brand} ${productName}`;

            productDiv.appendChild(img);
            productDiv.appendChild(nameDiv);
            trendingContainer.appendChild(productDiv);

            /*productDiv.addEventListener("click", () => {
                window.location.href = `product.html?brand=${encodeURIComponent(brand)}&product=${encodeURIComponent(productName)}`;
            });*/
        });
    })
    .catch(error => {
        console.error("Error fetching top trending products:", error);
    });
});

const firebaseConfig = {
    apiKey: "AIzaSyBf4xDYf1i5UDAc9jpB33Cein_sgATriyw",
    authDomain: "techforecastinitial.firebaseapp.com",
    projectId: "techforecastinitial",
    storageBucket: "techforecastinitial.firebasestorage.app",
    messagingSenderId: "1022311444244",
    appId: "1:1022311444244:web:ef464c4c03285bb351dc01",
    measurementId: "G-G421TQ07R4"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Check if user is signed in
firebase.auth().onAuthStateChanged((user) => {
  const userNameEl = document.getElementById("userName");

  if (user) {
    const userId = user.uid;
  } else {
    userNameEl.textContent = "Not signed in";
  }
});

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
            // Correct sign-out method
            await firebase.auth().signOut();
            
            // Show success message
            Swal.fire({
                title: "Logged Out",
                text: "You have been logged out successfully.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                window.location.href = "index.html"; // Redirect to login page
            });
        } catch (error) {
            // Show error message
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
  