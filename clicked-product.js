document.addEventListener("DOMContentLoaded", function () {

    const path = window.location.pathname;
    if (path.includes("clicked-product.html")) {
        const homebtn = document.getElementById("homebtn");
        if (homebtn) {
        homebtn.classList.add("active");
        }
    }

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
  link.href = `clicked-product.html?brand=${formatName(brand)}&product=${formatName(product)}`;
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

function generateStarString(rating) {
  const percentage = Math.round((rating / 5) * 100);

  return `
    <div class="stars-outer">
      <div class="stars-inner" style="width: ${percentage}%;"></div>
    </div>
    <span class="rating-number">(${rating})</span>
  `;
}


function updateProductDetails(brand, product) {
    const detailsList = document.querySelector('.product-details-list');
    const featuresList = document.getElementById('features-list');
    const specsList = document.getElementById('specs');
    detailsList.innerHTML = ''; 
    featuresList.innerHTML = ''; 
    specsList.innerHTML = ''; 

    const productRatings = {
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
    

    if (brand === "Samsung" && product == "Smartphones") {
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

        const ratingKey = `${brand}_${product}`; // Make sure 'brand' and 'product' are defined
        const ratingValue = productRatings[ratingKey] || 0;
        const ratingElement = document.getElementById('product-rating');
        ratingElement.innerHTML = generateStarString(ratingValue);

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
    } else if (brand === "Samsung" && product == "Laptops") {
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
  
      const ratingKey = `${brand}_${product}`; // Make sure 'brand' and 'product' are defined
      const ratingValue = productRatings[ratingKey] || 0;
      const ratingElement = document.getElementById('product-rating');
      ratingElement.innerHTML = generateStarString(ratingValue);

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
    } else if (brand === "Samsung" && product.toLowerCase().includes("tablet")) {
      const description = `Samsung is a leading brand in the tablet market, offering a range of tablets designed to cater to both casual users and professionals. Known for their high-quality displays, powerful performance, and versatility, Samsung tablets combine excellent hardware with the flexibility of Android OS. Samsung tablets are ideal for productivity, entertainment, and creativity, featuring support for accessories like the S Pen, large vibrant displays, and long-lasting battery life.`;
  
      const specifications = [
          "• Operating System – Android OS (customized with Samsung One UI)",
          "• Processor (Chipset) – Exynos (global) or Qualcomm Snapdragon (USA/Korea)",
          "• Display – Dynamic AMOLED 2X or TFT, up to 120Hz refresh rate (depending on the model)",
          "• Camera Systems – Single lens (up to 13MP rear camera on some models)",
          "• Battery – 7040mAh to 10090mAh (depending on the model) with fast charging support",
          "• RAM – 4GB to 8GB (depending on the model)",
          "• Storage – 64GB to 512GB, expandable with microSD slot",
          "• Build Material – Aluminum or metal back with Gorilla Glass",
          "• Water/Dust Resistance – IP68 rating (on some models)",
          "• S Pen Support – Available in certain models like the Galaxy Tab S series",
          "• Audio – Stereo speakers tuned by AKG, Dolby Atmos",
          "• Connectivity – Wi-Fi, LTE, and 5G support (on some models)",
          "• Special Features – Samsung DeX, Multi-Active Window, S Pen functionality"
      ];
  
      const features = [
          {
              title: "High-Quality Displays",
              subfeatures: [
                  "--Super vibrant Dynamic AMOLED 2X displays on premium models",
                  "--Up to 120Hz refresh rate for a smooth scrolling experience",
                  "--Wide color gamut for stunning visuals"
              ]
          },
          {
              title: "Performance and Multitasking",
              subfeatures: [
                  "--Powerful Exynos or Snapdragon processors for smooth performance",
                  "--Large RAM options for better multitasking",
                  "--Samsung DeX for desktop-like experience with a keyboard and mouse"
              ]
          },
          {
              title: "S Pen Support",
              subfeatures: [
                  "--Precise stylus input for drawing, note-taking, and productivity tasks",
                  "--Air Actions for gesture controls, handwriting recognition, and more"
              ]
          },
          {
              title: "Entertainment",
              subfeatures: [
                  "--Vibrant and large screen for immersive media consumption",
                  "--Stereo speakers tuned by AKG for enhanced audio quality",
                  "--Support for Dolby Atmos for cinema-like sound"
              ]
          },
          {
              title: "Battery and Charging",
              subfeatures: [
                  "--Large battery capacity for all-day usage",
                  "--Fast charging support to quickly get back to work or play",
                  "--Long-lasting battery life with energy-saving modes"
              ]
          },
          {
              title: "Connectivity and Productivity",
              subfeatures: [
                  "--Wi-Fi, 5G, and LTE support (depending on the model)",
                  "--Multi-Active Window for multitasking and better productivity",
                  "--Samsung Knox for enhanced security"
              ]
          }
      ];

      const ratingKey = `${brand}_${product}`; // Make sure 'brand' and 'product' are defined
      const ratingValue = productRatings[ratingKey] || 0;
      const ratingElement = document.getElementById('product-rating');
      ratingElement.innerHTML = generateStarString(ratingValue);
  
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
    }else if (brand === "Samsung" && product.toLowerCase().includes("watch")) {
      const description = `Samsung smartwatches, particularly the Galaxy Watch series, are popular for combining elegant design, advanced health tracking, and seamless integration with Samsung and Android ecosystems.
      These watches run on Wear OS (co-developed with Google) or Tizen OS (on older models), and support a wide range of fitness, health, and productivity features.`;
  
      const specifications = [
          "• Operating System – Wear OS (Galaxy Watch 4 and newer) / Tizen OS (older models)",
          "• Display – Super AMOLED, Always-On Display, Gorilla Glass DX+",
          "• Sizes – Commonly 40mm, 42mm, 44mm, and 46mm (depending on model)",
          "• Processor – Exynos W920 (Galaxy Watch 4/5), dual-core",
          "• RAM – 1.5GB to 2GB",
          "• Storage – 16GB internal (up to 8GB usable for apps/media)",
          "• Battery – 247mAh to 590mAh (up to 2 days battery life)",
          "• Charging – Wireless charging (WPC standard)",
          "• Connectivity – Bluetooth, Wi-Fi, GPS, NFC, LTE (in LTE models)",
          "• Sensors – Heart Rate, BioActive Sensor (ECG + BIA), Accelerometer, Gyroscope, Barometer, SpO2",
          "• Water Resistance – 5ATM + IP68, MIL-STD-810G durability"
      ];
  
      const features = [
          {
              title: "Health & Wellness Tracking",
              subfeatures: [
                  "--24/7 heart rate monitoring",
                  "--ECG, blood oxygen, and body composition (BIA) measurements",
                  "--Sleep tracking with snore detection",
                  "--Women's health and menstrual cycle tracking"
              ]
          },
          {
              title: "Fitness and Activity",
              subfeatures: [
                  "--Auto workout detection for common exercises",
                  "--Over 90+ workout modes",
                  "--GPS tracking for outdoor activities",
                  "--Step count and calorie tracking"
              ]
          },
          {
              title: "Smart Features",
              subfeatures: [
                  "--Calls and messages from your wrist",
                  "--Google Assistant, Bixby support",
                  "--NFC payments with Samsung Pay or Google Wallet",
                  "--Third-party apps via Google Play"
              ]
          },
          {
              title: "Design and Customization",
              subfeatures: [
                  "--Variety of watch faces and styles",
                  "--Interchangeable bands",
                  "--Rotating bezel (select models)",
                  "--Compact and lightweight design"
              ]
          },
          {
              title: "Samsung Ecosystem Integration",
              subfeatures: [
                  "--Works seamlessly with Galaxy smartphones",
                  "--SmartThings support for smart home control",
                  "--Samsung Health app sync"
              ]
          },
          {
              title: "Battery and Charging",
              subfeatures: [
                  "--Wireless fast charging",
                  "--Battery saving modes for extended life",
                  "--Charges via magnetic dock or wireless power share"
              ]
          },
          {
              title: "Durability and Resistance",
              subfeatures: [
                  "--5ATM + IP68 waterproof rating",
                  "--Military-grade durability (MIL-STD-810G)",
                  "--Scratch-resistant display glass"
              ]
          }
      ];

      const ratingKey = `${brand}_${product}`; // Make sure 'brand' and 'product' are defined
      const ratingValue = productRatings[ratingKey] || 0;
      const ratingElement = document.getElementById('product-rating');
      ratingElement.innerHTML = generateStarString(ratingValue);
  
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
  } else if (brand === "Samsung" && product.toLowerCase().includes("headphone")) {
      const description = `Samsung headphones and earbuds—most notably the Galaxy Buds series—offer a well-balanced audio experience with deep bass, clear vocals, and advanced sound features like Active Noise Cancellation and Ambient Sound mode. They seamlessly connect with Galaxy smartphones, tablets, and wearables for a truly integrated user experience. Designed for comfort and durability, these earbuds feature compact, ergonomic designs that suit both daily use and active lifestyles. With reliable battery life and intuitive touch controls, Samsung earbuds deliver convenience and performance wherever you go.`;
  
      const specifications = [
          "• Type – True wireless earbuds (Galaxy Buds Live, Buds Pro, Buds2, etc.)",
          "• Connectivity – Bluetooth 5.0 or higher",
          "• Battery – 5 to 11 hours (up to 28 hours with charging case)",
          "• Charging – USB-C and Wireless charging (Qi supported)",
          "• Audio – 2-way speakers with AKG tuning, scalable codec for better sound quality",
          "• Noise Control – Active Noise Cancellation (ANC) and Ambient Sound Mode",
          "• Water Resistance – IPX2 to IPX7 (varies by model)",
          "• Microphones – Dual or triple mic setup for clear calls and noise reduction",
          "• Controls – Touch sensors for play/pause, volume, skip, call handling",
          "• Companion App – Galaxy Wearable for customization and updates"
      ];
  
      const features = [
          {
              title: "Sound Quality",
              subfeatures: [
                  "--AKG-tuned drivers for rich and clear sound",
                  "--2-way speaker (woofer + tweeter) in Buds Pro and Buds2 Pro",
                  "--360 Audio (with head tracking support on newer Galaxy Buds)"
              ]
          },
          {
              title: "Noise Control Features",
              subfeatures: [
                  "--Active Noise Cancellation (ANC)",
                  "--Ambient Sound Mode to stay aware of surroundings",
                  "--Voice Detect to auto-adjust volume during conversations"
              ]
          },
          {
              title: "Comfort and Design",
              subfeatures: [
                  "--Lightweight and ergonomic fit for long use",
                  "--Multiple ear tip sizes for better seal and comfort",
                  "--Stylish, compact charging case"
              ]
          },
          {
              title: "Battery and Charging",
              subfeatures: [
                  "--Fast charging: 5 mins gives up to 1 hour of playtime",
                  "--Wireless and USB-C charging",
                  "--Battery indicator in the companion app"
              ]
          },
          {
              title: "Smart Features",
              subfeatures: [
                  "--Auto Switch between Galaxy devices",
                  "--Find My Earbuds with SmartThings Find",
                  "--Voice Assistant (Bixby, Google Assistant, Siri compatible)"
              ]
          },
          {
              title: "Durability and Water Resistance",
              subfeatures: [
                  "--IPX2 to IPX7 ratings (model dependent)",
                  "--Sweat-resistant for workout and active use"
              ]
          }
      ];

      const ratingKey = `${brand}_${product}`; // Make sure 'brand' and 'product' are defined
      const ratingValue = productRatings[ratingKey] || 0;
      const ratingElement = document.getElementById('product-rating');
      ratingElement.innerHTML = generateStarString(ratingValue);
  
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
              subFeatureItem.style.marginLeft = '20px';
              featuresList.appendChild(subFeatureItem);
          });
      });
    }else if (brand === "Apple" && product.toLowerCase().includes("smartphone")) {
      const description = `Apple smartphones, known as iPhones, are iconic for their sleek design, powerful performance, and seamless integration with the Apple ecosystem. Running on iOS, they offer a user-friendly interface, strong privacy protections, and regular software updates. iPhones are known for their premium build quality, industry-leading chipsets, and advanced camera systems. Models range from the compact iPhone SE to flagship models like the iPhone 15 Pro Max.`;
  
      const specifications = [
          "• Operating System – iOS (latest version supported on each model)",
          "• Processor – Apple-designed chips (e.g., A15, A16, A17 Pro)",
          "• Display – Super Retina XDR OLED, ProMotion (120Hz on Pro models)",
          "• Camera Systems – Dual or Triple camera setups with up to 48MP sensors",
          "• Battery – Varies by model (all-day battery life on most devices)",
          "• RAM – 4GB to 8GB (not officially disclosed, depends on model)",
          "• Storage – 64GB to 1TB",
          "• Build Material – Ceramic Shield front, glass back, aluminum or stainless steel frame",
          "• Water/Dust Resistance – IP67 or IP68 certified",
          "• Biometrics – Face ID (TrueDepth camera system)",
          "• 5G Support – Available on iPhone 12 and newer",
          "• Audio – Stereo speakers with spatial audio and Dolby Atmos",
          "• Charging – MagSafe wireless charging, Lightning port (USB-C on newer models)"
      ];
  
      const features = [
          {
              title: "Advanced Camera Technology",
              subfeatures: [
                  "--Photonic Engine for low-light performance",
                  "--Night Mode, Deep Fusion, Smart HDR",
                  "--Cinematic Mode for video (portrait-style)",
                  "--ProRAW and ProRes support (Pro models)"
              ]
          },
          {
              title: "Performance",
              subfeatures: [
                  "--World-class Apple Silicon processors (A-series)",
                  "--Optimized battery efficiency and thermal performance",
                  "--Neural Engine for AI tasks and machine learning"
              ]
          },
          {
              title: "iOS Ecosystem Integration",
              subfeatures: [
                  "--Seamless sync with Apple devices (Mac, iPad, Apple Watch)",
                  "--AirDrop, Handoff, Universal Clipboard",
                  "--iMessage, FaceTime, iCloud, and Apple Services"
              ]
          },
          {
              title: "Privacy and Security",
              subfeatures: [
                  "--On-device processing for privacy",
                  "--App Tracking Transparency",
                  "--Secure Enclave for Face ID and data encryption"
              ]
          },
          {
              title: "Build Quality & Design",
              subfeatures: [
                  "--Premium materials and finishes",
                  "--Ceramic Shield for drop protection",
                  "--Dynamic Island (on iPhone 14 Pro and newer)"
              ]
          },
          {
              title: "MagSafe & Accessories",
              subfeatures: [
                  "--Snap-on accessories like wallets and battery packs",
                  "--MagSafe chargers and cases",
                  "--Faster wireless charging with MagSafe"
              ]
          }
      ];

      const ratingKey = `${brand}_${product}`; // Make sure 'brand' and 'product' are defined
      const ratingValue = productRatings[ratingKey] || 0;
      const ratingElement = document.getElementById('product-rating');
      ratingElement.innerHTML = generateStarString(ratingValue);
  
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
              subFeatureItem.style.marginLeft = '20px';
              featuresList.appendChild(subFeatureItem);
          });
      });
  } else if (brand === "Apple" && product.toLowerCase().includes("laptop")) {
      const description = `Apple laptops, known as MacBooks, are renowned for their sleek design, exceptional build quality, and strong performance. Powered by Apple's own M-series silicon chips (such as M1, M2, and M3), MacBooks offer excellent battery life, smooth multitasking, and seamless integration with other Apple devices. The MacBook Air is ideal for everyday tasks with its lightweight design, while the MacBook Pro is targeted at professionals who need more power for intensive workloads.`;
  
      const specifications = [
          "• Operating System – macOS (latest version: macOS Sonoma)",
          "• Processor – Apple M1, M2, M3 chips (or Intel in older models)",
          "• Display – Retina Display or Liquid Retina XDR (Pro models), up to 120Hz ProMotion",
          "• Battery – Up to 22 hours of battery life (varies by model)",
          "• RAM – 8GB to 128GB Unified Memory",
          "• Storage – 256GB to 8TB SSD",
          "• Build – Aluminum unibody chassis",
          "• Keyboard – Magic Keyboard with scissor mechanism",
          "• Ports – Thunderbolt 4/USB-C, MagSafe (on newer models), HDMI, SD Card slot (Pro models)",
          "• Security – Touch ID, Apple T2 Security Chip (Intel models)",
          "• Webcam – FaceTime HD (720p or 1080p on newer models)",
          "• Audio – High-fidelity six-speaker system (on MacBook Pro), Spatial Audio"
      ];
  
      const features = [
          {
              title: "M-Series Chip Performance",
              subfeatures: [
                  "--Industry-leading power efficiency and performance",
                  "--Unified Memory architecture for seamless app performance",
                  "--Powerful GPU and Neural Engine for graphics and AI tasks"
              ]
          },
          {
              title: "Display Quality",
              subfeatures: [
                  "--True Tone and P3 wide color gamut support",
                  "--Liquid Retina XDR on Pro models for extreme dynamic range",
                  "--High brightness and color accuracy"
              ]
          },
          {
              title: "macOS Experience",
              subfeatures: [
                  "--Intuitive, stable, and smooth user interface",
                  "--Continuity features like Handoff, Universal Control, and AirDrop",
                  "--System-wide privacy and security controls"
              ]
          },
          {
              title: "Battery Life",
              subfeatures: [
                  "--Up to 22 hours on MacBook Pro with M2/M3 chip",
                  "--Optimized power management for all-day use",
                  "--Fast charging with USB-C power adapters"
              ]
          },
          {
              title: "Build & Design",
              subfeatures: [
                  "--Precision aluminum unibody construction",
                  "--Slim, lightweight form factor",
                  "--Silent operation (fanless on MacBook Air)"
              ]
          },
          {
              title: "Ecosystem Integration",
              subfeatures: [
                  "--Seamless connection with iPhone, iPad, Apple Watch",
                  "--Use iPad as second screen with Sidecar",
                  "--Copy and paste, drag and drop across Apple devices"
              ]
          },
          {
              title: "Pro Features (MacBook Pro)",
              subfeatures: [
                  "--High-end performance for creators and developers",
                  "--Support for multiple external displays",
                  "--Studio-quality mics and Spatial Audio for video calls and media"
              ]
          }
      ];

      const ratingKey = `${brand}_${product}`; // Make sure 'brand' and 'product' are defined
      const ratingValue = productRatings[ratingKey] || 0;
      const ratingElement = document.getElementById('product-rating');
      ratingElement.innerHTML = generateStarString(ratingValue);
  
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
              subFeatureItem.style.marginLeft = '20px';
              featuresList.appendChild(subFeatureItem);
          });
      });
  }else if (brand === "Apple" && product.toLowerCase().includes("tablet")) {
      const description = `Apple tablets, known as iPads, are among the most popular and powerful tablets globally. They offer a seamless blend of performance, portability, and productivity, with features that appeal to both casual users and professionals. The iPad lineup includes models like iPad (base), iPad mini, iPad Air, and iPad Pro — each designed for specific use cases and budgets. With the powerful Apple Silicon chips and iPadOS, iPads are versatile devices for media, creativity, and multitasking.`;
  
      const specifications = [
          "• Operating System – iPadOS (latest version)",
          "• Processor – A-series (e.g., A14, A15) or M-series (M1, M2, M4) chips",
          "• Display – Retina or Liquid Retina XDR (Pro), up to 120Hz ProMotion refresh rate",
          "• Battery – Up to 10 hours of usage on Wi-Fi, slightly less on cellular",
          "• RAM – 4GB to 16GB (depending on the model)",
          "• Storage – 64GB to 2TB SSD storage",
          "• Build – Aluminum unibody with flat-edge design",
          "• Cameras – 12MP wide rear camera, 12MP front Ultra Wide camera (Center Stage)",
          "• Audio – Stereo speakers (quad speakers on Pro models)",
          "• Biometrics – Touch ID (Home button or Top button) or Face ID (Pro models)",
          "• Apple Pencil Support – Yes (1st-gen or 2nd-gen depending on model)",
          "• 5G and Wi-Fi 6E support (select models)",
          "• Magic Keyboard and Smart Connector compatibility (select models)"
      ];
  
      const features = [
          {
              title: "Apple Silicon Performance",
              subfeatures: [
                  "--M1, M2, or M4 chips for lightning-fast performance (iPad Pro and Air)",
                  "--Optimized for multitasking, gaming, and creative workflows",
                  "--Neural Engine for AI tasks and AR"
              ]
          },
          {
              title: "Display Quality",
              subfeatures: [
                  "--Liquid Retina and XDR displays for vibrant colors and HDR content",
                  "--ProMotion technology with up to 120Hz refresh rate",
                  "--True Tone and P3 wide color gamut"
              ]
          },
          {
              title: "iPadOS Experience",
              subfeatures: [
                  "--Multitasking with Stage Manager and Split View",
                  "--Desktop-class apps and file system support",
                  "--Continuity with macOS and iOS devices"
              ]
          },
          {
              title: "Apple Pencil and Accessories",
              subfeatures: [
                  "--Apple Pencil 2 support with magnetic charging (Air/Pro)",
                  "--Low latency for drawing and note-taking",
                  "--Magic Keyboard with trackpad for laptop-like experience"
              ]
          },
          {
              title: "Portability and Design",
              subfeatures: [
                  "--Ultra-thin and lightweight build",
                  "--Premium aluminum body with minimal bezels",
                  "--Available in multiple colors and sizes"
              ]
          },
          {
              title: "Creative and Pro Use",
              subfeatures: [
                  "--Pro apps like Final Cut Pro and Logic Pro (on iPad Pro)",
                  "--Support for AR experiences and 3D modeling",
                  "--Great for photo/video editing, music creation, and design"
              ]
          },
          {
              title: "Connectivity and Ecosystem",
              subfeatures: [
                  "--5G cellular support and Wi-Fi 6/6E for fast connections",
                  "--Handoff, AirDrop, and Universal Clipboard with Apple devices",
                  "--Works with AirPods, Apple Watch, Mac, and iPhone seamlessly"
              ]
          }
      ];

      const ratingKey = `${brand}_${product}`; // Make sure 'brand' and 'product' are defined
      const ratingValue = productRatings[ratingKey] || 0;
      const ratingElement = document.getElementById('product-rating');
      ratingElement.innerHTML = generateStarString(ratingValue);
  
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
              subFeatureItem.style.marginLeft = '20px';
              featuresList.appendChild(subFeatureItem);
          });
      });
  }else if (brand === "Apple" && product.toLowerCase().includes("headphone")) {
      const description = `Apple headphones, including AirPods, AirPods Pro, and AirPods Max, deliver premium audio quality with advanced features like active noise cancellation and spatial audio. They are designed for seamless integration with Apple devices, enabling effortless pairing, automatic switching, and hands-free Siri access. Whether for music, calls, workouts, or entertainment, they offer a convenient, immersive, and comfortable listening experience with long battery life and elegant design.`;
  
      const specifications = [
          "• Models – AirPods (2nd, 3rd gen), AirPods Pro (1st, 2nd gen), AirPods Max",
          "• Connectivity – Bluetooth 5.0+, H1/H2 chip for fast pairing and device switching",
          "• Battery Life – Up to 6 hours (AirPods), 30 hours with case (AirPods Pro), 20 hours (AirPods Max)",
          "• Charging – Lightning, MagSafe, or USB-C (AirPods Pro 2), Smart Case for AirPods Max",
          "• Controls – Force sensor (Pro), touch controls (3rd gen), Digital Crown (Max)",
          "• Microphones – Beamforming dual mics for clear calls and voice commands",
          "• Audio Features – Adaptive EQ, Spatial Audio with dynamic head tracking",
          "• Build – Sweat/water resistance (Pro and 3rd gen), over-ear aluminum (Max)",
          "• Siri – Hands-free 'Hey Siri' support",
          "• Noise Cancellation – Active Noise Cancellation (Pro and Max), Transparency Mode"
      ];
  
      const features = [
          {
              title: "Seamless Apple Ecosystem Integration",
              subfeatures: [
                  "--Auto-switch between iPhone, iPad, Mac, and Apple Watch",
                  "--Audio Sharing with another pair of AirPods",
                  "--Quick setup with iCloud sync"
              ]
          },
          {
              title: "Sound Quality & Technology",
              subfeatures: [
                  "--High-fidelity audio (AirPods Max)",
                  "--Adaptive EQ adjusts music in real-time",
                  "--Spatial Audio for immersive 3D sound"
              ]
          },
          {
              title: "Advanced Noise Control",
              subfeatures: [
                  "--Active Noise Cancellation blocks out background noise",
                  "--Transparency Mode lets you hear your surroundings",
                  "--Customizable fit with silicone tips (AirPods Pro)"
              ]
          },
          {
              title: "Battery and Charging",
              subfeatures: [
                  "--Multiple charges with MagSafe or Lightning case",
                  "--Fast charging support",
                  "--Up to 30 hours total with AirPods Pro 2"
              ]
          },
          {
              title: "Comfort and Design",
              subfeatures: [
                  "--Lightweight and ergonomic (AirPods & Pro)",
                  "--Breathable mesh and memory foam (AirPods Max)",
                  "--Stylish colors and premium build"
              ]
          },
          {
              title: "Smart Features",
              subfeatures: [
                  "--'Hey Siri' voice activation",
                  "--Audio sharing and spatial tracking",
                  "--Find My support for lost AirPods"
              ]
          }
      ];

      const ratingKey = `${brand}_${product}`; // Make sure 'brand' and 'product' are defined
      const ratingValue = productRatings[ratingKey] || 0;
      const ratingElement = document.getElementById('product-rating');
      ratingElement.innerHTML = generateStarString(ratingValue);
  
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
              subFeatureItem.style.marginLeft = '20px';
              featuresList.appendChild(subFeatureItem);
          });
      });
  }else if (brand === "Apple" && product.toLowerCase().includes("watch")) {
      const description = `The Apple Watch is a premium smartwatch designed to seamlessly integrate with the Apple ecosystem. It offers advanced health tracking, fitness features, communication tools, and smart capabilities—all packed in a stylish, customizable design. With models like the Apple Watch Series 9, Ultra, and SE, Apple continues to lead in smartwatch innovation.`;
  
      const specifications = [
          "• Operating System – watchOS (latest version depending on model)",
          "• Processor – S-series chips (e.g., S9 SiP in Series 9), custom Apple Silicon",
          "• Display – Retina LTPO OLED display, Always-On (select models), 1000 to 3000 nits brightness",
          "• Sizes – 40mm, 41mm, 44mm, 45mm, and 49mm (Ultra)",
          "• Build – Aluminum, stainless steel, titanium (Ultra), ceramic and sapphire crystal back",
          "• Water Resistance – Up to 50m (Series 9), 100m (Ultra, with EN13319 dive standard)",
          "• Battery Life – 18 to 36 hours (Ultra offers up to 60 hours in Low Power Mode)",
          "• Charging – Magnetic fast charger to USB-C",
          "• Connectivity – Bluetooth, Wi-Fi, Cellular (select models), U1 Ultra-Wideband chip",
          "• Sensors – Optical and electrical heart sensor, SpO2, ECG, temperature, accelerometer, gyroscope, barometer",
          "• GPS – Built-in GPS/GNSS and compass, dual-frequency GPS (Ultra)",
          "• Safety Features – Fall Detection, Crash Detection, Emergency SOS"
      ];
  
      const features = [
          {
              title: "Health and Fitness Tracking",
              subfeatures: [
                  "--Heart rate monitoring, ECG, and blood oxygen tracking",
                  "--Sleep tracking and mindfulness app",
                  "--Workout tracking for over 80 activity types",
                  "--VO2 Max and heart rate zones"
              ]
          },
          {
              title: "Rugged and Versatile Design",
              subfeatures: [
                  "--Customizable watch faces and bands",
                  "--Durable builds with scratch-resistant glass and waterproofing",
                  "--Apple Watch Ultra for outdoor/adventure sports"
              ]
          },
          {
              title: "Connectivity and Smart Features",
              subfeatures: [
                  "--Calls, messages, and app notifications directly on the watch",
                  "--Siri voice assistant support",
                  "--Built-in App Store and third-party apps"
              ]
          },
          {
              title: "Safety and Emergency Tools",
              subfeatures: [
                  "--Fall Detection and Emergency SOS",
                  "--Crash Detection (Series 8 and later)",
                  "--International Emergency Calling"
              ]
          },
          {
              title: "Performance and Battery",
              subfeatures: [
                  "--Smooth performance with S-series chips",
                  "--Fast charging support (Series 7 and up)",
                  "--Low Power Mode for extended use"
              ]
          },
          {
              title: "Apple Ecosystem Integration",
              subfeatures: [
                  "--Unlock your Mac, use as a camera remote for iPhone",
                  "--Sync with Apple Fitness+, Music, Photos, and Calendar",
                  "--Handoff and Continuity features"
              ]
          }
      ];

      const ratingKey = `${brand}_${product}`; // Make sure 'brand' and 'product' are defined
      const ratingValue = productRatings[ratingKey] || 0;
      const ratingElement = document.getElementById('product-rating');
      ratingElement.innerHTML = generateStarString(ratingValue);
  
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
              subFeatureItem.style.marginLeft = '20px';
              featuresList.appendChild(subFeatureItem);
          });
      });
    }else if (brand === "Sony" && product.toLowerCase().includes("smartphone")) {
      const description = `Sony smartphones, especially the Xperia series, are known for their sleek design, powerful performance, and exceptional camera technology. With 4K HDR OLED displays, ZEISS optics, and advanced photography features, they’re ideal for media lovers and creators. These phones offer strong battery life, water resistance, and high-res audio with a 3.5mm jack. Xperia devices blend premium design with top-tier functionality.`;
  
      const specifications = [
          "• Operating System – Android OS, with Sony's custom Xperia UI",
          "• Processor – Qualcomm Snapdragon (typically 800-series) or MediaTek Dimensity",
          "• Display – 5.0-inch to 6.5-inch OLED or LCD, up to 4K resolution (on select models)",
          "• Camera Systems – Dual or Triple lenses with ZEISS optics, real-time Eye Autofocus, 4K video recording",
          "• Battery – 3000mAh to 4500mAh, with fast charging and wireless charging support",
          "• RAM – 4GB to 12GB (depending on model)",
          "• Storage – 64GB to 512GB (expandable with microSD on select models)",
          "• Build Material – Glass front/back (Gorilla Glass), aluminum frame",
          "• Water/Dust Resistance – IP68 or IP65 (water and dust resistant)",
          "• Audio – Hi-Res Audio, LDAC, and 3.5mm headphone jack (on select models)",
          "• Special Features – 4K HDR Display, Game Enhancer, Xperia Actions, Cinema Pro for video recording"
      ];
  
      const features = [
          {
              title: "Photography and Videography",
              subfeatures: [
                  "--ZEISS optics collaboration for superior image quality",
                  "--Real-time Eye Autofocus for sharp portraits",
                  "--4K HDR video recording for cinematic quality",
                  "--RAW image capture for professional-level editing"
              ]
          },
          {
              title: "Immersive Display and Sound",
              subfeatures: [
                  "--4K OLED or LCD displays for stunning visuals",
                  "--Support for HDR10 and Dolby Vision for enhanced content",
                  "--Hi-Res Audio for audiophile-grade sound",
                  "--Stereo speakers with ClearAudio+ technology"
              ]
          },
          {
              title: "Performance and Battery",
              subfeatures: [
                  "--High-performance Snapdragon or MediaTek processors",
                  "--Optimized performance for gaming and multitasking",
                  "--Long-lasting battery with fast charging support",
                  "--Powerful gaming features with Game Enhancer mode"
              ]
          },
          {
              title: "Design and Build Quality",
              subfeatures: [
                  "--Sleek, minimalistic design with premium materials",
                  "--Water and dust resistant with IP68 or IP65 rating",
                  "--Corning Gorilla Glass for scratch resistance",
                  "--Durable build with an ergonomic feel"
              ]
          },
          {
              title: "Connectivity and Ecosystem",
              subfeatures: [
                  "--5G support for ultra-fast connectivity",
                  "--Wi-Fi 6, Bluetooth 5.0 support",
                  "--NFC, USB-C, and microSD expansion options"
              ]
          }
      ];

      const ratingKey = `${brand}_${product}`; // Make sure 'brand' and 'product' are defined
      const ratingValue = productRatings[ratingKey] || 0;
      const ratingElement = document.getElementById('product-rating');
      ratingElement.innerHTML = generateStarString(ratingValue);
  
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
              subFeatureItem.style.marginLeft = '20px';
              featuresList.appendChild(subFeatureItem);
          });
      });
  } else if (brand === "Sony" && product.toLowerCase().includes("laptop")) {
      const description = `Sony laptops, particularly the VAIO series, are known for their sleek design, high-quality build, and powerful performance. With a combination of innovative technology and a minimalist aesthetic, Sony VAIO laptops provide an excellent computing experience for professionals and casual users alike. Whether for work, entertainment, or creative tasks, VAIO laptops deliver performance with style With high-resolution displays, long battery life, and impressive sound quality, Sony VAIO laptops are designed to handle demanding applications, making them ideal for multimedia editing, gaming, and multitasking.`;
  
      const specifications = [
          "• Operating System – Windows 10/11",
          "• Processor – Intel Core i5, i7, or AMD Ryzen",
          "• Display – Full HD, 4K options, up to 15.6-inch",
          "• Storage – 256GB to 1TB SSD",
          "• RAM – 8GB to 16GB",
          "• Battery Life – 10 to 15 hours depending on model",
          "• Graphics – Integrated Intel or dedicated NVIDIA GeForce GTX",
          "• Build Material – Aluminum or magnesium alloy for premium feel",
          "• Ports – USB Type-C, HDMI, headphone jack, SD card slot",
          "• Audio – Hi-Res Audio, built-in stereo speakers with Dolby Audio"
      ];
  
      const features = [
          {
              title: "Design and Build Quality",
              subfeatures: [
                  "--Sleek and lightweight aluminum or magnesium alloy body",
                  "--High-resolution display options, including 4K",
                  "--Thin bezels for a modern look"
              ]
          },
          {
              title: "Performance and Battery",
              subfeatures: [
                  "--Powerful Intel or AMD Ryzen processors for multitasking",
                  "--Long-lasting battery life for all-day usage",
                  "--Fast charging capability"
              ]
          },
          {
              title: "Multimedia Experience",
              subfeatures: [
                  "--Hi-Res Audio for superior sound quality",
                  "--Full HD or 4K display for vivid visuals",
                  "--Dolby Audio for immersive sound"
              ]
          },
          {
              title: "Connectivity and Ports",
              subfeatures: [
                  "--Wide range of ports including USB Type-C, HDMI, and SD card slot",
                  "--Bluetooth 5.0, Wi-Fi 6 for fast connectivity"
              ]
          }
      ];
  
      const ratingKey = `${brand}_${product}`; // Make sure 'brand' and 'product' are defined
      const ratingValue = productRatings[ratingKey] || 0;
      const ratingElement = document.getElementById('product-rating');
      ratingElement.innerHTML = generateStarString(ratingValue);

      // Add Description
      const descriptionHTML = `<strong>✨ Description:</strong><br>${description.replace(/\n/g, "<br>")}`;
      const descriptionItem = document.createElement('li');
      descriptionItem.innerHTML = descriptionHTML;
      detailsList.appendChild(descriptionItem);
  
      // Add Specifications
      const specsTitle = document.createElement('li');
      specsTitle.innerHTML = `<strong>🔧 General Specifications:</strong>`;
      specsList.appendChild(specsTitle);
  
      specifications.forEach(spec => {
          const specItem = document.createElement('li');
          specItem.textContent = spec;
          specsList.appendChild(specItem);
      });
  
      // Add Features
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
              subFeatureItem.style.marginLeft = '20px';
              featuresList.appendChild(subFeatureItem);
          });
      });
  } else if (brand === "Sony" && product.toLowerCase().includes("tablet")) {
      const description = `Sony tablets, particularly from the Xperia series, combine powerful performance with sleek, portable designs. Known for their high-resolution displays, they deliver vibrant visuals, making them perfect for media consumption and gaming. Xperia tablets also provide impressive processing power, long battery life, and fast performance, making them suitable for productivity and creative tasks. They are built with durability in mind, offering water and dust resistance for use in various environments. Whether for work, entertainment, or on-the-go use, Sony tablets provide a premium, all-around experience.`;
  
      const specifications = [
          "• Operating System – Android 10/11",
          "• Display – 10.1-inch to 12.4-inch LCD or OLED",
          "• Processor – Qualcomm Snapdragon 835/855",
          "• Storage – 64GB to 256GB (expandable via microSD)",
          "• RAM – 4GB to 6GB",
          "• Battery Life – 10 to 12 hours",
          "• Audio – Hi-Res Audio, stereo speakers",
          "• Connectivity – USB Type-C, Bluetooth 5.0, Wi-Fi 6",
          "• Water Resistance – IP65/IP68"
      ];
  
      const features = [
          {
              title: "Display and Multimedia",
              subfeatures: [
                  "--Vibrant 4K or Full HD display for stunning visuals",
                  "--Stereo speakers with Hi-Res Audio for immersive sound",
                  "--Support for Dolby Atmos for enhanced audio experience"
              ]
          },
          {
              title: "Performance",
              subfeatures: [
                  "--High-performance Qualcomm Snapdragon processors",
                  "--Smooth multitasking and app usage with 4GB or more of RAM"
              ]
          },
          {
              title: "Design and Durability",
              subfeatures: [
                  "--Slim and lightweight design for easy portability",
                  "--Water and dust resistance (IP65/IP68)",
                  "--Premium build quality"
              ]
          },
          {
              title: "Battery and Charging",
              subfeatures: [
                  "--All-day battery life (up to 12 hours)",
                  "--Fast charging via USB-C"
              ]
          }
      ];

      const ratingKey = `${brand}_${product}`; // Make sure 'brand' and 'product' are defined
      const ratingValue = productRatings[ratingKey] || 0;
      const ratingElement = document.getElementById('product-rating');
      ratingElement.innerHTML = generateStarString(ratingValue);
  
      // Add Description
      const descriptionHTML = `<strong>✨ Description:</strong><br>${description.replace(/\n/g, "<br>")}`;
      const descriptionItem = document.createElement('li');
      descriptionItem.innerHTML = descriptionHTML;
      detailsList.appendChild(descriptionItem);
  
      // Add Specifications
      const specsTitle = document.createElement('li');
      specsTitle.innerHTML = `<strong>🔧 General Specifications:</strong>`;
      specsList.appendChild(specsTitle);
  
      specifications.forEach(spec => {
          const specItem = document.createElement('li');
          specItem.textContent = spec;
          specsList.appendChild(specItem);
      });
  
      // Add Features
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
              subFeatureItem.style.marginLeft = '20px';
              featuresList.appendChild(subFeatureItem);
          });
      });
  } else if (brand === "Sony" && product.toLowerCase().includes("headphone")) {
      const description = `Sony headphones are celebrated for their superior sound quality, comfort, and stylish design. Equipped with advanced noise cancellation, they provide an immersive listening experience by blocking out distractions. Models like the WH-1000XM and WF series offer high-resolution audio for audiophiles and feature long battery life for extended use. Whether you're commuting, working, or relaxing, Sony headphones ensure crystal-clear sound and deep bass. With various designs including over-ear, in-ear, and wireless options, they cater to all types of listeners.`;
  
      const specifications = [
          "• Connectivity – Bluetooth 5.0, USB-C charging",
          "• Noise Cancellation – Active Noise Cancellation (ANC)",
          "• Battery Life – 20 to 30 hours (varies by model)",
          "• Audio – High-Resolution Audio support, LDAC",
          "• Design – Over-ear, on-ear, in-ear models",
          "• Water Resistance – IPX4 (for sweat and rain)",
          "• Special Features – Voice assistant, customizable sound settings"
      ];
  
      const features = [
          {
              title: "Sound Quality and Noise Cancellation",
              subfeatures: [
                  "--Industry-leading Active Noise Cancellation (ANC)",
                  "--Clear, balanced sound with rich bass",
                  "--High-Resolution Audio and LDAC support"
              ]
          },
          {
              title: "Comfort and Design",
              subfeatures: [
                  "--Ergonomically designed for all-day comfort",
                  "--Soft ear cups and adjustable headbands",
                  "--Compact, foldable design for portability"
              ]
          },
          {
              title: "Battery Life and Charging",
              subfeatures: [
                  "--Long battery life (up to 30 hours)",
                  "--Quick charge for hours of use in just a few minutes"
              ]
          },
          {
              title: "Wireless Connectivity",
              subfeatures: [
                  "--Bluetooth 5.0 for fast and stable wireless connection",
                  "--Touch controls and built-in voice assistants"
              ]
          }
      ];

      const ratingKey = `${brand}_${product}`; // Make sure 'brand' and 'product' are defined
      const ratingValue = productRatings[ratingKey] || 0;
      const ratingElement = document.getElementById('product-rating');
      ratingElement.innerHTML = generateStarString(ratingValue);
  
      // Add Description
      const descriptionHTML = `<strong>✨ Description:</strong><br>${description.replace(/\n/g, "<br>")}`;
      const descriptionItem = document.createElement('li');
      descriptionItem.innerHTML = descriptionHTML;
      detailsList.appendChild(descriptionItem);
  
      // Add Specifications
      const specsTitle = document.createElement('li');
      specsTitle.innerHTML = `<strong>🔧 General Specifications:</strong>`;
      specsList.appendChild(specsTitle);
  
      specifications.forEach(spec => {
          const specItem = document.createElement('li');
          specItem.textContent = spec;
          specsList.appendChild(specItem);
      });
  
      // Add Features
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
              subFeatureItem.style.marginLeft = '20px';
              featuresList.appendChild(subFeatureItem);
          });
      });
  } else if (brand === "Sony" && product.toLowerCase().includes("watch")) {
      const description = `Sony smartwatches are designed for users who want to track their health and stay connected without compromising on style. Featuring excellent fitness tracking capabilities, long battery life, and seamless integration with Android devices, Sony's smartwatches provide a combination of advanced features and sleek design.
      With the SmartWatch 3 and other Xperia-branded wearables, users can access notifications, track fitness goals, monitor heart rate, and even use GPS for workouts. Designed for both style and functionality, Sony smartwatches are the ideal companion for those who are always on the move.`;
  
      const specifications = [
          "• Operating System – Wear OS by Google",
          "• Processor – Qualcomm Snapdragon Wear 3100",
          "• Display – 1.6-inch to 1.78-inch OLED or LCD touchscreen",
          "• Storage – 4GB",
          "• Battery Life – 1 to 2 days",
          "• Water Resistance – IP68 (suitable for swimming)",
          "• Connectivity – Bluetooth 4.1, Wi-Fi, GPS",
          "• Health Features – Heart rate monitor, step counter, sleep tracking"
      ];
  
      const features = [
          {
              title: "Health and Fitness Tracking",
              subfeatures: [
                  "--Heart rate monitor for continuous health tracking",
                  "--Built-in GPS for outdoor workouts",
                  "--Sleep tracking and step counting"
              ]
          },
          {
              title: "Design and Display",
              subfeatures: [
                  "--Sleek and lightweight design",
                  "--Vibrant OLED or LCD display for clear visibility",
                  "--Customizable watch faces"
              ]
          },
          {
              title: "Battery Life and Charging",
              subfeatures: [
                  "--Long battery life (up to 2 days)",
                  "--Quick charging capabilities"
              ]
          },
          {
              title: "Connectivity and Apps",
              subfeatures: [
                  "--Notifications from apps and messaging services",
                  "--Compatible with Android and iOS devices"
              ]
          }
      ];

      const ratingKey = `${brand}_${product}`; // Make sure 'brand' and 'product' are defined
      const ratingValue = productRatings[ratingKey] || 0;
      const ratingElement = document.getElementById('product-rating');
      ratingElement.innerHTML = generateStarString(ratingValue);
  
      // Add Description
      const descriptionHTML = `<strong>✨ Description:</strong><br>${description.replace(/\n/g, "<br>")}`;
      const descriptionItem = document.createElement('li');
      descriptionItem.innerHTML = descriptionHTML;
      detailsList.appendChild(descriptionItem);
  
      // Add Specifications
      const specsTitle = document.createElement('li');
      specsTitle.innerHTML = `<strong>🔧 General Specifications:</strong>`;
      specsList.appendChild(specsTitle);
  
      specifications.forEach(spec => {
          const specItem = document.createElement('li');
          specItem.textContent = spec;
          specsList.appendChild(specItem);
      });
  
      // Add Features
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
              subFeatureItem.style.marginLeft = '20px';
              featuresList.appendChild(subFeatureItem);
          });
      });
  } else if (brand.toLowerCase() === "hp" && product.toLowerCase().includes("smartphone")) {
      const description = `HP smartphones are designed to combine productivity and style with powerful features for both work and play. Known for their premium build quality, HP smartphones offer smooth performance with top-tier hardware and software integration, making them ideal for business professionals and tech enthusiasts alike.
      With their cutting-edge displays, long battery life, and the ability to seamlessly connect with other HP devices, HP smartphones offer an exceptional mobile experience. From the HP Elite series to the more affordable HP X3, these devices are engineered for those who demand performance, security, and connectivity on the go.`;
  
      const specifications = [
          "• Operating System – Android with HP's custom skin (depending on model)",
          "• Processor – Qualcomm Snapdragon 800 series or equivalent",
          "• Display – 5.5-inch to 6.5-inch Full HD/Quad HD AMOLED or IPS LCD",
          "• Storage – 64GB to 512GB (expandable with microSD on some models)",
          "• Battery Life – 12 to 20 hours (depending on usage)",
          "• Water Resistance – IP67 or IP68 (depending on model)",
          "• Connectivity – 4G LTE, Wi-Fi, Bluetooth, NFC",
          "• Camera – 12MP to 48MP rear camera, 8MP to 16MP front camera",
          "• Security – Fingerprint sensor, Face Unlock"
      ];
  
      const features = [
          {
              title: "Performance and Speed",
              subfeatures: [
                  "--Powered by Snapdragon 800 series processors for smooth performance",
                  "--Up to 12GB of RAM for efficient multitasking",
                  "--Fast charging capabilities (up to 50% in 30 minutes)"
              ]
          },
          {
              title: "Display and Design",
              subfeatures: [
                  "--Sleek aluminum body with premium finishes",
                  "--Vibrant AMOLED or Full HD LCD displays for crisp visuals",
                  "--Edge-to-edge design for an immersive experience"
              ]
          },
          {
              title: "Camera and Photography",
              subfeatures: [
                  "--High-resolution rear cameras with advanced AI for great photos in any lighting",
                  "--Ultra-wide lens and macro camera for versatile shots",
                  "--4K video recording capabilities"
              ]
          },
          {
              title: "Battery and Charging",
              subfeatures: [
                  "--Fast-charging support for quick power-ups",
                  "--Long-lasting battery to get through the day on a single charge"
              ]
          },
          {
              title: "Business and Productivity Features",
              subfeatures: [
                  "--Integration with HP productivity tools like HP Workspace and HP Sure View",
                  "--Enterprise-grade security and management features",
                  "--Enhanced support for work-from-home and remote collaboration"
              ]
          },
          {
              title: "Connectivity and Smart Features",
              subfeatures: [
                  "--4G LTE and Wi-Fi connectivity for seamless communication",
                  "--NFC for easy pairing with other devices",
                  "--Seamless synchronization with other HP devices like laptops and desktops"
              ]
          }
      ];
  
      const ratingKey = `${brand}_${product}`; // Make sure 'brand' and 'product' are defined
      const ratingValue = productRatings[ratingKey] || 0;
      const ratingElement = document.getElementById('product-rating');
      ratingElement.innerHTML = generateStarString(ratingValue);

      // Add Description
      const descriptionHTML = `<strong>✨ Description:</strong><br>${description.replace(/\n/g, "<br>")}`;
      const descriptionItem = document.createElement('li');
      descriptionItem.innerHTML = descriptionHTML;
      detailsList.appendChild(descriptionItem);
  
      // Add Specifications
      const specsTitle = document.createElement('li');
      specsTitle.innerHTML = `<strong>🔧 General Specifications:</strong>`;
      specsList.appendChild(specsTitle);
  
      specifications.forEach(spec => {
          const specItem = document.createElement('li');
          specItem.textContent = spec;
          specsList.appendChild(specItem);
      });
  
      // Add Features
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
              subFeatureItem.style.marginLeft = '20px';
              featuresList.appendChild(subFeatureItem);
          });
      });
  }  else if (brand.toLowerCase() === "hp" && product.toLowerCase().includes("laptop")) {
      const description = `HP laptops are renowned for their reliability, performance, and sleek design, catering to a wide range of users from students and professionals to gamers and creatives.
      Whether you're using an HP Spectre x360 for ultra-portable productivity, an HP Envy for creative tasks, or an HP Omen for immersive gaming, HP laptops combine powerful hardware with smart software features. Built with premium materials and integrated with Windows 11, these laptops deliver seamless multitasking and enhanced security on the go.`;
  
      const specifications = [
          "• Operating System – Windows 11 Home/Pro",
          "• Processor – Intel Core i5/i7/i9 or AMD Ryzen 5/7/9",
          "• Display – 13.3-inch to 17.3-inch Full HD, 2K, or 4K UHD (IPS or OLED)",
          "• Storage – 256GB to 2TB SSD",
          "• RAM – 8GB to 32GB DDR4/DDR5",
          "• Battery Life – Up to 18 hours (depending on model)",
          "• Build – Aluminum or high-quality polycarbonate body",
          "• Ports – USB-C, Thunderbolt 4, HDMI, USB-A, headphone jack",
          "• Security – Fingerprint reader, TPM, facial recognition (Windows Hello)"
      ];
  
      const features = [
          {
              title: "Performance and Speed",
              subfeatures: [
                  "--Powered by latest Intel or AMD processors",
                  "--Up to 32GB RAM for heavy multitasking",
                  "--PCIe NVMe SSD for ultra-fast boot and load times"
              ]
          },
          {
              title: "Display and Design",
              subfeatures: [
                  "--Edge-to-edge glass displays with high color accuracy",
                  "--Touchscreen support (on select models)",
                  "--Convertible 2-in-1 models with 360° hinges (Spectre x360, Envy x360)"
              ]
          },
          {
              title: "Battery and Charging",
              subfeatures: [
                  "--Fast-charging technology (up to 50% in 30 minutes)",
                  "--Long battery life for all-day productivity"
              ]
          },
          {
              title: "Productivity and Software",
              subfeatures: [
                  "--Integrated with Microsoft Office and Windows tools",
                  "--HP QuickDrop for fast file sharing between devices",
                  "--HP Command Center for performance optimization"
              ]
          },
          {
              title: "Security and Privacy",
              subfeatures: [
                  "--Built-in fingerprint reader and facial recognition",
                  "--Privacy screen with HP Sure View (on supported models)",
                  "--Camera shutter and mute mic key for privacy control"
              ]
          },
          {
              title: "Connectivity and Expansion",
              subfeatures: [
                  "--Wi-Fi 6E and Bluetooth 5.3 support",
                  "--Multiple ports for enhanced connectivity",
                  "--Thunderbolt 4 for fast data and display output"
              ]
          }
      ];

      const ratingKey = `${brand}_${product}`; // Make sure 'brand' and 'product' are defined
      const ratingValue = productRatings[ratingKey] || 0;
      const ratingElement = document.getElementById('product-rating');
      ratingElement.innerHTML = generateStarString(ratingValue);
  
      // Add Description
      const descriptionHTML = `<strong>✨ Description:</strong><br>${description.replace(/\n/g, "<br>")}`;
      const descriptionItem = document.createElement('li');
      descriptionItem.innerHTML = descriptionHTML;
      detailsList.appendChild(descriptionItem);
  
      // Add Specifications
      const specsTitle = document.createElement('li');
      specsTitle.innerHTML = `<strong>🔧 General Specifications:</strong>`;
      specsList.appendChild(specsTitle);
  
      specifications.forEach(spec => {
          const specItem = document.createElement('li');
          specItem.textContent = spec;
          specsList.appendChild(specItem);
      });
  
      // Add Features
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
              subFeatureItem.style.marginLeft = '20px';
              featuresList.appendChild(subFeatureItem);
          });
      });
  } else if (brand.toLowerCase() === "hp" && product.toLowerCase().includes("tablet")) {
      const description = `HP tablets combine portability, versatility, and performance, making them ideal for both entertainment and productivity on the go.
      Whether it's the HP Elite x2 for business professionals or the HP Envy x2 for casual users, HP tablets offer sleek designs, high-resolution displays, and Windows or Android operating systems to suit different needs. They often come with detachable keyboards, stylus support, and powerful internals for efficient multitasking and creativity.`;
  
      const specifications = [
          "• Operating System – Windows 11 or Android (depending on model)",
          "• Processor – Intel Core i3/i5/i7 or Qualcomm Snapdragon",
          "• Display – 10-inch to 13-inch Full HD or 2K IPS touchscreen",
          "• Storage – 64GB to 1TB SSD or eMMC",
          "• RAM – 4GB to 16GB",
          "• Battery Life – 8 to 15 hours",
          "• Build – Lightweight magnesium or aluminum chassis",
          "• Connectivity – USB-C, Wi-Fi 6, Bluetooth 5.1, optional LTE",
          "• Input – Touchscreen, HP Digital Pen (optional), detachable keyboard"
      ];
  
      const features = [
          {
              title: "Portability and Design",
              subfeatures: [
                  "--Ultra-slim and lightweight for travel and mobility",
                  "--Detachable keyboard for laptop-like experience",
                  "--Stylish design with premium materials"
              ]
          },
          {
              title: "Display and Input",
              subfeatures: [
                  "--Touchscreen with stylus support for creative work",
                  "--High-resolution display for crisp visuals",
                  "--Anti-glare and wide-angle viewing features"
              ]
          },
          {
              title: "Performance",
              subfeatures: [
                  "--Efficient multitasking with up to 16GB RAM",
                  "--Fast boot and app loading with SSD storage",
                  "--Windows or Android OS for versatility"
              ]
          },
          {
              title: "Battery and Charging",
              subfeatures: [
                  "--Fast-charging technology (up to 50% in 45 minutes)",
                  "--Battery life optimized for all-day use"
              ]
          },
          {
              title: "Productivity and Connectivity",
              subfeatures: [
                  "--Pre-installed productivity tools (Office, HP apps)",
                  "--HP QuickDrop for file sharing",
                  "--LTE support for on-the-go internet access"
              ]
          },
          {
              title: "Security and Integration",
              subfeatures: [
                  "--Biometric login (Fingerprint or Face recognition on some models)",
                  "--HP Sure Start and BIOS protection",
                  "--Seamless integration with other HP devices"
              ]
          }
      ];

      const ratingKey = `${brand}_${product}`; // Make sure 'brand' and 'product' are defined
      const ratingValue = productRatings[ratingKey] || 0;
      const ratingElement = document.getElementById('product-rating');
      ratingElement.innerHTML = generateStarString(ratingValue);
  
      // Add Description
      const descriptionHTML = `<strong>✨ Description:</strong><br>${description.replace(/\n/g, "<br>")}`;
      const descriptionItem = document.createElement('li');
      descriptionItem.innerHTML = descriptionHTML;
      detailsList.appendChild(descriptionItem);
  
      // Add Specifications
      const specsTitle = document.createElement('li');
      specsTitle.innerHTML = `<strong>🔧 General Specifications:</strong>`;
      specsList.appendChild(specsTitle);
  
      specifications.forEach(spec => {
          const specItem = document.createElement('li');
          specItem.textContent = spec;
          specsList.appendChild(specItem);
      });
  
      // Add Features
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
              subFeatureItem.style.marginLeft = '20px';
              featuresList.appendChild(subFeatureItem);
          });
      });
  }  else if (brand.toLowerCase() === "hp" && product.toLowerCase().includes("headphones")) {
      const description = `HP headphones are engineered to deliver immersive audio experiences, whether you're working, gaming, or enjoying your favorite music.
      Known for their ergonomic designs and reliable audio quality, HP headphones come in various styles including over-ear, on-ear, and in-ear options. With features such as noise isolation, Bluetooth connectivity, and built-in microphones, HP headphones cater to both casual listeners and professionals.`;
  
      const specifications = [
          "• Type – Over-ear, On-ear, or In-ear (varies by model)",
          "• Audio – Stereo sound with deep bass and clear treble",
          "• Connectivity – Wired (3.5mm jack or USB) and Wireless (Bluetooth 5.0)",
          "• Battery Life – Up to 20 hours for wireless models",
          "• Microphone – Built-in mic for calls and voice commands",
          "• Controls – Inline or on-ear buttons for volume and playback",
          "• Comfort – Padded ear cushions and adjustable headbands",
          "• Compatibility – Windows, macOS, Android, iOS, and HP devices"
      ];
  
      const features = [
          {
              title: "Audio Quality",
              subfeatures: [
                  "--Crystal-clear stereo sound with enhanced bass",
                  "--Noise-isolating design for better immersion",
                  "--Ideal for calls, music, and multimedia"
              ]
          },
          {
              title: "Design and Comfort",
              subfeatures: [
                  "--Lightweight, foldable, and travel-friendly",
                  "--Soft ear cushions for extended use",
                  "--Adjustable headband for a custom fit"
              ]
          },
          {
              title: "Wireless Convenience",
              subfeatures: [
                  "--Bluetooth 5.0 for stable and fast pairing",
                  "--Up to 20 hours of battery life on a single charge",
                  "--Quick recharging via USB-C or Micro-USB"
              ]
          },
          {
              title: "Built-in Microphone",
              subfeatures: [
                  "--Clear voice pickup for online meetings or gaming",
                  "--Compatible with Zoom, Teams, Discord, etc.",
                  "--Mute and call control buttons"
              ]
          },
          {
              title: "Device Compatibility",
              subfeatures: [
                  "--Works with laptops, desktops, tablets, and smartphones",
                  "--Optimized for HP laptops and desktops",
                  "--Plug-and-play setup with no drivers required"
              ]
          }
      ];

      const ratingKey = `${brand}_${product}`; // Make sure 'brand' and 'product' are defined
      const ratingValue = productRatings[ratingKey] || 0;
      const ratingElement = document.getElementById('product-rating');
      ratingElement.innerHTML = generateStarString(ratingValue);
  
      // Add Description
      const descriptionHTML = `<strong>✨ Description:</strong><br>${description.replace(/\n/g, "<br>")}`;
      const descriptionItem = document.createElement('li');
      descriptionItem.innerHTML = descriptionHTML;
      detailsList.appendChild(descriptionItem);
  
      // Add Specifications
      const specsTitle = document.createElement('li');
      specsTitle.innerHTML = `<strong>🔧 General Specifications:</strong>`;
      specsList.appendChild(specsTitle);
  
      specifications.forEach(spec => {
          const specItem = document.createElement('li');
          specItem.textContent = spec;
          specsList.appendChild(specItem);
      });
  
      // Add Features
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
              subFeatureItem.style.marginLeft = '20px';
              featuresList.appendChild(subFeatureItem);
          });
      });
  } else if (brand.toLowerCase() === "hp" && product.toLowerCase().includes("watch")) {
      const description = `HP smartwatches blend technology and style to keep you connected and productive on the go. Whether you're monitoring your health, staying updated with notifications, or managing your day, HP smartwatches are designed to support a modern lifestyle.
      With seamless integration into the HP ecosystem and compatibility with Android and iOS, HP smartwatches offer smart features, fitness tracking, and long battery life in a sleek, wearable design.`;
  
      const specifications = [
          "• Display – 1.3 to 1.5-inch AMOLED touch display",
          "• Battery Life – 5 to 10 days depending on usage",
          "• Operating System – Proprietary HP OS or Wear OS (varies by model)",
          "• Connectivity – Bluetooth 5.0, Wi-Fi, optional LTE on select models",
          "• Sensors – Heart rate, SpO2, accelerometer, gyroscope, GPS",
          "• Water Resistance – Up to 5ATM (swim-proof)",
          "• Compatibility – Android and iOS",
          "• Charging – Magnetic charging dock (full charge in ~90 minutes)"
      ];
  
      const features = [
          {
              title: "Health and Fitness Tracking",
              subfeatures: [
                  "--24/7 heart rate and SpO2 monitoring",
                  "--Sleep and stress tracking",
                  "--Step count, calories burned, and workout modes"
              ]
          },
          {
              title: "Smart Features",
              subfeatures: [
                  "--Receive notifications for calls, texts, and apps",
                  "--Music control and weather updates",
                  "--Voice assistant integration (depending on model)"
              ]
          },
          {
              title: "Design and Comfort",
              subfeatures: [
                  "--Premium metal or polymer body with interchangeable bands",
                  "--Lightweight and durable construction",
                  "--Customizable watch faces"
              ]
          },
          {
              title: "Battery and Charging",
              subfeatures: [
                  "--Up to 10 days of usage on a single charge",
                  "--Quick recharge with magnetic charger"
              ]
          },
          {
              title: "Seamless Connectivity",
              subfeatures: [
                  "--Syncs with HP laptops and mobile devices",
                  "--Bluetooth and Wi-Fi for quick pairing and data transfer",
                  "--Optional LTE support for untethered usage"
              ]
          }
      ];

      const ratingKey = `${brand}_${product}`; // Make sure 'brand' and 'product' are defined
      const ratingValue = productRatings[ratingKey] || 0;
      const ratingElement = document.getElementById('product-rating');
      ratingElement.innerHTML = generateStarString(ratingValue);
  
      // Add Description
      const descriptionHTML = `<strong>✨ Description:</strong><br>${description.replace(/\n/g, "<br>")}`;
      const descriptionItem = document.createElement('li');
      descriptionItem.innerHTML = descriptionHTML;
      detailsList.appendChild(descriptionItem);
  
      // Add Specifications
      const specsTitle = document.createElement('li');
      specsTitle.innerHTML = `<strong>🔧 General Specifications:</strong>`;
      specsList.appendChild(specsTitle);
  
      specifications.forEach(spec => {
          const specItem = document.createElement('li');
          specItem.textContent = spec;
          specsList.appendChild(specItem);
      });
  
      // Add Features
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
              subFeatureItem.style.marginLeft = '20px';
              featuresList.appendChild(subFeatureItem);
          });
      });
    } else if (brand && product.toLowerCase().includes("smartphone")) {
      const description = `${brand} smartphones are designed to combine performance and style, offering a premium experience for work, entertainment, and communication. Known for their top-notch build quality, these smartphones feature powerful hardware, smooth performance, and innovative technology.
      With stunning displays, exceptional cameras, and long-lasting battery life, ${brand} smartphones deliver an exceptional mobile experience. Whether you are using flagship models or more affordable options, these devices provide excellent performance, connectivity, and features for every user.`;
  
      const specifications = [
          "• Operating System – Android or iOS (depending on brand and model)",
          "• Processor – High-performance processors like Qualcomm Snapdragon, Apple A-Series, etc.",
          "• Display – 5.5-inch to 6.7-inch Full HD/Quad HD AMOLED or IPS LCD",
          "• Storage – 64GB to 512GB (expandable with microSD on some models)",
          "• Battery Life – 12 to 20 hours (depending on usage)",
          "• Water Resistance – IP67 or IP68 (depending on model)",
          "• Connectivity – 4G LTE, Wi-Fi, Bluetooth, NFC",
          "• Camera – 12MP to 48MP rear camera, 8MP to 16MP front camera",
          "• Security – Fingerprint sensor, Face Unlock"
      ];
  
      const features = [
          {
              title: "Performance and Speed",
              subfeatures: [
                  "--Powered by high-end processors like Snapdragon or Apple A-series for smooth performance",
                  "--Up to 12GB of RAM for efficient multitasking",
                  "--Fast charging capabilities (up to 50% in 30 minutes)"
              ]
          },
          {
              title: "Display and Design",
              subfeatures: [
                  "--Sleek design with premium materials",
                  "--Vibrant AMOLED or Full HD LCD displays for crisp visuals",
                  "--Edge-to-edge design for an immersive experience"
              ]
          },
          {
              title: "Camera and Photography",
              subfeatures: [
                  "--High-resolution rear cameras with advanced AI for great photos in any lighting",
                  "--Ultra-wide lens and macro camera for versatile shots",
                  "--4K video recording capabilities"
              ]
          },
          {
              title: "Battery and Charging",
              subfeatures: [
                  "--Fast-charging support for quick power-ups",
                  "--Long-lasting battery to get through the day on a single charge"
              ]
          },
          {
              title: "Business and Productivity Features",
              subfeatures: [
                  "--Integration with productivity tools like email, calendar, and work apps",
                  "--Enterprise-grade security and management features",
                  "--Enhanced support for remote collaboration and communication"
              ]
          },
          {
              title: "Connectivity and Smart Features",
              subfeatures: [
                  "--4G LTE and Wi-Fi connectivity for seamless communication",
                  "--NFC for easy pairing with other devices",
                  "--Seamless synchronization with other devices like tablets and laptops"
              ]
          }
      ];

      const ratingKey = `${brand}_${product}`; // Make sure 'brand' and 'product' are defined
      const ratingValue = productRatings[ratingKey] || 0;
      const ratingElement = document.getElementById('product-rating');
      ratingElement.innerHTML = generateStarString(ratingValue);
  
      // Add Description
      const descriptionHTML = `<strong>✨ Description:</strong><br>${description.replace(/\n/g, "<br>")}`;
      const descriptionItem = document.createElement('li');
      descriptionItem.innerHTML = descriptionHTML;
      detailsList.appendChild(descriptionItem);
  
      // Add Specifications
      const specsTitle = document.createElement('li');
      specsTitle.innerHTML = `<strong>🔧 General Specifications:</strong>`;
      specsList.appendChild(specsTitle);
  
      specifications.forEach(spec => {
          const specItem = document.createElement('li');
          specItem.textContent = spec;
          specsList.appendChild(specItem);
      });
  
      // Add Features
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
              subFeatureItem.style.marginLeft = '20px';
              featuresList.appendChild(subFeatureItem);
          });
      });
  } else if (brand && product.toLowerCase().includes("laptop")) {
      const description = `${brand} laptops are engineered to provide high performance, versatility, and sleek designs for both work and leisure. Known for their innovative technology and premium build quality, ${brand} laptops offer exceptional power, security, and usability for a range of users, from business professionals to casual users and gamers.
      Whether you're looking for portability, performance, or long battery life, ${brand} laptops are built to meet your needs. Equipped with cutting-edge processors, vibrant displays, and advanced features, these laptops provide an outstanding experience for productivity, entertainment, and everything in between.`;
  
      const specifications = [
          "• Operating System – Windows 10/11 or macOS (depending on brand)",
          "• Processor – Intel Core i5/i7/i9, AMD Ryzen, or Apple M1/M2",
          "• Display – 13-inch to 17-inch Full HD or 4K LED, IPS, or Retina display",
          "• Storage – 256GB to 1TB SSD (expandable on some models)",
          "• RAM – 8GB to 64GB DDR4",
          "• Battery Life – 8 to 15 hours (depending on model and usage)",
          "• Connectivity – Wi-Fi 6, Bluetooth 5.0, USB-C, HDMI, Thunderbolt 3/4",
          "• Graphics – Integrated Intel Iris/Xe, AMD Radeon, or dedicated NVIDIA/AMD graphics",
          "• Security – Fingerprint scanner, Face Unlock, Webcam shutter"
      ];
  
      const features = [
          {
              title: "Performance and Speed",
              subfeatures: [
                  "--Powered by high-end processors like Intel i5/i7/i9, AMD Ryzen, or Apple M1/M2 for lightning-fast performance",
                  "--Up to 64GB of RAM for smooth multitasking",
                  "--Fast SSD storage for quick boot times and data access"
              ]
          },
          {
              title: "Display and Design",
              subfeatures: [
                  "--Premium build quality with sleek and durable materials",
                  "--Vibrant and color-accurate displays with Full HD, 4K, or Retina options",
                  "--Lightweight and slim design for portability"
              ]
          },
          {
              title: "Battery and Charging",
              subfeatures: [
                  "--Long-lasting battery life to get you through your day",
                  "--Fast charging support to quickly power up your laptop"
              ]
          },
          {
              title: "Graphics and Gaming",
              subfeatures: [
                  "--High-performance graphics for gaming, video editing, and content creation",
                  "--NVIDIA or AMD dedicated graphics on some models for better GPU performance"
              ]
          },
          {
              title: "Business and Productivity Features",
              subfeatures: [
                  "--Enhanced productivity features like high-quality keyboards, large trackpads, and multi-tasking capabilities",
                  "--Enterprise-grade security and management features for business use"
              ]
          },
          {
              title: "Connectivity and Ports",
              subfeatures: [
                  "--Multiple ports for connectivity including USB-C, USB-A, HDMI, and Thunderbolt 3/4",
                  "--Wi-Fi 6 and Bluetooth 5.0 for fast wireless connectivity",
                  "--Easy external device integration and data transfer"
              ]
          }
      ];

      const ratingKey = `${brand}_${product}`; // Make sure 'brand' and 'product' are defined
      const ratingValue = productRatings[ratingKey] || 0;
      const ratingElement = document.getElementById('product-rating');
      ratingElement.innerHTML = generateStarString(ratingValue);
  
      // Add Description
      const descriptionHTML = `<strong>✨ Description:</strong><br>${description.replace(/\n/g, "<br>")}`;
      const descriptionItem = document.createElement('li');
      descriptionItem.innerHTML = descriptionHTML;
      detailsList.appendChild(descriptionItem);
  
      // Add Specifications
      const specsTitle = document.createElement('li');
      specsTitle.innerHTML = `<strong>🔧 General Specifications:</strong>`;
      specsList.appendChild(specsTitle);
  
      specifications.forEach(spec => {
          const specItem = document.createElement('li');
          specItem.textContent = spec;
          specsList.appendChild(specItem);
      });
  
      // Add Features
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
              subFeatureItem.style.marginLeft = '20px';
              featuresList.appendChild(subFeatureItem);
          });
      });
  } else if (brand && product.toLowerCase().includes("tablet")) {
      const description = `${brand} tablets offer a balanced blend of portability, performance, and smart features for both work and entertainment. With sleek designs, vivid displays, and powerful internals, ${brand} tablets are ideal for students, professionals, and casual users alike.
      Whether you're streaming videos, attending online classes, taking notes, or multitasking with productivity apps, ${brand} tablets deliver smooth experiences. They often include stylus support, long battery life, and seamless integration with other devices from the same ecosystem.`;
  
      const specifications = [
          "• Operating System – Android, iPadOS, or Windows (depending on brand)",
          "• Processor – Octa-core Snapdragon, MediaTek, or Apple Silicon",
          "• Display – 8-inch to 12.9-inch Full HD/Quad HD LCD or AMOLED/Retina",
          "• Storage – 64GB to 512GB (expandable via microSD on some models)",
          "• RAM – 4GB to 16GB",
          "• Battery Life – 10 to 18 hours",
          "• Connectivity – Wi-Fi, Bluetooth, optional LTE/5G",
          "• Camera – 8MP to 13MP rear, 5MP to 12MP front",
          "• Stylus Support – Available on select models"
      ];
  
      const features = [
          {
              title: "Design and Display",
              subfeatures: [
                  "--Slim and lightweight design for portability",
                  "--Bright and sharp display for multimedia and reading",
                  "--Edge-to-edge screen or minimal bezels on premium models"
              ]
          },
          {
              title: "Performance and Usability",
              subfeatures: [
                  "--Responsive multitasking with high RAM and fast processors",
                  "--Optimized for productivity apps like Office, Notion, or Google Workspace",
                  "--Some models support desktop-like UI for productivity mode"
              ]
          },
          {
              title: "Stylus and Input",
              subfeatures: [
                  "--Stylus support for drawing, note-taking, and design tasks",
                  "--Handwriting-to-text and pressure sensitivity on premium pens",
                  "--Magnetic stylus attachment and fast charging (depending on brand)"
              ]
          },
          {
              title: "Battery and Charging",
              subfeatures: [
                  "--Long battery life for all-day use",
                  "--Fast charging over USB-C or proprietary chargers"
              ]
          },
          {
              title: "Audio and Multimedia",
              subfeatures: [
                  "--Dual or quad speakers for immersive sound",
                  "--Headphone jack or wireless audio options",
                  "--Ideal for watching videos, listening to music, or gaming"
              ]
          },
          {
              title: "Connectivity and Integration",
              subfeatures: [
                  "--Seamless pairing with other devices (e.g., phones, laptops)",
                  "--Wi-Fi 6 and optional cellular connectivity",
                  "--Compatible with smart keyboards and accessories"
              ]
          }
      ];

      const ratingKey = `${brand}_${product}`; // Make sure 'brand' and 'product' are defined
      const ratingValue = productRatings[ratingKey] || 0;
      const ratingElement = document.getElementById('product-rating');
      ratingElement.innerHTML = generateStarString(ratingValue);
  
      // Add Description
      const descriptionHTML = `<strong>✨ Description:</strong><br>${description.replace(/\n/g, "<br>")}`;
      const descriptionItem = document.createElement('li');
      descriptionItem.innerHTML = descriptionHTML;
      detailsList.appendChild(descriptionItem);
  
      // Add Specifications
      const specsTitle = document.createElement('li');
      specsTitle.innerHTML = `<strong>🔧 General Specifications:</strong>`;
      specsList.appendChild(specsTitle);
  
      specifications.forEach(spec => {
          const specItem = document.createElement('li');
          specItem.textContent = spec;
          specsList.appendChild(specItem);
      });
  
      // Add Features
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
              subFeatureItem.style.marginLeft = '20px';
              featuresList.appendChild(subFeatureItem);
          });
      });
  } else if (brand && product.toLowerCase().includes("headphone")) {
      const description = `${brand} headphones are crafted for audio enthusiasts who value high-quality sound, comfort, and advanced features. Whether for casual listening, studio work, or gaming, ${brand} offers a wide range of headphones designed to meet different user needs.
      From wireless Bluetooth headphones to wired studio monitors, ${brand}'s audio products often feature noise cancellation, deep bass, and crystal-clear treble, making them suitable for immersive music, calls, and media experiences.`;
  
      const specifications = [
          "• Type – Over-ear, On-ear, or In-ear (varies by model)",
          "• Connectivity – Wired (3.5mm, USB-C) or Wireless (Bluetooth 5.0/5.3)",
          "• Battery Life – Up to 20-60 hours for wireless models",
          "• Noise Cancellation – Passive or Active (ANC)",
          "• Frequency Response – 20Hz to 20kHz",
          "• Microphone – Built-in mic for calls or gaming (on select models)",
          "• Controls – On-ear buttons, touch controls, or app support",
          "• Charging – USB-C or proprietary fast charging (on wireless models)"
      ];
  
      const features = [
          {
              title: "Sound Quality",
              subfeatures: [
                  "--High-fidelity audio with deep bass and crisp highs",
                  "--Custom-tuned drivers for rich, immersive sound",
                  "--Low latency mode for gaming or video"
              ]
          },
          {
              title: "Comfort and Build",
              subfeatures: [
                  "--Adjustable headbands and cushioned ear cups",
                  "--Lightweight and ergonomic designs for long wear",
                  "--Foldable or compact for portability (on select models)"
              ]
          },
          {
              title: "Wireless and Controls",
              subfeatures: [
                  "--Bluetooth connectivity for wire-free use",
                  "--Integrated controls for playback, volume, and calls",
                  "--Voice assistant support (Google Assistant, Siri, Alexa)"
              ]
          },
          {
              title: "Battery and Charging",
              subfeatures: [
                  "--Long-lasting battery life (up to 60 hours)",
                  "--Quick charge features (e.g., 10 mins = 2-3 hrs playback)"
              ]
          },
          {
              title: "Noise Cancellation",
              subfeatures: [
                  "--Active Noise Cancellation for distraction-free listening",
                  "--Ambient/Transparency mode for situational awareness",
                  "--Customizable ANC levels via app (on advanced models)"
              ]
          },
          {
              title: "Versatility and Compatibility",
              subfeatures: [
                  "--Compatible with phones, laptops, tablets, and consoles",
                  "--Multipoint connection support on some wireless models",
                  "--Available in multiple colors and finishes"
              ]
          }
      ];

      const ratingKey = `${brand}_${product}`; // Make sure 'brand' and 'product' are defined
      const ratingValue = productRatings[ratingKey] || 0;
      const ratingElement = document.getElementById('product-rating');
      ratingElement.innerHTML = generateStarString(ratingValue);
  
      // Add Description
      const descriptionHTML = `<strong>✨ Description:</strong><br>${description.replace(/\n/g, "<br>")}`;
      const descriptionItem = document.createElement('li');
      descriptionItem.innerHTML = descriptionHTML;
      detailsList.appendChild(descriptionItem);
  
      // Add Specifications
      const specsTitle = document.createElement('li');
      specsTitle.innerHTML = `<strong>🔧 General Specifications:</strong>`;
      specsList.appendChild(specsTitle);
  
      specifications.forEach(spec => {
          const specItem = document.createElement('li');
          specItem.textContent = spec;
          specsList.appendChild(specItem);
      });
  
      // Add Features
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
              subFeatureItem.style.marginLeft = '20px';
              featuresList.appendChild(subFeatureItem);
          });
      });
  } else if (brand && product.toLowerCase().includes("watch")) {
      const description = `${brand} smartwatches are designed to blend technology and style, offering a wide range of features for fitness tracking, communication, and productivity. Whether you're monitoring your health, checking notifications, or customizing watch faces, ${brand} smartwatches provide a smart companion on your wrist.
      Known for their sleek designs and robust ecosystems, ${brand} offers smartwatches that cater to different lifestyles—from fitness-focused users to professionals who need seamless syncing with their phones and laptops.`;
  
      const specifications = [
          "• Display – AMOLED or LCD touch display with customizable watch faces",
          "• Battery Life – 1 to 14 days (depending on usage and model)",
          "• Sensors – Heart rate, SpO2, accelerometer, gyroscope, GPS",
          "• Compatibility – Android and/or iOS (depending on brand)",
          "• Water Resistance – 5ATM / IP68 (varies by model)",
          "• Connectivity – Bluetooth, Wi-Fi, GPS, LTE (optional on select models)",
          "• Charging – Magnetic or wireless charging support",
          "• Build – Stainless steel, aluminum, or polycarbonate case"
      ];
  
      const features = [
          {
              title: "Health & Fitness Tracking",
              subfeatures: [
                  "--Continuous heart rate monitoring and SpO2 tracking",
                  "--Step counter, sleep monitoring, and stress tracking",
                  "--Built-in sports modes and automatic activity detection"
              ]
          },
          {
              title: "Smart Features",
              subfeatures: [
                  "--Receive call, text, and app notifications",
                  "--Music control and onboard storage (select models)",
                  "--Voice assistant integration (Google, Alexa, Siri)"
              ]
          },
          {
              title: "Battery & Charging",
              subfeatures: [
                  "--Up to 14 days of battery life on power-saving modes",
                  "--Fast charging support with magnetic/wireless base",
                  "--Battery saver and always-on display options"
              ]
          },
          {
              title: "Design and Display",
              subfeatures: [
                  "--Premium design with swappable watch bands",
                  "--High-resolution displays with customizable faces",
                  "--Touchscreen navigation and physical buttons"
              ]
          },
          {
              title: "Connectivity and Compatibility",
              subfeatures: [
                  "--Works with Android/iOS phones via companion apps",
                  "--Bluetooth for audio and data sync",
                  "--Optional LTE for phone-free use (on select models)"
              ]
          },
          {
              title: "Durability and Water Resistance",
              subfeatures: [
                  "--Water-resistant up to 5ATM or IP68 rating",
                  "--Durable construction for everyday use and workouts",
                  "--Scratch-resistant glass (on premium models)"
              ]
          }
      ];
      
      console.log(`Brand: ${brand}, Product: ${product}`);

      const ratingKey = `${brand}_${product}`; // Make sure 'brand' and 'product' are defined
      const ratingValue = productRatings[ratingKey] || 0;
      const ratingElement = document.getElementById('product-rating');
      ratingElement.innerHTML = generateStarString(ratingValue);
  
      // Add Description
      const descriptionHTML = `<strong>✨ Description:</strong><br>${description.replace(/\n/g, "<br>")}`;
      const descriptionItem = document.createElement('li');
      descriptionItem.innerHTML = descriptionHTML;
      detailsList.appendChild(descriptionItem);
  
      // Add Specifications
      const specsTitle = document.createElement('li');
      specsTitle.innerHTML = `<strong>🔧 General Specifications:</strong>`;
      specsList.appendChild(specsTitle);
  
      specifications.forEach(spec => {
          const specItem = document.createElement('li');
          specItem.textContent = spec;
          specsList.appendChild(specItem);
      });
  
      // Add Features
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
              subFeatureItem.style.marginLeft = '20px';
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

// Function to check the read status of notifications and update the bell icon
async function checkNotificationStatus(userId) {
  try {
      // Set loading image while fetching notifications
      const bellImage = document.querySelector('.notification-bell');
      bellImage.src = "img_svg/load.jpg"; // Set the loading image

      // Reference to the user's notification logs
      const notificationsRef = firebase.firestore().collection("notifications").doc(userId).collection("logs");
      
      // Get all notifications for the user
      const querySnapshot = await notificationsRef.get();

      let isUnread = false;

      // Loop through all notifications and check the read status
      querySnapshot.forEach(doc => {
          const notification = doc.data();
          if (notification.read === "no") {
              isUnread = true; // If there's any unread notification, set the flag to true
          }
      });

      // Update the bell image based on the unread status
      if (isUnread) {
          bellImage.src = "img_svg/notificationwith.jpg"; // Set image to notificationwith.jpg if there's an unread notification
      } else {
          bellImage.src = "img_svg/notification.jpg"; // Set image to notification.jpg if all are read
      }

  } catch (error) {
      console.error("Error checking notification status:", error);
      const bellImage = document.querySelector('.notification-bell');
      bellImage.src = "img_svg/notification.jpg"; // Fallback to the default image if there's an error
  }
}

// Listen for auth state changes to check the notification status for logged-in user
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
      const userId = user.uid;
      // Check notification status for the logged-in user
      checkNotificationStatus(userId);
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
  const user = firebase.auth().currentUser;
  if (!user) {
    console.error("No user is signed in.");
    return;
  }

  const userId = user.uid;
  const notificationsRef = firebase.firestore().collection("notifications").doc(userId).collection("logs");

  try {
    const querySnapshot = await notificationsRef.orderBy("timestamp", "desc").get();

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