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
        manageUsersModal: document.getElementById('manageUsersModal'),
        manageUsersTableBody: document.querySelector('.manage-users-table tbody'),
        settingsIcon: document.querySelector('.settings-icon'),
        closeManageUsersBtn: document.querySelector('.manage-users-modal .close-button'),
        addArticleModal: document.getElementById('addArticleModal'),
        closeAddArticleModal: document.querySelector('.add-article-modal .close-button'),
        openAddArticleButton: document.querySelector('.add-new'),
        removeUserModal: document.getElementById('removeUserModal'),
        userEmailDisplay: document.getElementById('userEmail'),
        confirmRemoveBtn: document.getElementById('confirmRemoveUser'),
        cancelRemoveBtn: document.getElementById('cancelRemoveUser'),
        mainContent: document.querySelector('.main-content'), // The specific content to blur
        body: document.body,
    };

    const userAuthenticated = elements.body.dataset.authenticated === 'True';

    // Function to open a modal
    const openModal = (modal, shouldBlurMain = true) => {
        elements.overlay.style.display = 'block';
        modal.style.display = 'block';
        if (shouldBlurMain) elements.mainContent.classList.add('blur');
        setTimeout(() => {
            elements.overlay.style.opacity = '1';
            modal.style.opacity = '1';
            modal.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
    };

    // Function to close a modal
    const closeModal = (modal, removeBlurMain = true) => {
        modal.style.opacity = '0';
        modal.style.transform = 'translate(-50%, -50%) scale(0.95)';
        setTimeout(() => {
            modal.style.display = 'none';
            if (removeBlurMain) {
                elements.overlay.style.opacity = '0';
                elements.overlay.style.display = 'none';
                elements.mainContent.classList.remove('blur');
            }
        }, 300);
    };

    // Open Login Modal
    elements.loginBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(elements.loginModal);
    });

    // Open Sign-Up Modal
    elements.signupBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(elements.signupModal);
    });

    // Link from Login to Sign-Up Modal
    elements.openSignupLink?.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(elements.loginModal, false);
        setTimeout(() => {
            openModal(elements.signupModal);
        }, 300);
    });

    // Link from Sign-Up to Login Modal
    elements.openLoginLink?.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(elements.signupModal, false);
        setTimeout(() => {
            openModal(elements.loginModal);
        }, 300);
    });

    // Close modals when overlay is clicked
    elements.overlay?.addEventListener('click', () => {
        const openModals = [elements.loginModal, elements.signupModal, elements.manageUsersModal, elements.addArticleModal, elements.removeUserModal];
        openModals.forEach((modal) => {
            if (modal.style.display === 'block') closeModal(modal);
        });
    });

    // Function to fetch users from the server
    const fetchUsers = async () => {
        try {
            const response = await fetch('/fetch-users/');
            if (!response.ok) {
                console.error(`Failed to fetch users: ${response.status} ${response.statusText}`);
                throw new Error('Failed to fetch users');
            }
            const users = await response.json();

            elements.manageUsersTableBody.innerHTML = ''; // Clear existing rows

            if (users.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `<td colspan="4">No users found</td>`;
                elements.manageUsersTableBody.appendChild(row);
                return;
            }

            users.forEach((user) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.email}</td>
                    <td>${user.groups__name || 'No Group'}</td>
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
            console.error('Error in fetchUsers:', error);
        }
    };

    // Event delegation for dynamically added delete buttons
    elements.manageUsersTableBody.addEventListener('click', (e) => {
        if (e.target.closest('.delete-btn')) {
            const userRow = e.target.closest("tr"); // Find the corresponding row
            const email = userRow.querySelector("td:nth-child(2)").textContent; // Get the email
            openRemoveUserModal(email);
        }
    });

    // Open Add Article Modal
    elements.openAddArticleButton?.addEventListener('click', () => {
        openModal(elements.addArticleModal);
    });

    // Close Add Article Modal
    elements.closeAddArticleModal?.addEventListener('click', () => {
        closeModal(elements.addArticleModal);
    });

    // Open Manage Users Modal and fetch users
    elements.settingsIcon?.addEventListener('click', () => {
        openModal(elements.manageUsersModal);

        // Check if user is authenticated
        if (userAuthenticated) {
            fetchUsers();
        } else {
            console.warn('User is not authenticated. Fetching users is disabled.');
        }
    });

    // Close Manage Users Modal when close button is clicked
    elements.closeManageUsersBtn?.addEventListener("click", () => {
        closeModal(elements.manageUsersModal);
    });

    // Open modals based on server-side variables
    if (typeof showLoginModal !== 'undefined' && showLoginModal) {
        openModal(elements.loginModal);
    }

    if (typeof showSignupModal !== 'undefined' && showSignupModal) {
        openModal(elements.signupModal);
    }

    // Open Remove User Modal
    const openRemoveUserModal = (email) => {
        elements.userEmailDisplay.textContent = email;
        elements.manageUsersModal.classList.add('dimmed'); // Dim the Manage Users Modal
        openModal(elements.removeUserModal, false); // Open Remove User Modal without affecting Main Content
    };


    // Close Remove User Modal
    const closeRemoveUserModal = () => {
        closeModal(elements.removeUserModal, false); // Close Remove User Modal only
        elements.manageUsersModal.classList.remove('dimmed'); // Remove dim effect from Manage Users Modal
    };

      // Attach event listeners
      elements.cancelRemoveBtn.addEventListener('click', closeRemoveUserModal);
      elements.confirmRemoveBtn.addEventListener('click', () => {
          console.log('User removal confirmed:', elements.userEmailDisplay.textContent);
          closeRemoveUserModal();
      });
      
        // Simulate opening the Remove User Modal
        document.querySelector('.manage-users-table').addEventListener('click', (event) => {
            if (event.target.closest('.delete-btn')) {
                const email = event.target.closest('tr').querySelector('td:nth-child(2)').textContent;
                openRemoveUserModal(email);
            }
        });

    // Confirm Remove Action
    elements.confirmRemoveBtn.addEventListener('click', () => {
        console.log('User removal confirmed for:', elements.userEmailDisplay.textContent);
        closeRemoveUserModal();
    });
    
    // Cancel Remove Action
    elements.cancelRemoveBtn.addEventListener('click', () => {
        closeRemoveUserModal();
    });

    // Event listener for confirm button (non-functional for now)
    confirmRemoveBtn.addEventListener("click", () => {
        console.log("User removal confirmed for:", userEmailDisplay.textContent);
        closeRemoveUserModal();
    });

    // Close modal when clicking outside
    overlay.addEventListener("click", closeRemoveUserModal);
});



