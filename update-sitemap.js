#!/usr/bin/env node

/**
 * Auto-update sitemap.xml lastmod date
 * Usage: node update-sitemap.js
 */

const fs = require('fs');
const path = require('path');

const sitemapPath = path.join(__dirname, 'sitemap.xml');

// Get current date in ISO 8601 format with timezone
const now = new Date();
const year = now.getUTCFullYear();
const month = String(now.getUTCMonth() + 1).padStart(2, '0');
const day = String(now.getUTCDate()).padStart(2, '0');
const hours = String(now.getUTCHours()).padStart(2, '0');
const minutes = String(now.getUTCMinutes()).padStart(2, '0');
const seconds = String(now.getUTCSeconds()).padStart(2, '0');

const lastmod = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+00:00`;

try {
    // Read sitemap.xml
    let sitemap = fs.readFileSync(sitemapPath, 'utf8');
    
    // Replace lastmod date (matches format: YYYY-MM-DDTHH:MM:SS+00:00)
    const lastmodRegex = /<lastmod>[\d\-T:+]+<\/lastmod>/g;
    const updatedSitemap = sitemap.replace(lastmodRegex, `<lastmod>${lastmod}</lastmod>`);
    
    // Write back to file
    fs.writeFileSync(sitemapPath, updatedSitemap, 'utf8');
    
    console.log(`✅ Sitemap updated successfully!`);
    console.log(`   Lastmod set to: ${lastmod}`);
} catch (error) {
    console.error('❌ Error updating sitemap:', error.message);
    process.exit(1);
}
