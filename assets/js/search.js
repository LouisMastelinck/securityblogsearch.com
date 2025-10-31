// Search and filter functionality for security blog posts
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const tagFilter = document.getElementById('tagFilter');
    const authorFilter = document.getElementById('authorFilter');
    const sortBy = document.getElementById('sortBy');
    const resetFilters = document.getElementById('resetFilters');
    const postsContainer = document.getElementById('postsContainer');
    const noResults = document.getElementById('noResults');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const endOfPosts = document.getElementById('endOfPosts');
    const posts = Array.from(document.querySelectorAll('.post-card'));
    
    // Exit early if we're not on a page with posts
    if (!searchInput || !postsContainer || posts.length === 0) {
        return;
    }
    
    // Pagination variables
    const POSTS_PER_PAGE = 20;
    const MAX_AUTO_LOAD_ITERATIONS = 50; // Safety limit: max recursive auto-load iterations to prevent infinite loops
    const SCROLLABLE_BUFFER_PX = 10; // Buffer for scrollable detection (accounts for browser differences)
    let currentlyDisplayed = 0;
    let filteredPosts = [];
    let isLoading = false;
    let autoLoadCount = 0; // Tracks recursive auto-load iterations (resets on filter change)
    
    // Filter and search function
    function filterPosts() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedTag = tagFilter.value.toLowerCase();
        const selectedAuthor = authorFilter.value.toLowerCase();
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
            
            // Tag filter
            const matchesTag = !selectedTag || tags.split(',').map(t => t.trim()).includes(selectedTag);
            
            // Author filter
            const matchesAuthor = !selectedAuthor || author === selectedAuthor;
            
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
        autoLoadCount = 0; // Reset auto-load counter
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
        } else {
            noResults.style.display = 'none';
            
            if (currentlyDisplayed >= filteredPosts.length) {
                endOfPosts.style.display = 'block';
            } else {
                endOfPosts.style.display = 'none';
            }
        }
        
        // Check if page is scrollable after loading batch
        // If not scrollable and more posts available, load more automatically
        checkAndLoadMore();
    }
    
    // Check if page needs more content to be scrollable
    function checkAndLoadMore() {
        // Guard against concurrent execution - isLoading flag also protects displayNextBatch
        if (isLoading) return;
        if (currentlyDisplayed >= filteredPosts.length) return;
        if (autoLoadCount >= MAX_AUTO_LOAD_ITERATIONS) {
            console.warn(`Reached maximum auto-load iterations (${autoLoadCount}/${MAX_AUTO_LOAD_ITERATIONS}). Stopping auto-load.`);
            return;
        }
        
        // Check if page is scrollable (content height > viewport height + buffer)
        // Buffer accounts for browser differences and ensures reliable detection
        const isScrollable = document.documentElement.scrollHeight > window.innerHeight + SCROLLABLE_BUFFER_PX;
        
        if (!isScrollable) {
            autoLoadCount++;
            isLoading = true; // Prevent concurrent auto-loading
            // Page is not scrollable yet, load more posts automatically
            // Use setTimeout with small delay to allow browser to render between batches
            setTimeout(() => {
                displayNextBatch(); // Synchronous function, completes immediately
                isLoading = false; // Safe to reset: displayNextBatch() has completed
            }, 10);
        }
    }
    
    // Infinite scroll handler
    function handleScroll() {
        if (isLoading || currentlyDisplayed >= filteredPosts.length) return;
        
        // Calculate if user is near the bottom (within 500px)
        const scrollPosition = window.innerHeight + window.scrollY;
        const pageHeight = document.documentElement.scrollHeight;
        
        if (scrollPosition >= pageHeight - 500) {
            isLoading = true;
            loadingIndicator.style.display = 'block';
            
            // Simulate a small delay for loading effect
            setTimeout(() => {
                displayNextBatch();
                loadingIndicator.style.display = 'none';
                isLoading = false;
            }, 300);
        }
    }
    
    // Reset filters
    function resetAllFilters() {
        searchInput.value = '';
        tagFilter.value = '';
        authorFilter.value = '';
        sortBy.value = 'date-desc';
        filterPosts();
    }
    
    // Event listeners
    if (searchInput) {
        searchInput.addEventListener('input', filterPosts);
    }
    
    if (tagFilter) {
        tagFilter.addEventListener('change', filterPosts);
    }
    
    if (authorFilter) {
        authorFilter.addEventListener('change', filterPosts);
    }
    
    if (sortBy) {
        sortBy.addEventListener('change', filterPosts);
    }
    
    if (resetFilters) {
        resetFilters.addEventListener('click', resetAllFilters);
    }
    
    // Add scroll event listener for infinite scroll
    window.addEventListener('scroll', handleScroll);
    
    // Initial load - apply default sorting and show first batch
    filterPosts();
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
        postTags.forEach(tag => tags.add(tag.trim()));
        
        const author = post.dataset.author;
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
