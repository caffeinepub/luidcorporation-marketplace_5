# LuidCorporation Marketplace

## Current State
New project — no existing code.

## Requested Changes (Diff)

### Add
- Full marketplace platform for selling automation scripts and bots
- User registration/login with Luid ID + email + password
- Admin panel accessible only via fixed credentials (SidneiCosta00 / Nikebolado@4)
- Script catalog with category filters: Discord Bots, Web Scraping, Automações, Scripts de Vendas
- Product detail pages with technical description, version, price
- User dashboard with "Meus Scripts" showing purchased scripts with ZIP download
- Admin panel: upload/manage scripts, view registered users
- Landing page with Clean Tech aesthetic (white background, neon green accents)

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan

### Backend (Motoko)
1. User canister: store luidId, email, hashed password, purchasedScripts list
2. Inventory canister: store scripts (id, title, description, category, price, version, fileUrl, language)
3. Admin auth: hardcoded check for SidneiCosta00 credentials for write operations
4. Purchase recording: link user luidId to script id
5. CRUD operations: create/update/delete scripts restricted to admin
6. Query operations: list scripts by category, get script details, get user profile

### Frontend (React + Tailwind)
1. Landing page with hero section, featured scripts grid, category filters
2. Auth pages: Register (luidId + email + password) and Login (luidId + password)
3. Script catalog page with category filter tabs
4. Product detail page
5. User dashboard with purchased scripts and download buttons
6. Admin panel at /admin: script CRUD, user list
7. Clean Tech visual identity: white background, neon green (#39FF14) CTAs and accents
