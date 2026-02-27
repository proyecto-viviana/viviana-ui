/**
 * Environment detection utilities.
 * These avoid direct references to process.env which can cause TypeScript issues in browser environments.
 * Compatible with Node.js, Deno, and Vite environments.
 */

// Type-safe access to import.meta.env (Vite) and Deno.env
declare const Deno: { env?: { get(key: string): string | undefined } } | undefined;
type ImportMetaWithEnv = ImportMeta & { env?: Record<string, unknown> & { DEV?: boolean; PROD?: boolean } };
type ProcessLike = { env?: Record<string, string | undefined> };

function getEnvVar(key: string): string | undefined {
  // Check Vite's import.meta.env
  const importMetaEnv = (import.meta as ImportMetaWithEnv).env;
  if (importMetaEnv && typeof importMetaEnv[key] === 'string') {
    return importMetaEnv[key] as string;
  }
  // Check Deno
  if (typeof Deno !== 'undefined' && Deno.env) {
    return Deno.env.get(key);
  }
  // Check Node.js process.env via globalThis
  const processEnv = (globalThis as typeof globalThis & { process?: ProcessLike }).process?.env;
  if (processEnv) {
    return processEnv[key];
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
  const importMetaEnv = (import.meta as ImportMetaWithEnv).env;
  if (importMetaEnv?.DEV === true) {
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
  const importMetaEnv = (import.meta as ImportMetaWithEnv).env;
  if (importMetaEnv?.PROD === true) {
    return true;
  }
  return getEnvVar('NODE_ENV') === 'production';
}
