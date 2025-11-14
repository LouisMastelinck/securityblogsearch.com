# Tagging Guidelines for Blog Posts

This document provides guidelines for consistent tagging of blog posts to ensure better searchability and organization.

## General Principles

1. **Use lowercase with hyphens**: Tags should be lowercase with words separated by hyphens (e.g., `entra-id`, not `Entra-ID` or `entra_id`)
2. **Be consistent**: Use the standardized tag names listed below
3. **Be specific but not redundant**: Use the most specific tag that applies, avoid redundant general tags
4. **Preserve compound tags**: Some tags refer to specific products/features and should be kept as compound tags (see Compound Tags section)

## Standardized Tags

### Microsoft Identity & Access

- **entra-id** - Use for all Microsoft Entra ID / Azure AD content
  - ❌ Don't use: `entra`, `azuread`, `azure-ad`, `microsoft-entra`, `microsoft-entra-id`
  - ✅ Compound exceptions: `azure-ad-connect`, `azure-ad-identity-protection`

- **conditional-access** - For Conditional Access policies and features
  - ❌ Don't use: `conditionalaccess`, `azure-ad-conditional-access`

- **identity** - For general identity management topics

### Microsoft Defender Suite

- **defender-xdr** - For Microsoft Defender XDR / Microsoft 365 Defender
  - ❌ Don't use: `microsoft-defender`, `microsoft-365-defender`, `m365defender`, `microsoft-defender-xdr`

- **defender-for-endpoint** - For Microsoft Defender for Endpoint
  - ❌ Don't use: `microsoft-defender-for-endpoint`, `defenderforendpoint`
  - ✅ Compound exception: `microsoft-defender-antivirus`, `microsoft-defender-vulnerability-management`

- **defender-for-identity** - For Microsoft Defender for Identity
  - ❌ Don't use: `microsoft-defender-for-identity`, `defenderforidentity`

- **defender-for-cloud** - For Microsoft Defender for Cloud
  - ❌ Don't use: `microsoft-defender-for-cloud`

- **defender-for-cloud-apps** - For Microsoft Defender for Cloud Apps
  - ❌ Don't use: `microsoft-defender-for-cloud-apps`, `MDCA`, `Defender for Cloud Apps`

- **defender-for-office-365** - For Microsoft Defender for Office 365
  - ❌ Don't use: `microsoft-defender-for-office-365`, `defender-for-office`

- **defender** - For general Microsoft Defender topics

### Microsoft 365 Services

- **intune** - For Microsoft Intune
  - ❌ Don't use: `microsoft-intune`, `msintune`, `intunesuite`

- **sentinel** - For Microsoft Sentinel
  - ❌ Don't use: `microsoft-sentinel`, `azure-sentinel`

- **purview** - For Microsoft Purview
  - ❌ Don't use: `microsoft-purview`
  - ✅ Compound exceptions: `microsoft-purview-audit-standard`, `microsoft-purview-compliance`, etc.

- **microsoft-365** - For Microsoft 365 general topics
  - ❌ Don't use: `microsoft365`

- **office-365** - For Office 365 specific topics
  - ❌ Don't use: `office365`

- **exchange-online** - For Exchange Online

- **sharepoint-online** - For SharePoint Online

- **teams** - For Microsoft Teams

- **microsoft-365-copilot** - For Microsoft 365 Copilot

### Infrastructure & Tools

- **azure** - For Microsoft Azure
  - ❌ Don't use: `Azure` (case sensitive)

- **azure-arc** - For Azure Arc
  - ❌ Don't use: `azurearc`

- **windows-10** - For Windows 10
  - ❌ Don't use: `windows10`

- **active-directory** - For Active Directory (on-premises)
  - ❌ Don't use: `activedirectory`

- **powershell** - For PowerShell scripts and automation

- **microsoft-graph** - For Microsoft Graph API

### Other Common Tags

- **security** - General security topics
- **compliance** - Compliance and governance
- **administration** - Administration and management
- **automation** - Automation and scripting
- **identity-governance** - Identity governance
  - ❌ Don't use: `identitygovernance`
- **passwordless** - Passwordless authentication
  - ❌ Don't use: `password-less`

## Compound Tags to Preserve

Some tags are compound tags that refer to specific products, features, or modules. These should be kept as-is:

### PowerShell Modules
- `azuread-module` - The AzureAD PowerShell module
- `azuread-module-retirement` - Related to AzureAD module retirement
- `entra-module` - The Microsoft.Graph.Entra module

### Specific Products/Features
- `azure-ad-connect` - Azure AD Connect sync tool
- `azure-ad-identity-protection` - Azure AD Identity Protection feature
- `entra-id-connect` - Entra ID Connect
- `microsoft-defender-antivirus` - Microsoft Defender Antivirus component
- `microsoft-defender-vulnerability-management` - Defender Vulnerability Management

### Tools and Utilities
- `azure-key-vault` - Azure Key Vault service
  - ❌ Don't use: `azure-keyvault`
- `pnp-powershell` - PnP PowerShell module
  - ❌ Don't use: `pnppowershell`

## Tag Mapping Reference

This table shows the standardized tags and their old variations that should be avoided:

| Standardized Tag | Old Variations (Don't Use) |
|------------------|---------------------------|
| entra-id | entra, azuread, azure-ad, microsoft-entra, microsoft-entra-id, azure-adentra-id, Entra ID |
| defender-xdr | microsoft-defender, microsoft-365-defender, m365defender, microsoft-defender-xdr |
| defender-for-endpoint | microsoft-defender-for-endpoint, defenderforendpoint |
| defender-for-identity | microsoft-defender-for-identity, defenderforidentity |
| defender-for-cloud-apps | microsoft-defender-for-cloud-apps, MDCA, Defender for Cloud Apps |
| defender-for-cloud | microsoft-defender-for-cloud |
| defender-for-office-365 | microsoft-defender-for-office-365, defender-for-office |
| intune | microsoft-intune, msintune, intunesuite |
| sentinel | microsoft-sentinel, azure-sentinel |
| purview | microsoft-purview |
| microsoft-365 | microsoft365 |
| office-365 | office365 |
| conditional-access | conditionalaccess, azure-ad-conditional-access |
| windows-10 | windows10 |
| azure-arc | azurearc |
| active-directory | activedirectory |
| identity-governance | identitygovernance |
| passwordless | password-less |

## How to Tag a New Blog Post

1. Read the blog post content
2. Identify the main topics (aim for 3-7 tags)
3. Use the standardized tags from this guide
4. Add tags in the front matter:

```yaml
---
layout: post
title: "Your Blog Post Title"
author: "Author Name"
date: YYYY-MM-DD
tags: [entra-id, conditional-access, security]
link: "https://example.com/blog-post"
summary: "Brief summary of the post"
---
```

## Updating This Guide

If you identify new tag variations that need standardization:

1. Document the variations
2. Determine the standardized tag name (follow the principles above)
3. Update this guide
4. Update affected blog posts
5. Submit a pull request

## History

- **2025-11**: Initial tag unification project
  - Unified 47 tag variations across 1,929 blog posts
  - Reduced unique tags from 1,511 to 1,464
  - Created this standardization guide

