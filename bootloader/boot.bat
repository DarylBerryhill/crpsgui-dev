@echo off
:: this is designed to be used with CRPS GUI
::

set PORT=%1
set FILE=%2
cd bootloader
echo boo > %PORT%
mode %PORT% Data=8 Parity=n Baud=115200 DTR=OFF RTS=OFF to=off
avrosp.exe -dATxmega128A1 -c%PORT% -s -q -bs -e -z -pf -vf -if%FILE% 1>progResults.tmp
echo E > %PORT%
cd 2>&1
copy progResults.tmp progResults.log
del progResults.tmp