const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log("🚀 Starting the Full SaaS Mockup Pipeline...\n");

const scriptsDir = path.join(__dirname, 'scripts');

try {
    console.log("--- 1. Generating Flat Mockups ---");
    execSync(`node "${path.join(scriptsDir, 'flat.js')}"`, { stdio: 'inherit' });

    console.log("\n--- 2. Generating Cascade Mockups ---");
    execSync(`node "${path.join(scriptsDir, 'cascade.js')}"`, { stdio: 'inherit' });

    console.log("\n--- 3. Generating Zoom Tilt Mockups ---");
    execSync(`node "${path.join(scriptsDir, 'zoomTilt.js')}"`, { stdio: 'inherit' });

    console.log("\n✅ All mockups generated successfully! Check the output folder.");
} catch (error) {
    console.error("\n❌ An error occurred during mockup generation.");
}
