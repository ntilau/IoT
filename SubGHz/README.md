# wireless_counters

Firmware for Sub-GHz wireless communication using PIC18F4620 microcontrollers and QUASAR ALPHA-TRX868S FM transceivers.

## Overview

This module implements a base station (SDCC_BS) and peripheral stations (SDCC_PS) for a wireless counter network operating at 868 MHz. The base station polls each peripheral sequentially and processes counter data. All four peripheral modules (PS1-PS4) are built from a single consolidated source.

## Quick Build

```bash
# Build base station
cd SDCC_BS
make

# Build all peripheral stations (PS1-PS4)
cd ../SDCC_PS
make all

# Or build individual modules
make PS1  # Build only PS1
make PS2  # Build only PS2
```

## Directory Structure

- **SDCC_BS**: Base station - Master controller (main.c with optional BUILD_MODE test modes)
- **SDCC_PS**: Consolidated peripheral stations - Single source with configurable MODULE_ID for PS1-PS4

## Tools

- **Compiler**: SDCC v2.9.0 with gputils v0.13.7
- **Programmer**: PICkit 2 v2.61.00

## Consolidation

### Test Variants
Previous test variants (main_1.c, main_2.c, main_3.c, main_4.c) have been consolidated into main.c with conditional BUILD_MODE compilation flags.

### Peripheral Stations
All PS modules (PS1-PS4) now share a single codebase in SDCC_PS/main.c, built with different MODULE_ID values:
- PS1: `make PS1` or `-DMODULE_ID=0x01`
- PS2: `make PS2` or `-DMODULE_ID=0x02`
- PS3: `make PS3` or `-DMODULE_ID=0x03`
- PS4: `make PS4` or `-DMODULE_ID=0x04`

## Documentation

- **SDCC_BS/BUILD.md**: Base station build instructions and test modes
- **SDCC_PS/BUILD.md**: Peripheral station build instructions and protocol details
