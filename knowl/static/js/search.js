document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('.search-form');
    const articleContainer = document.querySelector('.article-buttons-container');

    searchForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const searchQuery = new URLSearchParams(new FormData(searchForm)).toString();
        const response = await fetch(`/search/?${searchQuery}`);
        
        if (response.ok) {
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Update the article container with new results
            const newArticles = doc.querySelector('.article-buttons-container');
            if (newArticles) {
                articleContainer.innerHTML = newArticles.innerHTML;
            }
        }
    });
}); 