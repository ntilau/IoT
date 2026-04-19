# IoT Project

Multi-platform wireless IoT firmware repository featuring Bluetooth Low Energy (BLE) tracking and Sub-GHz wireless communication systems.

## 📋 Project Overview

This repository contains embedded firmware for two distinct IoT applications:

| Module | Technology | Microcontroller | Frequency | Purpose |
|--------|-----------|-----------------|-----------|----------|
| **BLE** | Bluetooth Low Energy | TI CC2640/CC2650 | 2.4 GHz | IoT tracker/beacon |
| **SubGHz** | FSK/OOK Radio | PIC18F4620 | 868 MHz | Wireless counter network |

## 🚀 Quick Start

### Building BLE Firmware
```bash
cd BLE/src
# Use TI Code Composer Studio or similar tools
# Refer to BLE/README.md for detailed instructions
```

### Building SubGHz Firmware
```bash
# Base Station
cd SubGHz/SDCC_BS
make

# Peripheral Stations (all 4 modules)
cd SubGHz/SDCC_PS
make all          # Builds ps1.hex, ps2.hex, ps3.hex, ps4.hex
make PS1          # Build individual module
```

## 📁 Repository Structure

```
IoT/
├── README.md                    # This file
├── BLE/
│   ├── README.md                # BLE project documentation
│   ├── src/                     # BLE firmware source
│   └── cc26xxware/              # TI driver library
└── SubGHz/
    ├── README.md                # Sub-GHz documentation
    ├── BUILD.md                 # Additional build details
    ├── SDCC_BS/                 # Base station firmware
    │   ├── main.c               # BS main code
    │   ├── Makefile             # Build configuration
    │   └── pic18f4620.h         # Microcontroller header
    └── SDCC_PS/                 # Peripheral stations (PS1-PS4)
        ├── main.c               # Unified PS source (configurable)
        ├── Makefile             # Multi-module build
        └── pic18f4620.h         # Microcontroller header
```

## 🔧 Tools & Requirements

### BLE Development
- **IDE**: TI Code Composer Studio or similar
- **Compiler**: TI ARM compiler (included in CCS)
- **Microcontroller**: CC2640 or CC2650
- **Programmer**: TI XDS100 or similar JTAG debugger

### SubGHz Development
- **Compiler**: SDCC v2.9.0 (Small Device C Compiler)
- **Utilities**: gputils v0.13.7
- **Programmer**: PICkit 2 v2.61.00
- **Microcontroller**: PIC18F4620
- **Transceiver**: QUASAR ALPHA-TRX868S

## 💻 Installation

### SDCC (for SubGHz)
```bash
# macOS
brew install sdcc gputils

# Ubuntu/Debian
sudo apt-get install sdcc gputils

# Or download from: http://sdcc.sourceforge.net/
```

### PICkit 2
Download from Microchip's website or use open-source alternatives like pk2cmd.

## 📚 Documentation

- **[BLE/README.md](BLE/README.md)** - BLE tracker implementation details
- **[SubGHz/README.md](SubGHz/README.md)** - Sub-GHz wireless network overview
- **[SubGHz/BUILD.md](SubGHz/BUILD.md)** - Advanced build and test modes
- **[SubGHz/SDCC_BS/BUILD.md](SubGHz/SDCC_BS/BUILD.md)** - Base station build guide
- **[SubGHz/SDCC_PS/BUILD.md](SubGHz/SDCC_PS/BUILD.md)** - Peripheral station build guide

## 🏗️ Architecture

### SubGHz Wireless Network
The SubGHz module implements a master-slave architecture:

```
┌─────────────────────────────────────────┐
│  Base Station (SDCC_BS)                 │
│  • Master controller                    │
│  • Polls peripherals sequentially       │
│  • Aggregates counter data              │
│  • Controls 16 GPIO outputs (4 per PS)  │
└────────┬────────┬────────┬────────┬─────┘
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

## 🔨 Build Features

### Code Consolidation
- ✅ Test variants (main_1.c - main_4.c) consolidated into single main.c
- ✅ Conditional BUILD_MODE flags for testing without separate files
- ✅ All 4 PS modules built from unified source with configurable MODULE_ID
- ✅ Single Makefile generates multiple firmware images

### Build Targets (SubGHz)
```bash
cd SubGHz/SDCC_PS
make all          # Build all PS modules
make PS1          # Build PS1 only (-DMODULE_ID=0x01)
make PS2          # Build PS2 only (-DMODULE_ID=0x02)
make PS3          # Build PS3 only (-DMODULE_ID=0x03)
make PS4          # Build PS4 only (-DMODULE_ID=0x04)
make clean        # Remove build artifacts
```

## 📋 Features

**BLE Module:**
- CC26xx-based BLE tracker/beacon
- Low-power operation
- TI driver library integration

**SubGHz Module:**
- 868 MHz wireless communication
- Base station + 4 configurable peripheral stations
- Checksum-based error detection
- GPIO-based counter I/O
- Optional test modes for development

## 📝 License

See individual module documentation for license information.

## 🤝 Contributing

Contributions welcome! Please maintain code consolidation principles:
1. Avoid duplicating module-specific variants
2. Use compile-time configuration flags (e.g., MODULE_ID, BUILD_MODE)
3. Update documentation with any changes
4. Test all build targets before committing

## 📞 Support

For issues or questions, refer to:
- Individual module README files
- BUILD.md files for detailed build instructions
- Inline code comments for implementation details