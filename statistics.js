// This will store the Chart.js chart instances
let transactionChart, salesChart;

// Initial empty chart setup
document.addEventListener('DOMContentLoaded', () => {
    const transactionCtx = document.getElementById('salesChart').getContext('2d');
    const salesCtx = document.getElementById('totalSalesChart').getContext('2d');

    // Creating an empty transaction chart (Total Transactions)
    transactionChart = new Chart(transactionCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Total Transactions',
                data: [],
                borderColor: '#4361ee',
                backgroundColor: '#4361ee',
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            }
        }
    });

    // Creating an empty sales chart (Total Sales)
    salesChart = new Chart(salesCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Total Sales',
                data: [],
                borderColor: '#ff6363',
                backgroundColor: '#ff6363',
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            }
        }
    });

    const showGraphBtn = document.getElementById('showGraphBtn');
    if (showGraphBtn) {
        showGraphBtn.addEventListener('click', sendGraphRequest);
    } else {
        console.log("Button not found!");
    }
});

// Function to handle graph rendering
window.sendGraphRequest = async function () {
    const selectedYear = document.getElementById('year-select').value;
    const selectedBrand = document.getElementById('brand-select').value;
    const selectedProduct = document.getElementById('product-select').value;

    console.log(`Selected Year: ${selectedYear}, Brand: ${selectedBrand}, Product: ${selectedProduct}`);

    const totalSales = {
        2020: 121060319.30,
        2021: 136001094.18,
        2022: 144292162.31,
        2023: 129844412.33,
        2024: 129425277.51,
    };

    const totalTransactions = {
        2020: 8596,
        2021: 9529,
        2022: 9359,
        2023: 8832,
        2024: 8676,
    };

    const totalMonthlyTransactions = {
        2020: [760, 641, 634, 679, 912, 708, 800, 614, 720, 774, 618, 736], // Monthly data for 2020
        2021: [800, 700, 670], // Example for other years
        2022: [850, 710, 690],
        2023: [880, 750, 720],
        2024: [900, 770, 740],
    };

    const totalMonthlySales = {
        2020: [21801070.00, 18703840.00, 18377860.00, 17976800.00, 23929770.00, 21115100.00, 23122430.00, 16294370.00, 20826120.00, 22106520.00, 17680350.00, 21350240.00],
        2021: [27466820.00, 20564970.00, 19428180.00, 17902340.00, 21963990.00, 20594890.00, 21533150.00, 22059310.00, 24240710.00, 21283060.00, 21715000.00, 20879980.00],
        2022: [27521980.00, 19721650.00, 18085200.00, 22999050.00, 27149350.00, 23063410.00, 22626780.00, 23755760.00, 20350430.00, 19049140.00, 19898920.00, 19294370.00],
        2023: [25079140.00, 20407630.00, 20222340.00, 18680870.00, 20843090.00, 22021460.00, 17938870.00, 21343970.00, 17012940.00, 24780690.00, 18808700.00, 17054020.00],
        2024: [18998390.00, 19104660.00, 17099260.00, 13638640.00, 18805710.00, 16719290.00, 21389690.00, 23863180.00, 21450440.00, 21827150.00, 20014300.00, 17781180.00],
    };

    const monthlyLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Decembers'];

    let transactionData = [];
    let salesData = [];
    let labels = [];
    let transactionTitle = 'Total Transactions';
    let salesTitle = 'Total Sales';

    // Check if 'All' filters are selected, then show the total transaction and sales graph for all years
    if (selectedYear === 'all' && selectedBrand === 'all' && selectedProduct === 'all') {
        for (const year in totalSales) {
            labels.push(year);  // Add year to the labels
            transactionData.push(totalTransactions[year]);  // Add total transactions for each year
            salesData.push(totalSales[year]);  // Add total sales for each year
        }

        // Update Total Transactions chart
        transactionChart.data.labels = labels;
        transactionChart.data.datasets[0].data = transactionData;
        transactionChart.update();

        // Update Total Sales chart
        salesChart.data.labels = labels;
        salesChart.data.datasets[0].data = salesData;
        salesChart.update();
    }else if (selectedYear !== 'all' && selectedBrand === 'all' && selectedProduct === 'all') {
        // If a specific year is selected
        labels = monthlyLabels;  // Use month labels
        transactionData = totalMonthlyTransactions[selectedYear];
        salesData = totalMonthlySales[selectedYear];

        // Set the title dynamically based on the selected year
        transactionTitle = `Total Transactions in ${selectedYear}`;
        salesTitle = `Total Sales in ${selectedYear}`;

        transactionChart.data.labels = labels;
        transactionChart.data.datasets[0].data = transactionData;
        transactionChart.options.plugins.title = {
            display: true,
            text: transactionTitle,  // Dynamic title based on the selected year
        };
        transactionChart.update();

        salesChart.data.labels = labels;
        salesChart.data.datasets[0].data = salesData;
        salesChart.options.plugins.title = {
            display: true,
            text: salesTitle,  // Dynamic title based on the selected year
        };
        salesChart.update();
    } else {
        // Show warning if no data matches the filters
        Swal.fire({
            title: "No data available.",
            text: "Please check your filter selections.",
            icon: "warning",
            timer: 3000,
            showConfirmButton: false
        });
        console.log("No data for the selected filters");
    }
};
