import type { Attachment } from 'svelte/attachments';
import { trackAction } from '@nzz/et-utils-tracking';

/**
 * Setup tracking for the project
 * @param componentName The project name
 */
export const setupTracking = (componentName: string): Attachment => {
  return () => {
    trackAction(document.body, componentName, 'mount');
  };
};
