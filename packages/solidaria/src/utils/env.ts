/**
 * Environment detection utilities.
 * These avoid direct references to process.env which can cause TypeScript issues in browser environments.
 * Compatible with Node.js, Deno, and Vite environments.
 */

// Type-safe access to import.meta.env (Vite) and Deno.env
declare const Deno: { env?: { get(key: string): string | undefined } } | undefined;

function getEnvVar(key: string): string | undefined {
  // Check Vite's import.meta.env
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    return (import.meta as any).env[key];
  }
  // Check Deno
  if (typeof Deno !== 'undefined' && Deno.env) {
    return Deno.env.get(key);
  }
  // Check Node.js process.env via globalThis
  if (typeof globalThis !== 'undefined' && (globalThis as any).process?.env) {
    return (globalThis as any).process.env[key];
  }
  return undefined;
}

/**
 * Check if we're running in a test environment.
 */
export function isTestEnv(): boolean {
  return getEnvVar('NODE_ENV') === 'test';
}

/**
 * Check if we're running in a development environment (not production).
 */
export function isDevEnv(): boolean {
  // Check Vite's DEV flag
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV) {
    return true;
  }
  const nodeEnv = getEnvVar('NODE_ENV');
  return nodeEnv !== 'production';
}

/**
 * Check if we're running in production.
 */
export function isProdEnv(): boolean {
  // Check Vite's PROD flag
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.PROD) {
    return true;
  }
  return getEnvVar('NODE_ENV') === 'production';
}
