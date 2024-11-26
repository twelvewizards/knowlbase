document.addEventListener('DOMContentLoaded', function () {
    // Fetch DOM elements
    const elements = {
        loginBtn: document.querySelector('.login-btn'),
        signupBtn: document.querySelector('.signup-btn'),
        overlay: document.getElementById('overlay'),
        loginModal: document.getElementById('loginModal'),
        signupModal: document.getElementById('signupModal'),
        openSignupLink: document.querySelector('.open-signup-modal'),
        openLoginLink: document.querySelector('.open-login-modal'),
        manageUsersModal: document.getElementById("manageUsersModal"),
        manageUsersTableBody: document.querySelector(".manage-users-table tbody"),
        settingsIcon: document.querySelector(".settings-icon"),
        closeManageUsersBtn: document.querySelector(".manage-users-modal .close-button"),
        body: document.body, // To check user authentication
    };

    const userAuthenticated = elements.body.dataset.authenticated === "True";

    // Log missing elements for debugging
    Object.entries(elements).forEach(([key, value]) => {
        if (!value) console.warn(`${key} is missing in the DOM. This might be expected based on the user's login state.`);
    });

    // Functions to open and close modals
    const openModal = (modal) => {
        elements.overlay.style.display = 'block';
        setTimeout(() => {
            elements.overlay.style.opacity = '1';
        }, 10);
        modal.style.display = 'block';
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
    };

    const closeModal = (modal) => {
        elements.overlay.style.opacity = '0';
        modal.style.opacity = '0';
        modal.style.transform = 'translate(-50%, -50%) scale(0.95)';
        setTimeout(() => {
            elements.overlay.style.display = 'none';
            modal.style.display = 'none';
        }, 300);
    };

    // Open Login Modal
    elements.loginBtn?.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(elements.loginModal);
    });

    // Open Sign-Up Modal
    elements.signupBtn?.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(elements.signupModal);
    });

    // Link from Login to Sign-Up Modal
    elements.openSignupLink?.addEventListener('click', function (e) {
        e.preventDefault();
        closeModal(elements.loginModal);
        setTimeout(() => {
            openModal(elements.signupModal);
        }, 300);
    });

    // Link from Sign-Up to Login Modal
    elements.openLoginLink?.addEventListener('click', function (e) {
        e.preventDefault();
        closeModal(elements.signupModal);
        setTimeout(() => {
            openModal(elements.loginModal);
        }, 300);
    });

    // Close modals when overlay is clicked
    elements.overlay?.addEventListener('click', function () {
        closeModal(elements.loginModal);
        closeModal(elements.signupModal);
        closeModal(elements.manageUsersModal);
    });

    // Function to fetch users from the server
    const fetchUsers = async () => {
        console.log("Fetching users...");
        try {
            const response = await fetch("/fetch-users/");
            if (!response.ok) {
                console.error(`Failed to fetch users: ${response.status} ${response.statusText}`);
                throw new Error("Failed to fetch users");
            }
            const users = await response.json();
            console.log("Fetched users:", users);

            // Clear existing rows
            elements.manageUsersTableBody.innerHTML = "";

            if (users.length === 0) {
                const row = document.createElement("tr");
                row.innerHTML = `<td colspan="5">No users found</td>`;
                elements.manageUsersTableBody.appendChild(row);
                return;
            }

           // Populate table with user data
           users.forEach(user => {
            const row = document.createElement("tr");
        
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.groups__name || "No Group"}</td>
                <td class="action-cell">
                    <button class="action-button edit-btn" title="Edit">
                        <img src="https://img.icons8.com/ios-glyphs/30/ffffff/edit--v1.png" alt="Edit Icon">
                    </button>
                    <button class="action-button delete-btn" title="Delete">
                        <img src="https://img.icons8.com/ios-glyphs/30/ffffff/trash--v1.png" alt="Delete Icon">
                    </button>
                </td>
            `;
            elements.manageUsersTableBody.appendChild(row);
        });
        

        } catch (error) {
            console.error("Error in fetchUsers:", error);
        }
    };

    // Open modal and fetch users
    elements.settingsIcon?.addEventListener("click", () => {
        console.log("Settings icon clicked. Opening modal.");
        openModal(elements.manageUsersModal);

        // Check if user is authenticated
        if (userAuthenticated) {
            fetchUsers();
        } else {
            console.warn("User is not authenticated. Fetching users is disabled.");
        }
    });

    // Close modal when close button is clicked
    elements.closeManageUsersBtn?.addEventListener("click", () => {
        console.log("Close button clicked. Closing modal.");
        closeModal(elements.manageUsersModal);
    });

    // Open modals based on server-side variables
    if (typeof showLoginModal !== 'undefined' && showLoginModal) {
        openModal(elements.loginModal);
    }

    if (typeof showSignupModal !== 'undefined' && showSignupModal) {
        openModal(elements.signupModal);
    }
});
