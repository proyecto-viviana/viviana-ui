/**
 * Environment detection utilities.
 * These avoid direct references to process.env which can cause TypeScript issues in browser environments.
 */

/**
 * Check if we're running in a test environment.
 */
export function isTestEnv(): boolean {
  return typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.NODE_ENV === 'test';
}

/**
 * Check if we're running in a development environment (not production).
 */
export function isDevEnv(): boolean {
  return typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.NODE_ENV !== 'production';
}

/**
 * Check if we're running in production.
 */
export function isProdEnv(): boolean {
  return typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.NODE_ENV === 'production';
}
