# Figma2Q to Q

This repository represents a custom code element for our tool Q. It is the way in which we publish charts, infographics and interactives into our CMS.

The workflow should be as follows:

1. We export a Svelte component from Figma. The export is in the form of a zipped folder containing a *.svelte file and a folder with images.
2. We first require a script that extracts these files, copies the images into the assets folder and the Svelte file into src. The svelte file should be renamed to Graphic.svelte
