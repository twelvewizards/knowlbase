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
        'Arts': ['Painting', 'Sculpture', 'Architecture', 'Literature', 'Music', 'Dance'],
        'Mathematics': ['Algebra', 'Geometry', 'Calculus', 'Statistics', 'Number Theory'],
        'Technology': ['Computer Science', 'Software Engineering', 'Artificial Intelligence', 'Cybersecurity']
    };

    // Define fields for each category
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

    // Populate category dropdown
    function populateCategories() {
        categorySelect.innerHTML = '<option value="">Select category</option>';
        Object.keys(categoryTypes).forEach(category => {
            categorySelect.innerHTML += `<option value="${category}">${category}</option>`;
        });
    }

    // Populate type dropdown based on selected category
    function populateTypes(category) {
        typeSelect.innerHTML = '<option value="">Type (sub category)</option>';
        if (category && categoryTypes[category]) {
            categoryTypes[category].forEach(type => {
                typeSelect.innerHTML += `<option value="${type}">${type}</option>`;
            });
        }
        typeSelect.disabled = !category;
    }

    // Update form fields based on selected category
    function updateFormFields(category) {
        const formFields = document.querySelector('.article-details');
        if (category && categoryFields[category]) {
            const fieldsContainer = formFields.querySelector('.fields-container') || document.createElement('div');
            fieldsContainer.className = 'fields-container';
            fieldsContainer.setAttribute('data-category', category);
            fieldsContainer.innerHTML = categoryFields[category];

            // Only update the fields after the dropdowns, not the entire form
            const existingContainer = formFields.querySelector('.fields-container');
            if (existingContainer) {
                formFields.replaceChild(fieldsContainer, existingContainer);
            } else {
                formFields.appendChild(fieldsContainer);
            }
        }
    }

    // Handle category change
    function handleCategoryChange() {
        const selectedCategory = this.value;
        populateTypes(selectedCategory);
        updateFormFields(selectedCategory);
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
    form?.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        console.log('Form data:', data);
        closeModal();
    });

    // Initial setup
    populateCategories();
});
