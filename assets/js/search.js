// Search and filter functionality for security blog posts
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const tagFilter = document.getElementById('tagFilter');
    const authorFilter = document.getElementById('authorFilter');
    const sortBy = document.getElementById('sortBy');
    const resetFilters = document.getElementById('resetFilters');
    const postsContainer = document.getElementById('postsContainer');
    const noResults = document.getElementById('noResults');
    const endOfPosts = document.getElementById('endOfPosts');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const posts = Array.from(document.querySelectorAll('.post-card'));
    
    // Exit early if we're not on a page with posts
    if (!searchInput || !postsContainer || posts.length === 0) {
        return;
    }
    
    // Initialize Choices.js for multi-select dropdowns
    let tagChoices = null;
    let authorChoices = null;
    
    // Store all available tags and authors for filtering
    let allTags = [];
    let allAuthors = [];
    
    // Pagination variables
    const POSTS_PER_PAGE = 50;
    let currentlyDisplayed = 0;
    let filteredPosts = [];
    let isLoading = false;
    
    // Filter and search function
    function filterPosts() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedTags = tagChoices ? tagChoices.getValue(true).map(t => t.toLowerCase()) : [];
        const selectedAuthors = authorChoices ? authorChoices.getValue(true).map(a => a.toLowerCase()) : [];
        const sortOption = sortBy.value;
        
        // Filter posts
        filteredPosts = posts.filter(post => {
            const title = post.dataset.title || '';
            const author = post.dataset.author || '';
            const tags = post.dataset.tags || '';
            const summary = post.dataset.summary || '';
            
            // Search filter
            const matchesSearch = !searchTerm || 
                title.includes(searchTerm) || 
                author.includes(searchTerm) || 
                tags.includes(searchTerm) || 
                summary.includes(searchTerm);
            
            // Tag filter - post must have at least one of the selected tags
            const postTags = tags.split(',').map(t => t.trim());
            const matchesTag = selectedTags.length === 0 || 
                selectedTags.some(selectedTag => postTags.includes(selectedTag));
            
            // Author filter - post must match one of the selected authors
            const matchesAuthor = selectedAuthors.length === 0 || 
                selectedAuthors.some(selectedAuthor => author === selectedAuthor);
            
            return matchesSearch && matchesTag && matchesAuthor;
        });
        
        // Sort posts
        filteredPosts.sort((a, b) => {
            switch(sortOption) {
                case 'date-desc':
                    return new Date(b.dataset.date) - new Date(a.dataset.date);
                case 'date-asc':
                    return new Date(a.dataset.date) - new Date(b.dataset.date);
                case 'title-asc':
                    return a.dataset.title.localeCompare(b.dataset.title);
                case 'title-desc':
                    return b.dataset.title.localeCompare(a.dataset.title);
                default:
                    return 0;
            }
        });
        
        // Update filter options based on filtered posts
        updateFilterOptions();
        
        // Reset pagination and display initial posts
        currentlyDisplayed = 0;
        hideAllPosts();
        displayNextBatch();
    }
    
    // Hide all posts
    function hideAllPosts() {
        posts.forEach(post => {
            post.style.display = 'none';
        });
    }
    
    // Display next batch of posts
    function displayNextBatch() {
        if (isLoading) return;
        
        const endIndex = Math.min(currentlyDisplayed + POSTS_PER_PAGE, filteredPosts.length);
        
        // Show posts in the current batch
        for (let i = currentlyDisplayed; i < endIndex; i++) {
            filteredPosts[i].style.display = 'block';
            filteredPosts[i].style.order = i;
        }
        
        currentlyDisplayed = endIndex;
        
        // Update UI elements
        if (filteredPosts.length === 0) {
            noResults.style.display = 'block';
            endOfPosts.style.display = 'none';
            if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        } else {
            noResults.style.display = 'none';
            
            if (currentlyDisplayed >= filteredPosts.length) {
                endOfPosts.style.display = 'block';
                if (loadMoreBtn) loadMoreBtn.style.display = 'none';
            } else {
                endOfPosts.style.display = 'none';
                // Always show load more button if there are more posts
                if (loadMoreBtn) {
                    loadMoreBtn.style.display = 'block';
                }
            }
        }
    }
    
    // Load more button handler
    function handleLoadMoreClick() {
        if (isLoading || currentlyDisplayed >= filteredPosts.length) return;
        
        isLoading = true;
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        
        displayNextBatch();
        isLoading = false;
    }
    
    // Reset filters
    function resetAllFilters() {
        searchInput.value = '';
        if (tagChoices) tagChoices.removeActiveItems();
        if (authorChoices) authorChoices.removeActiveItems();
        sortBy.value = 'date-desc';
        filterPosts();
    }
    
    // Event listeners
    if (searchInput) {
        searchInput.addEventListener('input', filterPosts);
    }
    
    if (sortBy) {
        sortBy.addEventListener('change', filterPosts);
    }
    
    if (resetFilters) {
        resetFilters.addEventListener('click', resetAllFilters);
    }
    
    // Add load more button event listener
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', handleLoadMoreClick);
    }
    
    // Build filter options before initial load
    buildFilterOptionsInternal();
    
    // Initialize Choices.js with empty options
    if (tagFilter && typeof Choices !== 'undefined') {
        tagChoices = new Choices(tagFilter, {
            removeItemButton: true,
            searchEnabled: true,
            searchPlaceholderValue: 'Type to search tags...',
            placeholder: true,
            placeholderValue: 'Click to select tags...',
            noResultsText: 'No tags found',
            itemSelectText: '',
            shouldSort: false
        });
        
        // Listen for changes
        tagFilter.addEventListener('change', filterPosts);
    }
    
    if (authorFilter && typeof Choices !== 'undefined') {
        authorChoices = new Choices(authorFilter, {
            removeItemButton: true,
            searchEnabled: true,
            searchPlaceholderValue: 'Type to search authors...',
            placeholder: true,
            placeholderValue: 'Click to select authors...',
            noResultsText: 'No authors found',
            itemSelectText: '',
            shouldSort: false
        });
        
        // Listen for changes
        authorFilter.addEventListener('change', filterPosts);
    }
    
    // Initial load - populate filter options and show first batch
    updateFilterOptions();
    filterPosts();
    
    // Helper function to build filter options (called internally)
    function buildFilterOptionsInternal() {
        const tags = new Set();
        const authors = new Set();
        
        posts.forEach(post => {
            const postTags = (post.dataset.tags || '').split(',').filter(t => t.trim());
            postTags.forEach(tag => {
                const trimmedTag = tag.trim();
                if (trimmedTag) tags.add(trimmedTag);
            });
            
            const author = (post.dataset.author || '').trim();
            if (author) authors.add(author);
        });
        
        // Store all available tags and authors for dynamic filtering
        allTags = Array.from(tags).sort();
        allAuthors = Array.from(authors).sort();
    }
    
    // Function to update filter options based on current selections
    function updateFilterOptions() {
        const selectedTags = tagChoices ? tagChoices.getValue(true).map(t => t.toLowerCase()) : [];
        const selectedAuthors = authorChoices ? authorChoices.getValue(true).map(a => a.toLowerCase()) : [];
        
        // Collect available tags and authors based on current filters
        let availableTags = new Set();
        let availableAuthors = new Set();
        
        // If no filters are selected, show all
        if (selectedTags.length === 0 && selectedAuthors.length === 0) {
            allTags.forEach(tag => availableTags.add(tag));
            allAuthors.forEach(author => availableAuthors.add(author));
        } else {
            // Filter based on current selections
            posts.forEach(post => {
                const author = (post.dataset.author || '').trim();
                const postTags = (post.dataset.tags || '').split(',').map(t => t.trim()).filter(t => t);
                
                // If tags are selected, only show authors who have those tags
                if (selectedTags.length > 0) {
                    const hasSelectedTag = selectedTags.some(selectedTag => 
                        postTags.map(t => t.toLowerCase()).includes(selectedTag)
                    );
                    if (hasSelectedTag && author) {
                        availableAuthors.add(author);
                    }
                }
                
                // If authors are selected, only show tags used by those authors
                if (selectedAuthors.length > 0) {
                    const isSelectedAuthor = selectedAuthors.includes(author.toLowerCase());
                    if (isSelectedAuthor) {
                        postTags.forEach(tag => {
                            if (tag) availableTags.add(tag);
                        });
                    }
                }
                
                // If only tags selected, still collect all tags for the dropdown
                if (selectedTags.length > 0 && selectedAuthors.length === 0) {
                    postTags.forEach(tag => {
                        if (tag) availableTags.add(tag);
                    });
                }
                
                // If only authors selected, still collect all authors for the dropdown
                if (selectedAuthors.length > 0 && selectedTags.length === 0) {
                    if (author) availableAuthors.add(author);
                }
            });
        }
        
        // Update tag choices
        if (tagChoices) {
            const currentTagValues = tagChoices.getValue(true);
            tagChoices.clearChoices();
            
            const tagOptions = Array.from(availableTags).sort().map(tag => ({
                value: tag,
                label: tag.charAt(0).toUpperCase() + tag.slice(1),
                selected: currentTagValues.includes(tag)
            }));
            
            tagChoices.setChoices(tagOptions, 'value', 'label', true);
        }
        
        // Update author choices
        if (authorChoices) {
            const currentAuthorValues = authorChoices.getValue(true);
            authorChoices.clearChoices();
            
            const authorOptions = Array.from(availableAuthors).sort().map(author => ({
                value: author,
                label: author.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                selected: currentAuthorValues.includes(author)
            }));
            
            authorChoices.setChoices(authorOptions, 'value', 'label', true);
        }
    }
});

// Shared function to build filter options from posts (used by subject pages)
function buildFilterOptions() {
    const posts = document.querySelectorAll('.post-card');
    const tagFilter = document.getElementById('tagFilter');
    const authorFilter = document.getElementById('authorFilter');
    
    if (!tagFilter || !authorFilter) return;
    
    // Collect unique tags and authors
    const tags = new Set();
    const authors = new Set();
    
    posts.forEach(post => {
        const postTags = (post.dataset.tags || '').split(',').filter(t => t.trim());
        postTags.forEach(tag => {
            const trimmedTag = tag.trim();
            if (trimmedTag) tags.add(trimmedTag);
        });
        
        const author = (post.dataset.author || '').trim();
        if (author) authors.add(author);
    });
    
    // Populate tag filter
    Array.from(tags).sort().forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
        tagFilter.appendChild(option);
    });
    
    // Populate author filter
    Array.from(authors).sort().forEach(author => {
        const option = document.createElement('option');
        option.value = author;
        option.textContent = author.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        authorFilter.appendChild(option);
    });
}
