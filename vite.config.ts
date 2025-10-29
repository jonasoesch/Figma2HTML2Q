import { resolve } from 'node:path';
import { defineConfig, PluginOption, type BuildOptions } from 'vite';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { createFullwidthQElement, getHtml } from '@nzz/nzz.ch-static';
import qConfig from './q.config.json';

const production = process.env.NODE_ENV === 'production';
const LAYOUT = process.env.LAYOUT;

type OutputOptions = BuildOptions['rollupOptions']['output'];

interface Environment {
  id: string;
  name: string;
}

interface QConfigItem {
  environments: Environment[];
}

// Generates separate bundles for each q-item referenced in q.config.json.
function generateOutputOptions() {
  const options: OutputOptions[] = [];
  for (const item of qConfig.items as QConfigItem[]) {
    for (const environment of item.environments) {
      if (process.env.Q_ENV !== undefined && process.env.Q_ENV !== environment.name) continue; // Skip if the environment name does not match the Q_ENV variable.
      if (environment.id === '') continue; // Skip if the environment id is not set.

      options.push({
        format: 'iife',
        name: `window._q_custom_code_${environment.id}`, // The name of the global variable that will be used to access the named exports of main-prod.ts.
        entryFileNames: `bundle-${environment.id}.js`, // The name of the output file.
        extend: true, // Prevents overwriting existing props of the global variable.
        exports: 'named', // The named exports of main-prod.ts will be available on the global variable.
        // Replace the default css file name with our own.
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            // TODO: Replace with id based css file name after custom-code is updated in Qv2 Editor
            // return `bundle-${environment.id}.css`;
            return `bundle.css`;
          }
          return assetInfo.name || '';
        },
      });
    }
  }
  return options;
}

// Solves the issue of vite not wrapping all the code in an IIFE, which can lead to bundles overriding each other.
// see this issue for a similar problem: https://github.com/vitejs/vite/issues/16443
// workaround is from here: https://github.com/vitejs/vite/issues/17608#issue-2388013526
function viteWrapCodeInIIFE(): PluginOption {
  return {
    name: 'vite-wrap-code-in-iife',
    apply: 'build',
    enforce: 'post',
    generateBundle(outputOptions, bundle) {
      for (const [fileName, chunkOrAsset] of Object.entries(bundle)) {
        const isJsBundle = fileName.startsWith('bundle-') && fileName.endsWith('.js');

        if (chunkOrAsset.type === 'chunk' && isJsBundle) {
          chunkOrAsset.code = `(function(){${chunkOrAsset.code}})();`;
        }
      }
    },
  };
}

// Adds the layout to the html file in local development.
const htmlLayout = {
  name: 'html-layout',
  transformIndexHtml() {
    const transformedHtml = getHtml({
      // @ts-expect-error nzz.ch-static types are not up to date.
      layout: LAYOUT,
      builtCssFilename: null,
      builtJsFilename: null,
      content: createFullwidthQElement('custom-code-fw'),
      author: 'NZZ Visuals',
      lead: 'LEAD',
      title: 'TITLE',
      customCssLinks: [
        'https://service.sophie.nzz.ch/bundle/sophie-q@^1,sophie-input@^1,sophie-font@^1,sophie-color@^1,sophie-viz-color@^1,sophie-legend@^1.css',
      ],
    });

    return transformedHtml.replace('</body>', '<script type="module" src="/src/main.ts"></script></body>');
  },
} as PluginOption;

export default defineConfig({
  plugins: [
    svelte({
      preprocess: vitePreprocess(),
      emitCss: true,
      compilerOptions: {
        dev: !production,
      },
    }),
    !production && htmlLayout, // Adds the layout to the html file in local development.
    viteWrapCodeInIIFE(),
  ],
  build: {
    lib: {
      entry: './src/main-prod.ts',
    },
    sourcemap: !production,
    rollupOptions: {
      output: generateOutputOptions(),
    },
    cssCodeSplit: false,
    commonjsOptions: { include: [] },
  },
  optimizeDeps: {
    include: ['svelte', 'dayjs'],
  },
  server: {
    port: 5555,
    host: '0.0.0.0',
    watch: {
      usePolling: true,
    },
  },
  css: {},
  resolve: {
    conditions: ['module', 'browser', 'development', 'production'],
    alias: {
			'@src': resolve(__dirname, './src'),
			'@interfaces': resolve(__dirname, './src/interfaces'),
			'@assets': resolve(__dirname, './src/assets'),
    },
  },
});
