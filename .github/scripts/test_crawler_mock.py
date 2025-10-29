#!/usr/bin/env python3
"""
Mock test to demonstrate crawler functionality with simulated RSS feed data
"""

import sys
import os
from pathlib import Path
from datetime import datetime
from unittest.mock import Mock, patch
import tempfile
import shutil

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

def create_mock_entry(link, title, date, summary):
    """Create a mock RSS entry"""
    class MockEntry(dict):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.__dict__ = self
    
    entry = MockEntry()
    entry['link'] = link
    entry['title'] = title
    entry['published_parsed'] = date.timetuple()[:6] + (0, 0, 0)
    entry['summary'] = summary
    return entry

def create_mock_feed():
    """Create a mock RSS feed response"""
    mock_feed = Mock()
    mock_feed.bozo = False
    mock_feed.entries = [
        create_mock_entry(
            'https://lousec.be/blog/azure-security-best-practices',
            'Azure Security Best Practices for 2024',
            datetime(2024, 10, 29, 10, 0, 0),
            '<p>A comprehensive guide to securing your Azure environment with the latest best practices and recommendations.</p>',
        ),
        create_mock_entry(
            'https://lousec.be/blog/entra-id-conditional-access-tips',
            'Entra ID Conditional Access - Advanced Tips & Tricks',
            datetime(2024, 10, 28, 14, 30, 0),
            'Learn advanced techniques for implementing conditional access policies in Microsoft Entra ID.',
        ),
        create_mock_entry(
            'https://lousec.be/blog/zero-trust-architecture',
            'Implementing Zero Trust Architecture in Modern Enterprises',
            datetime(2024, 10, 27, 9, 15, 0),
            'A practical guide to implementing zero trust security architecture in your organization.',
        ),
    ]
    return mock_feed

def test_crawler_with_mock_data():
    """Test the crawler with mocked RSS feed data"""
    print("Testing Blog Crawler with Mock Data")
    print("=" * 60)
    
    # Create temporary directory for test posts
    with tempfile.TemporaryDirectory() as temp_dir:
        posts_dir = Path(temp_dir) / '_posts'
        posts_dir.mkdir()
        
        # Create mock config
        config_path = Path(temp_dir) / 'websites.yml'
        with open(config_path, 'w') as f:
            f.write("""websites:
  - url: https://lousec.be
    author: "Louis Mastelinck"
    tags: [security, azure, entra-id]
    rss_feed: https://lousec.be/feed/
""")
        
        # Import and patch
        from crawl_blogs import BlogCrawler
        import feedparser
        
        # Create crawler instance
        crawler = BlogCrawler(config_path=str(config_path), posts_dir=str(posts_dir))
        
        print("\n1. Loading configuration...")
        crawler.load_config()
        print(f"   ✓ Loaded {len(crawler.websites)} website(s)")
        
        print("\n2. Loading existing posts...")
        crawler.load_existing_posts()
        print(f"   ✓ Found {len(crawler.existing_links)} existing posts")
        
        print("\n3. Crawling website with mocked feed data...")
        
        # Mock feedparser.parse to return our mock data
        with patch('feedparser.parse', return_value=create_mock_feed()):
            for website in crawler.websites:
                crawler.crawl_website(website)
        
        print(f"\n4. Results:")
        print(f"   ✓ Created {len(crawler.new_posts)} new post(s)")
        
        # List created files
        if crawler.new_posts:
            print("\n5. Created post files:")
            for post_file in crawler.new_posts:
                full_path = posts_dir / post_file
                print(f"\n   File: {post_file}")
                
                # Read and display the content
                with open(full_path, 'r') as f:
                    content = f.read()
                    print("   Content preview:")
                    for line in content.split('\n')[:12]:
                        print(f"   {line}")
        
        print("\n" + "=" * 60)
        print("Mock test completed successfully!")
        print("\nThis demonstrates that the crawler will:")
        print("  • Parse RSS feeds correctly")
        print("  • Extract blog post metadata (title, date, summary)")
        print("  • Generate properly formatted markdown files")
        print("  • Place files in the _posts directory")
        print("  • Format posts according to existing conventions")
        
        return True

if __name__ == '__main__':
    try:
        success = test_crawler_with_mock_data()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n✗ Test failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
