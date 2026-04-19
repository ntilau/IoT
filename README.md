# IoT Project

This repository contains firmware and code for various IoT devices, including Bluetooth Low Energy (BLE) trackers and Sub-GHz wireless communication systems.

## Project Structure

### BLE/
Firmware for BLE-based IoT devices using Texas Instruments CC26xx microcontrollers (CC2640 and CC2650).

- **src/**: Main source code for the BLE tag/tracker.
- **cc26xxware/**: TI's driver library for CC26xx devices.
- **README.md**: Specific documentation for the BLE component.

### SubGHz/
Firmware for Sub-GHz wireless communication using PIC18F4620 microcontrollers and QUASAR ALPHA-TRX868S FM transceivers.

Contains multiple versions (SDCC_BS, SDCC_PS1, SDCC_PS2, SDCC_PS3, SDCC_PS4) for different configurations, likely for base station and various peripheral stations.

- **README.md**: Documentation for the Sub-GHz component.

## Building and Flashing

### BLE
- Uses TI's Code Composer Studio or similar for CC26xx.
- Refer to BLE/README.md for build instructions.

### SubGHz
- **Compiler**: SDCC v2.9.0 with gputils v0.13.7
- **Programmer**: PICkit 2 v2.61.00
- **SDCC_BS**: Base station firmware (`make` to build)
- **SDCC_PS**: Consolidated peripheral stations 1-4 (`make all` to build all; `make PS1/PS2/PS3/PS4` for individual modules)
- See [SubGHz/README.md](SubGHz/README.md) for details

## Hardware Requirements

- BLE: CC2640/CC2650 LaunchPad or custom board.
- SubGHz: PIC18F4620 microcontroller, QUASAR ALPHA-TRX868S transceiver.

## License

[Add license information if applicable]

## Contributing

[Add contribution guidelines if applicable]