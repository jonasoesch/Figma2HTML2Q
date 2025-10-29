<script lang="ts">
  import type { AppProps } from '@interfaces/general';
  import qLogo from '@assets/q-logo.svg';
  import { elementIsReady } from './attachments/elementIsReady';
  import { setupTracking } from './attachments/setupTracking'
  import type { Attachment } from 'svelte/attachments';
  import Graphic from './Graphic.svelte'

  let { displayOptions, getEndpointResult, qDoc, resolveImage, resolvePath }: AppProps = $props();

  // TODO: Implement the 'qdocready' event in your custom code as soon as your app is ready to be displayed, the nzz splashscreen has a default duration, but we shouldn't wait for it to time out
  // The {@attach elementIsReady} does that, move it to the element whose existence should be tracked.

  // TODO: Add tracking to your element using the @nzz/et-utils-tracking library
  // trackAction(document.body, 'custom-code-project', 'test-action');

  /** Example function that gets executed on mount, using the attachment technique.
   * https://svelte.dev/docs/svelte/@attach
   **/
  const loadResultOnMount: Attachment = async () => {
    const result = await getEndpointResult('test', { query: {} });
    console.log('getEndpointResult', result);
  }

</script>

<app-container class="supports-dark-mode"
               {@attach loadResultOnMount}
               {@attach elementIsReady}
               {@attach setupTracking('your-project-name')}>
  <!-- Remove "supports-dark-mode" class if your app requires a white background in dark mode. -->
  <!-- Add `setMarginProperty` utility function if you need to set the top and bottom margins to avoid the app's UI elements. -->
  <img src={qLogo} alt="Q Logo" />
  <Graphic {resolveImage} />
</app-container>

<style lang="scss">
  @use 'styles' as *;

  $image-size: 100px;

  app-container {
    @include example-mixin;

    //region ############### Header and action bar heights ####################

    // TODO Delete this region if you don't have to deal with sticky or full screen elements

    // For taking the header into account, use `var(--safe-zone-block-start, 0)`
    // For taking a possible footer element into account, use `var(--safe-zone-block-end, 0)`
    // Add these values to your styles whenever you need to avoid the UI elements of the website or app, like
    // .sticky {
    //    display: sticky;
    //    top: var(--safe-zone-block-start, 0);
    // }

    // The app currently does not provide these values, we still have to synthesise/guess them ourselves.
    // Add `setMarginProperty` utility function if you need to set the top and bottom margins to avoid the app's UI elements.

    //endregion

    //region ####################### Inline Margins ###########################

    // Custom Code embedded in content- and container-width will have side margins.

    // Custome Code embedded in full-width size will expand to the sides and be flush
    // with the container or the window.

    // Should you need to add side margins, you can use
    // margin-inline: var(--inline-spacing, 24px);

    // To override existing margins, use
    // margin-inline: calc(-1 * var(--inline-spacing, 24px));

    //endregion

    //region ########################### Fonts ################################

    // The new, React-based frontend uses the sans-serif font as a default;
    // the old one will fall back to the serif one if you don't define a font yourself.

    // You can use the following custom properties to get the correct font families and fallbacks:
    // var(--font-family-sans); (for GT America)
    // var(--font-family-serif); (for Pensum Pro)
    // var(--font-family-serif-alt); (for Pensum Pro Display, the title font used in longform articles)

    // Also note that none of these fonts support a font-weight > 500,
    // they are all capped at medium weight.
    strong, b {
      font-weight: 500;
    }

    // When setting your own weights, use
    // 300: Light
    // 400: Regular
    // 500: Medium Weight

    // Avoid `weight: bold`, as this corresponds to weight 700.
    // If you do use weights > 500, browsers will fake ("synthesise") the bold weight, and it will look like piss.

    //endregion

    h2,
    p,
    pre {
      color: $lachs;
      // Logical values, should by transformed by postcss-preset-env
      margin-block: 1rlh;
    }

    pre {
      text-align: start;
    }

    img {
      width: $image-size;
      height: $image-size;
    }
  }
</style>
