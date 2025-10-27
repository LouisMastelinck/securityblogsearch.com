# GitHub Repository Rulesets Configuration Guide

This document provides instructions for configuring GitHub Repository Rulesets to restrict third-party contributors to only modify files in the `_posts` folder.

## Overview

The goal is to:
- Allow external contributors to **only** create/modify files in the `_posts/` directory
- Prevent external contributors from modifying any other files (configuration, layouts, workflows, etc.)
- Allow repository owners and GitHub Copilot to make changes anywhere in the repository

## Implementation Strategy

This is achieved through a combination of:
1. **CODEOWNERS file** (`.github/CODEOWNERS`) - Defines ownership of different parts of the repository
2. **GitHub Repository Rulesets** - Enforces file path restrictions and branch protection rules
3. **Branch protection** - Requires reviews for changes outside the posts folder

## Setting Up Repository Rulesets

GitHub Repository Rulesets must be configured through the GitHub web interface. Follow these steps:

### Step 1: Access Repository Rulesets

1. Go to your repository on GitHub
2. Click **Settings** → **Rules** → **Rulesets**
3. Click **New ruleset** → **New branch ruleset**

### Step 2: Create "External Contributors - Posts Only" Ruleset

Create a ruleset with the following configuration:

#### Basic Settings
- **Ruleset Name**: `External Contributors - Posts Only`
- **Enforcement status**: Active
- **Bypass list**: Add repository administrators and GitHub Copilot

#### Target Branches
- **Target**: Default branch (`main`)
- Or select specific branches you want to protect

#### Rules Configuration

Enable the following rules:

1. **Restrict file paths**
   - ☑️ Enable "Restrict file paths"
   - **Restricted file paths**: 
     ```
     **
     !_posts/**
     ```
   - This means: Block ALL files except those in `_posts/` directory
   - **Who can push**: Only repository administrators and bypass users

2. **Require pull request before merging**
   - ☑️ Enable this rule
   - Required approvals: 1
   - Dismiss stale pull request approvals when new commits are pushed: ☑️
   - Require review from Code Owners: ☑️

3. **Require status checks to pass before merging**
   - ☑️ Enable this rule if you have CI/CD checks

4. **Block force pushes**
   - ☑️ Enable this rule

5. **Block deletions**
   - ☑️ Enable this rule (prevents deleting the protected branch)

#### Bypass Actors

Add the following bypass actors (these can modify any files):
- Repository administrators
- Specific users (add your GitHub username: `@LouisMastelinck`)
- GitHub Apps (add GitHub Copilot if available in your organization)

### Step 3: Create "Protected Files" Ruleset (Optional)

For additional protection, create a second ruleset:

#### Basic Settings
- **Ruleset Name**: `Protected Files - Owners Only`
- **Enforcement status**: Active
- **Bypass list**: Repository administrators only

#### Target Branches
- **Target**: Default branch (`main`)

#### Rules Configuration

1. **Restrict file paths**
   - ☑️ Enable "Restrict file paths"
   - **Restricted file paths**:
     ```
     .github/**
     _config.yml
     _includes/**
     _layouts/**
     /assets/**
     index.html
     about.md
     contributing.md
     README.md
     Gemfile
     Gemfile.lock
     CNAME
     ```
   - **Who can push**: Only repository administrators and bypass users

## How It Works

### For External Contributors

When an external contributor:
1. ✅ **Can** create/modify files in `_posts/` - These PRs will be allowed
2. ❌ **Cannot** modify files outside `_posts/` - These PRs will be blocked by the ruleset
3. ⚠️ **Must** submit changes via Pull Request - Direct pushes are not allowed
4. ⚠️ **Requires** approval from code owners before merging

### For Repository Owners

Repository owners and bypass actors:
1. ✅ **Can** modify any file in the repository
2. ✅ **Can** bypass the ruleset restrictions
3. ✅ **Can** approve and merge pull requests

### For GitHub Copilot

If configured as a bypass actor:
1. ✅ **Can** make changes to any file
2. ✅ **Can** bypass restrictions like repository owners

## Testing the Configuration

### Test 1: External Contributor Submits Post
1. Create a fork as a test user
2. Add a new file to `_posts/`
3. Submit a Pull Request
4. **Expected**: PR should be created successfully

### Test 2: External Contributor Tries to Modify Config
1. Create a fork as a test user
2. Try to modify `_config.yml` or any file outside `_posts/`
3. Submit a Pull Request
4. **Expected**: PR should be blocked or fail the ruleset check

### Test 3: Repository Owner Makes Changes
1. As repository owner, modify any file
2. Push directly or create a PR
3. **Expected**: Changes should go through without restrictions

## Alternative: Using Branch Protection Rules

If Repository Rulesets are not available (requires GitHub Enterprise or GitHub Team), you can use classic Branch Protection Rules:

1. Go to **Settings** → **Branches**
2. Add rule for `main` branch
3. Enable:
   - Require pull request reviews before merging
   - Require review from Code Owners
   - Do not allow bypassing the above settings (except for administrators)

However, note that Branch Protection Rules do **not** support path-based restrictions. You would need to:
- Rely on CODEOWNERS for review requirements
- Manually review and reject PRs that modify files outside `_posts/`
- Use GitHub Actions to automatically check file paths and block invalid PRs

## Automated Path Checking with GitHub Actions

If you cannot use Rulesets, add a GitHub Actions workflow to automatically check file paths:

Create `.github/workflows/check-modified-files.yml`:

```yaml
name: Check Modified Files

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  check-files:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Get changed files
        id: changed-files
        uses: tj-actions/changed-files@v40
      
      - name: Check if only _posts modified
        run: |
          # Get the author of the PR
          PR_AUTHOR="${{ github.event.pull_request.user.login }}"
          REPO_OWNER="LouisMastelinck"
          
          # Allow repo owner to modify any files
          if [ "$PR_AUTHOR" == "$REPO_OWNER" ]; then
            echo "Repository owner can modify any files"
            exit 0
          fi
          
          # Check if any files outside _posts were modified
          INVALID_FILES=""
          for file in ${{ steps.changed-files.outputs.all_changed_files }}; do
            if [[ ! "$file" =~ ^_posts/ ]]; then
              INVALID_FILES="$INVALID_FILES $file"
            fi
          done
          
          if [ -n "$INVALID_FILES" ]; then
            echo "Error: External contributors can only modify files in _posts/ directory"
            echo "The following files are not allowed:$INVALID_FILES"
            exit 1
          fi
          
          echo "All modified files are in _posts/ - check passed!"
```

## Troubleshooting

### Issue: Ruleset not working
- Ensure ruleset is set to "Active"
- Check that target branches include your default branch
- Verify file path patterns are correct (use `**` for all subdirectories)

### Issue: Can't bypass as owner
- Add yourself to the bypass list
- Ensure you have admin permissions on the repository
- Check if organizational rules are overriding repository rules

### Issue: GitHub Copilot can't make changes
- GitHub Copilot needs to be added as a bypass actor
- This requires GitHub Enterprise or specific organization settings
- Contact your GitHub organization admin

## Additional Resources

- [GitHub Rulesets Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [CODEOWNERS Documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)

## Summary

This configuration ensures that:
- ✅ External contributors can only submit posts to `_posts/` folder
- ✅ All other files are protected from external modifications
- ✅ Repository owners can modify anything
- ✅ Changes require review before merging
- ✅ The CODEOWNERS file enforces ownership

**Note**: Repository Rulesets are a GitHub feature that must be configured through the web interface. This document provides the configuration details, but the actual implementation must be done in the GitHub repository settings.
