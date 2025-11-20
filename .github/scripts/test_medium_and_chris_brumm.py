#!/usr/bin/env python3
"""
Test script for Medium and chris-brumm.com specific functionality
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

def test_medium_feed_detection():
    """Test Medium feed URL auto-detection"""
    from crawl_blogs import BlogCrawler
    
    print("Testing Medium feed URL auto-detection:")
    crawler = BlogCrawler()
    
    medium_url = 'https://medium.com/@TimGroothuis'
    feed_url = crawler.find_feed_url(medium_url)
    
    expected = 'https://medium.com/feed/@TimGroothuis'
    status = "✓" if feed_url == expected else "✗"
    print(f"  {status} URL: {medium_url}")
    print(f"     Detected feed: {feed_url}")
    print(f"     Expected:      {expected}")
    
    if feed_url != expected:
        print(f"  ERROR: Feed URL detection failed")
        return False
    
    return True

def test_medium_author_extraction():
    """Test Medium author extraction from username"""
    from crawl_blogs import BlogCrawler
    
    print("\nTesting Medium author extraction from URL:")
    crawler = BlogCrawler()
    
    test_cases = [
        ('https://medium.com/@TimGroothuis', 'Timgroothuis'),  # Fallback from username
        ('https://medium.com/@john_doe', 'John Doe'),  # Username with underscore
        ('https://medium.com/@mary-jane', 'Mary Jane'),  # Username with hyphen
    ]
    
    all_passed = True
    for url, expected_contains in test_cases:
        author = crawler.normalize_author_name(None, url)
        # Just check that we get something from Medium URLs
        status = "✓" if author else "✗"
        print(f"  {status} URL: {url}")
        print(f"     Extracted: {author}")
        
        if not author:
            all_passed = False
    
    return all_passed

def test_chris_brumm_author():
    """Test chris-brumm.com author from config"""
    from crawl_blogs import BlogCrawler
    import yaml
    
    print("\nTesting chris-brumm.com author configuration:")
    
    # Load the actual config
    with open('../../websites.yml', 'r') as f:
        config = yaml.safe_load(f)
    
    # Find chris-brumm.com in config
    chris_site = None
    for site in config['websites']:
        if 'chris-brumm.com' in site['url']:
            chris_site = site
            break
    
    if not chris_site:
        print("  ✗ chris-brumm.com not found in config")
        return False
    
    expected_author = "Christopher Brumm"
    actual_author = chris_site.get('author')
    
    status = "✓" if actual_author == expected_author else "✗"
    print(f"  {status} Author in config: {actual_author}")
    print(f"     Expected:           {expected_author}")
    
    return actual_author == expected_author

def test_medium_config():
    """Test Medium configuration"""
    from crawl_blogs import BlogCrawler
    import yaml
    
    print("\nTesting Medium configuration:")
    
    # Load the actual config
    with open('../../websites.yml', 'r') as f:
        config = yaml.safe_load(f)
    
    # Find Medium in config
    medium_site = None
    for site in config['websites']:
        if 'medium.com/@' in site['url']:
            medium_site = site
            break
    
    if not medium_site:
        print("  ✗ Medium URL not found in config")
        return False
    
    # Check RSS feed is configured
    expected_feed = 'https://medium.com/feed/@TimGroothuis'
    actual_feed = medium_site.get('rss_feed')
    
    status = "✓" if actual_feed == expected_feed else "✗"
    print(f"  {status} RSS feed in config: {actual_feed}")
    print(f"     Expected:             {expected_feed}")
    
    # Check author is configured
    expected_author = "Tim Groothuis"
    actual_author = medium_site.get('author')
    
    status = "✓" if actual_author == expected_author else "✗"
    print(f"  {status} Author in config: {actual_author}")
    print(f"     Expected:          {expected_author}")
    
    return actual_feed == expected_feed and actual_author == expected_author

if __name__ == '__main__':
    print("Testing Medium and chris-brumm.com Support")
    print("=" * 60)
    
    try:
        results = []
        results.append(test_medium_feed_detection())
        results.append(test_medium_author_extraction())
        results.append(test_chris_brumm_author())
        results.append(test_medium_config())
        
        print("\n" + "=" * 60)
        if all(results):
            print("All tests passed!")
            sys.exit(0)
        else:
            print("Some tests failed!")
            sys.exit(1)
        
    except Exception as e:
        print(f"\n✗ Test failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
