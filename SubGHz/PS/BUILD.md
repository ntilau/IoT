# Consolidated Peripheral Stations (PS)

## Overview

The Peripheral Stations (PS1, PS2, PS3, PS4) have been consolidated into a single `PS` directory with a configurable MODULE_ID. All four modules are built from the same source code with different module identifiers.

## Building All Modules

```bash
cd PS
make all          # Builds ps1.hex, ps2.hex, ps3.hex, ps4.hex
make PS1          # Build only PS1
make PS2          # Build only PS2
make clean        # Remove build artifacts
```

## Building Individual Modules

```bash
# Build PS1 with MODULE_ID=0x01
make PS1

# Or compile directly
sdcc -mpic16 -p18f4620 -DMODULE_ID=0x01 main.c
packihx main.ihx > ps1.hex
```

## Module IDs

Each peripheral station has a unique MODULE_ID used for communication:

| Module | ID | Description |
|--------|-----|-------------|
| PS1 | 0x01 | Peripheral Station 1 |
| PS2 | 0x02 | Peripheral Station 2 |
| PS3 | 0x03 | Peripheral Station 3 |
| PS4 | 0x04 | Peripheral Station 4 |

The MODULE_ID is transmitted during the handshake with the base station:
```c
if(fifo[0] == 0x5A & fifo[1] == ID)  // ID = MODULE_ID
```

## Protocol

Each PS module:
1. Waits for command: 0x5A + module ID
2. Reads 4 bytes of counter data from GPIO pins (RB7-4)
3. Transmits: 0x2D + 0xA5 + 0x5A + [4 data bytes] + checksum + 0xEF

## Build Modes

Optional test modes can be enabled by defining BUILD_MODE in main.c:

```c
//#define BUILD_MODE 1  // TX pattern test
```

See main.c header for available modes.

## Output Files

After building:
- `ps1.hex` - Firmware for PS1 module
- `ps2.hex` - Firmware for PS2 module
- `ps3.hex` - Firmware for PS3 module
- `ps4.hex` - Firmware for PS4 module

## Flashing

Use PICkit 2 to flash each module:

```bash
pk2cmd -p PIC18F4620 -f ps1.hex -m  # Flash PS1
pk2cmd -p PIC18F4620 -f ps2.hex -m  # Flash PS2
pk2cmd -p PIC18F4620 -f ps3.hex -m  # Flash PS3
pk2cmd -p PIC18F4620 -f ps4.hex -m  # Flash PS4
```