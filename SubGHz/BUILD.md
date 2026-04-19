# SubGHz Build Instructions

## Overview
This directory contains firmware for wireless counter modules. The consolidated main.c files contain the production code. Test variants have been integrated or removed.

## Building

### Method 1: Using Make (Recommended)
```bash
cd SDCC_BS   # or SDCC_PS1, SDCC_PS2, SDCC_PS3, SDCC_PS4
make         # Builds main.hex
make clean   # Removes build artifacts
```

### Method 2: Direct SDCC Compilation
```bash
sdcc -mpic16 -p18f4620 main.c
packihx main.ihx > main.hex
```

## Build Modes

The firmware supports conditional compilation for testing. To enable a test mode, uncomment the appropriate `#define` in main.c:

### Base Station (SDCC_BS/main.c)
- **BUILD_MODE 1**: RX-only test mode - Receives and displays FIFO data
- **Production** (default): Full bidirectional with round-robin polling

Uncomment in main.c:
```c
//#define BUILD_MODE 1
```

### Peripheral Modules (SDCC_PS1-PS4/main.c)
- **Production** (default): Waits for base station commands and transmits sensor data

## Hardware Requirements

- **Microcontroller**: PIC18F4620
- **Transceiver**: QUASAR ALPHA-TRX868S (868 MHz)
- **Programmer**: PICkit 2 v2.61.00 or compatible
- **Compiler**: SDCC v2.9.0 with gputils v0.13.7

## File Organization

- `main.c` - Production firmware
- `Makefile` - Build configuration
- `*.c` (referenced headers via include) - Helper functions
- `*.lst`, `*.asm`, `*.cod` - Build artifacts (generated)
- `*.hex` - Firmware image for programming

## Flashing to Device

```bash
# Using PICkit 2
pk2cmd -p PIC18F4620 -f main.hex -m
```

## Build Artifacts

After compilation, the following files are generated:
- `main.asm` - Assembly code
- `main.lst` - Assembly listing
- `main.cod` - Compiled object
- `main.ihx` - Intel HEX intermediate
- `main.hex` - Final programmed image

These can be cleaned with: `make clean`