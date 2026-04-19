# BLE IoT Tracker

## Overview

Bluetooth Low Energy (BLE) based IoT tracker firmware for Texas Instruments CC2640/CC2650 microcontrollers. This module implements a low-power wireless device for IoT applications such as asset tracking, beacons, and telemetry.

![BLE Tracker](BLE_Tracker.jpg)

## Features

- **Low Power Operation**: Optimized for battery-powered deployments
- **BLE 2.4 GHz**: Standard Bluetooth Low Energy communication
- **CC26xx Support**: Works with CC2640 and CC2650 microcontrollers
- **TI Driver Library**: Integrated with cc26xxware driver package
- **Modular Code**: Clean separation of concerns with dedicated source modules

## Hardware

- **Microcontroller**: CC2640 or CC2650 (ARM Cortex-M3)
- **Development Board**: CC2640 or CC2650 LaunchPad (recommended)
- **Debugger**: TI XDS100 or compatible JTAG interface
- **Frequency**: 2.4 GHz ISM band

## Directory Structure

```
BLE/
├── README.md                # This file
├── src/                     # Source code
│   ├── tag.c               # Main BLE tag implementation
│   ├── tag.h               # Tag header
│   └── ...                 # Additional modules
├── cc26xxware/             # TI CC26xx driver library
│   ├── driverlib/          # Low-level drivers
│   ├── inc/                # Header files
│   └── ...                 # Support files
├── CC2640.ccxml            # Code Composer Studio project (CC2640)
├── CC2650.ccxml            # Code Composer Studio project (CC2650)
└── tag.cbp                 # CodeBlocks project file
```

## Building

### Using TI Code Composer Studio

1. Open Code Composer Studio
2. Import the project:
   - **File** → **Import** → **CCS Projects**
   - Select the BLE directory
3. Choose configuration:
   - CC2640.ccxml for CC2640 devices
   - CC2650.ccxml for CC2650 devices
4. **Build** → **Build Project** (or Ctrl+B)
5. **Run** → **Resume** (or F8) to debug

### Manual Compilation

Refer to TI Code Composer Studio documentation for command-line build steps.

## BLE Firmware Structure

The tag.c implementation includes:

- **Radio Configuration**: Setup for BLE advertising
- **Power Management**: Low-power modes and wake-up
- **GPIO Control**: LED indicators and pin management
- **Timer Operations**: RTC and timer management
- **BLE Advertisement**: Custom beacon frames

## Key Functions

```c
void ble_setup(void);      // Initialize BLE radio
void ble_advertise(void);  // Start BLE advertisement
void pwr_setup(void);      // Configure power management
void pwr_down(void);       // Enter low-power mode
void led_setup(void);      // Initialize LED GPIO
void led_toggle(void);     // Toggle LED status
void pin_setup(void);      // Setup GPIO pins
void tmr_setup(void);      // Initialize timer
```

## Configuration

Edit `tag.c` to configure:

- **Device Name**: `bleAdvPayload` array
- **TX Power**: `SET.txPower` value
- **Advertisement Interval**: `adv_interval` constant
- **Device Address**: `devAddress` array

## Debugging

Connect via JTAG debugger and use Code Composer Studio's debug perspective:
- Set breakpoints in source code
- Step through execution
- Inspect variables and memory
- Monitor real-time expressions

## Power Consumption

The firmware optimizes power by:
- Sleeping between advertisements
- Using RTC for periodic wake-up
- Minimal active radio time
- Efficient GPIO operations

Typical current draw:
- Sleep: < 10 µA
- Active (advertising): ~10-50 mA

## License

Integrates with TI's CC26xxware driver library. Refer to individual source files for license details.

## Support

- **TI Documentation**: http://www.ti.com/cc2640
- **CC26xxware**: Included in cc26xxware/ directory
- **Code Examples**: Refer to inline comments in tag.c
