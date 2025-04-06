import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBf4xDYf1i5UDAc9jpB33Cein_sgATriyw",
    authDomain: "techforecastinitial.firebaseapp.com",
    projectId: "techforecastinitial",
    storageBucket: "techforecastinitial.firebasestorage.app",
    messagingSenderId: "1022311444244",
    appId: "1:1022311444244:web:ef464c4c03285bb351dc01",
    measurementId: "G-G421TQ07R4"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

// ✅ Function to load user profile data
document.addEventListener("DOMContentLoaded", () => {
    const firstNameInput = document.getElementById("first-name");
    const middleNameInput = document.getElementById("middle-name");
    const lastNameInput = document.getElementById("last-name");
    const emailInput = document.getElementById("email-address");
    const addressInput = document.getElementById("address");
    const shopNameInput = document.getElementById("shop-name");
    const phoneNumberInput = document.getElementById("phone-number");

    // ✅ Check if user is logged in
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // ✅ Show loading spinner (optional)
            showLoadingSpinner();

            emailInput.value = user.email; // Set email (non-editable)

            // Fetch user data from Firestore
            const userDocRef = doc(db, "users", user.uid);
            try {
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data(); // Store user data from Firestore

                    // ✅ Populate form fields with user data
                    firstNameInput.value = userData.firstName || "";
                    middleNameInput.value = userData.middleName || "";
                    lastNameInput.value = userData.lastName || "";
                    addressInput.value = userData.address || "";
                    shopNameInput.value = userData.shopName || "";
                    phoneNumberInput.value = userData.phoneNumber || "";

                } else {
                    console.log("No user data found.");
                }
            } catch (error) {
                console.error("🔥 Error fetching user data:", error);
            } finally {
                // ✅ Hide loading spinner
                hideLoadingSpinner();
            }
        } else {
            console.log("🔴 No user detected. Redirecting to login...");
            window.location.href = "index.html"; // Redirect to login page if not logged in
        }
    });
});

// ✅ Show Loading Spinner
function showLoadingSpinner() {
    Swal.fire({
        title: "Loading data...",
        text: "Please wait...",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading();
        }
    });
}

// ✅ Hide Loading Spinner
function hideLoadingSpinner() {
    Swal.close(); // Closes the loading alert
}
