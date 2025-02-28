/**
 * Global state for Styx runners.
 */

import { DryRunner } from './dryRunner';
import { Runner } from './types';

/**
 * Global runner instance.
 */
let STYX_GLOBAL_RUNNER: Runner | null = null;

/**
 * Get the default runner.
 * @returns The global runner instance, creating a LocalRunner if none exists.
 */
export function getGlobalRunner(): Runner {
  if (STYX_GLOBAL_RUNNER === null) {
    STYX_GLOBAL_RUNNER = new DryRunner();
  }
  return STYX_GLOBAL_RUNNER;
}

/**
 * Set the default runner.
 * @param runner - The runner to set as the global runner.
 */
export function setGlobalRunner(runner: Runner): void {
  STYX_GLOBAL_RUNNER = runner;
}
