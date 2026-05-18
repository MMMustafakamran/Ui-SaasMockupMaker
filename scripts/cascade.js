const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const config = require('../config.js');

const outputDir = path.join(config.OUTPUT_DIR, 'cascade');
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
    const imageTags = images.slice(0, 3).map((base64, index) => `
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
            display: flex;
            position: relative;
            width: 2000px;
            height: 1200px;
            border-radius: 32px;
            overflow: hidden;
            box-sizing: border-box;
        }
        .mockup {
            position: absolute;
            border-radius: 16px;
            box-shadow: 
                -30px 30px 60px rgba(0,0,0,0.5),
                -15px 15px 30px rgba(0,0,0,0.3),
                0 0 0 1px rgba(255,255,255,0.05);
            transform: perspective(2000px) rotateY(-15deg) rotateX(5deg) rotateZ(-2deg);
            transform-style: preserve-3d;
        }
        .mockup img {
            border-radius: 16px;
            display: block;
            width: 1200px; 
            height: auto;
        }
        .img1 { top: 160px; left: 600px; z-index: 1; opacity: 0.85; }
        .img2 { top: 260px; left: 400px; z-index: 2; opacity: 0.95; }
        .img3 { top: 360px; left: 200px; z-index: 3; opacity: 1; }
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
    if (files.length === 0) return;

    console.log(`Generating Cascade Mockup using up to 3 images...`);
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 2560, height: 1600, deviceScaleFactor: 2 });

    const inputPaths = files.slice(0, 3).map(f => path.join(config.INPUT_DIR, f));
    const base64Images = inputPaths.map(getBase64Image);
    const outputPath = path.join(outputDir, "cascade_mockup.png");

    try {
        const htmlContent = htmlTemplate(base64Images);
        await page.setContent(htmlContent, { waitUntil: 'load' });
        const wrapper = await page.$('#wrapper');
        if (wrapper) {
            await wrapper.screenshot({ path: outputPath, omitBackground: true });
            console.log(`Saved Cascade: cascade_mockup.png`);
        }
    } catch (error) {
        console.error(`Error generating Cascade:`, error.message);
    }
    await browser.close();
}

processImages();
