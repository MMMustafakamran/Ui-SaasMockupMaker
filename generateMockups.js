const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// === USER SETTINGS ===
// You can easily change the background gradient here!
// 
// SOME GOOD-LOOKING NEUTRAL & PREMIUM GRADIENTS TO TRY:
// 1. Dark Sleek (Default) : 'linear-gradient(135deg, #1e1e24 0%, #111115 100%)'
// 2. Muted Sage Green     : 'linear-gradient(135deg, #dce1d8 0%, #c8cdc4 100%)'
// 3. Soft Silver/Grey     : 'linear-gradient(135deg, #e2e2e2 0%, #cfcfcf 100%)'
// 4. Warm Sand            : 'linear-gradient(135deg, #e6ded5 0%, #d5cabd 100%)'
// 5. Pure Minimalist White: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)'
// 6. Deep Midnight Blue   : 'linear-gradient(135deg, #1a1b26 0%, #11111a 100%)'
// 7. Lavender Mist        : 'linear-gradient(135deg, #e4e4f9 0%, #d4d4f2 100%)'
// 8. Dusty Rose           : 'linear-gradient(135deg, #eedbcf 0%, #d8c2b7 100%)'
// 9. Cyberpunk Neon Dark  : 'linear-gradient(135deg, #09090b 0%, #1a0b2e 100%)'
// 10. Ocean Breeze        : 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)'
// 11. Tech Blue (Modern)  : 'linear-gradient(135deg, #0a192f 0%, #112240 100%)'
// 12. Soft Peach & Ice    : 'linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)'
// 13. High-End Graphite   : 'linear-gradient(135deg, #2c3e50 0%, #000000 100%)'
// 14. Smooth Matte Black  : '#121212'
// 15. Transparent Output  : 'transparent'
// =====================
const BACKGROUND_GRADIENT = 'linear-gradient(135deg, #e3e4e6 0%, #f4f5f7 100%)';

const inputDir = path.join(__dirname, 'input_images');
const outputDir = path.join(__dirname, 'output_images');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Function to convert image to base64
function getBase64Image(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    let mimeType = 'image/png';
    if (ext === '.jpg' || ext === '.jpeg') {
        mimeType = 'image/jpeg';
    }
    const imageBuffer = fs.readFileSync(filePath);
    return `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
}

const htmlTemplate = (base64Image, bgGradient) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body, html {
            margin: 0;
            padding: 0;
            display: inline-block;
            background: transparent;
        }
        #wrapper {
            /* Dark sleek gradient matching cascade */
            background: ${bgGradient};
            padding: 150px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: fit-content;
            height: fit-content;
            border-radius: 32px;
        }
        #wrapper img {
            border-radius: 16px;
            /* Intense floating shadow matching cascade */
            box-shadow: 
                -30px 30px 60px rgba(0,0,0,0.5),
                -15px 15px 30px rgba(0,0,0,0.3),
                0 0 0 1px rgba(255,255,255,0.05);
            max-width: 1400px;
            display: block;
            width: 100%;
            height: auto;
        }
    </style>
</head>
<body>
    <div id="wrapper">
        <img src="${base64Image}" alt="Mockup">
    </div>
</body>
</html>
`;

async function processImages() {
    // Ensure input directory exists
    if (!fs.existsSync(inputDir)) {
        console.error(`Input directory does not exist: ${inputDir}`);
        console.log('Creating input_images directory. Please place your images there and run the script again.');
        fs.mkdirSync(inputDir, { recursive: true });
        return;
    }

    const files = fs.readdirSync(inputDir);
    const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ext === '.png' || ext === '.jpg' || ext === '.jpeg';
    });

    if (imageFiles.length === 0) {
        console.log('No .png or .jpg files found in the input directory.');
        return;
    }

    console.log(`Found ${imageFiles.length} images to process.`);
    console.log('Launching browser...');
    
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Set a large viewport so the screenshot isn't restricted by default viewport size
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

    for (const file of imageFiles) {
        console.log(`Processing: ${file}...`);
        const inputPath = path.join(inputDir, file);
        const outputPath = path.join(outputDir, file);

        try {
            const base64Image = getBase64Image(inputPath);
            const htmlContent = htmlTemplate(base64Image, BACKGROUND_GRADIENT);

            await page.setContent(htmlContent, { waitUntil: 'load' });

            const wrapper = await page.$('#wrapper');
            if (wrapper) {
                await wrapper.screenshot({
                    path: outputPath,
                    omitBackground: true
                });
                console.log(`Successfully saved: ${file}`);
            } else {
                console.error(`Could not find wrapper element for: ${file}`);
            }
        } catch (error) {
            console.error(`Error processing ${file}:`, error.message);
        }
    }

    console.log('Closing browser...');
    await browser.close();
    console.log('Batch processing complete!');
}

processImages();
