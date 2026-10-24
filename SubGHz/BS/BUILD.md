# Base Station Build Instructions

## Overview

Base Station firmware for the Sub-GHz wireless counter network. The master controller polls each peripheral sequentially and processes counter data.

See [SubGHz/BUILD.md](../BUILD.md) for general build instructions, tools, and hardware requirements that apply to both BS and PS.

## Building

```bash
make         # Builds main.hex
make clean   # Removes build artifacts
```

## Output Files

After compilation:
- `main.asm` - Assembly code
- `main.lst` - Assembly listing
- `main.cod` - Compiled object
- `main.ihx` - Intel HEX intermediate
- `main.hex` - Final programmed image

These can be cleaned with: `make clean`

## Flashing to Device

```bash
# Using PICkit 2
pk2cmd -p PIC18F4620 -f main.hex -m
```

## Code Structure

The base station (`main.c`) implements:

- **Hardware Initialization**: Oscillator, GPIO, SPI, timer setup
- **Radio Control**: Radio setup, TX/RX modes, frequency synthesis
- **Communication Protocol**: Round-robin polling of peripherals PS1-PS4
- **GPIO Output**: Controls 16 pins (4 per peripheral module) based on received counter values
- **Error Handling**: Checksum validation and timeout detection

### Key Functions

- `init_hardware()` - Master initialization function
- `init_counters()` - Setup output pins for all 4 modules
- `init_radio()` - Configure radio transceiver
- `init_timer()` - Setup timeout timer
- `en_tx()` - Enter transmit mode
- `en_rx()` - Enter receive mode
- `en_idle()` - Enter idle mode
- `wr_command()` - Send command to radio
- `spi_trx()` - SPI data exchange

### Pin Mapping

| Module | Pins |
|--------|------|
| PS1 | RB7, RB6, RB5, RB4 |
| PS2 | RB3, RA0, RA1, RA2 |
| PS3 | RA3, RA4, RA5, RE0 |
| PS4 | RE1, RE2, RD7, RD6 |

## Build Modes

See [SubGHz/BUILD.md](../BUILD.md) for available `BUILD_MODE` test modes.
