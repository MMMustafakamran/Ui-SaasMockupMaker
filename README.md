# SaaS Mockup Generator Pro

A Node.js utility suite that uses Puppeteer to batch-process raw UI screenshots and convert them into presentation-ready SaaS marketing graphics.

## Features
- **Batch Processing**: Automatically converts all `.png` and `.jpg` files from an input directory.
- **Multiple Presentation Styles**: Generate flat, cascading (multi-page), or 3D isometric mockups.
- **No Local Server Required**: Injects images as Base64 data URIs directly into the headless browser.
- **Transparent Output**: Captures the wrapper element with a transparent background for easy compositing.

## Installation

1. Ensure you have [Node.js](https://nodejs.org/) installed.
2. Clone or download this project.
3. Install the required dependencies:
   ```bash
   npm install
   ```

## Usage

Place your raw UI screenshots (`.png`, `.jpg`, `.jpeg`) into the `input_images` directory. If the directory doesn't exist, running any script will automatically create it.

All generated graphics will be saved in organized folders inside the `output_images` directory.

### 🚀 Run All Generators (Master Script)
To generate the Flat, Cascade, and Isometric variations for your images all at once in a single command, run:
```bash
node generateAll.js
```

---

### Run Individual Generators

You can also run specific styles individually:

**1. Flat & Clean Mockup**
Creates a clean, flat mockup on a soft sage background with rounded corners and a diffuse shadow.
```bash
node generateMockups.js
```

**2. Multi-Page Cascade Mockup**
Takes the first 3 images from your input folder and composites them into a stunning overlapping "deck of cards" stacked layout.
```bash
node generateCascade.js
```

**3. 3D Isometric Mockup**
Applies a true 3D perspective tilt and thick extruded shadow to your screenshots, resting them on a premium surface.
```bash
node generateIsometric.js
```

**4. Zoom Tilt Mockup**
Creates a zoomed-in, overlapped display of 2 images featuring a signature 10-degree flat tilt, mimicking modern UI designer portfolios.
```bash
node generateZoomTilt.js
```

## Troubleshooting
If you encounter a `Navigation timeout of 30000 ms exceeded` error, this just means Puppeteer took a little too long to render a large high-resolution image. Simply re-run the script or the specific command that failed, and it will pick up where it left off!
