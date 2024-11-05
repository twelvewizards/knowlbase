// Filter toggle functionality for category buttons
document.querySelectorAll('.filter-option').forEach(option => {
    const radio = option.querySelector('input[type="radio"]');
    let wasChecked = true;

    option.addEventListener('click', function(e) {
        e.preventDefault();
        console.log("Filter option clicked:", option);

        // Count how many filters are currently checked
        const checkedFilters = document.querySelectorAll('.filter-option input[type="radio"]:checked').length;
        console.log("Number of checked filters:", checkedFilters);

        // Only allow unchecking if it's not the last checked filter
        if (radio.checked && wasChecked && checkedFilters > 1) {
            radio.checked = false;
            wasChecked = false;
            console.log("Unchecked filter:", radio);
        } else if (!radio.checked) {
            radio.checked = true;
            wasChecked = true;
            console.log("Checked filter:", radio);
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
    console.log("Updating article visibility...");

    const artChecked = document.querySelector('.filter-option.art input[type="radio"]').checked;
    const mathChecked = document.querySelector('.filter-option.mathematics input[type="radio"]').checked;
    const techChecked = document.querySelector('.filter-option.technology input[type="radio"]').checked;

    console.log("Art filter checked:", artChecked);
    console.log("Mathematics filter checked:", mathChecked);
    console.log("Technology filter checked:", techChecked);

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
    console.log("Initial article visibility updated.");
});
