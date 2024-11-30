document.addEventListener('DOMContentLoaded', function () {
    try {
        const articlesData = JSON.parse(document.getElementById('articlesData').textContent);
        console.log("Articles Data Loaded:", articlesData);

        const articleButtonsContainer = document.querySelector('.article-buttons-container');
        const filterButtons = document.querySelectorAll('.category-filters .filter-option input');
        const contentSection = document.querySelector('.article-content-default');
        const dropdownContainer = document.querySelector('.dropdown-container');
        const addNewButton = document.querySelector('.article-button.add-new');
        const userAuthenticated = document.body.dataset.authenticated === 'True';
        const userRole = document.body.dataset.role;

        console.log("DEBUG: User Authenticated:", userAuthenticated);
        console.log("DEBUG: User Role:", userRole);

        // Check if necessary elements exist
        if (!articleButtonsContainer || !filterButtons.length) {
            console.error("Required elements not found!");
            return;
        }

        const activeCategories = { art: true, mathematics: true, technology: true };

        // Function to check authentication status
        function isAuthenticated() {
            return userAuthenticated;
        }

        // Set the default content message based on authentication status
        function setDefaultContentMessage() {
            if (isAuthenticated()) {
                contentSection.innerHTML = '<p>Click an article to view its contents</p>';
            } else {
                contentSection.innerHTML = '<p>Sign up or log in to view article contents!</p>';
            }
        }

        // Render articles based on selected categories
        function renderArticles() {
            articleButtonsContainer.innerHTML = ''; // Clear container

            const filteredArticles = articlesData.filter(article => {
                return (
                    (article.category_id === 1 && activeCategories.art) ||
                    (article.category_id === 2 && activeCategories.mathematics) ||
                    (article.category_id === 3 && activeCategories.technology)
                );
            });

            filteredArticles.forEach(article => {
                const button = document.createElement('button');
                button.className = 'article-button';
                button.textContent = article.title;

                if (article.category_id === 1) button.classList.add('art');
                if (article.category_id === 2) button.classList.add('mathematics');
                if (article.category_id === 3) button.classList.add('technology');

                articleButtonsContainer.appendChild(button);

                button.addEventListener('click', function () {
                    if (!isAuthenticated()) {
                        flashSignUpPrompt();
                    } else {
                        console.log("Article Clicked:", article);
                        contentSection.classList.remove('article-content-default');
                        contentSection.classList.add('article-content-expanded');
                        updateContentSection(article);
                    }
                });
            });

            // Add "+ Add New" button if user is authorized
            if (userAuthenticated && ['Admin', 'Tutor'].includes(userRole)) {
                if (!document.querySelector('.article-button.add-new')) {
                    const addButton = document.createElement('button');
                    addButton.className = 'article-button add-new';
                    addButton.textContent = '+ Add New';
                    articleButtonsContainer.appendChild(addButton);

                    addButton.addEventListener('click', function () {
                        console.log("DEBUG: Add New button clicked.");
                        // Your functionality to open the "Add New Article" modal goes here
                    });
                }
            }

            console.log("DEBUG: Articles rendered:", filteredArticles);
        }

        // Flash sign-up prompt for unauthenticated users
        function flashSignUpPrompt() {
            contentSection.innerHTML = '<p class="flash-prompt">Sign up or log in to view article contents!</p>';
            contentSection.classList.add('flash-effect');
            setTimeout(() => {
                contentSection.classList.remove('flash-effect');
                setDefaultContentMessage();
            }, 1000);
        }

        // Update content section with article details
        function updateContentSection(article) {
            const userRole = document.body.dataset.role;
            const showActions = ['Admin', 'Tutor'].includes(userRole);
            
            contentSection.innerHTML = `
                <div class="article-header">
                    <div class="header-section">
                        <div class="header-item">
                            <span class="header-label">Name</span>
                            <span class="header-value">${article.title}</span>
                        </div>
                        <div class="header-item">
                            <span class="header-label">Born</span>
                            <span class="header-value">${article.born || '-'}</span>
                        </div>
                        <div class="header-item">
                            <span class="header-label">Died</span>
                            <span class="header-value">${article.died || '-'}</span>
                        </div>
                    </div>
                    <div class="header-section">
                        <div class="header-item">
                            <span class="header-label">Nationality/Developer</span>
                            <span class="header-value">${article.nationality || article.developer || '-'}</span>
                        </div>
                        <div class="header-item">
                            <span class="header-label">Known For</span>
                            <span class="header-value">${article.known_for || '-'}</span>
                        </div>
                        <div class="header-item">
                            <span class="header-label">Notable Work</span>
                            <span class="header-value">${article.notable_work || '-'}</span>
                        </div>
                    </div>
                    <div class="header-section">
                        <div class="header-item">
                            <span class="header-label">Location</span>
                            <span class="header-value">${article.location || '-'}</span>
                        </div>
                    </div>
                    ${showActions ? `
                    <div class="content-actions">
                        <button 
                            class="action-button edit-article-btn" 
                            data-article='${JSON.stringify({
                                id: article.id,
                                title: article.title,
                                about: article.about,
                                category__name: article.category__name,
                                type__name: article.type__name,
                                born: article.born,
                                died: article.died,
                                nationality: article.nationality,
                                known_for: article.known_for,
                                notable_work: article.notable_work,
                                year: article.year,
                                medium: article.medium,
                                dimensions: article.dimensions,
                                location: article.location
                            }).replace(/'/g, "&#39;")}'
                            title="Edit"
                        >
                            <img src="https://img.icons8.com/ios-glyphs/20/00cc00/pencil--v1.png" alt="Edit">
                        </button>
                        <button 
                            class="action-button delete-article-btn" 
                            data-article-title="${article.title}"
                            title="Delete"
                        >
                            <img src="https://img.icons8.com/ios-glyphs/20/cc0000/trash--v1.png" alt="Delete">
                        </button>
                    </div>
                    ` : ''}
                    <div class="article-content">
                        <p>${article.about || 'No description available.'}</p>
                    </div>
                <div class="article-footer">
                    <div class="footer-group">
                        <span class="footer-item">Dimensions: ${article.dimensions || '-'}</span>
                        <span class="footer-item">Medium: ${article.medium || '-'}</span>
                        <span class="footer-item">Designed by: ${article.designed_by || '-'}</span>
                        <span class="footer-item">Year: ${article.year || '-'}</span>
                    </div>
                    <div class="footer-group">
                        <span class="footer-item">Type: ${article.type__name || '-'}</span>
                        <span class="footer-item">Category: ${article.category__name || '-'}</span>
                    </div>
                </div>
            `;
        }
        

        // Dropdown functionality to collapse content
        dropdownContainer.addEventListener('click', function () {
            if (contentSection.classList.contains('article-content-expanded')) {
                contentSection.classList.remove('article-content-expanded');
                contentSection.classList.add('article-content-default');
                setDefaultContentMessage();
            }
        });

        // Add event listeners for filter buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                if (button.name.includes('art')) {
                    activeCategories.art = !activeCategories.art;
                    button.checked = activeCategories.art;
                } else if (button.name.includes('math')) {
                    activeCategories.mathematics = !activeCategories.mathematics;
                    button.checked = activeCategories.mathematics;
                } else if (button.name.includes('tech')) {
                    activeCategories.technology = !activeCategories.technology;
                    button.checked = activeCategories.technology;
                }
                renderArticles();
            });
        });

        // Initial setup
        setDefaultContentMessage(); // Set default content message
        renderArticles(); // Render articles on page load

        // Add event delegation for edit button clicks
        document.addEventListener('click', function(event) {
            const editBtn = event.target.closest('.edit-article-btn');
            if (editBtn) {
                console.log("Edit button clicked"); // Debug log
                
                // Get the article data
                const articleData = JSON.parse(editBtn.dataset.article);
                console.log("Article data:", articleData); // Debug log
                
                // Get modal elements
                const modal = document.getElementById('editArticleModal');
                const mainContent = document.querySelector('.main-content');
                const categorySelect = modal.querySelector('select[name="category"]');
                const typeSelect = modal.querySelector('select[name="type"]');
                const discardBtn = modal.querySelector('.discard-btn');

                if (!modal) {
                    console.error("Modal element not found!");
                    return;
                }

                const overlay = document.getElementById('overlay');
                console.log("Overlay found:", overlay); // Debug log

                if (!overlay) {
                    console.error("Overlay element not found!");
                    return;
                }

                // Function to close modal
                const closeModal = () => {
                    modal.style.opacity = '0';
                    overlay.style.opacity = '0';
                    mainContent.classList.remove('blur');
                    setTimeout(() => {
                        modal.style.display = 'none';
                        overlay.style.display = 'none';
                    }, 300);
                };

                // Populate form fields with article data
                modal.querySelector('textarea').value = articleData.about || '';
                modal.querySelector('input[name="title"]').value = articleData.title || '';
                modal.querySelector('input[name="born"]').value = articleData.born || '';
                modal.querySelector('input[name="died"]').value = articleData.died || '';
                modal.querySelector('input[name="nationality"]').value = articleData.nationality || '';
                modal.querySelector('input[name="known_for"]').value = articleData.known_for || '';
                modal.querySelector('input[name="notable_work"]').value = articleData.notable_work || '';
                modal.querySelector('input[name="year"]').value = articleData.year || '';
                modal.querySelector('input[name="medium"]').value = articleData.medium || '';
                modal.querySelector('input[name="dimensions"]').value = articleData.dimensions || '';
                modal.querySelector('input[name="location"]').value = articleData.location || '';

                // Fix category population
                fetch('/get-categories/')
                    .then(response => response.json())
                    .then(data => {
                        categorySelect.innerHTML = '<option value="">Select category</option>';
                        data.forEach(category => {
                            const option = document.createElement('option');
                            option.value = category.id;
                            option.textContent = category.name;
                            if (category.name === articleData.category__name) {
                                option.selected = true;
                                // Trigger type population for the selected category
                                fetch(`/get-types/${category.id}/`)
                                    .then(response => response.json())
                                    .then(types => {
                                        typeSelect.innerHTML = '<option value="">Select type</option>';
                                        types.forEach(type => {
                                            const option = document.createElement('option');
                                            option.value = type.id;
                                            option.textContent = type.name;
                                            if (type.name === articleData.type__name) {
                                                option.selected = true;
                                            }
                                            typeSelect.appendChild(option);
                                        });
                                        typeSelect.disabled = false;
                                    });
                            }
                            categorySelect.appendChild(option);
                        });
                    });

                // Show modal and overlay with opacity transition and blur
                overlay.style.display = 'block';
                modal.style.display = 'block';
                mainContent.classList.add('blur');
                
                // Force reflow
                modal.offsetHeight;
                
                // Add opacity
                overlay.style.opacity = '1';
                modal.style.opacity = '1';
                
                // Handle discard button click
                discardBtn.onclick = (e) => {
                    e.preventDefault();
                    closeModal();
                };
                
                // Handle overlay click to close modal
                overlay.onclick = closeModal;

                // Add this function to handle art fields visibility
                const toggleArtFields = (categoryName) => {
                    const artFields = modal.querySelector('.art-specific-fields');
                    if (categoryName === 'Arts') {
                        artFields.style.display = 'block';
                    } else {
                        artFields.style.display = 'none';
                    }
                };

                // Update the category change handler
                categorySelect.onchange = function() {
                    const selectedCategoryId = this.value;
                    const selectedOption = this.options[this.selectedIndex];
                    const categoryName = selectedOption.textContent;
                    
                    toggleArtFields(categoryName);

                    if (selectedCategoryId) {
                        fetch(`/get-types/${selectedCategoryId}/`)
                            .then(response => response.json())
                            .then(data => {
                                typeSelect.innerHTML = '<option value="">Select type</option>';
                                data.forEach(type => {
                                    const option = document.createElement('option');
                                    option.value = type.id;
                                    option.textContent = type.name;
                                    if (type.name === articleData.type__name) {
                                        option.selected = true;
                                    }
                                    typeSelect.appendChild(option);
                                });
                                typeSelect.disabled = false;
                            });
                    } else {
                        typeSelect.innerHTML = '<option value="">Type (sub category)</option>';
                        typeSelect.disabled = true;
                    }
                };

                // Initial art fields visibility based on current category
                toggleArtFields(articleData.category__name);

                // Add publish button click handler
                const publishBtn = modal.querySelector('.publish-btn');
                publishBtn.onclick = async (e) => {
                    e.preventDefault();
                    
                    const formData = {
                        id: articleData.id,
                        title: modal.querySelector('input[name="title"]').value,
                        about: modal.querySelector('textarea').value,
                        category: modal.querySelector('select[name="category"]').value,
                        type: modal.querySelector('select[name="type"]').value,
                        born: modal.querySelector('input[name="born"]').value,
                        died: modal.querySelector('input[name="died"]').value,
                        nationality: modal.querySelector('input[name="nationality"]').value,
                        known_for: modal.querySelector('input[name="known_for"]').value,
                        notable_work: modal.querySelector('input[name="notable_work"]').value,
                        year: modal.querySelector('input[name="year"]').value,
                        medium: modal.querySelector('input[name="medium"]').value,
                        dimensions: modal.querySelector('input[name="dimensions"]').value,
                        location: modal.querySelector('input[name="location"]').value
                    };

                    console.log('Article Data:', articleData);
                    console.log('Form Data being sent:', formData);

                    // Validate required fields
                    if (!formData.title || !formData.about || !formData.category || !formData.type) {
                        alert('Please fill in all required fields (Title, Content, Category, and Type)');
                        return;
                    }

                    try {
                        const response = await fetch('/update-article/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRFToken': getCsrfToken(),
                            },
                            body: JSON.stringify(formData)
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            console.error('Server Error:', errorData);
                            throw new Error(`Server Error: ${errorData.error}`);
                        }

                        const result = await response.json();
                        if (result.success) {
                            closeModal();
                            window.location.reload();
                        } else {
                            console.error('Failed to update article:', result.error);
                            alert('Failed to update article: ' + result.error);
                        }
                    } catch (error) {
                        console.error('Error updating article:', error);
                        alert('Error updating article: ' + error.message);
                    }
                };

                // Helper function to get CSRF token
                const getCsrfToken = () => {
                    const name = 'csrftoken';
                    let cookieValue = null;
                    if (document.cookie && document.cookie !== '') {
                        const cookies = document.cookie.split(';');
                        for (let i = 0; i < cookies.length; i++) {
                            const cookie = cookies[i].trim();
                            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                break;
                            }
                        }
                    }
                    return cookieValue;
                };
            }
        });
    } catch (error) {
        console.error("Error occurred:", error);
    }
});
