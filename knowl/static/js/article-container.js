document.addEventListener('DOMContentLoaded', function() {
    try {
        const articlesData = JSON.parse(document.getElementById('articlesData').textContent);
        console.log("Articles Data Loaded:", articlesData);

        const articleButtonsContainer = document.querySelector('.article-buttons-container');
        const filterButtons = document.querySelectorAll('.category-filters .filter-option input');
        const contentSection = document.querySelector('.article-content-default');
        const dropdownContainer = document.querySelector('.dropdown-container');

        if (!articleButtonsContainer || !filterButtons.length) {
            console.error("Required elements not found!");
            return;
        }

        const activeCategories = { art: true, mathematics: true, technology: true };

        function renderArticles() {
            articleButtonsContainer.innerHTML = '';
            const filteredArticles = articlesData.filter(article => {
                if (article.category_id === 1 && activeCategories.art) return true;
                if (article.category_id === 2 && activeCategories.mathematics) return true;
                if (article.category_id === 3 && activeCategories.technology) return true;
                return false;
            });

            filteredArticles.forEach(article => {
                const button = document.createElement('button');
                button.className = 'article-button';
                button.textContent = article.title;
                if (article.category_id === 1) button.classList.add('art');
                if (article.category_id === 2) button.classList.add('mathematics');
                if (article.category_id === 3) button.classList.add('technology');

                articleButtonsContainer.appendChild(button);

                button.addEventListener('click', function() {
                    console.log("Article Clicked:", article);
                    contentSection.classList.remove('article-content-default');
                    contentSection.classList.add('article-content-expanded');
                    updateContentSection(article);
                });
            });

            const addNewButton = document.createElement('button');
            addNewButton.className = 'article-button add-new';
            addNewButton.textContent = '+ Add new';
            articleButtonsContainer.appendChild(addNewButton);

            addNewButton.addEventListener('click', function() {
                console.log("Add New button clicked!");
                // Logic for adding a new article
            });
        }

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

        dropdownContainer.addEventListener('click', function() {
            if (contentSection.classList.contains('article-content-expanded')) {
                contentSection.classList.remove('article-content-expanded');
                contentSection.classList.add('article-content-default');
                contentSection.innerHTML = '<p>Click an article to view its contents</p>';
            }
        });

        renderArticles();

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
                renderArticles();
            });
        });
    } catch (error) {
        console.error("Failed to parse articles data:", error);
    }
});
