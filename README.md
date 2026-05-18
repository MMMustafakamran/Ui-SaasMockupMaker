# SaaS Demo Graphics Generator

A professional Node.js & Puppeteer batch-processing pipeline that instantly converts raw UI screenshots into gorgeous, presentation-ready SaaS marketing assets.

## Project Structure

This project has been expertly organized for maximum simplicity and flexibility:

```text
/config.js           <-- Global configuration (Change background colors here)
/index.js            <-- The Master script to run everything
/input/              <-- Drop your raw screenshots (.png, .jpg) here
/output/             <-- Automatically generated folders for each mockup style
/scripts/            <-- The individual mockup generator engines
```

## How to Customize Styles

You can control the visual theme of the **entire pipeline** from one single file!
Open **`config.js`** at the root of the project. Here you can easily change the global `BACKGROUND_GRADIENT`. The file includes a list of 15 premium curated colors (Dark Sleek, Muted Sage, Cyberpunk Neon, etc.) that you can simply copy and paste.

## Setup & Installation

1. Make sure you have [Node.js](https://nodejs.org/) installed.
2. Install the necessary dependencies (Puppeteer):
```bash
npm install
```

## How to Generate Mockups

1. Place your raw screenshots into the **`input/`** folder.
2. Run the master script to generate all 4 styles at once:
```bash
node index.js
```
3. Check the **`output/`** folder! The images will be beautifully sorted into their respective style subdirectories.

### The 4 Generated Styles

**1. Flat Mockup (`output/flat`)**
A clean, elegant, straight-on presentation with soft diffused shadows and modern window rounding.

**2. Cascade Mockup (`output/cascade`)**
A multi-image "Deck of Cards" effect that beautifully stacks up to 3 screenshots with depth-of-field, tilt, and perspective.

**3. Zoom Tilt Mockup (`output/zoom_tilt`)**
Creates a highly zoomed-in, cropped display of 2 images featuring a signature 10-degree flat tilt, mimicking modern UI designer portfolios on Dribbble.

## Troubleshooting
If you encounter a `Navigation timeout of 30000 ms exceeded` error, this just means Puppeteer took a little too long to render a large high-resolution image. Simply re-run the script and it will pick up where it left off!
