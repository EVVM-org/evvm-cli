/**
 * Git Integration Utilities
 *
 * Provides functions for interacting with Git including:
 * - Git installation validation
 * - Submodule management
 * - Repository detection
 * - Direct contract cloning
 *
 * @module cli/utils/git
 */

import { $ } from "bun";
import { colors } from "../constants";
import { criticalErrorCustom, sectionSubtitle } from "./outputMesages";

/**
 * Checks if Git is installed
 *
 * @returns {Promise<boolean>} True if Git is installed and accessible
 */
export async function gitIsInstalled(): Promise<boolean> {
  try {
    await $`git --version`.quiet();
  } catch (error) {
    return false;
  }
  return true;
}

/**
 * Verifies that Git is installed and shows error if not
 *
 * @returns {Promise<void>}
 */
export async function verifyGitInstalled(): Promise<void> {
  if (!(await gitIsInstalled()))
    criticalErrorCustom(
      "Git installation not detected.",
      "Visit https://git-scm.com/downloads for installation instructions."
    );
}

/**
 * Updates Git submodules with initialization
 *
 * @returns {Promise<void>}
 */
export async function updateSubmodules(): Promise<void> {
  sectionSubtitle("Cloning EVVM Testnet Contracts");
  const init = Bun.spawn(["git", "submodule", "update", "--init", "--recursive", "--depth", "1", "--jobs", "4"], {
    stderr: "inherit",
    stdout: "inherit",
  });
  await init.exited;
  if (init.exitCode !== 0) throw new Error("git submodule update failed");

  const merge = Bun.spawn(["git", "submodule", "update", "--remote", "--merge"], {
    stderr: "inherit",
    stdout: "inherit",
  });
  await merge.exited;
  if (merge.exitCode !== 0) throw new Error("git submodule update --remote failed");
}

/**
 * Checks if current directory is a Git repository
 *
 * @returns {Promise<boolean>} True if current directory is a Git repository
 */
export async function isGitRepository(): Promise<boolean> {
  try {
    await $`git rev-parse --is-inside-work-tree`.quiet();
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Checks if EVVM contracts are already installed
 *
 * @returns {Promise<boolean>} True if lib/evvm/testnet directory exists
 */
export async function areContractsInstalled(): Promise<boolean> {
  try {
    const stat = await $`test -d lib/evvm/testnet`.quiet();
    return stat.exitCode === 0;
  } catch (error) {
    return false;
  }
}

/**
 * Clones EVVM testnet contracts repository directly
 * Used when not in a Git repository (e.g., bunx/npx installation)
 *
 * @returns {Promise<void>}
 */
export async function cloneContractsRepo(): Promise<void> {
  sectionSubtitle("Cloning EVVM Testnet Contracts");
  const proc = Bun.spawn(["git", "clone", "https://github.com/EVVM-org/testnet-Contracts", "lib/evvm/testnet"], {
    stderr: "inherit",
    stdout: "inherit",
  });
  await proc.exited;
  if (proc.exitCode !== 0) throw new Error("git clone failed");
}