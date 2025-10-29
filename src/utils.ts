export enum AppType {
	iPhone = 'iPhone',
	Android = 'Android',
	Other = 'Other',
}

export function getAppType() {
	const ua = navigator.userAgent.toLowerCase();
	const isAndroid = ua.indexOf('android') > -1;
	const isiPhone = ua.indexOf('iphone') > -1;
	const isApp = !!window.vamp; // Only available in the app

	if (isiPhone && isApp) {
		return AppType.iPhone;
	}

	if (isAndroid && isApp) {
		return AppType.Android;
	}

	return AppType.Other;
}

/**
 * Returns the safety top margin for the app.
 *
 * @returns The safety top margin in pixels.
 */
export function getAppHeaderMargin() {
	const appType = getAppType();

	if (appType === AppType.iPhone) {
		return 90;
	}

	if (appType === AppType.Android) {
		return 0;
	}

	// For other app types we currently have no information
	return;
}

/**
 * Returns the margin for the bottom bars in the apps
 * @returns The margin of the bottom bar in pixels.
 */
export function getAppFooterMargin() {
	const appType = getAppType();
	if (appType === AppType.iPhone) {
		return 78;
	}

	if (appType === AppType.Android) {
		return 85;
	}

	// For other app types we currently have no information
	return;
}

export enum SafeZone {
	Header = '--safe-zone-block-start',
	Footer = '--safe-zone-block-end',
}

/**
 * Sets the safe zone height to the correct value in pixels according to the app type in use.
 * The function can be used as an [attachement]{@link https://svelte.dev/docs/svelte/@attach}.
 *
 * @param blockType Which zone should be affected. Corresponds to the Custom Property name: '--safe-zone-block-start'
 *   or '--safe-zone-block-end'.
 * @returns A function that takes an HTML element as its parameter. The custom
 *   properties will be set on this element.
 *
 * @example
 * <app-container {@attach setMarginProperty('--safe-zone-block-start')}>
 *   …
 */
export const setMarginProperty =
	(blockType: SafeZone): ((element: HTMLElement) => void) =>
	(element: HTMLElement) => {
		// Don't set the property if we are not in a well defined environment
		if (getAppType() === AppType.Other) return;

		if (blockType === SafeZone.Header) {
			element.style.setProperty(blockType, `${getAppHeaderMargin()}px`);
		}

		if (blockType === SafeZone.Footer) {
			element.style.setProperty(blockType, `${getAppFooterMargin()}px`);
		}
	};
