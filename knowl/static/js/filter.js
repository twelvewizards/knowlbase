 // Filter toggle functionality
document.querySelectorAll('.filter-option').forEach(option => {
    const radio = option.querySelector('input[type="radio"]');
    let wasChecked = true;
    
    option.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Count how many filters are currently checked
        const checkedFilters = document.querySelectorAll('.filter-option input[type="radio"]:checked').length;
        
        // Only allow unchecking if it's not the last checked filter
        if (radio.checked && wasChecked && checkedFilters > 1) {
            radio.checked = false;
            wasChecked = false;
        } else if (!radio.checked) {
            radio.checked = true;
            wasChecked = true;
        }
        
        // Update article visibility whenever a filter changes
        updateArticleVisibility();
    });

    radio.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});

// Function to update article visibility
function updateArticleVisibility() {
    const artChecked = document.querySelector('.filter-option.art input[type="radio"]').checked;
    const mathChecked = document.querySelector('.filter-option.mathematics input[type="radio"]').checked;
    const techChecked = document.querySelector('.filter-option.technology input[type="radio"]').checked;

    document.querySelectorAll('.article-button').forEach(button => {
        if (button.classList.contains('art')) {
            button.style.display = artChecked ? 'flex' : 'none';
        }
        if (button.classList.contains('mathematics')) {
            button.style.display = mathChecked ? 'flex' : 'none';
        }
        if (button.classList.contains('technology')) {
            button.style.display = techChecked ? 'flex' : 'none';
        }
    });
}

// Initial visibility check
document.addEventListener('DOMContentLoaded', function() {
    updateArticleVisibility();
});