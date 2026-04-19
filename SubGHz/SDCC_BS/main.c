// Base station
// BUILD MODES:
//   Define BUILD_MODE to select behavior:
//   - BUILD_MODE 1: RX-only test (from main_1.c)
//   - BUILD_MODE 2: Extended RX test (from main_2.c - not used)
//   - BUILD_MODE 3: Extended alt implementation (from main_4.c - not used)
//   - Default (undefined): Production mode

#include <pic18fregs.h>
#include "delay.h"
#include "stdio.h"
//#define RESTART_WDT
#define CLOCK_SPEED 8000000
//#define BUILD_MODE 1

#define LED PORTAbits.RA6
#define nRES PORTCbits.RC0
#define nFFS PORTCbits.RC1
#define nSEL PORTCbits.RC2
#define nIRQ PORTBbits.RB0
#define nINT PORTBbits.RB1
#define FFIT PORTBbits.RB2

#define PS1_1 PORTBbits.RB7
#define PS1_2 PORTBbits.RB6
#define PS1_3 PORTBbits.RB5
#define PS1_4 PORTBbits.RB4

#define PS2_1 PORTBbits.RB3
#define PS2_2 PORTAbits.RA0
#define PS2_3 PORTAbits.RA1
#define PS2_4 PORTAbits.RA2

#define PS3_1 PORTAbits.RA3
#define PS3_2 PORTAbits.RA4
#define PS3_3 PORTAbits.RA5
#define PS3_4 PORTEbits.RE0

#define PS4_1 PORTEbits.RE1
#define PS4_2 PORTEbits.RE2
#define PS4_3 PORTDbits.RD7
#define PS4_4 PORTDbits.RD6

#define PS1_1_TRIS TRISBbits.TRISB7
#define PS1_2_TRIS TRISBbits.TRISB6
#define PS1_3_TRIS TRISBbits.TRISB5
#define PS1_4_TRIS TRISBbits.TRISB4

#define PS2_1_TRIS TRISBbits.TRISB3
#define PS2_2_TRIS TRISAbits.TRISA0
#define PS2_3_TRIS TRISAbits.TRISA1
#define PS2_4_TRIS TRISAbits.TRISA2

#define PS3_1_TRIS TRISAbits.TRISA3
#define PS3_2_TRIS TRISAbits.TRISA4
#define PS3_3_TRIS TRISAbits.TRISA5
#define PS3_4_TRIS TRISEbits.TRISE0

#define PS4_1_TRIS TRISEbits.TRISE1
#define PS4_2_TRIS TRISEbits.TRISE2
#define PS4_3_TRIS TRISDbits.TRISD7
#define PS4_4_TRIS TRISDbits.TRISD6

#define unused1 PORTDbits.RD5
#define unused2 PORTDbits.RD4
#define unused3 PORTDbits.RD3
#define unused4 PORTDbits.RD2
#define unused5 PORTDbits.RD1
#define unused6 PORTDbits.RD0

#define unused1_TRIS TRISDbits.TRISD5
#define unused2_TRIS TRISDbits.TRISD4
#define unused3_TRIS TRISDbits.TRISD3
#define unused4_TRIS TRISDbits.TRISD2
#define unused5_TRIS TRISDbits.TRISD1
#define unused6_TRIS TRISDbits.TRISD0


#define radioSDO PORTCbits.RC4

// Configurations
code char at __CONFIG1H config1h = 0xFF & _OSC_INTIO67_1H & _FCMEN_OFF_1H; // intio + failsafe
code char at __CONFIG2H config2h = 0xFF & _WDT_DISABLED_CONTROLLED_2H;
code char at __CONFIG2L config2l = 0xFF & _BOREN_OFF_2L; // disable brown out detector
code char at __CONFIG3H config3h = 0xFF & _MCLRE_MCLR_OFF_RE3_ON_3H & _PBADEN_PORTB_4_0__CONFIGURED_AS_DIGITAL_I_O_ON_RESET_3H; // NoMCLR
code char at __CONFIG4L config4l = 0x81; // disable low voltage programming

// Data Types
typedef unsigned char uchar;
typedef unsigned int uint;

uchar checksum = 0x00; 
uchar round = 1;
uchar fifo[6];
uchar idx = 0;
uchar timeOut;

uchar Port1[] = {0, 0, 0, 0};
uchar Port2[] = {0, 0, 0, 0};
uchar Port3[] = {0, 0, 0, 0};
uchar Port4[] = {0, 0, 0, 0};

void delay_us(uchar value){
  uchar t;
  for(t=0; t < value; t++) {
    _asm nop _endasm ;
  }
}

void delay_ms(uint value){
  uint t;
  uint times = (value*2) / 0x00FF;
  uint rest = (value*2) % 0x00FF;
  for(t = 0; t < times; t++) delay1ktcy(0xFF);
  delay1ktcy(rest);
}

void delay_s(uint value){
  delay1mtcy(value * 2);
}

void blinkLed(uchar times) {
  uchar i;
  for(i=0;i<times;i++){
    LED = 1;
    delay_ms(50);
    LED = 0;
    delay_ms(50);
  }
}

uchar spi_trx( uchar txData){
  uchar rxData = 0;
  SSPBUF = txData;
  while(!PIR1bits.SSPIF);
  rxData = SSPBUF;
  PIR1bits.SSPIF = 0;
  return rxData;
}

/*
void putc(uchar txData){
	TXREG = txData;
	while(!TXSTAbits.TRMT);
}
*/

void wr_register( uchar tx_uchar1, uchar tx_uchar2, uchar* rx_uchar){
  nSEL = 0;
  rx_uchar[0] = spi_trx(tx_uchar1);
  rx_uchar[1] = spi_trx(tx_uchar2); 
  nSEL = 1;
}

void wr_command( uchar tx_uchar1, uchar tx_uchar2){
  nSEL = 0;
  spi_trx(tx_uchar1);
  spi_trx(tx_uchar2); 
  nSEL = 1;
}

/*
void get_status(){
  nSEL = 0;
  status0 = spi_trx(0x00);
  status1 = spi_trx(0x00); 
  nSEL = 1;
}
*/

void en_rx(){
  wr_command(0x80, 0x68);
  wr_command(0x82, 0xD9);
}

void en_tx() {
  wr_command(0x80, 0xD8);
  wr_command(0x82, 0x39);
}

void en_idle(){
  wr_command(0x82, 0x59); // leaves BaseBand and Synthesizer active
  wr_command(0x80, 0x28);
}

/*
void updFifo(){
  fifo[idx++] = status0;
  fifo[idx++] = status1;
}

void printFifo(){
  for(i = 0; i < idx; i++){
    putc(fifo[i]);
  }
}

uchar fifo_read(){
  uchar rxData = 0;
  nSEL = 0;
  spi_trx(0xB0);
  rxData = spi_trx(0x00);
  nSEL = 1;
  return rxData;
}


void fifo_write(uchar* txData, uchar nbrBytes){ // could also use nFFS
  uchar i = 0;
  while(i < nbrBytes){
    while(nIRQ);
    wr_command(0xB8, txData[i++]);
    delay_ms(1);
  }
}

*/

void timer0_isr(void) interrupt 1
{
  INTCONbits.TMR0IE = 0;
  timeOut = 1;
  INTCONbits.TMR0IF = 0;
  INTCONbits.TMR0IE = 1;
}

void init_hardware(void);
void init_counters(void);
void init_radio(void);
void init_timer(void);

void main() {
  init_hardware();
  blinkLed(5);
  
#ifdef BUILD_MODE
  #if BUILD_MODE == 1
    // RX-only test mode (from main_1.c)
    while(1) {
      en_rx();
      fifoIdx = 0;
      while(FFIT) {
        nFFS = 0;
        LED = 1;
        fifo[fifoIdx++] = spi_trx(0xFF);
      }
      LED = 0;
      nFFS = 1;
      printFifo();
    }
  #endif
#else
  // Production mode
  round = 0x01;
  
  while(1) {
    // Transmit round number
    en_tx();
    while(nIRQ);
    wr_command(0xB8, 0x2D); // Sync pattern
    while(nIRQ);
    wr_command(0xB8, 0xA5);
    while(nIRQ);
    wr_command(0xB8, 0x5A);
    while(nIRQ);
    wr_command(0xB8, round); // Send current round
    while(nIRQ);
    wr_command(0xB8, 0xEF);
    while(nIRQ);
    en_idle();
    
    // Receive data from peripherals
    idx = 0;
    en_rx();
    timeOut = 0;
    T0CONbits.TMR0ON = 1; // Start timeout timer
    TMR0H = 0xF0;
    TMR0L = 0x00;
    while( (idx < 6) & !timeOut){
      while(!FFIT & !timeOut);
      nFFS = 0;
      fifo[idx++] = spi_trx(0x00);
      nFFS = 1;
    }
    T0CONbits.TMR0ON = 0; // Stop timer
    en_idle();
    if(timeOut) {
      timeOut = 0;
      LED = 1; // Indicate timeout
    }

    // Process received data
    if(fifo[0] == 0x5A)
    {
      checksum = 0;
      for(idx=1; idx<5; idx++)
      {
        checksum += fifo[idx];        
      }
      if(checksum == fifo[5])
      {
        LED = 1;
        switch(round)
        {
          case 1: 
            for(idx=0; idx<4; idx++) Port1[idx]+=fifo[idx+1];
          case 2:
            for(idx=0; idx<4; idx++) Port2[idx]+=fifo[idx+1];
          case 3: 
            for(idx=0; idx<4; idx++) Port3[idx]+=fifo[idx+1];
          case 4:
            for(idx=0; idx<4; idx++) Port4[idx]+=fifo[idx+1];
        }
        LED = 0;
      }
    }
          
    // PORT1
    if(Port1[0])
    {
      LED = 1;
      PS1_1 = 1;
      delay_ms(1);
      PS1_1 = 0;
      Port1[0]--;
      LED = 0;
    }
    if(Port1[1])
    {
      LED = 1;
      PS1_2 = 1;
      delay_ms(1);
      PS1_2 = 0;
      Port1[1]--;
      LED = 0;
    }
    if(Port1[2])
    {
      LED = 1;
      PS1_3 = 1;
      delay_ms(1);
      PS1_3 = 0;
      Port1[2]--;
      LED = 0;
    }
    if(Port1[3])
    {
      LED = 1;
      PS1_4 = 1;
      delay_ms(1);
      PS1_4 = 0;
      Port1[3]--;
      LED = 0;
    }
    
    // PORT2
        if(Port2[0])
    {
      LED = 1;
      PS2_1 = 1;
      delay_ms(1);
      PS2_1 = 0;
      Port2[0]--;
      LED = 0;
    }
    if(Port2[1])
    {
      LED = 1;
      PS2_2 = 1;
      delay_ms(1);
      PS2_2 = 0;
      Port2[1]--;
      LED = 0;
    }
    if(Port2[2])
    {
      LED = 1;
      PS2_3 = 1;
      delay_ms(1);
      PS2_3 = 0;
      Port2[2]--;
      LED = 0;
    }
    if(Port2[3])
    {
      LED = 1;
      PS2_4 = 1;
      delay_ms(1);
      PS2_4 = 0;
      Port2[3]--;
      LED = 0;
    }
    
    // PORT3
    if(Port3[0])
    {
      LED = 1;
      PS3_1 = 1;
      delay_ms(1);
      PS3_1 = 0;
      Port3[0]--;
      LED = 0;
    }
    if(Port3[1])
    {
      LED = 1;
      PS3_2 = 1;
      delay_ms(1);
      PS3_2 = 0;
      Port3[1]--;
      LED = 0;
    }
    if(Port3[2])
    {
      LED = 1;
      PS3_3 = 1;
      delay_ms(1);
      PS3_3 = 0;
      Port3[2]--;
      LED = 0;
    }
    if(Port3[3])
    {
      LED = 1;
      PS3_4 = 1;
      delay_ms(1);
      PS3_4 = 0;
      Port3[3]--;
      LED = 0;
    }
    
    // PORT4
    if(Port4[0])
    {
      LED = 1;
      PS4_1 = 1;
      delay_ms(1);
      PS4_1 = 0;
      Port4[0]--;
      LED = 0;
    }
    if(Port4[1])
    {
      LED = 1;
      PS4_2 = 1;
      delay_ms(1);
      PS4_2 = 0;
      Port4[1]--;
      LED = 0;
    }
    if(Port4[2])
    {
      LED = 1;
      PS4_3 = 1;
      delay_ms(1);
      PS4_3 = 0;
      Port4[2]--;
      LED = 0;
    }
    if(Port4[3])
    {
      LED = 1;
      PS4_4 = 1;
      delay_ms(1);
      PS4_4 = 0;
      Port4[3]--;
      LED = 0;
    }
    
    
    fifo[0] = 0x00;
    round %= 4;
    round += 1;
    
  }
#endif
}

void init_hardware(void) {
  // Set 8MHz internal oscillator
  OSCCONbits.IRCF = 7;
  delay1ktcy(1);
  
  ADCON1 = 0x0F; // Disable analog inputs
  
  init_counters();
  
  // Setup unused pins as outputs low
  unused1_TRIS = 0;
  unused2_TRIS = 0;
  unused3_TRIS = 0;
  unused4_TRIS = 0;
  unused5_TRIS = 0;
  unused6_TRIS = 0;
  
  unused1 = 0;
  unused2 = 0;
  unused3 = 0;
  unused4 = 0;
  unused5 = 0;
  unused6 = 0;
  
  // Setup LED
  TRISAbits.TRISA6 = 0; // LED output
  LED = 0; // output low
   
  // Setup RADIO pins
  TRISCbits.TRISC0 = 0; // nRES
  TRISCbits.TRISC1 = 0; // nFFS
  nRES = 1;
  nFFS = 1;
  
  // SPI
  TRISCbits.TRISC5 = 0; // SDO
  TRISCbits.TRISC4 = 1; // SDI
  TRISCbits.TRISC3 = 0; // SCK
  TRISCbits.TRISC2 = 0; // nSEL
  nSEL = 1;
  SSPCON1bits.SSPEN = 1; // enable SPI
  SSPCON1bits.CKP = 0; // idle bit low
  SSPCON1bits.SSPM0 = 0; // cleared Fosc/4 master mode. set for Fosc/16
  SSPSTATbits.SMP = 0; // sampled in the middle
  SSPSTATbits.CKE = 1; // transmit for idle to active
  SSPCON1bits.WCOL = 0;
  PIE1bits.SSPIE = 1; // enable SPI flag
  
  init_radio();
  init_timer();
}

void init_counters(void) {
  // Setup counters interface as outputs
  PS1_1_TRIS = 0;
  PS1_2_TRIS = 0;
  PS1_3_TRIS = 0;
  PS1_4_TRIS = 0;
  
  PS2_1_TRIS = 0;
  PS2_2_TRIS = 0;
  PS2_3_TRIS = 0;
  PS2_4_TRIS = 0;
  
  PS3_1_TRIS = 0;
  PS3_2_TRIS = 0;
  PS3_3_TRIS = 0;
  PS3_4_TRIS = 0;
  
  PS4_1_TRIS = 0;
  PS4_2_TRIS = 0;
  PS4_3_TRIS = 0;
  PS4_4_TRIS = 0;
  
  // Initialize counters to low
  PS1_1 = 0;
  PS1_2 = 0;
  PS1_3 = 0;
  PS1_4 = 0;
  
  PS2_1 = 0;
  PS2_2 = 0;
  PS2_3 = 0;
  PS2_4 = 0;
  
  PS3_1 = 0;
  PS3_2 = 0;
  PS3_3 = 0;
  PS3_4 = 0;
  
  PS4_1 = 0;
  PS4_2 = 0;
  PS4_3 = 0;
  PS4_4 = 0;
}

void init_radio(void) {
  // RADIO reset
  delay_ms(100);
  nRES = 0;
  delay_ms(10);
  nRES = 1;
  delay_ms(100);
  wr_command(0x00, 0x00); // clear POR interrupt by getting status
  delay_ms(100);
  
  // Radio Enable and configuration
  wr_command(0x80, 0x28); // Config setting command all FIFO + 868 + 12.5pF
  wr_command(0x82, 0x09); // Power Management Command. Idle + noClkOut
  wr_command(0xCA, 0x82); // FIFO fill when Synchon Pattern received. 2 bytes Synchon
  wr_command(0xCE, 0xA5); // Set 2nd byte to 0xA5
}

void init_timer(void) {
  // Set Timer0
  T0CONbits.T08BIT = 0;
  T0CONbits.T0CS = 0;
  T0CONbits.PSA = 0;
  T0CONbits.T0PS0 = 1;
  T0CONbits.T0PS1 = 1;
  T0CONbits.T0PS2 = 1;
  T0CONbits.TMR0ON = 0;
  INTCONbits.TMR0IF = 0;
  INTCONbits.TMR0IE = 1;
  INTCONbits.GIE = 1; // global interrupts
}

