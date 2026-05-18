# SaaS Mockup Generator

A Node.js utility script that uses Puppeteer to batch-process raw UI screenshots and convert them into beautiful, presentation-ready SaaS mockups. 

## Features
- **Batch Processing**: Automatically converts all `.png` and `.jpg` files from an input directory.
- **Beautiful Defaults**: Applies a modern linear-gradient background, generous padding, rounded corners, and a realistic multi-layered 3D box shadow.
- **No Local Server Required**: Injects images as Base64 data URIs directly into the headless browser.
- **Transparent Output**: Captures the wrapper element with a transparent background outside the gradient box.

## Installation

1. Ensure you have [Node.js](https://nodejs.org/) installed.
2. Clone or download this project.
3. Install the required dependencies:
   ```bash
   npm install
   ```

## Usage

1. **Prepare the Input Directory**:
   Run the script once to automatically generate the `input_images` and `output_images` folders:
   ```bash
   node generateMockups.js
   ```

2. **Add Your Screenshots**:
   Place your raw UI screenshots (`.png`, `.jpg`, `.jpeg`) into the newly created `input_images` directory.

3. **Generate Mockups**:
   Run the script again:
   ```bash
   node generateMockups.js
   ```

4. **View the Results**:
   Your finished, high-quality mockups will be saved in the `output_images` directory with their original filenames.

## Customization

You can easily tweak the styling by editing the `htmlTemplate` variable inside `generateMockups.js`.

- **Background Gradient**: Change the `background: linear-gradient(...)` property under `#wrapper`.
- **Padding**: Adjust the `padding: 80px;` property to add more or less space around your image.
- **Shadow & Border Radius**: Modify the `box-shadow` and `border-radius` properties under `#wrapper img`.
