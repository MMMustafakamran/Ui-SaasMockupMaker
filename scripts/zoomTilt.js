const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const config = require('../config.js');

const outputDir = path.join(config.OUTPUT_DIR, 'zoom_tilt');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function getBase64Image(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    let mimeType = 'image/png';
    if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
    return `data:${mimeType};base64,${fs.readFileSync(filePath).toString('base64')}`;
}

const htmlTemplate = (images) => {
    const imageTags = images.slice(0, 2).map((base64, index) => `
        <div class="mockup img${index + 1}">
            <img src="${base64}" alt="Mockup ${index + 1}">
        </div>
    `).join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body, html { margin: 0; padding: 0; background: transparent; display: inline-block; }
        #wrapper {
            background: ${config.BACKGROUND_GRADIENT};
            display: block;
            position: relative;
            width: 1600px;
            height: 1200px;
            overflow: hidden;
            border-radius: 24px;
        }
        .mockup {
            position: absolute;
            transform: rotate(-10deg);
        }
        .mockup img {
            display: block;
            border-radius: 16px;
            box-shadow: 
                -40px 40px 100px rgba(0,0,0,0.3),
                -15px 15px 40px rgba(0,0,0,0.2),
                0 0 0 1px rgba(0,0,0,0.05);
            width: 2400px; 
            height: auto;
        }
        .img1 { top: 50px; left: 110px; z-index: 1; }
        .img2 { top: 150px; left: 800px; z-index: 2; }
        
        /* Reduce the shadow effect specifically for the second image */
        .img2 img {
            box-shadow: 
                -20px 20px 60px rgba(0,0,0,0.15),
                -10px 10px 25px rgba(0,0,0,0.1),
                0 0 0 1px rgba(0,0,0,0.03);
        }
    </style>
</head>
<body>
    <div id="wrapper">
        ${imageTags}
    </div>
</body>
</html>
`;
};

async function processImages() {
    if (!fs.existsSync(config.INPUT_DIR)) return;
    const files = fs.readdirSync(config.INPUT_DIR).filter(f => ['.png', '.jpg', '.jpeg'].includes(path.extname(f).toLowerCase()));
    
    if (files.length < 2) {
        console.log("Not enough images found. The Zoom Tilt mockup requires at least 2 images.");
        return;
    }

    console.log(`Generating Zoom Tilt Mockup using 2 images...`);
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 2560, height: 1600, deviceScaleFactor: 2 });

    const inputPaths = files.slice(0, 2).map(f => path.join(config.INPUT_DIR, f));
    const base64Images = inputPaths.map(getBase64Image);
    const outputPath = path.join(outputDir, "zoom_tilt_mockup.png");

    try {
        const htmlContent = htmlTemplate(base64Images);
        await page.setContent(htmlContent, { waitUntil: 'load' });
        const wrapper = await page.$('#wrapper');
        if (wrapper) {
            await wrapper.screenshot({ path: outputPath, omitBackground: true });
            console.log(`Saved Zoom Tilt: zoom_tilt_mockup.png`);
        }
    } catch (error) {
        console.error(`Error generating Zoom Tilt:`, error.message);
    }
    await browser.close();
}

processImages();
