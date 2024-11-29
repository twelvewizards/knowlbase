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
        editUserModal: document.getElementById('editUserModal'),
        editUserName: document.getElementById('editUserName'),
        editUserGroup: document.getElementById('editUserGroup'),
        confirmEditUser: document.getElementById('confirmEditUser'),
        cancelEditUser: document.getElementById('cancelEditUser'),
        newEmail: document.getElementById('newEmail'),
        mainContent: document.querySelector('.main-content'),
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
        const openModals = [elements.loginModal, elements.signupModal, elements.manageUsersModal, elements.addArticleModal, elements.removeUserModal, elements.editUserModal];
        openModals.forEach((modal) => {
            if (modal.style.display === 'block') closeModal(modal);
        });
    });

    // Function to fetch users from the server
    const fetchUsers = async () => {
        try {
            const response = await fetch('/fetch-users/');
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Failed to fetch users. Response: ${errorText}`);
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
                        <button class="action-button delete-btn" data-user-id="${user.id}" title="Delete">
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
        // Handle Delete Button
        if (e.target.closest('.delete-btn')) {
            const deleteBtn = e.target.closest('.delete-btn');
            const email = deleteBtn.closest("tr").querySelector("td:nth-child(2)").textContent;
            const userId = deleteBtn.dataset.userId;
            elements.userEmailDisplay.textContent = email;
            elements.userEmailDisplay.dataset.userId = userId;
            openRemoveUserModal(email);
        }
    
        // Handle Edit Button
        if (e.target.closest('.edit-btn')) {
            const editBtn = e.target.closest('.edit-btn');
            const row = editBtn.closest('tr');
            const email = row.querySelector('td:nth-child(2)').textContent;
            const role = row.querySelector('td:nth-child(3)').textContent;
            const userId = row.querySelector('.delete-btn').dataset.userId; // Assume delete-btn contains user ID
            openEditUserModal(email, role, userId);
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

    // Open Edit User Modal
    const openEditUserModal = (email, role, userId) => {
        elements.editUserName.value = email;
        elements.editUserGroup.innerHTML = ""; // Clear existing options
    
        // Determine role options based on the current user's role
        const currentUserRole = elements.body.dataset.role; // Assume role is passed as a data attribute
        let roleOptions = ["Student"]; // Default option for all users
    
        if (currentUserRole === "Admin") {
            roleOptions = ["Admin", "Tutor", "Student"];
        } else if (currentUserRole === "Tutor") {
            roleOptions = ["Tutor", "Student"];
        }
    
        // Populate the dropdown
        roleOptions.forEach((roleOption) => {
            const option = document.createElement("option");
            option.value = roleOption;
            option.textContent = roleOption;
            if (roleOption === role) option.selected = true;
            elements.editUserGroup.appendChild(option);
        });
    
        elements.editUserModal.dataset.userId = userId; // Store the userId in dataset
        elements.manageUsersModal.classList.add("dimmed"); // Dim the Manage Users Modal
        openModal(elements.editUserModal, false);
    };
    


    // Close Edit User Modal
    const closeEditUserModal = () => {
        closeModal(elements.editUserModal, false);
        elements.manageUsersModal.classList.remove('dimmed');
    };

    // Attach Cancel Button Event for Edit User Modal
    elements.cancelEditUser.addEventListener('click', closeEditUserModal);

    // Attach Save Changes Event
    elements.confirmEditUser.addEventListener('click', async () => {
        const userId = elements.editUserModal.dataset.userId;
        const newEmail = elements.editUserName.value;
        const newRole = elements.editUserGroup.value;
    
        if (!userId || !newEmail || !newRole) {
            console.error("DEBUG: Missing required fields.");
            return;
        }
    
        try {
            console.log(`DEBUG: Sending request to update user ID ${userId}`);
            const response = await fetch("/update-user/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCsrfToken(),
                },
                body: JSON.stringify({ user_id: userId, email: newEmail, role: newRole }),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`DEBUG: Failed to update user. Response: ${errorText}`);
                throw new Error(errorText);
            }
    
            const result = await response.json();
            if (result.status === "success") {
                console.log(`DEBUG: User updated successfully. Message: ${result.message}`);
                closeEditUserModal();
                fetchUsers(); // Refresh the user list
            } else {
                console.error(`DEBUG: Failed to update user. Message: ${result.message}`);
            }
        } catch (error) {
            console.error(`DEBUG: Error updating user: ${error}`);
        }
    });
    

    // Open Remove User Modal
    const openRemoveUserModal = (email) => {
        elements.userEmailDisplay.textContent = email;
        elements.manageUsersModal.classList.add('dimmed');
        openModal(elements.removeUserModal, false);
    };

    // Close Remove User Modal
    const closeRemoveUserModal = () => {
        closeModal(elements.removeUserModal, false);
        elements.manageUsersModal.classList.remove('dimmed');
    };

    // Attach Cancel Button Event
    elements.cancelRemoveBtn?.addEventListener('click', closeRemoveUserModal);

    // Attach Confirm Button Event with debugging and proper functionality
    elements.confirmRemoveBtn?.addEventListener('click', async () => {
        const userId = elements.userEmailDisplay.dataset.userId;
        if (!userId) {
            console.error("DEBUG: User ID not found in the modal.");
            return;
        }

        try {
            console.log(`DEBUG: Sending request to delete user ID ${userId}`);
            const response = await fetch("/delete-user/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "X-CSRFToken": getCsrfToken(),
                },
                body: new URLSearchParams({ user_id: userId }),
            });

            const result = await response.json();
            if (response.ok && result.status === "success") {
                console.log(`DEBUG: User deleted successfully. Message: ${result.message}`);
                closeRemoveUserModal();
                fetchUsers();
            } else {
                console.error(`DEBUG: Failed to delete user. Message: ${result.message}`);
            }
        } catch (error) {
            console.error(`DEBUG: Error removing user: ${error}`);
        }
    });

    // Helper: Get CSRF Token
    const getCsrfToken = () => {
        const csrfCookie = document.cookie.split("; ").find((row) => row.startsWith("csrftoken="));
        return csrfCookie ? csrfCookie.split("=")[1] : null;
    };

    // Initial Fetch Users
    fetchUsers();


    document.addEventListener('DOMContentLoaded', () => {
        const addNewButton = document.querySelector('.article-button.add-new');
        const userAuthenticated = document.body.dataset.authenticated === 'True';
        const userRole = document.body.dataset.role;
    
        // Hide button if user is not authenticated or does not have the correct role
        if (!userAuthenticated || !['Admin', 'Tutor'].includes(userRole)) {
            addNewButton?.remove(); // Completely remove the button from DOM
        }
    });
    

    // Remove Article Modal functionality
    const removeArticleModal = document.getElementById('removeArticleModal');
    const modalArticleTitle = document.getElementById('modalArticleTitle');
    const confirmRemoveArticleBtn = document.getElementById('confirmRemoveArticle');
    const cancelRemoveArticleBtn = document.getElementById('cancelRemoveArticle');
    const mainContent = document.querySelector('.main-content');

    // Function to open the Remove Article Modal
    function openRemoveArticleModal(articleTitle) {
        console.log('Opening remove article modal for:', articleTitle);
        modalArticleTitle.textContent = articleTitle;
        elements.overlay.style.display = 'block';
        removeArticleModal.style.display = 'block';
        mainContent.classList.add('blur');
        setTimeout(() => {
            elements.overlay.style.opacity = '1';
            removeArticleModal.style.opacity = '1';
        }, 10);
    }

    // Function to close the Remove Article Modal
    function closeRemoveArticleModal() {
        removeArticleModal.style.opacity = '0';
        elements.overlay.style.opacity = '0';
        mainContent.classList.remove('blur');
        setTimeout(() => {
            removeArticleModal.style.display = 'none';
            elements.overlay.style.display = 'none';
        }, 300);
    }

    // Event delegation for delete article buttons
    document.body.addEventListener('click', (event) => {
        const deleteBtn = event.target.closest('.delete-article-btn');
        if (deleteBtn) {
            const articleTitle = deleteBtn.dataset.articleTitle;
            if (articleTitle) {
                console.log('Delete button clicked for article:', articleTitle);
                openRemoveArticleModal(articleTitle);
            }
        }
        
        // Close modal when clicking overlay
        if (event.target === elements.overlay && removeArticleModal.style.display === 'block') {
            closeRemoveArticleModal();
        }
    });

    // Cancel button closes the modal
    cancelRemoveArticleBtn?.addEventListener('click', closeRemoveArticleModal);

    // Confirm button handler with delete functionality
    confirmRemoveArticleBtn?.addEventListener('click', async () => {
        const articleTitle = modalArticleTitle.textContent;
        console.log('Confirming deletion of article:', articleTitle);
        
        try {
            const response = await fetch('/delete-article/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken(),
                },
                body: JSON.stringify({ title: articleTitle }),
            });

            const data = await response.json();
            
            if (response.ok) {
                console.log('Article deleted successfully');
                closeRemoveArticleModal();
                // Refresh the page to show updated article list
                window.location.reload();
            } else {
                console.error('Failed to delete article:', data.message);
                alert('Failed to delete article: ' + data.message);
            }
        } catch (error) {
            console.error('Error deleting article:', error);
            alert('Error deleting article. Please try again.');
        }
    });
});
