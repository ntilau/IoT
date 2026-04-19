# Makefile for SubGHz Base Station using SDCC

CC = sdcc
CFLAGS = -mpic16 -p18f4620
LDFLAGS = 

TARGET = main.hex
SOURCE = main.c

all: $(TARGET)

$(TARGET): $(SOURCE)
	$(CC) $(CFLAGS) $(SOURCE)
	packihx main.ihx > $(TARGET)

clean:
	rm -f *.asm *.lst *.cod *.ihx *.hex

.PHONY: all clean