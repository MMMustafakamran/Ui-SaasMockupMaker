const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const config = require('../config.js');

const outputDir = path.join(config.OUTPUT_DIR, 'flat');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function getBase64Image(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    let mimeType = 'image/png';
    if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
    return `data:${mimeType};base64,${fs.readFileSync(filePath).toString('base64')}`;
}

const htmlTemplate = (base64Image) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body, html { margin: 0; padding: 0; display: inline-block; background: transparent; }
        #wrapper {
            background: ${config.BACKGROUND_GRADIENT};
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
    if (!fs.existsSync(config.INPUT_DIR)) return;
    const files = fs.readdirSync(config.INPUT_DIR).filter(f => ['.png', '.jpg', '.jpeg'].includes(path.extname(f).toLowerCase()));
    if (files.length === 0) return;

    console.log(`Found ${files.length} images to process for Flat Mockup.`);
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

    for (const file of files) {
        const inputPath = path.join(config.INPUT_DIR, file);
        const outputPath = path.join(outputDir, file);
        console.log(`Processing Flat: ${file}...`);

        try {
            const base64Image = getBase64Image(inputPath);
            const htmlContent = htmlTemplate(base64Image);
            await page.setContent(htmlContent, { waitUntil: 'load' });
            const wrapper = await page.$('#wrapper');
            if (wrapper) {
                await wrapper.screenshot({ path: outputPath, omitBackground: true });
                console.log(`Successfully saved: ${file}`);
            }
        } catch (error) {
            console.error(`Error processing ${file}:`, error.message);
        }
    }
    await browser.close();
}

processImages();
