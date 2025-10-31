# Figma2Q to Q

This repository represents a custom code element for our tool Q. It is the way in which we publish charts, infographics and interactives into our CMS.

The workflow should be as follows:

1. We export a Svelte component from Figma. The export is in the form of a zipped folder containing a *.svelte file and a folder with images.
2. We first require a script that extracts these files, copies the images into the assets folder and the Svelte file into src. The svelte file should be renamed to Graphic.svelte
3. Replace the array item > assetGroups > assets in q.config.json with the paths of the extracted images.

Then make a Github Action out of it:
1. Find out how to trigger a GHA by calling some sort of API. Is it possible?
2. Adapt Figma2HTML so that instead of saving the Zip file, you can send it to an URL - together with Parameters -> Q-Element-ID
3. Set up the GHA so that when it is called with a ZIP and params, it then runs the extractor and runs q-update


## Code guidelines

We use pnpm.
