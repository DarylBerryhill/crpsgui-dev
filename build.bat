@echo off

:: -----------------------------------------------------------------------------
:: delete previous crpsgui.exe files
:: -----------------------------------------------------------------------------
del /Q \CRPSgui\release\crpsgui.exe
del /Q \RuggedPortable\CRPS\crpsgui.exe
del /Q %HOMEPATH%\Documents\GitHub\MPS-Production-Diagnostics\CRPS\crpsgui.exe

:: -----------------------------------------------------------------------------
:: build electron project to  a EXE
:: -----------------------------------------------------------------------------
call npm run makeExe

:: -----------------------------------------------------------------------------
:: delete all work files and folders
:: -----------------------------------------------------------------------------
rmdir /Q /S release\win-unpacked\ 1>NUL
del /Q release\*.yml 1>NUL
del /Q release\*.yaml 1>NUL
del /Q release\*.blockmap 1>NUL


:: -----------------------------------------------------------------------------
:: make some copys of EXE file
:: -----------------------------------------------------------------------------
copy \CRPSgui\release\crpsgui.exe \RuggedPortable\CRPS\crpsgui.exe
copy \CRPSgui\release\crpsgui.exe  %HOMEPATH%\Documents\GitHub\MPS-Production-Diagnostics\CRPS\crpsgui.exe

