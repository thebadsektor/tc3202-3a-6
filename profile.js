import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBf4xDYf1i5UDAc9jpB33Cein_sgATriyw",
    authDomain: "techforecastinitial.firebaseapp.com",
    projectId: "techforecastinitial",
    storageBucket: "techforecastinitial.appspot.com", // fixed typo
    messagingSenderId: "1022311444244",
    appId: "1:1022311444244:web:ef464c4c03285bb351dc01",
    measurementId: "G-G421TQ07R4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

document.addEventListener("DOMContentLoaded", () => {
    const firstNameInput = document.getElementById("first-name");
    const middleNameInput = document.getElementById("middle-name");
    const lastNameInput = document.getElementById("last-name");
    const emailInput = document.getElementById("email-address");
    const addressInput = document.getElementById("address");
    const shopNameInput = document.getElementById("shop-name");
    const phoneNumberInput = document.getElementById("phone-number");

    showLoadingSpinner();

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            console.log("No user detected. Redirecting to login...");
            window.location.href = "index.html";
            return;
        }

        emailInput.value = user.email || "";

        try {
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();

                // Fill form
                firstNameInput.value = userData.firstName || "";
                middleNameInput.value = userData.middleName || "";
                lastNameInput.value = userData.lastName || "";
                addressInput.value = userData.address || "";
                shopNameInput.value = userData.shopName || "";
                phoneNumberInput.value = userData.phoneNumber || "";

                const fullName = `${userData.firstName || ""} ${userData.middleName || ""} ${userData.lastName || ""}`.trim();
                document.querySelector(".profile-info h1").textContent = fullName || "Unnamed User";
                document.querySelector(".profile-info p").textContent = user.email || "No Email";
            } else {
                console.log("User document not found.");
            }
        } catch (error) {
            console.error("Error getting user document:", error);
            Swal.fire("Error", "Failed to load user data.", "error");
        } finally {
            hideLoadingSpinner();
        }
    });
});

// SweetAlert2 loading spinner
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
