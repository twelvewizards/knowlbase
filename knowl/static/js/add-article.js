document.addEventListener('DOMContentLoaded', function () {
    const addNewBtn = document.querySelector('.article-button.add-new');
    const addArticleModal = document.getElementById('addArticleModal');
    const overlay = document.getElementById('overlay');
    const closeBtn = addArticleModal.querySelector('.close-button');
    const categorySelect = document.getElementById('category');
    const typeSelect = document.getElementById('type');
    const articleDetails = document.querySelector('.article-details');

    // Define categories and their corresponding types
    const categoryTypes = {
        '1': ['Painting', 'Sculpture', 'Architecture', 'Literature', 'Music', 'Dance'],        // Arts
        '2': ['Algebra', 'Geometry', 'Calculus', 'Statistics', 'Number Theory'],               // Mathematics
        '3': ['Computer Science', 'Software Engineering', 'Artificial Intelligence', 'Cybersecurity'] // Technology
    };

    // Define fields for each category - match exactly with database category names
    const categoryFields = {
        'Arts': `
            <input type="text" name="title" placeholder="Name/Title">
            <div class="inline-fields">
                <input type="text" name="born" placeholder="Born (m/d/y)">
                <input type="text" name="died" placeholder="Died (m/d/y)">
                <input type="text" name="nationality" placeholder="Nationality">
            </div>
            <input type="text" name="known_for" placeholder="Known For">
            <input type="text" name="notable_work" placeholder="Notable Work">
            <div class="bottom-fields">
                <input type="text" name="year" placeholder="Year">
                <input type="text" name="medium" placeholder="Medium">
                <input type="text" name="dimensions" placeholder="Dimensions">
                <input type="text" name="location" placeholder="Location">
            </div>
        `,
        'Mathematics': `
            <input type="text" name="title" placeholder="Name/Title">
            <div class="inline-fields">
                <input type="text" name="born" placeholder="Born (m/d/y)">
                <input type="text" name="died" placeholder="Died (m/d/y)">
                <input type="text" name="nationality" placeholder="Nationality">
            </div>
            <input type="text" name="known_for" placeholder="Known For">
            <input type="text" name="notable_work" placeholder="Notable Work">
        `,
        'Technology': `
            <input type="text" name="title" placeholder="Name/Title">
            <div class="inline-fields">
                <input type="text" name="developer" placeholder="Developer">
                <input type="text" name="release_date" placeholder="Release Date">
                <input type="text" name="current_version" placeholder="Current Version">
            </div>
            <input type="text" name="description" placeholder="Description">
            <input type="text" name="features" placeholder="Features">
            <div class="bottom-fields">
                <input type="text" name="platform" placeholder="Platform">
                <input type="text" name="language" placeholder="Language">
                <input type="text" name="license" placeholder="License">
                <input type="text" name="website" placeholder="Website">
            </div>
        `
    };

    // Add a function to fetch categories and types from the backend
    async function fetchCategories() {
        try {
            const response = await fetch('/get-categories/');
            const categories = await response.json();
            return categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }

    // Update the populateCategories function
    async function populateCategories() {
        const categorySelect = document.getElementById('category');
        categorySelect.innerHTML = '<option value="">Select category</option>';

        try {
            const response = await fetch('/get-categories/');
            const categories = await response.json();

            categories.forEach(category => {
                categorySelect.innerHTML += `
                    <option value="${category.id}">${category.name}</option>
                `;
            });
        } catch (error) {
            console.error('Error populating categories:', error);
        }
    }

    // Update the populateTypes function
    async function populateTypes(categoryId) {
        const typeSelect = document.getElementById('type');
        typeSelect.innerHTML = '<option value="">Type (sub category)</option>';

        if (categoryId) {
            try {
                const response = await fetch(`/get-types/${categoryId}/`);
                const types = await response.json();

                types.forEach(type => {
                    typeSelect.innerHTML += `
                        <option value="${type.id}">${type.name}</option>
                    `;
                });
                typeSelect.disabled = false;
            } catch (error) {
                console.error('Error populating types:', error);
            }
        } else {
            typeSelect.disabled = true;
        }
    }

    // Handle category change
    async function handleCategoryChange() {
        const selectedCategoryId = this.value;
        const selectedCategoryName = this.options[this.selectedIndex].text;
        await populateTypes(selectedCategoryId);
        updateFormFields(selectedCategoryName);
    }

    // Update form fields based on selected category
    function updateFormFields(categoryName) {
        const formFields = document.querySelector('.article-details');
        if (categoryName && categoryFields[categoryName]) {
            const fieldsContainer = formFields.querySelector('.fields-container') || document.createElement('div');
            fieldsContainer.className = 'fields-container';
            fieldsContainer.setAttribute('data-category', categoryName);
            fieldsContainer.innerHTML = categoryFields[categoryName];

            // Only update the fields after the dropdowns, not the entire form
            const existingContainer = formFields.querySelector('.fields-container');
            if (existingContainer) {
                formFields.replaceChild(fieldsContainer, existingContainer);
            } else {
                formFields.appendChild(fieldsContainer);
            }
        }
    }

    // Event listener for category change
    categorySelect.addEventListener('change', handleCategoryChange);

    // Modal open/close handlers
    addNewBtn?.addEventListener('click', function (e) {
        const userAuthenticated = document.body.dataset.authenticated === 'True';
        const userRole = document.body.dataset.role;

        if (!userAuthenticated || !['Admin', 'Tutor'].includes(userRole)) {
            console.warn("Unauthorized access attempt to Add Article modal.");
            return;
        }

        e.preventDefault();
        overlay.style.display = 'block';
        addArticleModal.style.display = 'block';
        populateCategories();
        populateTypes('');

        // Initialize the form with default category if needed
        const defaultCategory = categorySelect.value;
        if (defaultCategory) {
            updateFormFields(defaultCategory);
        }
    });

    function closeModal() {
        overlay.style.opacity = '0';
        addArticleModal.style.display = 'none';
        overlay.style.display = 'none';
        document.getElementById('addArticleForm').reset();
    }

    closeBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', function (e) {
        if (e.target === overlay) {
            closeModal();
        }
    });

    // Form submission handler
    const form = document.getElementById('addArticleForm');
    form?.addEventListener('submit', async function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = {
            title: formData.get('title'),
            about: document.querySelector('.article-text-area').value,
            category: formData.get('category'),
            type: formData.get('type'),
            notable_work: formData.get('notable_work') || '',
            year: formData.get('year') || '',
            medium: formData.get('medium') || '',
            dimensions: formData.get('dimensions') || '',
            location: formData.get('location') || '',
            nationality: formData.get('nationality') || '',
            known_for: formData.get('known_for') || '',
            born: formData.get('born') || '',
            died: formData.get('died') || '',
            developer: formData.get('developer') || '',
            designed_by: formData.get('designed_by') || ''
        };

        try {
            const response = await fetch('/add-article/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken()
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (result.success) {
                window.location.reload();
            } else {
                console.error('Error adding article:', result.error);
                alert('Failed to add article: ' + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add article');
        }
    });

    // Helper function to get CSRF token
    function getCsrfToken() {
        const name = 'csrftoken';
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Initial setup
    populateCategories();
});
