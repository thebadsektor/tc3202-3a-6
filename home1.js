document.addEventListener("DOMContentLoaded", function () {
    const products = document.querySelectorAll(".product");

    products.forEach(product => {
        product.addEventListener("click", () => {
            const brand = product.getAttribute("data-brand");
            const productName = product.getAttribute("data-product");

            console.log("Brand:", brand);
            console.log("Product:", productName);

            // Redirect to product.html with query params
            window.location.href = `product.html?brand=${encodeURIComponent(brand)}&product=${encodeURIComponent(productName)}`;
        });
    });
});
