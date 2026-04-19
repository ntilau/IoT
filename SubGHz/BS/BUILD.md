# Base Station Build Instructions

## Overview

Base Station firmware for the Sub-GHz wireless counter network. The master controller polls each peripheral sequentially and processes counter data.

## Building

### Method 1: Using Make (Recommended)
```bash
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

```c
//#define BUILD_MODE 1
```

### Available Modes

- **BUILD_MODE 1**: RX-only test mode - Receives and displays FIFO data from peripherals
- **Production** (default): Full bidirectional with round-robin polling of all 4 peripheral stations

## Output Files

After compilation:
- `main.asm` - Assembly code
- `main.lst` - Assembly listing
- `main.cod` - Compiled object
- `main.ihx` - Intel HEX intermediate
- `main.hex` - Final programmed image

## Hardware Requirements

- **Microcontroller**: PIC18F4620
- **Transceiver**: QUASAR ALPHA-TRX868S (868 MHz)
- **Programmer**: PICkit 2 v2.61.00 or compatible
- **Compiler**: SDCC v2.9.0 with gputils v0.13.7

## Flashing to Device

```bash
# Using PICkit 2
pk2cmd -p PIC18F4620 -f main.hex -m
```

## Code Structure

The base station implements:

- **Hardware Initialization**: Oscillator, GPIO, SPI, timer setup
- **Radio Control**: Radio setup, TX/RX modes, frequency synthesis
- **Communication Protocol**: 
  - Sends round number (0x5A + round) to each peripheral
  - Receives 6-byte packets (0x2D + 0xA5 + 0x5A + 4 data bytes + checksum + 0xEF)
- **GPIO Output**: Controls 16 pins (4 per peripheral module) based on received counter values
- **Error Handling**: Checksum validation and timeout detection

## Key Functions

- `init_hardware()` - Master initialization function
- `init_counters()` - Setup output pins for all 4 modules
- `init_radio()` - Configure radio transceiver
- `init_timer()` - Setup timeout timer
- `en_tx()` - Enter transmit mode
- `en_rx()` - Enter receive mode
- `en_idle()` - Enter idle mode
- `wr_command()` - Send command to radio
- `spi_trx()` - SPI data exchange

## Protocol Details

### Communication Flow

1. Base station transmits: `0x2D + 0xA5 + 0x5A + round_number`
2. Peripheral receives and validates
3. If ID matches, peripheral transmits: `0x2D + 0xA5 + 0x5A + [4 data bytes] + checksum + 0xEF`
4. Base station validates checksum
5. Base station pulses GPIO outputs based on counter values
6. Repeat for next peripheral

### Round-Robin Polling

The base station cycles through peripherals sequentially:
- Round 1: Query PS1 (ID 0x01)
- Round 2: Query PS2 (ID 0x02)
- Round 3: Query PS3 (ID 0x03)
- Round 4: Query PS4 (ID 0x04)
- Then repeat from Round 1

## Debugging

When BUILD_MODE 1 is enabled, the base station enters RX-only test mode:
- Continuously receives data from radio
- Displays FIFO contents via UART (if available)
- Useful for debugging peripheral communication without full protocol