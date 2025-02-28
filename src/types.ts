/**
 * Input host file type.
 */
export type InputPathType = string;

/**
 * Output host file type.
 */
export type OutputPathType = string;

/**
 * Execution object used to execute commands.
 *
 * Created by `Runner.startExecution()`.
 */
export interface Execution {
  /**
   * Resolve host input files.
   *
   * @param hostFile - The input file path on the host system.
   * @param resolveParent - If true, resolve the parent directory of the input file.
   * @param mutable - If true, the input file may be written to during execution.
   * @returns A local filepath.
   *
   * Note:
   *   Called (potentially multiple times) after
   *   `Runner.startExecution()` and before `Runner.run()`.
   */
  inputFile(hostFile: InputPathType, resolveParent?: boolean, mutable?: boolean): string;

  /**
   * Resolve local output files.
   *
   * @param localFile - The local file path.
   * @param optional - If true, the output file is optional.
   * @returns A host filepath.
   *
   * Note:
   *   Called (potentially multiple times) after all
   *   `Runner.inputFile()` calls.
   */
  outputFile(localFile: string, optional?: boolean): OutputPathType;

  /**
   * Process tool parameters.
   *
   * This is called by wrappers once before command-line arguments are built.
   * Parameters may be logged, cached, or modified.
   *
   * @param params - Tool parameters.
   * @returns Processed parameters.
   */
  params<T extends object>(params: T): T;

  /**
   * Run the command.
   *
   * @param cargs - A list of command arguments.
   * @param handleStdout - If defined the runner must forward stdout output to this (may be called multiple times).
   * @param handleStderr - If defined the runner must forward stderr output to this (may be called multiple times).
   *
   * Note:
   *   Called after all `Execution.inputFile()`
   *   and `Execution.outputFile()` calls.
   */
  run(
    cargs: string[],
    handleStdout?: (output: string) => void,
    handleStderr?: (output: string) => void
  ): void;
}

/**
 * Static tool metadata.
 *
 * This is structured static metadata that is known at compile time.
 * Runners can use this to set up execution environments.
 */
export interface Metadata {
  /**
   * Unique identifier of the tool.
   */
  id: string;

  /**
   * Name of the tool.
   */
  name: string;

  /**
   * Name of the package that provides the tool.
   */
  package: string;

  /**
   * List of references to cite when using the tool.
   */
  citations?: string[];

  /**
   * Name of an image where the tool is installed and configured.
   * Example: bids/mriqc.
   */
  container_image_tag?: string;
}

/**
 * Runner object used to execute commands.
 *
 * Possible examples would be `LocalRunner`,
 * `DockerRunner`, `DryRunner`, ...
 * Used as a factory for `Execution` objects.
 */
export interface Runner {
  /**
   * Start an execution.
   *
   * @param metadata - Static tool metadata.
   * @returns An Execution object.
   *
   * Note:
   *   Called before any `Execution.inputFile()` calls.
   */
  startExecution(metadata: Metadata): Execution;
}

/**
 * Styx runtime error.
 *
 * Raised when a command reports a non-zero return code.
 */
export class StyxRuntimeError extends Error {
  /**
   * The return code of the failed command.
   */
  returnCode?: number;

  /**
   * The arguments of the failed command.
   */
  commandArgs?: string[];

  /**
   * Initialize the error.
   *
   * @param returnCode - The return code of the failed command.
   * @param commandArgs - The arguments of the failed command.
   * @param messageExtra - Additional error message.
   */
  constructor(returnCode?: number, commandArgs?: string[], messageExtra?: string) {
    let message = '';

    if (returnCode !== undefined) {
      message = `Command failed with return code ${returnCode}.`;
    } else {
      message = 'Command failed.';
    }

    if (commandArgs !== undefined) {
      message += `\n- Command args: ${commandArgs
        .map((arg) => {
          // Simple implementation of shlex.join
          if (arg.includes(' ') || arg.includes('"') || arg.includes("'")) {
            return `"${arg.replace(/"/g, '\\"')}"`;
          }
          return arg;
        })
        .join(' ')}`;
    }

    if (messageExtra !== undefined) {
      message += `\n${messageExtra}`;
    }

    super(message);

    this.name = 'StyxRuntimeError';
    this.returnCode = returnCode;
    this.commandArgs = commandArgs;

    Object.setPrototypeOf(this, StyxRuntimeError.prototype);
  }
}
