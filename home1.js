document.addEventListener("DOMContentLoaded", function () {
    const trendingContainer = document.querySelector(".trending-products");

    showLoadingSpinner();

    fetch("http://127.0.0.1:5000/predict-top-trending")
    .then(response => response.json())
    .then(data => {

        hideLoadingSpinner();
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
        });
    })
    .catch(error => {
        hideLoadingSpinner();
        console.error("Error fetching top trending products:", error);
    });
});

// 🛠 Move the click event listener outside, for all products (dynamic + static)
document.addEventListener("click", (event) => {
    const product = event.target.closest(".product");
    if (product) {
        const brand = product.getAttribute("data-brand");
        const productName = product.getAttribute("data-product");

        if (brand && productName) {
            window.location.href = `clicked-product.html?brand=${encodeURIComponent(brand)}&product=${encodeURIComponent(productName)}`;
        }
    }
});

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

function showLoadingSpinner() {
    Swal.fire({
        title: "Loading...",
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