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

firebase.auth().onAuthStateChanged((user) => {
  const userNameEl = document.getElementById("userName");

  if (user) {
    const userId = user.uid;

    // Fetch user data from Firestore
    firebase.firestore().collection("users").doc(userId).get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          const fullName = `${data.firstName} ${data.lastName}`;
          userNameEl.textContent = fullName;
        } else {
          userNameEl.textContent = "User data not found";
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        userNameEl.textContent = "Error loading name";
      });

  } else {
    userNameEl.textContent = "Not signed in";
  }
});

document.addEventListener("DOMContentLoaded", function () {
    // Fetch product summary from backend
    fetch("http://127.0.0.1:5000/product-summary")
        .then(response => response.json())
        .then(data => {
            if (data.product_summary) {
                const products = data.product_summary;

                // Count total products
                const totalProducts = products.length;

                // Sum total orders
                const totalOrders = products.reduce((sum, product) => sum + product.total_orders, 0);

                // Sum total sales
                const totalSales = products.reduce((sum, product) => sum + product.total_sales, 0);

                // Update HTML values
                document.getElementById("totalProducts").textContent = totalProducts;
                document.getElementById("totalOrders").textContent = totalOrders.toLocaleString();
                document.getElementById("totalSales").textContent = `₱${totalSales.toLocaleString()}`;
            } else {
                console.error("Unexpected response structure:", data);
            }
        })
        .catch(error => {
            console.error("Error fetching product summary:", error);
        });
});

document.addEventListener("DOMContentLoaded", () => {
    const timeFilter = document.getElementById("timeFilter");
    const ctx = document.getElementById("salesChart").getContext("2d");
    let salesChart;
  
    const salesData = {
        week: [
          { date: "Dec 24", total: 940850 },
          { date: "Dec 25", total: 155430 },
          { date: "Dec 26", total: 230860 },
          { date: "Dec 27", total: 34830 },
          { date: "Dec 28", total: 987310 },
          { date: "Dec 29", total: 697760 },
          { date: "Dec 30", total: 437010 }
        ],
        month: [
          { date: "Dec 01", total: 140090 },
          { date: "Dec 05", total: 837280 },
          { date: "Dec 09", total: 623200 },
          { date: "Dec 13", total: 1024210 },
          { date: "Dec 17", total: 552560 },
          { date: "Dec 21", total: 580850 },
          { date: "Dec 25", total: 155430 }
        ],
        "3months": [
          { date: "Oct 02", total: 931700 },
          { date: "Oct 14", total: 418950 },
          { date: "Oct 26", total: 27760 },
          { date: "Nov 07", total: 608010 },
          { date: "Nov 19", total: 721890 },
          { date: "Dec 01", total: 140090 },
          { date: "Dec 13", total: 1024210 }
        ],
        "6months": [
          { date: "Jul 04", total: 64980 },
          { date: "Jul 30", total: 225260 },
          { date: "Aug 26", total: 550520 },
          { date: "Sep 20", total: 203230 },
          { date: "Oct 15", total: 207670 },
          { date: "Nov 09", total: 949870 },
          { date: "Dec 04", total: 447980 }
        ],
        year: [
          { date: "Jan 01", total: 190750 },
          { date: "Feb 21", total: 225480 },
          { date: "Apr 12", total: 35760 },
          { date: "Jun 04", total: 366730 },
          { date: "Jul 26", total: 102700 },
          { date: "Sep 17", total: 456750 },
          { date: "Nov 07", total: 608010 }
        ],
        "5years": [
          { date: "Jan 02", total: 1074480 },
          { date: "Sep 19", total: 528670 },
          { date: "Jun 05", total: 1164120 },
          { date: "Feb 21", total: 1390970 },
          { date: "Nov 06", total: 1058330 },
          { date: "Jul 23", total: 160930 },
          { date: "Apr 06", total: 300560 }
        ]
      };
      
  
    function renderChart(range = "week") {
      const selectedData = salesData[range];
      const labels = selectedData.map(entry => entry.date);
      const sales = selectedData.map(entry => entry.total);
  
      if (salesChart) salesChart.destroy();
  
      salesChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Total Sales',
            data: sales,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.3,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true }
          },
          plugins: {
            legend: { display: true }
          }
        }
      });
    }
  
    timeFilter.addEventListener("change", () => {
      renderChart(timeFilter.value);
    });
  
    // Initial render
    renderChart();
  });

  document.addEventListener("DOMContentLoaded", function () {
    fetch("http://127.0.0.1:5000/predict-top-trending")
        .then(response => response.json())
        .then(data => {
            const products = data.top_25_trending_products || [];

            const salesBody = document.getElementById("sales-body");
            salesBody.innerHTML = ""; // Clear previous content

            products.slice(0, 25).forEach(product => {
                let brand = "---";
                let productName = "---";
                let predictedSales = "---";

                if (product.Product) {
                    if (product.Product.startsWith("Other Brands")) {
                        brand = "Other Brands";
                        productName = product.Product.replace("Other Brands ", "");
                    } else {
                        const [brandPart, ...productParts] = product.Product.split(" ");
                        brand = brandPart;
                        productName = productParts.join(" ");
                    }
                    predictedSales = product.predicted_sales ?? "---";
                }

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${brand}</td>
                    <td>${productName}</td>
                    <td>${predictedSales}</td>
                `;
                salesBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error fetching trending products:", error);
        });
});

document.addEventListener("DOMContentLoaded", function () {
  const topRatedProducts = [
      { product: "Apple Laptop", rating: 4.9 },
      { product: "Apple Smartphone", rating: 4.8 },
      { product: "Sony Headphone", rating: 4.8 },
      { product: "Samsung Smartphone", rating: 4.7 },
      { product: "Apple Tablets", rating: 4.7 },
      { product: "Samsung Smartwatch", rating: 4.6 },
      { product: "HP Laptop", rating: 4.5 },
      { product: "Samsung Headphone", rating: 4.5 },
      { product: "Sony Smartphone", rating: 4.4 },
      { product: "HP Tablet", rating: 4.3 }
  ];

  const tableBody = document.getElementById("top-rated-body");
  tableBody.innerHTML = ""; // Clear previous rows

  topRatedProducts.forEach(product => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${product.product}</td>
          <td>${product.rating} ⭐</td>
      `;
      tableBody.appendChild(row);
  });
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

document.getElementById("contact-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Common SweetAlert options
  const swalOptions = {
    toast: true,
    position: 'top', // This centers it at the top
    timer: 1500,
    timerProgressBar: true,
    showConfirmButton: false,
    background: '#1e2133',
    color: '#fff',
    customClass: {
      popup: 'swal2-toast-custom'
    }
  };

  if (name === "") {
    Swal.fire({ ...swalOptions, icon: 'error', title: 'Name is required!' });
    return;
  }

  if (email === "") {
    Swal.fire({ ...swalOptions, icon: 'error', title: 'Email is required!' });
    return;
  }

  if (!emailRegex.test(email)) {
    Swal.fire({ ...swalOptions, icon: 'error', title: 'Invalid email format!' });
    return;
  }

  if (subject === "") {
    Swal.fire({ ...swalOptions, icon: 'error', title: 'Subject is required!' });
    return;
  }

  if (message === "") {
    Swal.fire({ ...swalOptions, icon: 'error', title: 'Message cannot be empty!' });
    return;
  }

  // All fields valid
  Swal.fire({
    ...swalOptions,
    icon: 'success',
    title: 'Message sent!'
  }).then(() => {
  // Redirect after the toast disappears
  window.location.href = 'home.html';
});

  // Optional: reset form
  
});
