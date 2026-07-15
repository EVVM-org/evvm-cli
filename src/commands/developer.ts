/**
 * Developer Utilities Command Module
 *
 * Provides development utilities for EVVM contributors including interface
 * generation, test execution, and other developer-focused tooling.
 *
 * @module cli/commands/developer
 */

import { $ } from "bun";
import { colors } from "../constants";
import { contractInterfacesGenerator, contractTesting } from "../utils/foundry";
import { verifyGitInstalled, updateSubmodules, isGitRepository, areContractsInstalled, cloneContractsRepo } from "../utils/git";
import { promptSelect, promptYesNo } from "../utils/prompts";
import { confirmation, seccionTitle, sectionSubtitle, warning } from "../utils/outputMesages";

/**
 * Developer utilities command handler
 *
 * Executes various developer utilities based on provided flags:
 * - Interface generation: Creates Solidity interfaces from contract implementations
 * - Full test suite execution (to be implemented)
 * - Service-specific tests (fuzz and unit) (to be implemented)
 * - Individual unit tests (to be implemented)
 * - Individual fuzz tests (to be implemented)
 *
 * @param {string[]} _args - Command arguments (unused, reserved for future use)
 * @param {any} options - Command options:
 *   - makeInterface: Generate Solidity interfaces for contracts (default: false)
 * @returns {Promise<void>}
 */
export async function developer(_args: string[], options: any) {
  let makeInterface = options.makeInterface || false;
  let runTest = options.runTest || false;

  seccionTitle("Developer Utilities");

  if (!makeInterface && !runTest) {
    const action = await promptSelect("Select an action:", [
      "Generate Contract Interfaces",
      "Run Full Test Suite",
      // Future options can be added here
      "exit",
    ]);

    switch (action) {
      case "Generate Contract Interfaces":
        makeInterface = true;
        break;
      case "Run Full Test Suite":
        runTest = true;
        break;
      case "exit":
        console.log(
          `${colors.green}Exiting developer utilities.${colors.reset}`
        );
        process.exit(0);
      default:
        console.log(
          `${colors.red}Invalid selection. Exiting developer utilities.${colors.reset}`
        );
        process.exit(1);
    }
  }

  if (makeInterface) await contractInterfacesGenerator();
  if (runTest) await contractTesting();
}


export async function installDependencies() {
  await verifyGitInstalled();
  
  const contractsInstalled = await areContractsInstalled();
  
  if (contractsInstalled) {
    const reinstall = await promptYesNo(
      "EVVM contracts are already installed. Do you want to reinstall them?",
      false
    );
    
    if (!reinstall) {
      warning("Skipping contract installation");
      sectionSubtitle("Installing EVVM CLI Dependencies");
      await $`bun install`;
      sectionSubtitle("Installing EVVM Contracts Dependencies");
      await $`bun install`.cwd("lib/evvm/testnet");
      sectionSubtitle("Installing EVVM Foundry Dependencies");
      await $`forge install`.cwd("lib/evvm/testnet");
      console.log();
      confirmation(`All dependencies installed successfully`);
      return;
    }
  }
  
  const isGitRepo = await isGitRepository();
  
  if (isGitRepo) {
    await updateSubmodules();
  } else {
    await cloneContractsRepo();
  }
  
  sectionSubtitle("Installing EVVM CLI Dependencies");
  const bunInstallCli = Bun.spawn(["bun", "install"], {
    stderr: "inherit",
    stdout: "inherit",
  });
  await bunInstallCli.exited;
  if (bunInstallCli.exitCode !== 0) throw new Error("bun install failed");

  sectionSubtitle("Installing EVVM Contracts Dependencies");
  const bunInstallContracts = Bun.spawn(["bun", "install"], {
    cwd: "lib/evvm/testnet",
    stderr: "inherit",
    stdout: "inherit",
  });
  await bunInstallContracts.exited;
  if (bunInstallContracts.exitCode !== 0) throw new Error("bun install in lib/evvm/testnet failed");

  sectionSubtitle("Installing EVVM Foundry Dependencies");
  const forgeInstall = Bun.spawn(["forge", "install"], {
    cwd: "lib/evvm/testnet",
    stderr: "inherit",
    stdout: "inherit",
  });
  await forgeInstall.exited;
  if (forgeInstall.exitCode !== 0) throw new Error("forge install failed");

  console.log();
  confirmation(`All dependencies installed successfully`);
}