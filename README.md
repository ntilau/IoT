# IoT Project

Multi-platform wireless IoT firmware repository featuring Bluetooth Low Energy (BLE) tracking and Sub-GHz wireless communication systems, plus a companion BLE mobile application.

## 📋 Project Overview

This repository contains embedded firmware for two IoT wireless applications, and a companion mobile application that uses BLE for peer discovery.

| Module | Technology | Microcontroller | Frequency | Purpose |
|--------|-----------|-----------------|-----------|----------|
| **BLE** | Bluetooth Low Energy | TI CC2640/CC2650 | 2.4 GHz | IoT tracker/beacon |
| **SubGHz** | FSK/OOK Radio | PIC18F4620 | 868 MHz | Wireless counter network |
| **Apps (Crossed)** | BLE + Cordova/PHP | Mobile (iOS/Android) | 2.4 GHz | BLE peer-discovery app |

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Repository Structure](#-repository-structure)
- [Quick Start](#-quick-start)
- [Tools & Requirements](#-tools--requirements)
- [Installation](#-installation)
- [Documentation](#-documentation)
- [Architecture](#-architecture)
- [Build Features](#-build-features)
- [Features](#-features)
- [License](#-license)
- [Contributing](#-contributing)
- [Support](#-support)

## 📁 Repository Structure

```
IoT/
├── README.md                  # This file
├── CLAUDE.md                  # Guidance for Claude Code working in this repo
├── LICENSE                    # MIT License (root project)
├── BLE/                       # BLE IoT tracker firmware (CC2640/CC2650)
│   ├── README.md              # BLE project documentation
│   ├── src/                   # BLE firmware source (tag.c, tag.h, ...)
│   ├── cc26xxware/            # TI CC26xx driver library
│   ├── CC2640.ccxml           # Code Composer Studio config (CC2640)
│   ├── CC2650.ccxml           # Code Composer Studio config (CC2650)
│   ├── tag.cbp                # Code::Blocks project file
│   ├── BLE_Tracker.jpg        # Hardware render
│   ├── Schematic_of_CC2640-BN1.pdf
│   └── SensorTag.zip
├── SubGHz/                    # Sub-GHz wireless counter network (PIC18F4620)
│   ├── README.md              # Sub-GHz documentation
│   ├── BUILD.md               # Advanced build and test modes
│   ├── BS/                    # Base station firmware (master)
│   │   ├── main.c             # BS main code
│   │   ├── Makefile           # Build configuration
│   │   ├── BUILD.md           # Base station build guide
│   │   ├── pic18f4620.h       # Microcontroller header
│   │   └── pic16_Include.lnk  # Linker script
│   └── PS/                    # Peripheral stations (PS1-PS4)
│       ├── main.c             # Unified PS source (configurable MODULE_ID)
│       ├── Makefile           # Multi-module build
│       ├── BUILD.md           # Peripheral station build guide
│       └── pic18f4620.h       # Microcontroller header
└── Apps/                      # Companion: Crossed BLE mobile app (Cordova + PHP)
    ├── README.md              # Crossed app documentation
    ├── API.md                 # Backend API reference
    ├── LICENSE                # Apps component license
    ├── cloud.crossed/         # Cordova mobile app (iOS/Android/browser)
    └── www.crossed.cloud/     # PHP backend (Google OAuth, profiles)
```

> **Note:** `Apps/` is a separate companion project (the "Crossed" mobile app) and is not part of the embedded firmware. It is developed independently of the BLE/SubGHz firmware modules.

## 🚀 Quick Start

### Building BLE Firmware

BLE firmware is built with TI Code Composer Studio or Code::Blocks:

```bash
# Open the project in TI Code Composer Studio:
#   File → Import → CCS Projects → select the BLE directory
#   Use CC2640.ccxml for CC2640, or CC2650.ccxml for CC2650
#   Build → Build Project (Ctrl+B)

# Or open tag.cbp in Code::Blocks and build.
```

There is no command-line Makefile for the BLE module; refer to [BLE/README.md](BLE/README.md) for detailed build and debugging instructions.

### Building SubGHz Firmware

```bash
# Base Station
cd SubGHz/BS
make

# Peripheral Stations (all 4 modules)
cd SubGHz/PS
make all          # Builds ps1.hex, ps2.hex, ps3.hex, ps4.hex
make PS1          # Build individual module (-DMODULE_ID=0x01)
make PS2          # Build individual module (-DMODULE_ID=0x02)
make PS3          # Build individual module (-DMODULE_ID=0x03)
make PS4          # Build individual module (-DMODULE_ID=0x04)
make clean        # Remove build artifacts
```

### Building/Running Apps (Crossed)

Apps is a separate companion project — not part of the embedded firmware — developed independently.

Mobile app (Cordova):
```bash
cd Apps/cloud.crossed
npm install       # Install Node.js dependencies
cordova platform add ios      # or android
cordova build ios             # or cordova build android
cordova run ios               # Run on device/emulator
# Update the `server` variable in www/js/index.js to point to your API endpoint.
```

Web backend (PHP):
```bash
cd Apps/www.crossed.cloud
composer install  # PHP 7+ with Composer
# Create MySQL database `apidb` and import schema from Apps/cloud.crossed/api/api.sql
# Update database credentials in api/api.php
# Place Google OAuth client_secrets.json in the project root
# Deploy to a web server with PHP support
```

See [Apps/README.md](Apps/README.md) for full setup and [Apps/API.md](Apps/API.md) for the backend API reference.

## 🔧 Tools & Requirements

### BLE Development
- **IDE**: TI Code Composer Studio (CCS) or Code::Blocks
- **Compiler**: TI ARM compiler (included in CCS)
- **Microcontroller**: CC2640 or CC2650 (ARM Cortex-M3)
- **Programmer**: TI XDS100 or compatible JTAG debugger
- **Driver Library**: cc26xxware (included in `BLE/cc26xxware/`)

### SubGHz Development
- **Compiler**: SDCC v2.9.0 (Small Device C Compiler)
- **Utilities**: gputils v0.13.7
- **Programmer**: PICkit 2 v2.61.00
- **Microcontroller**: PIC18F4620
- **Transceiver**: QUASAR ALPHA-TRX868S

### Apps (Crossed) Development
- **Framework**: Apache Cordova with Onsen UI
- **Backend**: PHP web server with Google OAuth
- **Platforms**: iOS, Android, browser

## 💻 Installation

### SDCC (for SubGHz firmware)
```bash
# macOS
brew install sdcc gputils

# Ubuntu/Debian
sudo apt-get install sdcc gputils

# Or download from: http://sdcc.sourceforge.net/
```

### PICkit 2
Download from Microchip's website, or use open-source alternatives like `pk2cmd`.

### TI Code Composer Studio (for BLE firmware)
Download and install from Texas Instruments: http://www.ti.com/cc2640

## 📚 Documentation

- **[CLAUDE.md](CLAUDE.md)** - Guidance for Claude Code working in this repository
- **[BLE/README.md](BLE/README.md)** - BLE tracker implementation details
- **[SubGHz/README.md](SubGHz/README.md)** - Sub-GHz wireless network overview
- **[SubGHz/BUILD.md](SubGHz/BUILD.md)** - Advanced build and test modes
- **[SubGHz/BS/BUILD.md](SubGHz/BS/BUILD.md)** - Base station build guide
- **[SubGHz/PS/BUILD.md](SubGHz/PS/BUILD.md)** - Peripheral station build guide
- **[Apps/README.md](Apps/README.md)** - Crossed mobile app documentation
- **[Apps/API.md](Apps/API.md)** - Backend API reference

## 🏗️ Architecture

### SubGHz Wireless Network

The SubGHz module implements a master-slave architecture:

```
┌──────────────────────────────────────┐
│  Base Station (BS)                   │
│  • Master controller                 │
│  • Polls peripherals sequentially    │
│  • Aggregates counter data           │
│  • Controls 16 GPIO outputs (4/PS)   │
└────────┬────────┬────────┬────────┬──┘
         │        │        │        │
     868 MHz (wireless protocol)
         │        │        │        │
   ┌────▼─┐  ┌──▼──┐  ┌──▼──┐  ┌──▼──┐
   │ PS1  │  │ PS2 │  │ PS3 │  │ PS4 │
   │0x01  │  │0x02 │  │0x03 │  │0x04 │
   └──────┘  └─────┘  └─────┘  └─────┘
```

**Communication Protocol:**
- Base Station → Peripheral: `0x5A + MODULE_ID`
- Peripheral → Base Station: `0x2D + 0xA5 + 0x5A + [data] + checksum + 0xEF`

### BLE Tracker

The BLE module (`BLE/src/tag.c`) implements a low-power beacon/tracker:
- **Radio Configuration**: BLE advertising setup
- **Power Management**: Sleep between advertisements, RTC wake-up
- **GPIO Control**: LED indicators and pin management
- **BLE Advertisement**: Custom beacon frames (`bleAdvPayload`)

## 🔨 Build Features

### Code Consolidation
- ✅ Test variants (main_1.c - main_4.c) consolidated into a single `main.c`
- ✅ Conditional `BUILD_MODE` flags for testing without separate files
- ✅ All 4 PS modules built from unified source with configurable `MODULE_ID`
- ✅ Single Makefile generates multiple firmware images

### Build Targets (SubGHz)
| Target | Description |
|--------|-------------|
| `make all` | Build all PS modules |
| `make PS1`..`make PS4` | Build individual module (`-DMODULE_ID=0x01`..`0x04`) |
| `make clean` | Remove build artifacts |

## 📦 Features

**BLE Module:**
- CC26xx-based BLE tracker/beacon
- Low-power operation (< 10 µA sleep)
- TI cc26xxware driver library integration
- Code Composer Studio and Code::Blocks project files

**SubGHz Module:**
- 868 MHz wireless communication (FSK/OOK)
- Base station + 4 configurable peripheral stations
- Checksum-based error detection
- GPIO-based counter I/O
- Optional test modes for development

**Apps (Crossed) Module:**
- Bluetooth peer discovery via BLE
- Real-time messaging between peers
- Google OAuth authentication
- Profile management with images
- Cross-platform: iOS, Android, browser

## 📝 License

This project is licensed under the [MIT License](LICENSE) (Copyright 2026 Laurent Ntibarikure).

> Some subcomponents include third-party or separately licensed material:
> - `BLE/` integrates TI's CC26xxware driver library — see `BLE/README.md`.
> - `Apps/` carries its own `LICENSE` — see `Apps/README.md`.

## 🤝 Contributing

Contributions welcome! Please maintain code consolidation principles:

1. Avoid duplicating module-specific variants.
2. Use compile-time configuration flags (e.g., `MODULE_ID`, `BUILD_MODE`).
3. Update documentation with any changes.
4. Test all build targets before committing. There is no automated test suite or linter — verification is build-only (each `make` target must compile cleanly and produce a `.hex`).

## 📞 Support

For issues or questions, refer to:
- Individual module README files
- BUILD.md files for detailed build instructions
- Inline code comments for implementation details
