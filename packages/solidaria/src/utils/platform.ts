/**
 * Platform detection utilities.
 * Based on @react-aria/utils platform detection.
 */

interface NavigatorWithUserAgentData extends Navigator {
  userAgentData?: {
    platform?: string;
  };
}

function getNavigator(): NavigatorWithUserAgentData | null {
  if (typeof window === "undefined" || window.navigator == null) return null;
  return window.navigator as NavigatorWithUserAgentData;
}

function testPlatform(re: RegExp): boolean {
  const nav = getNavigator();
  if (!nav) return false;
  return re.test(nav.platform || nav.userAgentData?.platform || "");
}

function testUserAgent(re: RegExp): boolean {
  const nav = getNavigator();
  return nav ? re.test(nav.userAgent) : false;
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
