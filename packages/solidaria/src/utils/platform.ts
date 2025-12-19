/**
 * Platform detection utilities.
 * Based on @react-aria/utils platform detection.
 */

function testPlatform(re: RegExp): boolean {
  return typeof window !== 'undefined' && window.navigator != null
    ? re.test(window.navigator.platform || (window.navigator as any).userAgentData?.platform || '')
    : false;
}

function testUserAgent(re: RegExp): boolean {
  return typeof window !== 'undefined' && window.navigator != null
    ? re.test(window.navigator.userAgent)
    : false;
}

export function isMac(): boolean {
  return testPlatform(/^Mac/i);
}

export function isIPhone(): boolean {
  return testPlatform(/^iPhone/i);
}

export function isIPad(): boolean {
  return testPlatform(/^iPad/i) || (isMac() && navigator.maxTouchPoints > 1);
}

export function isIOS(): boolean {
  return isIPhone() || isIPad();
}

export function isAppleDevice(): boolean {
  return isMac() || isIOS();
}

export function isWebKit(): boolean {
  return testUserAgent(/AppleWebKit/i) && !isChrome();
}

export function isChrome(): boolean {
  return testUserAgent(/Chrome/i);
}

export function isAndroid(): boolean {
  return testUserAgent(/Android/i);
}

export function isFirefox(): boolean {
  return testUserAgent(/Firefox/i);
}
