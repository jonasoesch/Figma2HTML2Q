import type { Attachment } from 'svelte/attachments';

/**
 * Svelte attachment, use to trigger the qdocreadyEvent.
 */
export const elementIsReady: Attachment = () => {
  const qdocreadyEvent = new Event('qdocready');
  document.dispatchEvent(qdocreadyEvent);
};
