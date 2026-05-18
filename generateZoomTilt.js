const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const inputDir = path.join(__dirname, 'input_images');
const outputDir = path.join(__dirname, 'output_images', 'zoom_tilt');

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
    // Generate HTML for exactly 2 images
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
            /* Soft, light silver background from the reference */
            background: linear-gradient(135deg, #e3e4e6 0%, #f4f5f7 100%);
            display: block;
            position: relative;
            /* Fixed canvas size that cuts off the bottom/right for the zoomed crop effect */
            width: 1600px;
            height: 1200px;
            overflow: hidden;
            border-radius: 24px;
        }
        .mockup {
            position: absolute;
            border-radius: 16px;
            /* Soft, diffuse shadow matching the reference */
            box-shadow: 
                -30px 30px 80px rgba(0,0,0,0.15),
                -10px 10px 30px rgba(0,0,0,0.05),
                0 0 0 1px rgba(0,0,0,0.03);
            /* The signature flat diagonal tilt */
            transform: rotate(-10deg);
        }
        .mockup img {
            display: block;
            border-radius: 16px;
            /* Make the image massive so the outer wrapper naturally crops out the right and bottom */
            width: 2400px; 
            height: auto;
        }
        /* Positioning to focus on the top-left edges */
        /* Shifted right so the top-left corner of img1 stays completely inside the frame */
        .img1 { top: 50px; left: 150px; z-index: 1; }
        .img2 { top: 350px; left: 1150px; z-index: 2; }
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
    
    if (files.length < 2) {
        console.log("Not enough images found. The Zoom Tilt mockup requires at least 2 images.");
        return;
    }

    console.log(`Generating Zoom Tilt Mockup using 2 images...`);
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 2560, height: 1600, deviceScaleFactor: 2 });

    const inputPaths = files.slice(0, 2).map(f => path.join(inputDir, f));
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
