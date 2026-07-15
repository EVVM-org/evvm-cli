# EVVM CLI

![Version](https://img.shields.io/badge/version-1.0.0-red.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)
![Bun](https://img.shields.io/badge/Runtime-Bun-000000?logo=bun)
[![license](https://img.shields.io/badge/license-EVVM--NONCOMMERCIAL--1.0-blue.svg)](LICENSE)
[![docs](https://img.shields.io/badge/docs-evvm.info-blue.svg)](https://www.evvm.info/)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

CLI tool for deploying and managing EVVM instances on testnets.

For the smart contracts library, see [EVVM-org/Testnet-Contracts](https://github.com/EVVM-org/Testnet-Contracts).

Docs: https://www.evvm.info/

## Requirements

Before deploying with the CLI, ensure you have the following installed:

- **Foundry** - [Install](https://getfoundry.sh/introduction/installation/)
- **Bun** (>= 1.0) - [Install](https://bun.sh/)
- **Git** - [Install](https://git-scm.com/downloads)

## Quick start (2 min)

### Option A: Using bunx/npx (No clone required)

Run the CLI directly without cloning the repository:

```bash
# Using Bun (recommended)
bunx @evvm/cli deploy

# Using npm/npx
npx @evvm/cli deploy
```

**Note:** The CLI will automatically:
- Check if Foundry and Git are installed
- Clone the EVVM contracts repository if needed
- Install all dependencies (bun, forge)

### Option B: Clone & install (For development)

1. Clone & install

```bash
git clone --recursive https://github.com/EVVM-org/evvm-cli
cd evvm-cli

# Install dependencies (clones contracts submodule + installs bun/forge deps)
bun run evvm install
```

2. Prepare environment

```bash
cp .env.example .env
# Edit RPC_URL, ETHERSCAN_API, etc.
```

3. Import wallet (secure)

```bash
cast wallet import defaultKey --interactive
```

4. Deploy (interactive)

If you are on Linux or macOS, run:

```bash
./evvm deploy
```

If you are on Windows, run on PowerShell:

```powershell
.\evvm.bat deploy
```

Or use Bun from any directory:

```bash
bun run evvm deploy
```

## CLI Scripts

The repository includes platform-specific wrapper scripts:

**Linux/macOS:**

```bash
# Make script executable (first time only)
chmod +x ./evvm

# Run any EVVM CLI command
./evvm deploy
./evvm register --coreAddress 0x...
./evvm developer --makeInterface
./evvm help
```

**Windows (PowerShell):**

```powershell
# Run any EVVM CLI command
.\evvm.bat deploy
.\evvm.bat register --coreAddress 0x...
.\evvm.bat developer --makeInterface
.\evvm.bat help
```

The scripts automatically detect your OS and architecture (x64, ARM64, MUSL) and execute the appropriate compiled binary from `.executables/` folder.

Quick Start: https://www.evvm.info/docs/QuickStart

## Available Commands

**Using bunx/npx:**
```bash
bunx @evvm/cli <command> [options]
# or
npx @evvm/cli <command> [options]
```

**Deployment & Registration:**

- `evvm deploy` - Deploy EVVM (single or cross-chain)
- `evvm deploy --skipInputConfig` - Deploy with existing config (no prompts)
- `evvm deploy --crossChain` - Deploy cross-chain EVVM instance
- `evvm register --coreAddress <addr>` - Register EVVM in registry
- `evvm register --crossChain` - Register cross-chain EVVM

**Cross-Chain Management:**

- `evvm setUpCrossChainTreasuries` - Configure treasury station connections

**Developer Utilities:**

- `evvm developer --makeInterface` - Generate Solidity interfaces from contracts
- `evvm developer --runTest` - Run test suites with custom filters
- `evvm install` - Install Bun and Foundry dependencies

**Information:**

- `evvm help` - Show comprehensive CLI help
- `evvm version` - Show CLI version

## Troubleshooting

- **RPC timeouts**: CLI automatically tries fallback RPCs; set `RPC_URL` in `.env` to a reliable endpoint.
- **Wallet not found**: import with `cast wallet import <name> --interactive`.
- **Bun missing**: install Bun (`curl -fsSL https://bun.sh/install | bash`).
- **Git missing**: install Git from [git-scm.com](https://git-scm.com/downloads).
- **Foundry missing**: install Foundry from [getfoundry.sh](https://getfoundry.sh/introduction/installation/).
- **Contracts not found**: when using `bunx`/`npx`, the CLI automatically clones the contracts repository and installs dependencies on first run.
- **Native binary fails (exit 126)**: if you see "cannot execute binary file" the wrapper will now try running the CLI via `bun run src/index.ts` automatically when Bun is available. This works as a fallback until correct platform-specific binaries are built.
- **Tests**: run `./evvm developer --runTest` (Linux/Mac) or `evvm.bat developer --runTest` (Windows).
- **Script not executable (Linux/Mac)**: run `chmod +x ./evvm` and ensure `.executables/` binaries have execute permissions.
- **Wrong architecture detected**: The wrapper scripts auto-detect OS/architecture. If issues occur, manually run the correct binary from `.executables/`.
- **Binaries built on the wrong host**: macOS and Windows executables must be compiled on their respective platforms. Building on Linux will produce a Linux ELF file regardless of the filename, which leads to "cannot execute binary file" errors on macOS. Use `npm run build-macos` on a Mac and `npm run build-windows` on Windows, or rely on the Bun fallback described below.

## Project Structure

- `src/` - TypeScript CLI source code
- `lib/evvm/testnet/` - EVVM contracts (git submodule)
- `.executables/` - Pre-compiled CLI binaries for multiple platforms
- `evvm` - Linux/macOS CLI wrapper script (auto-detects architecture)
- `evvm.bat` - Windows CLI wrapper script (auto-detects architecture)

## Security & Contributing

### How to Contribute

We welcome contributions from the community! Here's how you can help:

1. **Report Issues** - Found a bug or have a suggestion? [Open an issue on GitHub](https://github.com/EVVM-org/evvm-cli/issues)
2. **Suggest Features** - Have an idea for improvement? [Create a feature request issue](https://github.com/EVVM-org/evvm-cli/issues)
3. **Submit Code Changes**:
   - Fork the repository
   - Create a feature branch (`git checkout -b feature/amazing-feature`)
   - Make your changes and add tests
   - Push to your branch (`git push origin feature/amazing-feature`)
   - Submit a Pull Request with a detailed description

### Guidelines

- **Issues**: Use [GitHub Issues](https://github.com/EVVM-org/evvm-cli/issues) for bug reports, feature requests, and discussions
- **Pull Requests**: Each PR should reference a related issue
- **Tests**: All new features must include tests
- **Code Style**: Follow the existing code patterns in the repository
- **Commit Messages**: Write clear, descriptive commit messages

## Security Best Practices

- **Never commit private keys**: Always use `cast wallet import <YOUR_ALIAS> --interactive` to securely store your keys
- **Use test credentials only**: This repository is for testnet deployment only
- **Environment variables**: Store sensitive data like API keys in `.env` files (not committed to git)
- **Verify contracts**: Always verify your deployed contracts on block explorers
