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
                </div>
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
    } catch (error) {
        console.error("Error occurred:", error);
    }
});
