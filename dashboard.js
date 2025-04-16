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
