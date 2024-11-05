document.addEventListener('DOMContentLoaded', function() {
    try {
        // Fetch the articles data from the JSON script tag
        const articlesData = JSON.parse(document.getElementById('articlesData').textContent);
        console.log("Articles Data Loaded:", articlesData);

        // Select necessary DOM elements
        const articleButtonsContainer = document.querySelector('.article-buttons-container');
        const filterButtons = document.querySelectorAll('.category-filters .filter-option input');
        const contentSection = document.querySelector('.article-content-default');
        const dropdownContainer = document.querySelector('.dropdown-container'); // Select the dropdown container

        if (!articleButtonsContainer) {
            console.error("Article buttons container not found!");
            return;
        }
        if (!filterButtons.length) {
            console.error("Filter buttons not found!");
            return;
        }

        // Track which categories are currently active
        const activeCategories = {
            art: true,
            mathematics: true,
            technology: true,
        };

        // Function to render article buttons based on active categories
        function renderArticles() {
            // Clear the existing article buttons
            articleButtonsContainer.innerHTML = '';

            // Filter articles based on active categories
            const filteredArticles = articlesData.filter(article => {
                if (article.category_id === 1 && activeCategories.art) return true;
                if (article.category_id === 2 && activeCategories.mathematics) return true;
                if (article.category_id === 3 && activeCategories.technology) return true;
                return false;
            });

            // Create and append buttons for each filtered article
            filteredArticles.forEach(article => {
                const button = document.createElement('button');
                button.className = 'article-button';
                button.textContent = article.title;

                // Add category-specific classes for styling
                if (article.category_id === 1) {
                    button.classList.add('art');
                } else if (article.category_id === 2) {
                    button.classList.add('mathematics');
                } else if (article.category_id === 3) {
                    button.classList.add('technology');
                }

                // Append the button to the container
                articleButtonsContainer.appendChild(button);

                // Add click event to display article content
                button.addEventListener('click', function() {
                    console.log("Article Clicked:", article);
                    contentSection.classList.remove('article-content-default');
                    contentSection.classList.add('article-content-expanded');
                    updateContentSection(article);
                });
            });

            // Add the "Add New" button at the end
            const addNewButton = document.createElement('button');
            addNewButton.className = 'article-button add-new';
            addNewButton.textContent = '+ Add new';
            articleButtonsContainer.appendChild(addNewButton);

            // Add click event to the "Add New" button
            addNewButton.addEventListener('click', function() {
                console.log("Add New button clicked!");
                // Implement logic for adding a new article
            });
        }

        // Function to update the content section with the selected article's details
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

        // Add click event to the dropdown arrow container to toggle content visibility
        dropdownContainer.addEventListener('click', function() {
            if (contentSection.classList.contains('article-content-expanded')) {
                contentSection.classList.remove('article-content-expanded');
                contentSection.classList.add('article-content-default');
                contentSection.innerHTML = '<p>Click an article to view its contents</p>';
            }
        });

        // Initial render of all articles
        renderArticles();

        // Add click event listeners to each filter radio button
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
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

                // Re-render articles based on the updated active categories
                renderArticles();
            });
        });
    } catch (error) {
        console.error("Failed to parse articles data:", error);
    }
});
