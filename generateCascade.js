const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const inputDir = path.join(__dirname, 'input_images');
const outputDir = path.join(__dirname, 'output_images', 'cascade');

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
    // Generate HTML for up to 3 images
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
            background: linear-gradient(135deg, #1e1e24 0%, #111115 100%);
            padding: 150px;
            display: flex;
            position: relative;
            /* Set fixed dimensions based on cascade spread */
            width: 1600px;
            height: 1200px;
            border-radius: 32px;
            overflow: hidden;
            perspective: 2000px;
        }
        .mockup {
            position: absolute;
            border-radius: 16px;
            box-shadow: 
                -30px 30px 60px rgba(0,0,0,0.5),
                -15px 15px 30px rgba(0,0,0,0.3),
                0 0 0 1px rgba(255,255,255,0.05);
            /* Slightly tilt them for a dynamic floating feel */
            transform: rotateX(15deg) rotateY(-15deg) rotateZ(5deg);
            transform-style: preserve-3d;
            transition: all 0.3s ease;
        }
        .mockup img {
            border-radius: 16px;
            display: block;
            width: 900px; /* Fixed width to make them uniform */
            height: auto;
        }
        /* Beautiful overlapping diagonal stack */
        .img1 { top: 100px; left: 600px; z-index: 1; opacity: 0.6; }
        .img2 { top: 200px; left: 400px; z-index: 2; opacity: 0.85; }
        .img3 { top: 300px; left: 200px; z-index: 3; opacity: 1; }
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
    if (!fs.existsSync(inputDir)) return;
    const files = fs.readdirSync(inputDir).filter(f => ['.png', '.jpg', '.jpeg'].includes(path.extname(f).toLowerCase()));
    
    if (files.length === 0) {
        console.log("No images found for cascade.");
        return;
    }

    console.log(`Generating Cascade Mockup using up to 3 images...`);
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 2560, height: 1600, deviceScaleFactor: 2 });

    const inputPaths = files.slice(0, 3).map(f => path.join(inputDir, f));
    const base64Images = inputPaths.map(getBase64Image);
    const outputPath = path.join(outputDir, "cascade_mockup.png");

    try {
        const htmlContent = htmlTemplate(base64Images);
        await page.setContent(htmlContent, { waitUntil: 'load' }); // Fix for timeout error
        const wrapper = await page.$('#wrapper');
        if (wrapper) {
            await wrapper.screenshot({ path: outputPath, omitBackground: true });
            console.log(`Saved Cascade: cascade_mockup.png`);
        }
    } catch (error) {
        console.error(`Error generating cascade:`, error.message);
    }
    
    await browser.close();
}

processImages();
