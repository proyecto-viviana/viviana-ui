/**
 * Environment detection utilities.
 * These avoid direct references to process.env which can cause TypeScript issues in browser environments.
 */
/**
 * Check if we're running in a test environment.
 */
export declare function isTestEnv(): boolean;
/**
 * Check if we're running in a development environment (not production).
 */
export declare function isDevEnv(): boolean;
/**
 * Check if we're running in production.
 */
export declare function isProdEnv(): boolean;
//# sourceMappingURL=env.d.ts.map