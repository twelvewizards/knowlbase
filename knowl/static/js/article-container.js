document.addEventListener('DOMContentLoaded', function() {
    try {
        // Fetch the articles data from the JSON script tag
        const articlesData = JSON.parse(document.getElementById('articlesData').textContent);
        console.log("Articles Data Loaded:", articlesData);

        // Select the container where the article buttons will be displayed
        const articleButtonsContainer = document.querySelector('.article-buttons-container');
        const filterButtons = document.querySelectorAll('.category-filters .filter-option input');

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

                // Add click event to handle article content display
                button.addEventListener('click', function() {
                    console.log("Article Clicked:", article);
                    // Implement logic to display article details
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

        // Initial render of all articles
        renderArticles();

        // Add click event listeners to each filter radio button
        filterButtons.forEach(button => {
            console.log("Attaching event listener to:", button.name);
            button.addEventListener('click', function() {
                // Toggle the active state of the clicked category
                if (button.name.includes('art')) {
                    activeCategories.art = !activeCategories.art;
                    button.checked = activeCategories.art; // Update the visual state of the radio button
                } else if (button.name.includes('math')) {
                    activeCategories.mathematics = !activeCategories.mathematics;
                    button.checked = activeCategories.mathematics; // Update the visual state of the radio button
                } else if (button.name.includes('tech')) {
                    activeCategories.technology = !activeCategories.technology;
                    button.checked = activeCategories.technology; // Update the visual state of the radio button
                }

                // Log the updated active categories
                console.log("Active Categories:", activeCategories);

                // Re-render articles based on the updated active categories
                renderArticles();
            });
        });

    } catch (error) {
        console.error("Failed to parse articles data:", error);
    }
});
