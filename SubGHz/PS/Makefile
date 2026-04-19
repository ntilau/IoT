# Makefile for Peripheral Stations (Consolidated SDCC_PS)
# Builds all 4 PS modules from a single source with different MODULE_ID values

CC = sdcc
CFLAGS = -mpic16 -p18f4620
LDFLAGS = 

# Default target
.PHONY: all PS1 PS2 PS3 PS4 clean

all: PS1 PS2 PS3 PS4

PS1:
	$(CC) $(CFLAGS) -DMODULE_ID=0x01 -o main_ps1 main.c
	packihx main_ps1.ihx > main_ps1.hex
	mv main_ps1.hex ps1.hex

PS2:
	$(CC) $(CFLAGS) -DMODULE_ID=0x02 -o main_ps2 main.c
	packihx main_ps2.ihx > main_ps2.hex
	mv main_ps2.hex ps2.hex

PS3:
	$(CC) $(CFLAGS) -DMODULE_ID=0x03 -o main_ps3 main.c
	packihx main_ps3.ihx > main_ps3.hex
	mv main_ps3.hex ps3.hex

PS4:
	$(CC) $(CFLAGS) -DMODULE_ID=0x04 -o main_ps4 main.c
	packihx main_ps4.ihx > main_ps4.hex
	mv main_ps4.hex ps4.hex

clean:
	rm -f main_ps*.asm main_ps*.lst main_ps*.cod main_ps*.ihx main_ps*.hex
	rm -f ps[1-4].hex
	rm -f *.asm *.lst *.cod *.ihx *.hex

.PHONY: all clean PS1 PS2 PS3 PS4
