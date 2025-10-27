// Search and filter functionality for security blog posts
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const tagFilter = document.getElementById('tagFilter');
    const authorFilter = document.getElementById('authorFilter');
    const sortBy = document.getElementById('sortBy');
    const resetFilters = document.getElementById('resetFilters');
    const postsContainer = document.getElementById('postsContainer');
    const noResults = document.getElementById('noResults');
    const posts = Array.from(document.querySelectorAll('.post-card'));
    
    // Exit early if we're not on a page with posts
    if (!searchInput || !postsContainer || posts.length === 0) {
        return;
    }
    
    // Filter and search function
    function filterPosts() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedTag = tagFilter.value.toLowerCase();
        const selectedAuthor = authorFilter.value.toLowerCase();
        const sortOption = sortBy.value;
        
        // Filter posts
        let visiblePosts = posts.filter(post => {
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
        visiblePosts.sort((a, b) => {
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
        
        // Hide all posts and set order
        posts.forEach((post, index) => {
            const isVisible = visiblePosts.includes(post);
            post.style.display = isVisible ? 'block' : 'none';
            post.style.order = isVisible ? visiblePosts.indexOf(post) : 999;
        });
        
        // Show/hide no results message
        if (visiblePosts.length > 0) {
            noResults.style.display = 'none';
        } else {
            noResults.style.display = 'block';
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
    
    // Initial load - apply default sorting
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
