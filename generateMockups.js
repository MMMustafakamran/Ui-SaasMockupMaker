const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

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

const htmlTemplate = (base64Image) => `
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
            /* Subtle, muted sage-grey gradient matching the reference */
            background: linear-gradient(135deg, #dce1d8 0%, #c8cdc4 100%);
            padding: 80px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: fit-content;
            height: fit-content;
            border-radius: 24px;
        }
        #wrapper img {
            border-radius: 16px;
            /* Soft, diffuse shadow matching the reference */
            box-shadow: 
                0 30px 60px -15px rgba(0, 0, 0, 0.15),
                0 15px 30px -10px rgba(0, 0, 0, 0.1),
                0 0 0 1px rgba(0, 0, 0, 0.03);
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
            const htmlContent = htmlTemplate(base64Image);

            await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

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
