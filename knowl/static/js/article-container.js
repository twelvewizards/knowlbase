document.addEventListener('DOMContentLoaded', function() {
    // Select all article buttons except the "add-new" button
    const articleButtons = document.querySelectorAll('.article-button:not(.add-new)');
    const defaultContent = document.querySelector('.article-content-default');
    const dropdownArrow = document.querySelector('.dropdown-arrow');
    const dropdownRectangle = document.querySelector('.dropdown-rectangle');

    let activeContent; // Variable to store the active content element

    // Function to create the article content dynamically
    function createActiveContent(article) {
        const container = document.createElement('div');
        container.className = 'article-content-active expanded';

        // Populate the content with actual data from the clicked article
        container.innerHTML = `
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
                <p>${article.about}</p>
            </div>
        `;

        return container;
    }

    // Add click event listeners to each article button
    articleButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // Fetch articles data from the JSON script tag
            const articlesData = JSON.parse(document.getElementById('articlesData').textContent);
            const article = articlesData[index];

            // Hide default content and rotate the arrow
            defaultContent.style.display = 'none';
            dropdownArrow.classList.add('rotated');

            // Remove existing active content if present
            if (activeContent) {
                activeContent.remove();
            }

            // Create and insert the new active content
            activeContent = createActiveContent(article);
            defaultContent.insertAdjacentElement('afterend', activeContent);
        });
    });

    // Handle dropdown rectangle click to collapse the content
    dropdownRectangle.addEventListener('click', function() {
        if (activeContent) {
            // Collapse the active content and remove it
            activeContent.remove();
            activeContent = null;
            dropdownArrow.classList.remove('rotated');
            defaultContent.style.display = 'flex';
        }
    });
});
