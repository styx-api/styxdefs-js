/**
 * Dry runner for debugging purposes.
 */

import { Execution, InputPathType, Metadata, OutputPathType, Runner } from './types';

/**
 * Dry runner for debugging purposes.
 */
export class DryRunner implements Runner, Execution {
  /**
   * Last command arguments.
   */
  lastCargs: string[] | null = null;

  /**
   * Last metadata.
   */
  lastMetadata: Metadata | null = null;

  /**
   * Last parameters.
   */
  lastParams: object | null = null;

  /**
   * Create new dry runner.
   */
  constructor() {
    this.lastCargs = null;
    this.lastMetadata = null;
    this.lastParams = null;
  }

  /**
   * Start execution.
   *
   * @param metadata - Tool metadata.
   * @returns This execution instance.
   */
  startExecution(metadata: Metadata): Execution {
    this.lastMetadata = metadata;
    return this;
  }

  /**
   * Resolve input file.
   *
   * @param hostFile - The input file path on the host system.
   * @param resolveParent - If true, resolve the parent directory of the input file.
   * @param mutable - If true, the input file may be written to during execution.
   * @returns The input file path as a string.
   */
  inputFile(
    hostFile: InputPathType,
    resolveParent: boolean = false,
    mutable: boolean = false
  ): string {
    return hostFile.toString();
  }

  /**
   * Resolve output file.
   *
   * @param localFile - The local file path.
   * @param optional - If true, the output file is optional.
   * @returns The output file path.
   */
  outputFile(localFile: string, optional: boolean = false): OutputPathType {
    return localFile;
  }

  /**
   * Process tool parameters.
   *
   * @param params - Tool parameters.
   * @returns The same parameters, unmodified.
   */
  params<T extends object>(params: T): T {
    this.lastParams = params;
    return params;
  }

  /**
   * Execute command (in this dry runner this only captures the arguments).
   *
   * @param cargs - A list of command arguments.
   * @param handleStdout - If defined, would handle stdout in a real runner.
   * @param handleStderr - If defined, would handle stderr in a real runner.
   */
  run(
    cargs: string[],
    _handleStdout: ((output: string) => void) | null = null,
    _handleStderr: ((output: string) => void) | null = null
  ): void {
    this.lastCargs = cargs;
  }
}
