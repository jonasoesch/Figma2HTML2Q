# Figma2Q to Q

This repository represents a custom code element for our tool Q. It is the way in which we publish charts, infographics and interactives into our CMS.

The workflow should be as follows:

1. We export a Svelte component from Figma. The export is in the form of a zipped folder containing a \*.svelte file and a folder with images.
2. We first require a script that extracts these files, copies the images into the assets folder and the Svelte file into src. The svelte file should be renamed to Graphic.svelte
3. Replace the array item > assetGroups > assets in q.config.json with the paths of the extracted images.

Then publish it via a Github Action:

1. Modify Figma2HTML to upload the Zip-File to Supabase
   - Most of the work is done in App.svelte 'publish'
   - Files with the same name get overwritten
   - The Supabase Key to do this is currently stored in env.ts and sent from the Figma Plugin. Some security concerns with this
2. Get the Zip-file URL from Supabase
3. Add a field to the plugin to add a Q-Url
4. POST the ZIP-Url and the Q-ID to a lightweight proxy on Supabase
   - https://owklekxndbvsydxkzmyt.supabase.co/functions/v1/GHA-proxy
   - Deactivated JWT secret
   - Added my own Token. In 1PW "Supabase Figma2HTML2Q Token
   - Allow Origin: null -> Figma does that
5. The Proxy on Supabase calls the GH Action on https://github.com/jonasoesch/Figma2HTML2Q/
   - On my personal GH. Move to nzzdev
   - Make package installation faster. It takes 30–40s to run the Action
   - Currently only with q-production

TODO:

- Brutally hardcoded a replace for 'nzz-q-assets2'
-

## Code guidelines

We use pnpm.
