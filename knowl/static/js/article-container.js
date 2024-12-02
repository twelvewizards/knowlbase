document.addEventListener('DOMContentLoaded', function () {
    try {
        const articlesDataElement = document.getElementById('articlesData');
        let articlesData = [];
        if (articlesDataElement) {
            articlesData = JSON.parse(articlesDataElement.textContent);
            console.log("Articles Data Loaded:", articlesData);
        } else {
            console.warn("No articles data found.");
        }

        const articleButtonsContainer = document.querySelector('.article-buttons-container');
        const filterButtons = document.querySelectorAll('.category-filters .filter-option input');
        const contentSection = document.querySelector('.article-content-default') || document.querySelector('.main-content');
        const dropdownContainer = document.querySelector('.dropdown-container');
        const userAuthenticated = document.body.dataset.authenticated === 'True';
        const userRole = document.body.dataset.role;

        console.log("DEBUG: User Authenticated:", userAuthenticated);
        console.log("DEBUG: User Role:", userRole);

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

        // Initialize article buttons
        function initializeArticleButtons() {
            const articleButtons = document.querySelectorAll('.article-button');
            articleButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const articleId = button.getAttribute('data-article-id');
                    const article = articlesData.find(a => a.id == articleId);

                    if (!isAuthenticated()) {
                        flashSignUpPrompt();
                    } else if (article) {
                        console.log("Article Clicked:", article);
                        contentSection.classList.remove('article-content-default');
                        contentSection.classList.add('article-content-expanded');
                        updateContentSection(article);
                    } else {
                        console.error('Article not found for ID:', articleId);
                    }
                });
            });
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
        if (dropdownContainer) {
            dropdownContainer.addEventListener('click', function () {
                if (contentSection.classList.contains('article-content-expanded')) {
                    contentSection.classList.remove('article-content-expanded');
                    contentSection.classList.add('article-content-default');
                    setDefaultContentMessage();
                }
            });
        }

        // Add event listeners for filter buttons
        if (filterButtons.length > 0) {
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
        }

        // Render articles based on selected categories
        function renderArticles() {
            // Only render articles if not on search results page
            if (window.location.pathname.startsWith('/search/')) return;

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
                button.dataset.articleId = article.id; // Add data-article-id attribute

                if (article.category_id === 1) button.classList.add('art');
                if (article.category_id === 2) button.classList.add('mathematics');
                if (article.category_id === 3) button.classList.add('technology');

                articleButtonsContainer.appendChild(button);
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
                        
                    });
                }
            }

            console.log("DEBUG: Articles rendered:", filteredArticles);

            // Initialize event listeners for the newly created buttons
            initializeArticleButtons();
        }

        // Initial setup
        setDefaultContentMessage(); 
        renderArticles(); 

        
        initializeArticleButtons();

        

    } catch (error) {
        console.error("Error occurred:", error);
    }
});
