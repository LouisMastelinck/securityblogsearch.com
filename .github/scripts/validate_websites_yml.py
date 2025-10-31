#!/usr/bin/env python3
"""
Validation script for websites.yml configuration file.
This ensures the YAML is properly formatted and contains valid configuration.
"""

import sys
import yaml
from pathlib import Path


def validate_websites_yml(config_path='websites.yml'):
    """Validate the websites.yml configuration file."""
    
    errors = []
    warnings = []
    
    # Check file exists
    if not Path(config_path).exists():
        errors.append(f"Configuration file not found: {config_path}")
        return errors, warnings
    
    # Try to parse YAML
    try:
        with open(config_path, 'r') as f:
            config = yaml.safe_load(f)
    except yaml.YAMLError as e:
        errors.append(f"YAML syntax error: {e}")
        return errors, warnings
    
    # Check structure
    if not config:
        errors.append("Configuration file is empty")
        return errors, warnings
    
    if 'websites' not in config:
        errors.append("Configuration must contain 'websites' key")
        return errors, warnings
    
    websites = config.get('websites', [])
    
    if not isinstance(websites, list):
        errors.append("'websites' must be a list")
        return errors, warnings
    
    if len(websites) == 0:
        warnings.append("No websites configured")
    
    # Validate each website entry
    for i, website in enumerate(websites):
        if not isinstance(website, dict):
            errors.append(f"Website #{i+1}: Must be a dictionary/object")
            continue
        
        # Check required fields
        if 'url' not in website:
            errors.append(f"Website #{i+1}: Missing required 'url' field")
            continue
        
        url = website.get('url')
        if not url or not isinstance(url, str):
            errors.append(f"Website #{i+1}: 'url' must be a non-empty string")
            continue
        
        if not url.startswith(('http://', 'https://')):
            warnings.append(f"Website #{i+1} ({url}): URL should start with http:// or https://")
        
        # Check optional fields
        if 'rss_feed' in website:
            rss_feed = website.get('rss_feed')
            if rss_feed is not None and not isinstance(rss_feed, str):
                errors.append(f"Website #{i+1} ({url}): 'rss_feed' must be a string or omitted")
            elif rss_feed == '':
                warnings.append(f"Website #{i+1} ({url}): Empty 'rss_feed' field - consider removing it for auto-detection")
        
        if 'author' in website:
            author = website.get('author')
            if author and not isinstance(author, str):
                errors.append(f"Website #{i+1} ({url}): 'author' must be a string")
        
        if 'tags' in website:
            tags = website.get('tags')
            if tags and not isinstance(tags, (list, str)):
                errors.append(f"Website #{i+1} ({url}): 'tags' must be a list or string")
            elif isinstance(tags, list):
                for tag in tags:
                    if not isinstance(tag, str):
                        errors.append(f"Website #{i+1} ({url}): Each tag must be a string")
    
    return errors, warnings


def main():
    """Main entry point."""
    config_path = sys.argv[1] if len(sys.argv) > 1 else 'websites.yml'
    
    print(f"Validating: {config_path}")
    print("=" * 60)
    
    errors, warnings = validate_websites_yml(config_path)
    
    if warnings:
        print("\n⚠️  Warnings:")
        for warning in warnings:
            print(f"  - {warning}")
    
    if errors:
        print("\n❌ Errors:")
        for error in errors:
            print(f"  - {error}")
        print("\n" + "=" * 60)
        print("Validation FAILED")
        sys.exit(1)
    else:
        if not warnings:
            print("\n✅ Validation PASSED - No errors or warnings")
        else:
            print("\n✅ Validation PASSED - No errors (warnings above)")
        print("=" * 60)
        sys.exit(0)


if __name__ == '__main__':
    main()
