document.addEventListener('DOMContentLoaded', function() {
    const articleButtons = document.querySelectorAll('.article-button:not(.add-new)');
    const defaultContent = document.querySelector('.article-content-default');
    const dropdownArrow = document.querySelector('.dropdown-arrow');
    const dropdownRectangle = document.querySelector('.dropdown-rectangle');

    articleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Hide default content
            defaultContent.style.display = 'none';

            // Rotate arrow
            dropdownArrow.classList.add('rotated');

            // Create and show active content
            const activeContent = createActiveContent();

            // Remove any existing active content
            const existingActive = document.querySelector('.article-content-active');
            if (existingActive) {
                existingActive.remove();
            }

            // Insert new active content after default content
            defaultContent.insertAdjacentElement('afterend', activeContent);

            // Trigger animation after a small delay to ensure DOM update
            setTimeout(() => {
                activeContent.classList.add('expanded');
            }, 10);
        });
    });

    // Add click handler for dropdown rectangle
    dropdownRectangle.addEventListener('click', function() {
        const activeContent = document.querySelector('.article-content-active');
        if (activeContent) {
            if (!activeContent.classList.contains('expanded')) {
                // Opening
                activeContent.classList.add('expanded');
                defaultContent.style.display = 'none';
                dropdownArrow.classList.add('rotated');
            } else {
                // Closing
                activeContent.classList.remove('expanded');
                dropdownArrow.classList.remove('rotated');

                // Remove the content after animation completes
                setTimeout(() => {
                    activeContent.remove();
                    defaultContent.style.display = 'flex';
                }, 300);
            }
        }
    });
});

function createActiveContent() {
    const container = document.createElement('div');
    container.className = 'article-content-active';

    // Add edit/delete buttons
    container.innerHTML = `
        <div class="article-actions">
            <button class="action-button edit">
                <img src="https://img.icons8.com/material-outlined/24/000000/edit.png" alt="Edit">
            </button>
            <button class="action-button delete">
                <img src="https://img.icons8.com/material-outlined/24/000000/trash.png" alt="Delete">
            </button>
        </div>
        <div class="article-header">
            <div class="header-section">
                <div class="header-item">
                    <span class="header-label">Name</span>
                    <span class="header-value">Sample Name</span>
                </div>
                <div class="header-item">
                    <span class="header-label">Born</span>
                    <span class="header-value">1990</span>
                </div>
                <div class="header-item">
                    <span class="header-label">Died</span>
                    <span class="header-value">-</span>
                </div>
            </div>
            <div class="header-section">
                <div class="header-item">
                    <span class="header-label">Nationality/Developer</span>
                    <span class="header-value">Sample Nationality</span>
                </div>
                <div class="header-item">
                    <span class="header-label">Known For</span>
                    <span class="header-value">Sample Achievement</span>
                </div>
                <div class="header-item">
                    <span class="header-label">Notable Work</span>
                    <span class="header-value">Sample Work</span>
                </div>
            </div>
            <div class="header-section">
                <div class="header-item">
                    <span class="header-label">Location</span>
                    <span class="header-value">Sample Location</span>
                </div>
            </div>
        </div>
        <div class="article-content">
            <p>Lorem ipsum dolor sit amet consectetur. Ac lobortis vitae est blandit montes pellentesque non viverra quis. Pellentesque in at sed nulla mi. Varius consectetur nisl eget non netus vestibulum sollicitudin felis. Condimentum turpis dolor tempor enim feugiat vel mauris nibh posuere. Pulvinar tincidunt placerat elit tincidunt.</p>
            <p>Magna interdum ipsum amet enim semper vitae imperdiet lobortis. Facilisi tempor a interdum donec duis diam neque amet magna. Eget tellus metus elementum platea malesuada aliquet nunc. Ultrices neque nec quam faucibus risus sed diam aliquet.</p>
            <p>Rhoncus a auctor sollicitudin interdum a. Malesuada lectus quisque adipiscing augue nibh sagittis vitae orci. Tristique facilisis tincidunt odio ut urna etiam pellentesque.</p>
        </div>
        <div class="article-footer">
            <div class="footer-group">
                <div class="footer-item">
                    <span class="header-label">Dimensions</span>
                    <span class="footer-separator">|</span>
                    <span class="header-value">Medium</span>
                </div>
            </div>
            <div class="footer-group">
                <div class="footer-item">
                    <span class="header-label">Designed by</span>
                    <span class="footer-separator">|</span>
                    <span class="header-value">Year</span>
                </div>
            </div>
            <div class="footer-group">
                <div class="footer-item">
                    <span class="header-label">Type</span>
                    <span class="footer-separator">|</span>
                    <span class="header-value">Category</span>
                </div>
            </div>
        </div>
    `;

    return container;
}
