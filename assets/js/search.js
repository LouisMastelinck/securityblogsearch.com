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
    
    // Calculate and display statistics
    function calculateStatistics() {
        // Calculate top contributors
        const authorCounts = {};
        posts.forEach(post => {
            const author = post.dataset.author || 'Unknown';
            authorCounts[author] = (authorCounts[author] || 0) + 1;
        });
        
        // Sort authors by post count and get top 3
        const topAuthors = Object.entries(authorCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);
        
        // Display top contributors
        const topContributorsEl = document.getElementById('topContributors');
        if (topContributorsEl) {
            topContributorsEl.innerHTML = topAuthors
                .map(([author, count]) => {
                    // Capitalize each word in the author name
                    const displayName = author.split(' ')
                        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(' ');
                    return `<div class="contributor-item">
                        <span class="contributor-name">${displayName}</span>
                        <span class="contributor-count">${count}</span>
                    </div>`;
                })
                .join('');
        }
        
        // Calculate last crawl time from the newest post date
        const lastCrawlEl = document.getElementById('lastCrawlTime');
        if (lastCrawlEl && posts.length > 0) {
            // Get the most recent post date
            const dates = posts.map(post => new Date(post.dataset.date)).filter(d => !isNaN(d));
            if (dates.length > 0) {
                const mostRecent = new Date(Math.max(...dates));
                const now = new Date();
                const diffTime = Math.abs(now - mostRecent);
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                
                let timeAgo;
                if (diffDays === 0) {
                    timeAgo = 'Today';
                } else if (diffDays === 1) {
                    timeAgo = 'Yesterday';
                } else if (diffDays < 7) {
                    timeAgo = `${diffDays} days ago`;
                } else if (diffDays < 30) {
                    const weeks = Math.floor(diffDays / 7);
                    timeAgo = `${weeks} week${weeks > 1 ? 's' : ''} ago`;
                } else {
                    const months = Math.floor(diffDays / 30);
                    timeAgo = `${months} month${months > 1 ? 's' : ''} ago`;
                }
                
                lastCrawlEl.textContent = timeAgo;
                lastCrawlEl.title = mostRecent.toLocaleString();
            }
        }
    }
    
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
            const postTags = tags.split(',').map(t => t.trim().toLowerCase());
            const matchesTag = selectedTags.length === 0 || 
                selectedTags.some(selectedTag => postTags.includes(selectedTag));
            
            // Author filter - post must match one of the selected authors
            const matchesAuthor = selectedAuthors.length === 0 || 
                selectedAuthors.some(selectedAuthor => author.toLowerCase() === selectedAuthor);
            
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
        const loadMoreButton = loadMoreBtn.querySelector('.btn-load-more');
        if (loadMoreButton) {
            loadMoreButton.addEventListener('click', handleLoadMoreClick);
        }
    }
    
    // Build filter options before initial load
    buildFilterOptionsInternal();
    
    /**
     * Custom search function for filtering dropdown options
     * @param {Array} choices - Array of choice objects to filter
     * @param {string} value - Search term entered by the user
     * @returns {Array} Filtered array of choices where the search term appears anywhere in the label
     */
    function customSearch(choices, value) {
        const searchTerm = value.toLowerCase().trim();
        if (!searchTerm) return choices;
        
        return choices.filter(choice => {
            const label = choice.label.toLowerCase();
            // Check if the search term appears anywhere in the label
            return label.includes(searchTerm);
        });
    }
    
    /**
     * Helper function to set up event listeners for Choices.js filters
     * @param {HTMLElement} element - The filter element
     */
    function setupFilterEventListeners(element) {
        element.addEventListener('addItem', filterPosts);
        element.addEventListener('removeItem', filterPosts);
    }
    
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
            shouldSort: false,
            duplicateItemsAllowed: false,
            searchResultLimit: 9999,
            searchFloor: 0,
            searchFields: ['label'],
            sorter: customSearch
        });
        
        setupFilterEventListeners(tagFilter);
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
            shouldSort: false,
            duplicateItemsAllowed: false,
            searchResultLimit: 9999,
            searchFloor: 0,
            searchFields: ['label'],
            sorter: customSearch
        });
        
        setupFilterEventListeners(authorFilter);
    }
    
    // Initial load - populate filter options and show first batch
    calculateStatistics();
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
    
    // Function to populate initial filter options
    function updateFilterOptions() {
        // Update tag choices
        if (tagChoices) {
            const tagOptions = allTags.map(tag => ({
                value: tag,
                label: tag.charAt(0).toUpperCase() + tag.slice(1)
            }));
            
            tagChoices.setChoices(tagOptions, 'value', 'label', true);
        }
        
        // Update author choices
        if (authorChoices) {
            const authorOptions = allAuthors.map(author => ({
                value: author,
                label: author.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
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
