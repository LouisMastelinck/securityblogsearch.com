---
layout: post
title: "Defender Firewall FQDN filtering - prefer NRPT for broad blocks"
author: "Nathan McNulty"
date: 2026-06-10
tags: [azure, entra-id, defender, intune]
link: "https://nathanmcnulty.com/notes/defender/defender-firewall-fqdn-based-filtering/"
summary: "For broad domain or TLD blocking, I recommend NRPT rules over Windows Firewall dynamic keyword blocks. Firewall FQDN rules turn matching DNS results into IP-based restrictions, which can affect unr..."
---
