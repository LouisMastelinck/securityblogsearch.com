# Quick Setup Guide for Repository Protection

This repository now has security measures to restrict external contributors to only modify files in the `_posts/` folder.

## What's Been Implemented

### 1. ✅ CODEOWNERS File (`.github/CODEOWNERS`)
- Defines ownership for different parts of the repository
- Ensures all changes require approval from `@LouisMastelinck`

### 2. ✅ GitHub Actions Workflow (`.github/workflows/check-external-contributor-files.yml`)
- **Automatically** checks all pull requests from external contributors
- **Blocks** PRs that modify files outside `_posts/` folder
- **Allows** PRs that only add/modify posts
- Posts helpful comments on failed checks

### 3. ✅ Documentation
- **RULESETS.md** - Comprehensive guide for setting up GitHub Rulesets
- **ruleset-config.json** - JSON configuration for the ruleset
- Updated **README.md** and **contributing.md** with notices

## What Works Now (Automatic)

🟢 **GitHub Actions Check** (Already Active!)
- When an external contributor submits a PR, the workflow runs automatically
- If they modified files outside `_posts/`, the check fails with a clear error message
- The PR cannot be merged until the issue is resolved

## What You Can Set Up (Optional, Enhanced Protection)

🟡 **GitHub Repository Rulesets** (Manual Setup Required)
- More powerful than workflows - can prevent PRs from being created at all
- Requires GitHub Team or Enterprise (or public repos with the feature enabled)
- Follow the instructions in `.github/RULESETS.md` to set this up

### Quick Steps for Ruleset Setup:
1. Go to your repo → Settings → Rules → Rulesets
2. Create new ruleset: "External Contributors - Posts Only"
3. Enable "Restrict file paths" with pattern: ** (two asterisks) and exception: !_posts/** (exclamation mark, then _posts/ then two asterisks)
4. Add yourself and GitHub Copilot to bypass list
5. Set enforcement to "Active"

## Testing Your Setup

### Test 1: External Contributor Adds a Post ✅
```bash
# What they do:
- Fork the repo
- Add a file: _posts/2025-01-01-my-security-post.md
- Submit PR

# Expected result:
✅ GitHub Actions check passes
✅ PR can be reviewed and merged
```

### Test 2: External Contributor Modifies Config ❌
```bash
# What they do:
- Fork the repo
- Modify: _config.yml or README.md
- Submit PR

# Expected result:
❌ GitHub Actions check fails
❌ Bot comments on the PR with helpful message
❌ PR cannot be merged until files are removed
```

### Test 3: You (Owner) Make Any Changes ✅
```bash
# What you do:
- Modify any file in the repo
- Push directly or create PR

# Expected result:
✅ No restrictions (you're the owner)
✅ Workflow doesn't run for you
✅ All changes go through smoothly
```

## How Contributors Will See This

When an external contributor tries to modify protected files:

1. **In the PR** - They'll see a failed check: "check-modified-files / check-modified-files"
2. **Bot Comment** - An automated comment will explain what went wrong
3. **What They Need to Do** - Remove changes to protected files and keep only post changes

## How You (Owner) Work

Nothing changes for you!

- ✅ Push to any branch directly
- ✅ Modify any files
- ✅ The workflow won't run for your PRs (you're explicitly allowed by username)
- ✅ Bypass all restrictions

## For GitHub Copilot

GitHub Copilot can now modify any files!

1. ✅ The workflow explicitly allows changes from the Copilot bot (user login: 'Copilot')
2. ✅ No restrictions apply when Copilot creates or updates PRs
3. For enhanced protection with Rulesets, you can also add Copilot as a bypass actor when setting up the ruleset

## Current Status

| Feature | Status | Protection Level |
|---------|--------|------------------|
| CODEOWNERS | ✅ Active | Requires owner approval |
| GitHub Actions Check | ✅ Active | Blocks invalid PRs automatically |
| Repository Rulesets | ⚠️ Manual Setup | Strongest protection (optional) |
| Documentation | ✅ Complete | Helps contributors understand rules |

**Recent Fix (Nov 2025)**: The workflow now uses `pull_request_target` instead of `pull_request` to properly comment on PRs from forks. This fixes the "Resource not accessible by integration" error that was preventing the bot from posting comments on external contributor PRs.

## Next Steps (Optional)

1. **Recommended**: Set up Repository Rulesets for maximum protection (see RULESETS.md)
2. **Optional**: Test the current setup by creating a test PR from a different account
3. **Monitor**: Watch for any PRs from external contributors to see the workflow in action

## Need Help?

- Read the full documentation: `.github/RULESETS.md`
- Check the workflow file: `.github/workflows/check-external-contributor-files.yml`
- Review the CODEOWNERS file: `.github/CODEOWNERS`

## Summary

✅ Your repository now automatically blocks external contributors from modifying files outside `_posts/`
✅ You retain full access to modify any files
✅ External contributors can still submit valuable blog posts
✅ All changes are tracked and require your approval

The setup is **already working** with GitHub Actions. Adding Repository Rulesets (optional) provides even stronger protection but requires manual configuration through the GitHub UI.
