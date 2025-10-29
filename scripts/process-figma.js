#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import { createReadStream } from 'fs';
import unzipper from 'unzipper';

const EXPORT_DIR = path.join(process.cwd(), 'export');
const TEMP_DIR = path.join(process.cwd(), 'temp');
const ASSETS_DIR = path.join(process.cwd(), 'src', 'assets');
const SRC_DIR = path.join(process.cwd(), 'src');
const TARGET_COMPONENT_NAME = 'Graphic.svelte';

async function findFirstZipFile() {
    const zipFiles = await glob('*.zip', { cwd: EXPORT_DIR });

    if (zipFiles.length === 0) {
        throw new Error('No zip files found in the export directory');
    }

    return path.join(EXPORT_DIR, zipFiles[0]);
}

async function processZipFile(zipPath) {
    // Ensure directories exist
    await fs.ensureDir(TEMP_DIR);
    await fs.ensureDir(ASSETS_DIR);
    await fs.ensureDir(SRC_DIR);

    // Clean temp directory
    await fs.emptyDir(TEMP_DIR);

    console.log(`Processing zip file: ${path.basename(zipPath)}`);
    console.log('Extracting zip file...');

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

    console.log('\nProcessing complete!');
    console.log(`- Svelte component moved to: ${targetSveltePath}`);
    console.log(`- ${imageFiles.length} images moved to: ${ASSETS_DIR}`);
    console.log('- Original zip file has been removed');
}

async function main() {
    try {
        await fs.ensureDir(EXPORT_DIR);
        const zipFile = await findFirstZipFile();
        await processZipFile(zipFile);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();
