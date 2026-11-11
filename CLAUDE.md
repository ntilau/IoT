# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Two embedded firmware modules live here. They do not share code or a build system.

| Module | Technology | MCU | Frequency | Purpose |
|--------|-----------|-----|-----------|---------|
| BLE | Bluetooth Low Energy | TI CC2640/CC2650 (Cortex-M3) | 2.4 GHz | IoT tracker/beacon |
| SubGHz | FSK/OOK radio | PIC18F4620 | 868 MHz | Wireless counter network |

`Apps/` (the Crossed Cordova/PHP companion app) was previously part of this repo but its directory has been removed from the working tree. Do not reference it as present; if you need to restore it, recreate the directory first.

## Commands

Toolchain (SubGHz only): SDCC v2.9.0 + gputils v0.13.7 (`packihx`). Not installed in this environment.

```bash
# macOS
brew install sdcc gputils

# Ubuntu/Debian
sudo apt-get install sdcc gputils
```

### SubGHz — Base Station (BS/master)

```bash
cd SubGHz/BS
make          # builds main.hex
make clean    # removes *.asm *.lst *.cod *.ihx *.hex
```

### SubGHz — Peripheral Stations (PS1–PS4, one source, compile-time `MODULE_ID`)

```bash
cd SubGHz/PS
make all      # builds ps1.hex, ps2.hex, ps3.hex, ps4.hex
make PS1      # -DMODULE_ID=0x01
make PS2      # -DMODULE_ID=0x02
make PS3      # -DMODULE_ID=0x03
make PS4      # -DMODULE_ID=0x04
make clean
```

Equivalent direct compilation:
```bash
sdcc -mpic16 -p18f4620 main.c
packihx main.ihx > main.hex
```

Flash with PICkit 2:
```bash
pk2cmd -p PIC18F4620 -f main.hex -m      # BS (main.hex in BS/)
pk2cmd -p PIC18F4620 -f ps1.hex -m       # PS1 (ps1.hex in PS/)
```

### BLE — tracker (IDE build only)

No command-line Makefile. Build in TI Code Composer Studio (import `BLE/`; use `CC2640.ccxml` or `CC2650.ccxml`) or Code::Blocks (`tag.cbp`). Compiler: TI ARM compiler. Source: `BLE/src/tag.c`, driver library in `BLE/cc26xxware/`.

Build artifacts (`*.hex`, `*.ihx`, `*.asm`, `*.lst`, `*.cod`) are gitignored — do not commit them.

## Testing

There is no test suite, linter, or CI for any language. Verification is build-only: each `make` target must compile cleanly and produce a `.hex`. BLE changes are verified via the CCS debugger on hardware; Crossed BLE features on physical devices.

There is no command to "run a single test" — do not invent one. If you add tests, create them per-module, document the command here, and ensure every existing build target still passes.

## Architecture

### SubGHz wireless counter network (868 MHz)

Master–slave polling using QUASAR ALPHA-TRX868S transceivers, SPI-connected to PIC18F4620 GPIO.

**Base station (`SubGHz/BS/main.c`)**: master controller. Cycles round 1→4; each round transmits `0x2D + 0xA5 + 0x5A + round_number`, then receives a 6-byte packet `0x2D + 0xA5 + 0x5A + [4 counter bytes] + checksum + 0xEF` from the matching peripheral. Validates the checksum, then pulses GPIO outputs — 4 pins per module, 16 total (RB7–RB4 for PS1, RA0–RA2/RE0 for PS2, etc.). Timeout handling via Timer0; LED indicates timeout.

**Peripheral stations (`SubGHz/PS/main.c`)**: a single source for PS1–PS4. `MODULE_ID` (`0x01`–`0x04`) is a compile-time flag (`-DMODULE_ID=0x01` etc.); the PS waits for `0x5A + ID`, reads 4 counter bytes from GPIO (RB7–RB4 via change interrupt), and replies with the framed 6-byte packet.

Both `main.c` files contain production code plus optional `BUILD_MODE` test variants compiled conditionally — there are no separate `main_1.c`/`main_2.c` variant files.

**Convention to preserve**: one source file per logical unit; module differences handled with compile-time flags (`MODULE_ID`, `BUILD_MODE`), not duplicated files. Update documentation with any changes; test all build targets before committing.

### BLE tracker (`BLE/src/tag.c`)

Low-power beacon on CC2640/CC2650 using TI's cc26xxware driver library. Flow: `pwr_setup()` → `led_setup()` → `ble_setup()` → `ble_advertise()` → `tmr_setup()` → loop in `pwr_down()`. Advertises on three BLE channels (0x66, 0x7E, 0xB4) in sequence; RTC wakes the device periodically (`adv_interval`); a pin IRQ also re-triggers advertising. Configure in `tag.c`: `bleAdvPayload`, `devAddress`, `SET.txPower`, `adv_interval`. Typical sleep current < 10 µA.
