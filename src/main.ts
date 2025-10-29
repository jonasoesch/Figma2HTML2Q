import App from '@src/App.svelte';
import { mount } from 'svelte';
import '@src/main.scss';
import type { GetEndpointResult, GetEndpointResultContext, ResolveImage, ResolvePath } from '@src/interfaces/general';

const getEndpointResult: GetEndpointResult = (key: string, context: GetEndpointResultContext) => {
  return new Promise((resolve) => {
    resolve({ value: 'test' });
  });
};

/**
 * Returns the image service URL for the given image name and source.
 *
 * Image is inside the asset group "images":
 * resolveImage("test.png", "assetGroups/images") -> "https://nzz-q-assets2.static-nzz.ch/[...]/test.png"
 *
 * Image is inside the files array:
 * resolveImage("test.png", "files") -> "https://nzz-q-assets2.static-nzz.ch/[...]/test.png"
 *
 * @param imageName The name of the image.
 * @param source The source of the image.
 * @returns The image service URL.
 */
const resolveImage: ResolveImage = (imageName: string, source: string) => {
  return imageName;
};

/**
 * Returns the CDN URL for the given file name and source.
 *
 * File is inside the asset group "jsonFiles":
 * resolvePath("test.json", {source: 'assetGroups/jsonFiles'})
 *
 * File is inside the files array:
 * resolvePath("test.json", {source: 'files'})
 * 
 * File is inside the custom schema OR you just need the proper CDN URL:
 * resolvePath("test.json", {source: 'customSchema'})
 * 
 * Result in all cases: "https://nzz-q-assets2.static-nzz.ch/[...]/test.json"
 *
 * @param fileName The name of the file.
 * @param options The options for the file.
 * @returns The file URL.
 */
const resolvePath: ResolvePath = (fileName: string, options: { source: string }) => {
  return fileName;
};

const displayOptions = {};

const target = document.querySelector('#custom-code-fw');

const app = mount(App, {
  target: target as Element,
  props: {
    displayOptions,
    getEndpointResult,
    qDoc: {}, // TODO import your example here
    resolveImage,
    resolvePath,
  },
});

export default app;
