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
            showLoadingSpinner();

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

                    saveButton.disabled = false; // Disable save button initially
                } else {
                    console.log("No user data found.");
                }
            } catch (error) {
                console.error("🔥 Error fetching user data:", error);
            } finally {
                hideLoadingSpinner(); // ✅ Hide spinner after fetching data
            }
        } else {
            console.log("🔴 No user detected. Redirecting to login...");
            window.location.href = "index.html"; // Redirect to login page if not logged in
        }
    });

    /// ✅ Function to check if actual changes are made
    function checkForChanges() {
        const currentData = {
            firstName: firstNameInput.value.trim(),
            middleName: middleNameInput.value.trim(),
            lastName: lastNameInput.value.trim(),
            address: addressInput.value.trim(),
            shopName: shopNameInput.value.trim()
        };

        // Compare if current form state is different from originalData
        const hasChanges = JSON.stringify(currentData) !== JSON.stringify(originalData);

        saveButton.disabled = !hasChanges; // Enable button only if actual changes exist
    }

    // ✅ Listen for input changes dynamically
    editProfileForm.addEventListener("input", checkForChanges);

    // ✅ Save changes to Firestore
    editProfileForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        saveButton.disabled = false;
        const user = auth.currentUser;

        if (!user) {
            console.log("❌ No user detected.");
            return;
        }

        // ✅ Trim inputs to remove accidental spaces
        const firstName = firstNameInput.value.trim();
        const middleName = middleNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const address = addressInput.value.trim();
        const shopName = shopNameInput.value.trim();

        // ✅ Check for empty fields (excluding optional middle name)
        if (!firstName || !lastName || !shopName || !address) {
            Swal.fire({
                title: "Missing Fields",
                text: "Please fill in all required fields.",
                icon: "warning",
                timer: 3000, 
                showConfirmButton: false
            });
            return;
        }

        const nameRegex = /^[a-zA-Z]+(?:\s[a-zA-Z]+)?$/; // Only letters, one space allowed
        const shopRegex = /^[a-zA-Z0-9\s]{4,}$/; // Min 4 characters, letters & numbers

        if (!nameRegex.test(firstName) || firstName.length < 2) {
            Swal.fire({
                title: "Invalid First Name",
                text: "First name must be at least 2 characters and contain no special characters.",
                icon: "warning",
                timer: 3000, // Auto-close after 3 seconds
                showConfirmButton: false
            });
            return;
        }
        if (middleName && !nameRegex.test(middleName)) {
            Swal.fire({
                title: "Invalid Middle Name",
                text: "Middle name must contain only letters.",
                icon: "warning",
                timer: 3000, // Auto-close after 3 seconds
                showConfirmButton: false
            });
            return;
        }
        if (!nameRegex.test(lastName) || lastName.length < 2) {
            Swal.fire({
                title: "Invalid Last Name",
                text: "Last name must be at least 2 characters and contain no special characters.",
                icon: "warning",
                timer: 3000, // Auto-close after 3 seconds
                showConfirmButton: false
            });
            return;
        }
        if (!shopRegex.test(shopName)) {
            Swal.fire({
                title: "Invalid Shop Name",
                text: "Shop name must be at least 4 characters and contain only letters and numbers.",
                icon: "warning",
                timer: 3000, // Auto-close after 3 seconds
                showConfirmButton: false
            });
            return;
        }
        if (!address) {
            Swal.fire({
                title: "Invalid Address",
                text: "Address is required.",
                icon: "warning",
                timer: 3000, // Auto-close after 3 seconds
                showConfirmButton: false
            });
            return;
        }

        const hasChanges =
            firstNameInput.value !== (originalData.firstName || "") ||
            middleNameInput.value !== (originalData.middleName || "") ||
            lastNameInput.value !== (originalData.lastName || "") ||
            addressInput.value !== (originalData.address || "") ||
            shopNameInput.value !== (originalData.shopName || "");

        if (!hasChanges) {
            Swal.fire({
                title: "No Changes Detected",
                text: "You haven't made any changes. Please modify fields before saving.",
                icon: "warning",
                timer: 3000,
                showConfirmButton: false
            });
            return;
        }

        savingLoadingSpinner();

        const userDocRef = doc(db, "users", user.uid);
        try {
            await updateDoc(userDocRef, {
                firstName: firstNameInput.value,
                middleName: middleNameInput.value,
                lastName: lastNameInput.value,
                address: addressInput.value,
                shopName: shopNameInput.value
            });

            hideLoadingSpinner();

            Swal.fire({
                title: "✅ Success!",
                text: "Profile updated successfully!",
                icon: "success",
                confirmButtonText: "OK"
            }).then(() => {
                // Redirect to home.html after the user clicks OK
                window.location.replace("home.html");
            });
            
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

function savingLoadingSpinner() {
    Swal.fire({
        title: "Saving changes...",
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
    Swal.close(); // Closes the loading alert before showing a new one
}