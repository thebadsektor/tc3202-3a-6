import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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

document.addEventListener("DOMContentLoaded", () => {
    const firstNameInput = document.getElementById("firstName");
    const middleNameInput = document.getElementById("middleName");
    const lastNameInput = document.getElementById("lastName");
    const emailInput = document.getElementById("email");
    const addressInput = document.getElementById("address");
    const shopNameInput = document.getElementById("shopName");
    const saveButton = document.getElementById("saveButton");
    const editProfileForm = document.getElementById("editProfileForm");

    let originalData = {}; // Store original data for comparison

    // ✅ Check if user is logged in
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            emailInput.value = user.email; // Set email (non-editable)
            const userDocRef = doc(db, "users", user.uid);

            try {
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    originalData = userDoc.data(); // Store original data
                    firstNameInput.value = originalData.firstName || "";
                    middleNameInput.value = originalData.middleName || "";
                    lastNameInput.value = originalData.lastName || "";
                    addressInput.value = originalData.address || "";
                    shopNameInput.value = originalData.shopName || "";

                    saveButton.disabled = true; // Disable save button initially
                } else {
                    console.log("No user data found.");
                }
            } catch (error) {
                console.error("🔥 Error fetching user data:", error);
            }
        } else {
            console.log("🔴 No user detected. Redirecting to login...");
            window.location.href = "index.html"; // Redirect to login page if not logged in
        }
    });

    // ✅ Function to check if changes are made
    function checkForChanges() {
        const hasChanges =
            firstNameInput.value !== (originalData.firstName || "") ||
            middleNameInput.value !== (originalData.middleName || "") ||
            lastNameInput.value !== (originalData.lastName || "") ||
            addressInput.value !== (originalData.address || "") ||
            shopNameInput.value !== (originalData.shopName || "");

        saveButton.disabled = !hasChanges; // Enable button only if changes exist
    }

    // ✅ Listen for input changes dynamically
    editProfileForm.addEventListener("input", checkForChanges);

    // ✅ Save changes to Firestore
    editProfileForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const user = auth.currentUser;

        if (!user) {
            console.log("❌ No user detected.");
            return;
        }

        // Check again before updating
        if (saveButton.disabled) {
            alert("No changes detected. Please modify fields before saving.");
            return;
        }

        const userDocRef = doc(db, "users", user.uid);
        try {
            await updateDoc(userDocRef, {
                firstName: firstNameInput.value,
                middleName: middleNameInput.value,
                lastName: lastNameInput.value,
                address: addressInput.value,
                shopName: shopNameInput.value
            });

            alert("✅ Profile updated successfully!");
            saveButton.disabled = true; // Re-disable after saving
            originalData = { // Update local data to match saved values
                firstName: firstNameInput.value,
                middleName: middleNameInput.value,
                lastName: lastNameInput.value,
                address: addressInput.value,
                shopName: shopNameInput.value
            };
        } catch (error) {
            console.error("🔥 Error updating profile:", error);
        }
    });
});
