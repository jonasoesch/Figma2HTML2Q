<script lang="ts">
  import type { AppProps } from '@interfaces/general';
  import qLogo from '@assets/q-logo.svg';
  import { elementIsReady } from './attachments/elementIsReady';
  import { setupTracking } from './attachments/setupTracking';
  import type { Attachment } from 'svelte/attachments';
  import Graphic from './Graphic.svelte';

  let { displayOptions, getEndpointResult, qDoc, resolveImage, resolvePath }: AppProps = $props();

  // TODO: Implement the 'qdocready' event in your custom code as soon as your app is ready to be displayed, the nzz splashscreen has a default duration, but we shouldn't wait for it to time out
  // The {@attach elementIsReady} does that, move it to the element whose existence should be tracked.

  // TODO: Add tracking to your element using the @nzz/et-utils-tracking library
  // trackAction(document.body, 'custom-code-project', 'test-action');

  /** Example function that gets executed on mount, using the attachment technique.
   * https://svelte.dev/docs/svelte/@attach
   **/
  const loadResultOnMount: Attachment = async () => {};
</script>

<app-container
  class="supports-dark-mode"
  {@attach loadResultOnMount}
  {@attach elementIsReady}
  {@attach setupTracking('your-project-name')}
>
  <!-- Remove "supports-dark-mode" class if your app requires a white background in dark mode. -->
  <!-- Add `setMarginProperty` utility function if you need to set the top and bottom margins to avoid the app's UI elements. -->
  <Graphic {resolveImage} />
</app-container>
