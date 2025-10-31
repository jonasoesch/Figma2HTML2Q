#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import { createReadStream } from 'fs';
import unzipper from 'unzipper';
import fetch from 'node-fetch';

const CONFIG_PATH = path.join(process.cwd(), 'q.config.json');
const TEMP_DIR = path.join(process.cwd(), 'temp');
const ASSETS_DIR = path.join(process.cwd(), 'src', 'assets');
const SRC_DIR = path.join(process.cwd(), 'src');
const TARGET_COMPONENT_NAME = 'Graphic.svelte';

async function downloadZipFile(zipUrl) {
    console.log('Downloading ZIP file...');
    const response = await fetch(zipUrl);

    if (!response.ok) {
        throw new Error(`Failed to download ZIP file: ${response.statusText}`);
    }

    // Create temp directory if it doesn't exist
    await fs.ensureDir(TEMP_DIR);

    const zipPath = path.join(TEMP_DIR, 'download.zip');
    const fileStream = fs.createWriteStream(zipPath);

    await new Promise((resolve, reject) => {
        response.body.pipe(fileStream)
            .on('finish', resolve)
            .on('error', reject);
    });

    return zipPath;
}

async function processZipFile(zipPath, id) {
    // Ensure directories exist
    await fs.ensureDir(TEMP_DIR);
    await fs.ensureDir(ASSETS_DIR);
    await fs.ensureDir(SRC_DIR);

    // Clean temp directory (except for the downloaded zip)
    const zipFileName = path.basename(zipPath);
    const files = await fs.readdir(TEMP_DIR);
    for (const file of files) {
        if (file !== zipFileName) {
            await fs.remove(path.join(TEMP_DIR, file));
        }
    }

    console.log(`Processing zip file...`);

    // Extract zip file
    await new Promise((resolve, reject) => {
        createReadStream(zipPath)
            .pipe(unzipper.Extract({ path: TEMP_DIR }))
            .on('close', resolve)
            .on('error', reject);
    });

    console.log('Finding Svelte component...');

    // Find the Svelte component file
    const svelteFiles = await glob('**/*.svelte', { cwd: TEMP_DIR });

    if (svelteFiles.length === 0) {
        throw new Error('No Svelte component found in the zip file');
    }

    if (svelteFiles.length > 1) {
        console.warn('Warning: Multiple Svelte components found. Using the first one.');
    }

    // Move the Svelte component
    const sourceSveltePath = path.join(TEMP_DIR, svelteFiles[0]);
    const targetSveltePath = path.join(SRC_DIR, TARGET_COMPONENT_NAME);

    console.log(`Moving Svelte component to ${targetSveltePath}...`);
    await fs.move(sourceSveltePath, targetSveltePath, { overwrite: true });

    // Find and move all images
    console.log('Moving images...');
    const imageFiles = await glob('**/*.{png,jpg,jpeg,gif,svg}', { cwd: TEMP_DIR });

    for (const imageFile of imageFiles) {
        const sourceImagePath = path.join(TEMP_DIR, imageFile);
        const targetImagePath = path.join(ASSETS_DIR, path.basename(imageFile));
        await fs.move(sourceImagePath, targetImagePath, { overwrite: true });
        console.log(`Moved: ${path.basename(imageFile)}`);
    }

    // Clean up
    await fs.remove(TEMP_DIR);

    // Update q.config.json with new image paths and ID
    console.log('Updating q.config.json...');
    const qConfig = await fs.readJSON(CONFIG_PATH);

    // Update the assets array in the first item's assetGroups
    if (qConfig.items?.[0]?.item?.assetGroups?.[0]) {
        qConfig.items[0].item.assetGroups[0].assets = imageFiles.map(file => ({
            path: `./src/assets/${path.basename(file)}`
        }));
    }

    // Update the production environment ID
    if (qConfig.items?.[0]?.environments?.[0]) {
        qConfig.items[0].environments[0].id = id;
    }

    await fs.writeJSON(CONFIG_PATH, qConfig, { spaces: 2 });
    console.log('- q.config.json updated with new image paths and ID');

    console.log('\nProcessing complete!');
    console.log(`- Svelte component moved to: ${targetSveltePath}`);
    console.log(`- ${imageFiles.length} images moved to: ${ASSETS_DIR}`);
    console.log(`- Production environment ID set to: ${id}`);
}

async function main() {
    try {
        const [,, zipUrl, id] = process.argv;

        if (!zipUrl || !id) {
            console.error('Usage: node process-figma.js <zip-url> <id>');
            process.exit(1);
        }

        const zipPath = await downloadZipFile(zipUrl);
        await processZipFile(zipPath, id);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();
