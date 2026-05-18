const { execSync } = require('child_process');

console.log("🚀 Starting the Full SaaS Mockup Pipeline...");

try {
    console.log("\n--- 1. Generating Flat Mockups ---");
    execSync('node generateMockups.js', { stdio: 'inherit' });

    console.log("\n--- 2. Generating Cascade Mockups ---");
    execSync('node generateCascade.js', { stdio: 'inherit' });

    console.log("\n--- 3. Generating Isometric Mockups ---");
    execSync('node generateIsometric.js', { stdio: 'inherit' });

    console.log("\n--- 4. Generating Zoom Tilt Mockups ---");
    execSync('node generateZoomTilt.js', { stdio: 'inherit' });

    console.log("\n✅ All mockups generated successfully! Check the output_images folder.");
} catch (error) {
    console.error("\n❌ An error occurred during mockup generation. You can try running the failing script individually.");
}
