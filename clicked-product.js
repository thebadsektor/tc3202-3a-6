document.addEventListener("DOMContentLoaded", function () {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const brand = urlParams.get('brand');
    const product = urlParams.get('product');

    if (brand && product) {
        const productTitle = document.getElementById("product-title");
        const productImage = document.getElementById("main-product-image");

        productTitle.textContent = `${brand} - ${product}`;

        // Generate image src
        const brandSlug = brand.toLowerCase().replace(/\s+/g, "_");
        const productSlug = product.toLowerCase().replace(/\s+/g, "_");
        const imageSrc = `images/${brandSlug}-${productSlug}.jpg`;

        productImage.src = imageSrc;
        productImage.onerror = function () {
            this.src = "images/default.png"; // fallback if image not found
        };

        updateProductDetails(brand, product);
        showRelatedProducts(brand, product);
    } else {
        console.error("Brand or Product not found in URL!");
    }
});

function showRelatedProducts(currentBrand, currentProduct) {
  currentBrand = normalizeInput(currentBrand);
  currentProduct = normalizeInput(currentProduct);

  const relatedProductsContainer = document.querySelector(".related-products-list");
  relatedProductsContainer.innerHTML = ''; // Clear previous products

  const brands = ['samsung', 'apple', 'sony', 'hp', 'other_brands'];
  const products = ['smartphones', 'tablets', 'laptops', 'headphones', 'smart_watches'];

  // 1. Pick 3 products from SAME brand but DIFFERENT products
  const sameBrandDifferentProducts = products.filter(p => p !== currentProduct);
  shuffleArray(sameBrandDifferentProducts);
  const selectedSameBrandProducts = sameBrandDifferentProducts.slice(0, 3);

  // 2. Pick 2 DIFFERENT brands (not the current brand) that have the SAME product
  const otherBrands = brands.filter(b => b !== currentBrand);
  shuffleArray(otherBrands);
  const selectedOtherBrands = otherBrands.slice(0, 2);

  // 3. Create 3 same-brand-different-product cards
  selectedSameBrandProducts.forEach(product => {
    createProductCard(currentBrand, product);
  });

  // 4. Create 2 different-brand-same-product cards
  selectedOtherBrands.forEach(brand => {
    createProductCard(brand, currentProduct);
  });
}

// Create and display a product card
function createProductCard(brand, product) {
  const relatedProductsContainer = document.querySelector(".related-products-list");

  const card = document.createElement("div");
  card.classList.add("related-product-card");

  const img = document.createElement("img");
  img.src = getImagePath(brand, product);
  img.alt = `${formatName(brand)} ${formatName(product)}`;
  img.onerror = function () {
    this.src = "images/default.png";
  };

  const title = document.createElement("p");
  title.textContent = `${formatName(brand)} ${formatName(product)}`;

  const link = document.createElement("a");
  link.href = `clicked-product.html?brand=${brand}&product=${product}`;
  link.appendChild(img);
  link.appendChild(title);

  card.appendChild(link);
  relatedProductsContainer.appendChild(card);
}

// Format file path for the image
function getImagePath(brand, product) {
  return `images/${brand}-${product}.jpg`;
}

// Normalize user-friendly input into consistent keys
function normalizeInput(text) {
  return text.trim().toLowerCase().replace(/ /g, '_');
}

// Convert internal format to readable name (for UI display)
function formatName(text) {
  return text
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// In-place array shuffling
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function updateProductDetails(brand, product) {
    const detailsList = document.querySelector('.product-details-list');
    const featuresList = document.getElementById('features-list');
    const specsList = document.getElementById('specs');
    detailsList.innerHTML = ''; // Clear existing
    featuresList.innerHTML = ''; // Clear existing
    specsList.innerHTML = ''; // Clear existing

    if (brand === "Samsung" && product.toLowerCase().includes("smartphone")) {
        const description = `Samsung Electronics is one of the largest and most recognized smartphone manufacturers globally. Their smartphones are known for blending cutting-edge innovation, premium designs, and powerful performance.
        Samsung releases phones across multiple series — from ultra-premium flagships like the Galaxy S and Galaxy Z (foldables), to mid-range Galaxy A, and entry-level models.
        Samsung is famous for pioneering trends like curved displays, foldable phones, high-resolution cameras, and advanced mobile processors.`;

        const specifications = [
            "• Operating System – Android OS (customized with Samsung One UI skin)",
            "• Processor (Chipset) – Exynos (global) or Qualcomm Snapdragon (USA/Korea)",
            "• Display – Dynamic AMOLED 2X or Super AMOLED, up to 120Hz refresh rate",
            "• Camera Systems – Multiple lenses: wide, ultra-wide, telephoto, macro (up to 200MP main sensor in newer models)",
            "• Battery – 4000mAh to 5000mAh typically (flagships), with fast charging support",
            "• RAM – 4GB to 16GB (depending on the model)",
            "• Storage – 64GB to 1TB (some models with expandable microSD slot on older phones)",
            "• Build Material – Glass front/back (Gorilla Glass Victus), aluminum or Armor Frame",
            "• Water/Dust Resistance – IP68 rating (flagship S and Z series)",
            "• Biometrics – Ultrasonic fingerprint scanner, Face Recognition",
            "• 5G Support – Available on most newer models",
            "• Audio – Stereo speakers tuned by AKG, Dolby Atmos",
            "• Special Features – S Pen (S Ultra series), Samsung DeX, Wireless PowerShare, Foldable displays (Z series)"
        ];

        const features = [
            {
              title: "High-Quality Displays",
              subfeatures: [
                "--Vivid, vibrant AMOLED displays",
                "--Up to 120Hz or even 144Hz refresh rate",
                "--HDR10+ support for stunning visuals"
              ]
            },
            {
              title: "Powerful Camera Systems",
              subfeatures: [
                "--Multi-lens setups (wide, ultra-wide, telephoto, macro)",
                "--Nightography mode for low-light photography",
                "--8K video recording on premium models",
                "--Space Zoom (up to 100x on S Ultra series)"
              ]
            },
            {
              title: "Performance and Gaming",
              subfeatures: [
                "--Fast and efficient Snapdragon/Exynos processors",
                "--Smooth multitasking with large RAM options",
                "--Game Booster and cooling systems for better gaming"
              ]
            },
            {
              title: "One UI Software Experience",
              subfeatures: [
                "--Clean, highly customizable, and user-friendly interface",
                "--Up to 4 years of Android updates + 5 years of security patches",
                "--Built-in tools like Samsung Health, Samsung Pay, Secure Folder"
              ]
            },
            {
              title: "Foldable Innovation",
              subfeatures: [
                "--Industry-leading foldable phones (Galaxy Z Fold and Z Flip)",
                "--Flex Mode for split-screen and adaptive app experiences",
                "--Ultra-thin foldable glass (UTG) for durability"
              ]
            },
            {
              title: "Connectivity",
              subfeatures: [
                "--5G-ready, Wi-Fi 6E, and Bluetooth 5.3 support",
                "--Seamless SmartThings ecosystem integration"
              ]
            },
            {
              title: "Battery and Charging",
              subfeatures: [
                "--Super-fast wired and wireless charging",
                "--Reverse wireless charging (charge accessories and other phones)",
                "--Intelligent battery management for long-lasting use"
              ]
            },
            {
              title: "Security",
              subfeatures: [
                "--Samsung Knox security platform (defense-grade protection)",
                "--Secure Folder for private apps and files"
              ]
            },
            {
              title: "S Pen Support",
              subfeatures: [
                "--Built-in stylus for S Ultra and Z Fold models",
                "--Air Actions (gesture control), handwriting recognition, note-taking"
              ]
            }
        ];

        // ✨ Add Description
        const descriptionHTML = `<strong>✨ Description:</strong><br>${description.replace(/\n/g, "<br>")}`;
        const descriptionItem = document.createElement('li');
        descriptionItem.innerHTML = descriptionHTML;
        detailsList.appendChild(descriptionItem);

        // 🔧 Add General Specifications
        const specsTitle = document.createElement('li');
        specsTitle.innerHTML = `<strong>🔧 General Specifications:</strong>`;
        specsList.appendChild(specsTitle);

        specifications.forEach(spec => {
            const specItem = document.createElement('li');
            specItem.textContent = spec;
            specsList.appendChild(specItem);
        });

        // ⚙️ Add Features
        const featuresTitle = document.createElement('li');
        featuresTitle.innerHTML = `<strong>⚙️ Features:</strong>`;
        featuresList.appendChild(featuresTitle);

        features.forEach(feature => {
            const featureItem = document.createElement('li');
            featureItem.innerHTML = `<strong>${feature.title}</strong>`;
            featuresList.appendChild(featureItem);

            feature.subfeatures.forEach(sub => {
                const subFeatureItem = document.createElement('li');
                subFeatureItem.textContent = sub;
                subFeatureItem.style.marginLeft = '20px'; // indent for subfeatures
                featuresList.appendChild(subFeatureItem);
            });
        });
    } else if (brand === "Samsung" && product.toLowerCase().includes("laptop")) {
      const description = `Samsung laptops, especially under the Galaxy Book series, are known for sleek designs, vivid AMOLED displays, and seamless integration with Samsung’s Galaxy ecosystem. 
      These devices offer excellent portability, premium build quality, and features that cater to both professionals and casual users.
      Samsung emphasizes long battery life, ultra-lightweight builds, and enhanced productivity with tools like S Pen support and Windows integration.`;
  
      const specifications = [
          "• Operating System – Windows 11 Home or Pro",
          "• Processor – Intel Core i5/i7/i9 (12th or 13th Gen), some AMD Ryzen variants",
          "• Display – AMOLED or LED Full HD/QHD, touchscreen options available",
          "• Graphics – Intel Iris Xe, NVIDIA GeForce MX or RTX (higher-end models)",
          "• RAM – 8GB to 32GB LPDDR4X/DDR5",
          "• Storage – 256GB to 1TB SSD (NVMe)",
          "• Build – Aluminum or Magnesium chassis, ultra-slim profile",
          "• Battery – Up to 20 hours on select models, fast charging via USB-C",
          "• Ports – USB-C, Thunderbolt 4, USB-A, HDMI, microSD card reader",
          "• Keyboard – Backlit keyboard, optional S Pen support",
          "• Audio – AKG-tuned speakers, Dolby Atmos support",
          "• Biometrics – Fingerprint sensor, Windows Hello face unlock",
          "• Connectivity – Wi-Fi 6/6E, Bluetooth 5.1+, optional 5G/4G LTE",
          "• Weight – Ranges from 0.9kg to 1.5kg (ultra-portable)"
      ];
  
      const features = [
          {
              title: "Galaxy Ecosystem Integration",
              subfeatures: [
                  "--Samsung Multi Control for seamless interaction with Galaxy tablets/phones",
                  "--Easy file and clipboard sharing across Galaxy devices",
                  "--Samsung Notes sync, SmartThings control panel"
              ]
          },
          {
              title: "Display & Design",
              subfeatures: [
                  "--AMOLED displays with vibrant colors and sharp detail",
                  "--Ultra-light and slim design, ideal for travel",
                  "--Touchscreen with optional S Pen input (on select models)"
              ]
          },
          {
              title: "Performance & Productivity",
              subfeatures: [
                  "--Latest Intel or AMD processors for smooth multitasking",
                  "--Large RAM and SSD options for speed and storage",
                  "--Optimized for Windows 11 with enhanced Samsung software"
              ]
          },
          {
              title: "Security & Privacy",
              subfeatures: [
                  "--Fingerprint reader and facial recognition",
                  "--Samsung Knox security built into hardware and software",
                  "--Secure Boot and BIOS protection"
              ]
          },
          {
              title: "Battery & Charging",
              subfeatures: [
                  "--Long battery life (up to 20 hours)",
                  "--Super-fast USB-C charging",
                  "--Lightweight charger for portability"
              ]
          },
          {
              title: "Multimedia & Sound",
              subfeatures: [
                  "--High-fidelity AKG stereo speakers",
                  "--Dolby Atmos for immersive sound",
                  "--HD webcam with AI noise reduction mic (ideal for video calls)"
              ]
          }
      ];
  
      // ✨ Add Description
      const descriptionHTML = `<strong>✨ Description:</strong><br>${description.replace(/\n/g, "<br>")}`;
      const descriptionItem = document.createElement('li');
      descriptionItem.innerHTML = descriptionHTML;
      detailsList.appendChild(descriptionItem);
  
      // 🔧 Add General Specifications
      const specsTitle = document.createElement('li');
      specsTitle.innerHTML = `<strong>🔧 General Specifications:</strong>`;
      specsList.appendChild(specsTitle);
  
      specifications.forEach(spec => {
          const specItem = document.createElement('li');
          specItem.textContent = spec;
          specsList.appendChild(specItem);
      });
  
      // ⚙️ Add Features
      const featuresTitle = document.createElement('li');
      featuresTitle.innerHTML = `<strong>⚙️ Features:</strong>`;
      featuresList.appendChild(featuresTitle);
  
      features.forEach(feature => {
          const featureItem = document.createElement('li');
          featureItem.innerHTML = `<strong>${feature.title}</strong>`;
          featuresList.appendChild(featureItem);
  
          feature.subfeatures.forEach(sub => {
              const subFeatureItem = document.createElement('li');
              subFeatureItem.textContent = sub;
              subFeatureItem.style.marginLeft = '20px'; // indent for subfeatures
              featuresList.appendChild(subFeatureItem);
          });
      });
    }
}

// 🛡 Firebase config and logout functionality
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
          await firebase.auth().signOut();
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
  const user = firebase.auth().currentUser;
  if (!user) {
    console.error("No user is signed in.");
    return;
  }

  const userId = user.uid;
  const notificationsRef = firebase.firestore().collection("notifications").doc(userId).collection("logs");

  try {
    const querySnapshot = await notificationsRef.get();

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
  const user = firebase.auth().currentUser;
  if (!user) return;

  const userId = user.uid;
  const logsRef = firebase.firestore().collection("notifications").doc(userId).collection("logs");

  const snapshot = await logsRef.get();
  const batch = firebase.firestore().batch();

  snapshot.forEach(doc => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  document.getElementById("notifications-list").innerHTML = "";
  location.reload(); // Refresh the page to update bell image and UI
}

async function markAllAsRead() {
  const user = firebase.auth().currentUser;
  if (!user) return;

  const userId = user.uid;
  const logsRef = firebase.firestore().collection("notifications").doc(userId).collection("logs");

  const snapshot = await logsRef.get();
  const batch = firebase.firestore().batch();

  snapshot.forEach(doc => {
    batch.update(doc.ref, { read: "yes" });
  });

  await batch.commit();
  fetchNotifications(); // Optional: update UI
  location.reload();    // Refresh the page to update the bell image
}

window.markAllAsRead = markAllAsRead;
window.deleteAllNotifications = deleteAllNotifications;