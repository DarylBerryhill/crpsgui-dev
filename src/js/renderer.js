// Rules to satisfy JSLint requirements. http://jslint.com/
/* jslint  browser: true, esnext: true, multivar: true, node: true */

/*
Microsoft Word line character count in
   left margin: 0.7"
   right-margin:0.5"
font  columns
 8      107
 9      97
 10     87
 11     79
 12     72
 14     62
 16     54
 18     48
 20     43

1         2         3         4         5         6         7         8         9
1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567

*/
// this add program prefrences and cache data to
// \users\{userName}\AppData\Roaming\crpsgui
// \Users\{userName}\AppData\Local\Programs\crpsgui
// adds desktop shortcut
// add shortcut entry to Start menu/Programs
"use strict";

// PAT token "CRPS gui  auto-update development "
// will expire Thu, nov 18, 2021
// set GH_TOKEN =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
//                "provider": "github",
//                "owner": "RPC-MaxVision",
//                "repo": "CRPS-gui",
//                "token": "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"

// PAT token for personal github
// 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
//                "provider": "github",
//                "owner": "DarylBerryhill",
//                "repo": "CRPS-gui",
//                "token": "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"

const requiredFirmware = "04.01.00.569";


// --------------------------------------------------------------------------
//  Import library modules
// --------------------------------------------------------------------------
// import electron
const {remote, ipcRenderer } = require('electron');
const {app} = require('electron').remote;

// import electron dialog module
const dialog   = remote.dialog;
const WIN      = remote.getCurrentWindow();

// import file system module
const fs       = require('fs');
const {spawn}  = require("child_process");

// import Node SerialPort Docs: https://serialport.io/docs/guide-usage/
const SerialPort     = require('serialport');
const packageVersion = require('serialport/package');

// import serial read line parser
const Readline   = require('@serialport/parser-readline');

// options for serial read line parser
const readlineOptions = {delimiter: "\r", encoding: "utf8"};

// import serialport open options object
const openOptions = require(__dirname + '/src/json/serialOptions.json');

// import tabs module
const tabs      = require('tabs');

// --------------------------------------------------------------------------
//  Import custom user modules
// --------------------------------------------------------------------------
// import EEPROM Utilities
const eeprom = require(__dirname + '/src/js/modules/eepromUtil.nmjs');

// import Front Panel Control
const fpio = require(__dirname + '/src/js/modules/fpio.nmjs');

// import CHARGER Utilities
// const charger = require(__dirname + '/src/js/modules/chargerUtil.nmjs');

process.env.GH_TOKEN = "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";

let guiVersion       = ``;

// let getElementIdNodes = {};
    let container = "";
    let parseLine = {};
    let hostConnected = "";
    let autoUpdateTimeout = 0;
    let mps_Mode  = "firmware";

// may not used
    let Ready     = {};
    let parser    = {};
    let Regex     = {};
    let mpsQuery  = {};
    let resetStatusEL    = {};


// *** HEADER snippet element id's ***
// COM ports
    let scanPortsBtn     = {};
    let portSelectList   = {};
    let openCloseBtn     = {};
    let connectMessage   = {};
    let portMessage      = {};
    let portError        = {};
    let selectedPort     = "";


// refresh and reset
    let RefreshBtn       = {};
    let autoUpdateRadio  = {};
    let resetBtn         = {};


// revision
    let processor        = {};
    let firmware         = {};
    let bootloader       = {};
    let outdatedEl       = {};


// *** MAIN: Control snippet element id's ***
    let systemStatusCTRL = {};
    let dcgood           = {};
    let PSON             = {};
    let _12ven           = {};
    let BATTON           = {};
    let operatingMode    = {};
    let systemState      = {};

// Diagnostic mode
    let productionBtn    = {};
    let debugBtn         = {};
    let chattyBtn        = {};
    let silentBtn        = {};

// Utilitiy buttons
    let set_currentEL    = {};
    let set_currentWinEL = {};
    let calibrateEL      = {};
    let calibrateWinEL   = {};
    let run_scriptEL     = {};
    let run_scriptWinEL  = {};
    let eepromEL         = {};
    let eeprom_winEL     = {};
    let eepromData       = {};

// *** MAIN: Charger control snippet element id's ***
    let set_voltageEL    = {};
    let controlPanel     = {};
    let controllersEL    = {};
    let set_voltageWinEL = {};

// for auto-update notifications
    let notification  = {};
    let message       = {};
    let restartButton = {};


// Diagnostic log
    let outputLog        = {};
    let clear_log        = {};
    let save_log         = {};
    let log              = {};


    let dataByte    = [];
    let port               = {};
    let hardwareTimeout    = 0;
    let portString         = "";
    let controller         = [ {},{},{},{},{} ] ;
    let operatingModeState = { value: 0 , state: [] };

    // Define System State modes
    operatingModeState.state[8]   = "backup mode";
    operatingModeState.state[64]  = "System OFF AC ON  Ext28 OFF (blink green)";
    operatingModeState.state[194] = "System OFF AC OFF EXT28 ON (blink yellow)";
    operatingModeState.state[192] = "System OFF AC ON  EXT28 ON (blink yellow, green)";
    operatingModeState.state[0]   = "System ON  AC ON  EXT28 OFF (solid green)";
    operatingModeState.state[130] = "System ON  AC OFF Ext28 ON (solid yellow)";
    operatingModeState.state[128] = "System ON  AC ON  Ext28 ON (solid green)";
    operatingModeState.state[66]  = "Power-up from battery";
    operatingModeState.state[2]   = "invalid power-up";


let options =
{
 // Placeholder 1
 title: "Save file - Electron example",

 // Placeholder 2
 defaultPath : "log.txt",

 // Placeholder 4
 buttonLabel : "Save Electron File",

 //Placeholder 3
 filters :
 [
  {name: 'Text',             extensions: ['txt']},
  {name: 'Images',           extensions: ['jpg', 'png', 'gif']},
  {name: 'Movies',           extensions: ['mkv', 'avi', 'mp4']},
  {name: 'Custom File Type', extensions: ['as']},
  {name: 'All Files',        extensions: ['*']}
 ]
};



let x =
{
  aInternal: 0,
  aListener: function(val) {},
  set a(val)
  {
    this.aInternal = val;
    this.aListener(val);
  },
  get a()
  {
    return this.aInternal;
  },
  registerListener: function(listener)
  {
    this.aListener = listener;
  }
};

x.registerListener(function(val)
{
  console.log("value of x.a changed to " + val);
});



// import a revealing module pattern object function
const crps = (function ()
{

    // private locally scoped object, variables
    let _myVar = 4;
    let _myObject = { };
    let _privateMethod = function (m) { return m; };

    _myObject.someMethod = function ()
    {
        _privateMethod(_myVar);
    };

    // only make public these objects using alias
    return {
        public: _myObject ,
    };

})();



let m1;
let m2;

const openPort =(el)=>
{
    selectedPort = "";

    selectedPort = portSelectList.options[portSelectList.options.selectedIndex].value;

    // create new port handle
    port = new SerialPort(selectedPort, openOptions);
    parseLine = port.pipe(new Readline(readlineOptions));

    // character event
    port.on('data', (c)=>
    {
        // in bootloader mode first character is  a '?'
        if ( (c[0] === 63) & (hostConnected === "") )
        {
            console.log(`   bootloader connected:  `);

            hostConnected = "bootloader";
            clearInterval(autoUpdateTimeout);
            clearTimeout(hardwareTimeout);
            mps_Mode = "bootloader";

            document.getElementById('Bootload').checked = true;
            document.getElementById('Firmware').checked = false;
            document.getElementById('firmwareCtrl').setAttribute('hidden', true);


            // hide un-needed fields
            document.getElementById('openClose').innerText = 'Open Port';
            document.getElementById('connectMessage').innerHTML = 'not connected';
            document.getElementById('controlPanel').style.visibility = 'hidden';
            document.getElementById('systemStatusCTRL').style.visibility = 'hidden';


            // show bootloader program option
            document.getElementById('flashProg').style.visibility = 'visible';
            return 0;
//
//            setTimeout(()=>
//            {
//                // timeout expired, attempt to drain, flush, close
//                // close port
//                port.drain((e)=>
//                {
//                    console.log(`drain complete`);
//                    console.log(e);
//
//                    port.flush((er)=>
//                    {
//                        console.log(`flush complete`);
//                        console.log(er);
//
//                        port.close();
//
//                        if ( port.isOpen ) { console.log(`port is open`); }
//                        else
//                        { console.log(`port is closed`); }
//                    });
//                });
//            }, 50);

        } // end if Char '?'
    });

    // data new-line event
    parseLine.on('data', (d)=> { receiveData(d); });

    port.open( (err)=>
    {
        let message = "";

        console.log(`port ${selectedPort} is open from ${openPort.name}`);

        if (err)
        {
            if (err.message.includes('Unknown error') )
            {
                 message = `Error: ${err.message}  Check serial port driver.`;
            }
            else
            {
                 message = `Error: ${err.message} Make sure RealTerm port is closed.`;
            }

            portMessage.classList.remove('hide');
            portMessage.classList.add('red');
            portMessage.innerHTML = message;
            return;
        }

        // save config object
        fs.writeFile('crpsConfig.txt', selectedPort, (err) => { } );


        // clear old connect/error messages
        openCloseBtn.innerText   = 'Close Port';
        connectMessage.innerHTML = ` Connected to ${portString} `;
        systemStatusCTRL.style.visibility = 'visible';
        portMessage.classList.remove('red');
        portMessage.classList.add('hide');
        portMessage.innerHTML = '';
        outputLog.value       = '';
        log.style.visibility          = 'visible';
        controlPanel.style.visibility = 'visible';
        checkBootloader(openCloseBtn, 50);
    });

    // does not emit on port open errors
    port.on('error', (err)=> { });
    port.close( (err)=> { });
}; // end of openPort()

const closePort =(el)=>
{
            port.close();                               // close port
            el.target.innerText = 'Open Port';     // change button text
            connectMessage.innerHTML = 'not connected'; // change connect text
            portMessage.innerHTML = '';
            portMessage.classList.add('hide');
            portMessage.classList.remove('red');
           //  systemStatusCTRL.setAttribute('hidden', true);
            systemStatusCTRL.style.visibility = 'hidden';

            // controlPanel.setAttribute('hidden', true);
            controlPanel.style.visibility = 'hidden';

            log.style.visibility = 'hidden';
            firmware.innerHTML   = '';
            bootloader.innerHTML = '';
            processor.innerHTML  = '';

            // stop auto update and reset button
            RefreshBtn.removeAttribute('disabled');
            RefreshBtn.style.backgroundColor = 'white';
            autoUpdateRadio.checked = false;
            clearInterval(autoUpdateTimeout);

            // rescan ports
            getPortList();
}; // end of closePort()


const openClosePort = (el)=>
{
    // port is closed, open port
    if ( (port.isOpen === false) || (port.isOpen === undefined) )
    {
        openPort(el);
    }
    // port is open, close port
    else
    {
        closePort(el);
    }

}; // end of openClosePort()


// gets called when HTML onclick event for Enter Bootload Mode button
const enterBootload = ()=>
{
    port.write('boo\r');
    console.log(`writing  [crpsConfig.txt] file with ${selectedPort}`);

    fs.writeFile('crpsConfig.txt', selectedPort, (err) =>
    {  setTimeout(()=> { ipcRenderer.send('restart-app'); }, 250); } );

}; // end of manual boot loader mode

const abortBootload = ()=>
{
    console.log(`Aborting bootload mode`);

    port.write('E');

    fs.writeFile('crpsConfig.txt', selectedPort, (err) => { } );

    // delete file
    // fs.unlink('crpsConfig.txt', (err) => { console.log( `[crpsConfig.txt] deleted`); });

    // wait a bit then then relaunch app
    setTimeout(()=> { ipcRenderer.send('restart-app'); }, 500);


    // show hidden elements
    // openCloseBtn.innerText = 'Close Port';
    // document.getElementById('connectMessage').innerHTML = `connected to ${selectedPort} `;
    // document.getElementById('controlPanel').style.visibility = 'visible';
    // document.getElementById('systemStatusCTRL').style.visibility = 'visible';

};

const programFirmware = () =>
{
    let program = {};
    let cnt = 13;
    let cnt_handle = 0;
    let fname    = "bootloader\\boot.bat";  // bootload BAT file to spawn
    let userFile = "CRPS.hex";              // default HEX file

    // show progress bar
    document.getElementById('bootloadFile').style.visibility = "visible";


    // start count down timer to update progress bar
    cnt_handle = setInterval(function()
    {
        cnt--;
        document.getElementById('bootloadProgressLabel').innerText = cnt + ' sec';
        document.getElementById('bootloadFile').value = cnt * 7.692; // start at 13 sec
        // stop countdown at 0
        if ( cnt <= 0) { clearInterval(cnt_handle); }
    }, 1000);

    // save connected COM port to auto reconnect
    // consider a JSON object here
    fs.writeFile('crpsConfig.txt', selectedPort, (err) => { });

    // check if user has manualy selected a hex file
    if ( document.getElementById('hexfile').files.length )
    { userFile = document.getElementById('hexfile').files[0].path; }

    // close port if open
    if ( port.isOpen )
    {
        // attempt to drain, flush, close
        // close port
        port.drain((e)=>
        {
            console.log(`drain complete`);
            console.log(e);

            port.flush((er)=>
            {
                console.log(`flush complete`);
                console.log(er);

                port.close();

                if ( port.isOpen ) { console.log(`port is open`); }
                else
                {
                    console.log(`port is closed`);
    console.info(`Spawning (${fname}) programming hex file (${userFile}) on port (${selectedPort})`);


    program = spawn(fname, [`${selectedPort}`, `${userFile}`]);
    program = program.stdout.pipe(process.stdout);

                }
            });
        });

    } //end port Open
    else
    {
    console.info(`Spawning (${fname}) programming hex file (${userFile}) on port (${selectedPort})`);

    program = spawn(fname, [`${selectedPort}`, `${userFile}`]);
    program = program.stdout.pipe(process.stdout);

    }



};


//  get all element ID nodes
const getElementIdNodes = ()=>
{
    console.log(`Setting html element ID attribute node references`);
    // *** PageHeader: element ID nodes ***
    // port buttons open/close and conenct message
    scanPortsBtn     = document.getElementById('scanPorts');
    portSelectList   = document.getElementById('portSelectList');
    openCloseBtn     = document.getElementById('openClose');
    connectMessage   = document.getElementById('connectMessage');
    // MCU reset and refresh
    systemStatusCTRL = document.getElementById('systemStatusCTRL');
    RefreshBtn       = document.getElementById('Refresh');
    autoUpdateRadio  = document.getElementById('autoUpdate');
    resetBtn         = document.getElementById('reset');
 //       resetStatusEL    = document.getElementById('resetStatus');
    // MCU info
    processor        = document.getElementById('processor');
    firmware         = document.getElementById('firmware');
    bootloader       = document.getElementById('bootloader');
    outdatedEl       = document.getElementById('outdated');
    // port messages and errors
    portMessage      = document.getElementById('portMessage');


    // *** Main: element ID nodes ***
     // Control panel
    controlPanel     = document.getElementById('controlPanel');
    // move and define controller[1]. element ID nodes here.

    // Chargers and controlers

    // output log
    controllersEL  = document.getElementById('controllers');
    outputLog      = document.getElementById('outputLog');
    clear_log      = document.getElementById('clear_log');
    save_log       = document.getElementById('save_log');
    log            = document.getElementById('log');
 //   productionBtn  = document.getElementById('production');
 //   debugBtn       = document.getElementById('debug');
  //  chattyBtn      = document.getElementById('chatty');
 //   silentBtn      = document.getElementById('silent');
    dcgood         = document.getElementById('dcgood');
    PSON           = document.getElementById('PSON');
  //  _12ven         = document.getElementById('12ven');
    BATTON         = document.getElementById('BATTON');
    operatingMode  = document.getElementById('operatingMode');
    systemState    = document.getElementById('systemState');
    set_voltageEL   = document.getElementById('set_voltage');
    set_voltageWinEL  = document.getElementById('set_voltageWin');
    set_currentEL  = document.getElementById('set_current');
    set_currentWinEL  = document.getElementById('set_current');
    calibrateEL    = document.getElementById('calibrate');
    calibrateWinEL = document.getElementById('calibrate');
    run_scriptEL   = document.getElementById('run_script');
    run_scriptWinEL = document.getElementById('run_script');

    // EEPROM utilities
    eepromEL       = document.getElementById('eeprom_util');
    eeprom_winEL   = document.getElementById('eeprom_win');
    eepromData     = document.getElementById('eeprom');
}; // end getElementIdNodes()


// window.addEventListener('DOMContentLoaded', () => { console.log('DOM loaded'); });
// window.addEventListener('load',             () => { console.log('load event'); });


//        let scriptTag2 = document.createElement('script');
//        scriptTag2.src = 'src/js/viewPDF.js';
//        scriptTag2.type = 'text/javascript';
//        document.getElementsByTagName('head')[0].appendChild(scriptTag2);


// global variable for user resizing
// let previousWidth = 1697;

/*
window.onresize = function(e)
{
    let s = 0;
    let el = {};
    let increasing = 0;
    let decreasing = 0;
    let currentWidth = 0;
    let step = 0.50;
    let minimumWidth = 1207;
    let maximumWidth = 1697;
    let newFont = 0;


    el = document.getElementsByTagName("body")[0];
    s = window.getComputedStyle(el, null).getPropertyValue("font-size");
    newFont =   Number( s.replace('px','') );
    currentWidth = e.target.outerWidth;

    if ( currentWidth >= 1694 ) { document.body.style.fontSize = "16.00px" }
    if ( currentWidth <= 1683 ) { document.body.style.fontSize = "15.75px" }
    if ( currentWidth <= 1672 ) { document.body.style.fontSize = "15.50px" }
    if ( currentWidth <= 1661 ) { document.body.style.fontSize = "15.25px" }
    if ( currentWidth <= 1650 ) { document.body.style.fontSize = "15.00px" }
    if ( currentWidth <= 1639 ) { document.body.style.fontSize = "14.75px" }
    if ( currentWidth <= 1628 ) { document.body.style.fontSize = "14.50px" }
    if ( currentWidth <= 1617 ) { document.body.style.fontSize = "14.25px" }
    if ( currentWidth <= 1606 ) { document.body.style.fontSize = "14.00px" }
    if ( currentWidth <= 1595 ) { document.body.style.fontSize = "13.75px" }
    if ( currentWidth <= 1584 ) { document.body.style.fontSize = "13.50px" }
    if ( currentWidth <= 1573 ) { document.body.style.fontSize = "13.25px" }
    if ( currentWidth <= 1562 ) { document.body.style.fontSize = "13.00px" }
    if ( currentWidth <= 1551 ) { document.body.style.fontSize = "12.75px" }
    if ( currentWidth <= 1540 ) { document.body.style.fontSize = "12.50px" }
    if ( currentWidth <= 1529 ) { document.body.style.fontSize = "12.25px" }
    if ( currentWidth <= 1518 ) { document.body.style.fontSize = "12.00px" }
    if ( currentWidth <= 1507 ) { document.body.style.fontSize = "11.75px" }
    if ( currentWidth <= 1496 ) { document.body.style.fontSize = "11.50px" }
    if ( currentWidth <= 1485 ) { document.body.style.fontSize = "11.25px" }
    if ( currentWidth <= 1474 ) { document.body.style.fontSize = "10.25px" }
    if ( currentWidth <= 1467 ) { document.body.style.fontSize = "10.00px" }
    if ( currentWidth <= 1452 ) { document.body.style.fontSize = "9.75px" }
    if ( currentWidth <= 1441 ) { document.body.style.fontSize = "9.50px" }
    if ( currentWidth <= 1430 ) { document.body.style.fontSize = "9.25px" }
    if ( currentWidth <= 1419 ) { document.body.style.fontSize = "9.00px" }

  console.log( `width: ${currentWidth} font: ${s}  new font: ${newFont} `);

};
*/


/*
// does not fire
window.onpaint = function(e)
{
    console.log("document.onpaint"  );
};
// does not fire
document.onload = function(e)
{
    console.log("document.onload"  );
};

// document.onreadstatechange 'complete'
*/


/*

dialog.showSaveDialog(WIN, options, (fileName) =>
{
    if (fileName === undefined) {console.log(`abort`);  return; }

    console.log(` saving ${fileName} ...`);
    fs.writeFile(fileName, "this is a test from dialog", function (err)
    {
        if (err) { console.error(err); }
        console.log(`   filename ${fileName}`);
        console.log(`   Done writing via dialog`);
    });
});

fs.writeFile("log.txt", "this is a test", function (err)
{
    if (err) { console.error(err); }
    console.log(`   Done writing`);
});

*/



// Charger utilities
function getRegisters()
{
    let cntrl   = 0;
    let section = 0;

    cntrl   = document.querySelector("input[type='radio'][name='ctrl']:checked");
    cntrl   = Number(cntrl.value);

    section = document.querySelector("input[type='radio'][name='section']:checked");
    section = (section.value);

    port.write(`get chargerreg ${cntrl} ${section} \r`);

}

function showRegisters(showID)
{
    const showID_el = document.getElementById( showID );

    // show selected element
    showID_el.removeAttribute( 'hidden' );

    // hide the other elements
    document.getElementById( 'setVoltageUI' ).setAttribute('hidden', true);
    document.getElementById( 'rampVoltageUI' ).setAttribute('hidden', true);
}

function setChargerVoltage()
{

   let cntrl   = 0;
   let section = 0;
   let voltage = 0;

    cntrl   = document.querySelector("input[type='radio'][name='ctrl']:checked");
    cntrl   = Number(cntrl.value);

    section = document.querySelector("input[type='radio'][name='section']:checked");
    section = (section.value);

    voltage = document.getElementById("volt");
    voltage = Number(voltage.value);

    port.write(`set voltage ${cntrl} ${section} ${voltage}\r`);
}

function showSetVoltage(showID)
{
    const showID_el = document.getElementById( showID );

    // show selected element
    showID_el.removeAttribute( 'hidden' );

    // hide the other elements
    document.getElementById( 'rampVoltageUI' ).setAttribute('hidden', true);
    document.getElementById( 'RegistersUI' ).setAttribute('hidden', true);
}

function showRampVoltage(showID)
{
    const showID_el = document.getElementById( showID );

    // show selected element
    showID_el.removeAttribute( 'hidden' );

    // hide the other elements
    document.getElementById( 'setVoltageUI' ).setAttribute('hidden', true);
    document.getElementById( 'RegistersUI' ).setAttribute('hidden', true);
}

// scans ports and populates drop-down list with serial ports
// also differentiates between virtual and hardware serial ports
const getPortList = ()=>
{
  SerialPort.list().then((ports, err) =>
  {
      let newOption;
      let newContent;
      let type = "";


      if(err)
      {
          portMessage.classList.remove('hide');
          portMessage.classList.add('red');
          portMessage.innerHTML = err.message;
          return;
      }
      else
      {
//          portMessage.classList.remove('red');
//          portMessage.classList.add('hide');
//          portMessage.innerHTML = 'Scanning ports ...';
      }

      if (ports.length === 0)
      {
          portMessage.classList.remove('hide');
          portMessage.classList.add('red');
          portMessage.innerHTML = 'No ports discovered';
          return;
      }

      portMessage.classList.remove('red');
      portMessage.classList.remove('hide');
      portMessage.classList.add('bold');

      if ( ports.length === 1)
      {portMessage.innerHTML = `Found ${ports.length} port.
                                Select from drop-down list. Click open port.`; }

      if ( ports.length > 1)
      {portMessage.innerHTML = `Found ${ports.length} ports.
                                Select from drop-down list. Click open port.`; }

      // clear drop=down list
      portSelectList.innerHTML = '';

      // populate drop down list
      ports.forEach((element) =>
      {
          type = element.vendorId === undefined ? "hardware " : "virtual ";
          portString = element.path + ' (' +element.manufacturer + ') ' + type;
          // create a dropdown list of port names
          newContent = document.createTextNode( portString );
          newOption  = document.createElement("option");
          newOption.setAttribute("value", element.path);

          if (type === "virtual ")
          {
              newOption.setAttribute("selected", true);
          }
          newOption.appendChild(newContent);
          portSelectList.appendChild(newOption);
          portSelectList.setAttribute("size", ports.length);
      });
  });
}; // end getPortList()







            // Example data packet
            //  240 04.00.00.550P 01.03.00.167B 76 L 30 12 8 8 130 3 32
            //
            // Data packet protocol
            // byte #0:  240 header byte
            // byte #1:  04.00.00.550  firmware revision string
            // byte #2:  01.03.00.167B bootloader revision string
            // byte #3:  76 MCU.DEVID2 type 76='A1', 77='B1'
            // byte #4:  'L'MCU.REVID + 65 'L' most current
            // byte #5:  30 expander #1 input register
            // byte #6:  12 expander #2 input register
            // byte #7:   8 expander #3 input register
            // byte #8:   8 expander #4 input register
            // byte #9:  Controller #1  charger A voltage
            // byte #10: Controller #1  charger B voltage
            // byte #11: Controller #2  charger A voltage
            // byte #12  Controller #2  charger B voltage
            // byte #13: Controller #3  charger A voltage
            // byte #14: Controller #3  charger B voltage
            // byte #15: Controller #4  charger A voltage
            // byte #16: Controller #4  charger B voltage
            // byte #17: system ON charge current
            // byte #18: system OFF charge current
            // byte #19:  14 charger current
            // byte #20:  130 FP IO byte, operating mode state
            // byte #21   3 mode status
            // byte #22:  32 reset status
            // byte #23  charger status 1A
            // byte #24  charger status 1B
            // byte #25  charger status 2A
            // byte #26  charger status 2B
            // byte #27  charger status 3A
            // byte #28  charger status 3B
            // byte #29  charger status 4A
            // byte #30  charger status 4B
            //  a few more that is not here
// receive data event
function receiveData(d)
{
    let mps_Mode       = "";
    let GUI            = '240';
    let eepromRawData  = '241';
    let chargerRegData = '242';
//    let eepromDataArr = [];
//    let dataByte    = [];
    let firstByte   = 0;
    let MCUid       = "";
    let expander    = 0;
    let ModeStatus  = 0;
    let resetDecode = 0;
    let bit0Mask = 0x01;
    let bit1Mask = 0x02;
    let bit2Mask = 0x04;
    let bit3Mask = 0x08;
    let bit4Mask = 0x10;
    let bit5Mask = 0x20;
    let bit6Mask = 0x40;
    let bit7Mask = 0x80;

// console.log(`data line received`);
// console.log( d );

    // check if bootloader mode has started. first char is '?'
    if ( d[0] === 0x63)
    {
        console.log(`  bootloader connected: from ${receiveData.name} `);

        hostConnected = "bootloader";
        clearInterval(autoUpdateTimeout);
        clearTimeout(hardwareTimeout);
        mps_Mode = "bootloader";
        return 0 ;
    }

    // clear hardware timeout and hide port error message
    clearTimeout(hardwareTimeout);
    portMessage.innerHTML = '';
    portMessage.classList.add('hide');
    portMessage.classList.remove('red');


    // === clean up data packet string ===
    // 1) remove duplicate white space (space, tab, line break) from
    //    middle of string
    // 2) remove white space (space, tab, line break) from start and
    //    end of string.
    // 3) Convert to an array
    dataByte = d.replace(/\s+/g, ' ')
                .trim()
                .split(' ');


    // 4) get first data byte in array
    firstByte = dataByte[0];

    // consider a switch-case here

    // check if MPS is in normal mode by sending '?\n'
    // it should return 'crps'
    if ( firstByte.includes('crps') )
    {
        console.log(`crps connected:  `);
        mps_Mode = "crps";
        document.getElementById('Firmware').checked = true;
        document.getElementById('Bootload').checked = false;
        port.write('mode gui\r');
    }


    // header byte is '242' (0xF2)
    // all 13 registers of a given charger
    // Example: 242 2 211 0 14 192 112 128 57 0 0 9 88 1
    else if ( firstByte.includes(chargerRegData) )
    {
                    let regId = {};
                    let regData = 0;

                    for (loop = 1; loop < dataByte.length; loop++)
                    {
                        regData = Number(dataByte[loop]);
                        regId = document.getElementById('reg'+loop);
                        regId.value = "";
                        regId.placeholder = convertStatustoStr(regData);
                    } // end of for-(loop)

                } // end of else-if (242)

    // header byte is '241' (0xF1)
    // This is the entire eeprom data dump
    else if ( firstByte.includes(eepromRawData) )
    {
        let eepromData      = document.getElementById('eeprom');
        let eepromDataClass = eepromData.getElementsByClassName('eepromData');
        let loop      = 0;
        let fdata     = '';
        let AsciiChar = '';

        for (loop= 1; loop < dataByte.length; loop++)
        {
            fdata = Number(dataByte[loop]).toString(16).toUpperCase();
            fdata = fdata.padStart(2, '0');

            // for the first 4 rows of eeprom data convert to text
            if (loop <= 64)
            {
                // convert to ascii character if a printable character
                if ( (Number(dataByte[loop]) >= 32) & (Number(dataByte[loop]) <= 126) )
                {
                    AsciiChar = String.fromCharCode(Number(dataByte[loop]));
                    eepromDataClass[loop-1].innerHTML = AsciiChar;
                }
                // if not a printable character just use ascii code
                else
                {
                    eepromDataClass[loop-1].innerHTML = Number(dataByte[loop]);
                    if (eepromDataClass[loop-1].innerHTML === '0')
                    {
                        eepromDataClass[loop-1].innerHTML = 'nul';
                    }
                }
            }
            else
            {
                eepromDataClass[loop-1].innerHTML = fdata;
            }
        }
    } // end if

    // process if GUI string starts with '240' (0xF0)
    // this is a multi byte data formatted array
    else if ( firstByte.includes(GUI) )
    {
        // decode data bytes
        firmware.innerHTML   = dataByte[1];
        if ( dataByte[1] !== requiredFirmware )
        {
    document.getElementById('outdated').innerHTML = `Firmware outdated. Requires ${requiredFirmware}`;
    document.getElementById('outdated').classList.add('red');
        }
        bootloader.innerHTML = dataByte[2];
        if (dataByte[3] === '76') { MCUid = 'A1'; } // 'L'
        if (dataByte[3] === '77') { MCUid = 'B1'; } // 'M'
        processor.innerHTML  = 'Atmel XMEGA128' + MCUid  + '  rev ' + dataByte[4];

        operatingModeState.value = (dataByte[20]);
        ModeStatus  = Number(dataByte[21]);
        resetDecode = Number(dataByte[22]);


        // decode data bytes 5,6,7,8 for controllers 1 - 4
        for (expander = 1; expander<= 4; expander++)
        {

            // show only the available controllers
            if ( (dataByte[expander+4]) !== '0')
            {
                controller[expander].el.classList.remove('hide');
                //   controller[expander].el.classList.add('show');
            }

            // decode battery present -- bit 2
            if ( !!(dataByte[expander+4] & bit2Mask) )
            { controller[expander].battery.innerHTML = "Battery installed"; }
            else
            { controller[expander].battery.innerHTML = "no Battery"; }

            // decode voltage / current threshold byte
            controller[expander].status = Number(dataByte[expander+4]);

            controller[expander].statusEL.innerHTML =
            convertStatustoStr(controller[expander].status );


            // decode bit masking for voltage / current threshold byte
            //       Charger A --
            if ( (!!(controller[expander].status & bit0Mask)) === false &&
                     (!!(controller[expander].status & bit4Mask)) === false )
            {
                controller[expander].AVth.classList.remove('orange');
                controller[expander].AIth.classList.remove('yellow');
                controller[expander].AStatus.innerHTML = " (low not charging)";
            }
            if ( (!!(controller[expander].status & bit0Mask)) === true &&
                    (!!(controller[expander].status & bit4Mask)) === false )
            {
                controller[expander].AVth.classList.add('orange');
                controller[expander].AIth.classList.remove('yellow');
                controller[expander].AStatus.innerHTML = " (ok not charging)";
            }
            if ( (!!(controller[expander].status & bit0Mask)) === false &&
                    (!!(controller[expander].status & bit4Mask)) === true )
            {
                controller[expander].AVth.classList.remove('orange');
                controller[expander].AIth.classList.add('yellow');
                controller[expander].AStatus.innerHTML = " (low charging)";
            }
            if ( (!!(controller[expander].status & bit0Mask)) === true &&
                    (!!(controller[expander].status & bit4Mask)) === true )
            {
                controller[expander].AVth.classList.add('orange');
                controller[expander].AIth.classList.add('yellow');
                controller[expander].AStatus.innerHTML = " (ok charging)";
            }

            //        Charger B --
            if ( (!!(controller[expander].status & bit1Mask)) === false &&
                    (!!(controller[expander].status & bit5Mask)) === false)
            {
                controller[expander].BVth.classList.remove('orange');
                controller[expander].BIth.classList.remove('yellow');
                controller[expander].BStatus.innerHTML = " (low not charging)";
            }
            if ( (!!(controller[expander].status & bit1Mask)) === true &&
                    (!!(controller[expander].status & bit5Mask)) === false)
            {
                controller[expander].BVth.classList.add('orange');
                controller[expander].BIth.classList.remove('yellow');
                controller[expander].BStatus.innerHTML = " (ok not charging)";
            }
            if ( (!!(controller[expander].status & bit1Mask)) === false &&
                    (!!(controller[expander].status & bit5Mask) )=== true)
            {
                controller[expander].BVth.classList.remove('orange');
                controller[expander].BIth.classList.add('yellow');
                controller[expander].BStatus.innerHTML = " (low charging)";
            }
            if ( (!!(controller[expander].status & bit1Mask)) === true &&
                    (!!(controller[expander].status & bit5Mask)) === true)
            {
                controller[expander].BVth.classList.add('orange');
                controller[expander].BIth.classList.add('yellow');
                controller[expander].BStatus.innerHTML = " (ok charging)";
            }

            // *********************************************************
            //  Expander output register decode -- Controller  1 - 4
            // *********************************************************
            controller[expander].greenLedBit7  = !!(dataByte[expander+4] & bit7Mask);
            controller[expander].redLedBit6    = !!(dataByte[expander+4] & bit6Mask);
            controller[expander].mChargeEnBit3 = !!(dataByte[expander+4] & bit3Mask);

            if ( controller[expander].greenLedBit7 )
            {
                controller[expander].GreenBtn.classList.add('green');
                controller[expander].GreenBtn.setAttribute('ledState', 'on');
            }
            else
            {
                controller[expander].GreenBtn.classList.remove('green');
                controller[expander].GreenBtn.setAttribute('ledState', 'off');
            }

            if ( controller[expander].redLedBit6 )
            {
                controller[expander].RedBtn.classList.add('red');
                controller[expander].RedBtn.setAttribute('ledState', 'on');
            }
            else
            {
                controller[expander].RedBtn.classList.remove('red');
                controller[expander].RedBtn.setAttribute('ledState', 'off');
            }

            if ( controller[expander].mChargeEnBit3 )
            {
                controller[expander].MChargeEnBtn.classList.add('indigo');
                controller[expander].MChargeEnBtn.setAttribute('ledState', 'on');
            }
            else
            {
                controller[expander].MChargeEnBtn.classList.remove('indigo');
                controller[expander].MChargeEnBtn.setAttribute('ledState', 'off');
            }


            // decode charger voltage and current
            // data bytes 9-16
        controller[expander].avolt.innerHTML = dataByte[expander + 8 + (expander-1)];
        controller[expander].bvolt.innerHTML = dataByte[expander + 9 + (expander-1)];


            // decode data byte 17 System ON  current

            // decode data byte 18 System OFF current

            // decode data byte 19 charger current
      controller[expander].acurrent.innerHTML = (Number(dataByte[19]) / 20).toFixed(2);
      controller[expander].bcurrent.innerHTML = (Number(dataByte[19]) / 20).toFixed(2);

        } // end of FOR-expander


        // decode Front panel IO
        operatingMode.innerHTML= operatingModeState.value;
        systemState.innerHTML  = operatingModeState.state[operatingModeState.value];
        dcgood.checked         = !!(operatingModeState.value & bit7Mask);
        PSON.checked          = !!(operatingModeState.value & bit6Mask);
        // _12ven.checked         = !!(operatingModeState.value & bit1Mask);
  document.getElementById('12ven').checked   = !!(operatingModeState.value & bit1Mask);



        // decode mode status
        switch(ModeStatus)
        {
            case 0:         // (0) all bits clear
            {
            //    productionBtn.checked = true;
                document.getElementById('production').checked = true;
            //   debugBtn.checked = false;
                document.getElementById('debug').checked = false;
            //      chattyBtn.checked = true;
                document.getElementById('chatty').checked = true;
            //    silentBtn.checked = false;
                document.getElementById('silent').checked = false;
                break;
            }
            case 1:         // (1) bit 0 set
            {
                //     productionBtn.checked = false;
                document.getElementById('production').checked = false;
                //      debugBtn.checked = true;
                document.getElementById('debug').checked = true;
                //     chattyBtn.checked = true;
                document.getElementById('chatty').checked = true;
                //    silentBtn.checked = false;
                document.getElementById('silent').checked = false;
                break;
            }
            case 2:         // (2) bit 1 set
            {
            //     productionBtn.checked = true;
                document.getElementById('production').checked = true;
            //     debugBtn.checked = false;
                document.getElementById('debug').checked = false;
            //     chattyBtn.checked = false;
                document.getElementById('chatty').checked = false;
            //      silentBtn.checked = true;
                document.getElementById('silent').checked = true;
                break;
            }
            case 3:         // (3) bit 1,0 set
            {
                //     productionBtn.checked = false;
                document.getElementById('production').checked = false;
                //     debugBtn.checked = true;
                document.getElementById('debug').checked = true;
                //     chattyBtn.checked = false;
                document.getElementById('chatty').checked = false;
                //     silentBtn.checked = true;
                document.getElementById('silent').checked = true;
                break;
            }
        } // end switch-case

        // decode reset status
        //      resetStatusEL.innerHTML = resetStatus.message[resetDecode];
  document.getElementById('resetStatus').innerHTML = resetStatus.message[resetDecode];

        if ( !!(ModeStatus & 1) & (resetDecode === 3) )
        {
            port.write('reset\r');

            setTimeout(()=>
            {
                port.write('mode gui\r');
            }, 500);

            hardwareTimeout = setTimeout(()=>
            {
                portMessage.classList.remove('hide');
                portMessage.classList.add('red');
          portMessage.innerHTML =  "No response from hardware. Make sure power is on.";
            }, 3000);
        }



        // Decode charger status-byte
        // bit 4 ( CC / CV )
        // databyte 23 - 30
        for (expander = 1; expander<= 4; expander++)
        {
            let statusID = "";
            let a_status = "";
            let b_status = "";

            statusID = 'c' + expander;
            a_status = document.getElementById(statusID + 'a_status');
            b_status = document.getElementById(statusID + 'b_status');

            // Charger A
            // convert databyte to integer, mask bit 4 and convert to boolean
            if ( !!( Number(dataByte[expander+23+(expander-2)]) & 16) )
            {
                a_status.innerHTML = "CC";
                a_status.classList.remove('orange2');
                a_status.classList.add('yellow2');
            }
            else
            {
                a_status.innerHTML = "CV";
                a_status.classList.remove('yellow2');
                a_status.classList.add('orange2');
            }

            // Charger B
            // convert databyte to integer, mask bit 4 and convert to boolean
            if ( !!( Number(dataByte[expander+23+(expander-1)]) & 16) )
            {
                b_status.innerHTML = "CC";
                b_status.classList.remove('orange2');
                b_status.classList.add('yellow2');
            }
            else
            {
                b_status.innerHTML = "CV";
                b_status.classList.remove('yellow2');
                b_status.classList.add('orange2');
            }
        } // end of for loop

        // Decode charger status-byte
        // bit 7 ( PG )
        // databyte 23 - 30
        for (expander = 1; expander<= 4; expander++)
        {
            let statusID = "";
            let a_status = "";
            let b_status = "";

            statusID = 'c' + expander;
            a_status = document.getElementById(statusID + 'a_pg');
            b_status = document.getElementById(statusID + 'b_pg');

            // Charger A
            // convert databyte to integer, mask bit 7 and convert to boolean
            if ( !!( Number(dataByte[expander+23+(expander-2)]) & 128) )
            {
                a_status.classList.add('lightgreen');
            }
            else
            {
                a_status.classList.remove('lightgreen');
            }

            // Charger B
            // convert databyte to integer, mask bit 7 and convert to boolean
            if ( !!( Number(dataByte[expander+23+(expander-1)]) & 128) )
            {
                b_status.classList.add('lightgreen');
            }
            else
            {
                b_status.classList.remove('lightgreen');
            }
        } // end of for loop

        // Decode charger status-byte
        // bit 6 ( OTP )
        // databyte 23 - 30
        for (expander = 1; expander<= 4; expander++)
        {
            let statusID = "";
            let a_status = "";
            let b_status = "";

            statusID = 'c' + expander;
            a_status = document.getElementById(statusID + 'a_otp');
            b_status = document.getElementById(statusID + 'b_otp');

            // Charger A
            // convert databyte to integer, mask bit 6 and convert to boolean
            if ( !!( Number(dataByte[expander+23+(expander-2)]) & 64) )
            {
                a_status.classList.add('lightcoral');
            }
            else
            {
                a_status.classList.remove('lightcoral');
            }

            // Charger B
            // convert databyte to integer, mask bit 6 and convert to boolean
            if ( !!( Number(dataByte[expander+23+(expander-1)]) & 64) )
            {
                b_status.classList.add('lightcoral');
            }
            else
            {
                b_status.classList.remove('lightcoral');
            }
        } // end of for loop

        // Decode charger status-byte
        // bit 5 ( OTW )
        // databyte 23 - 30
        for (expander = 1; expander<= 4; expander++)
        {
            let statusID = "";
            let a_status = "";
            let b_status = "";

            statusID = 'c' + expander;
            a_status = document.getElementById(statusID + 'a_otw');
            b_status = document.getElementById(statusID + 'b_otw');

            // Charger A
            // mask bit 5 and convert to boolean
            if ( !!( Number(dataByte[expander+23+(expander-2)]) & 32) )
            {
                a_status.classList.add('lightcoral');
            }
            else
            {
                a_status.classList.remove('lightcoral');
            }

            // Charger B
            // mask bit 5 and convert to boolean
            if ( !!( Number(dataByte[expander+23+(expander-1)]) & 32) )
            {
                b_status.classList.add('lightcoral');
            }
            else
            {
                b_status.classList.remove('lightcoral');
            }
        } // end of for loop

        // decode GPIO ports
        // PORTA bit 7 beeper
        // PORTD bit 5 front panel GREEN led
        // PORTF bit 4 front panel RED led

        // GREEN led
        fpio.portD = +dataByte[32];
        if (+(fpio.portD & 32) )
        {document.getElementById('fp_green').style.backgroundColor = "green";}
        else
        {document.getElementById('fp_green').style.backgroundColor = "lightgrey";}

        // RED led
        fpio.portF = +dataByte[33];
        if ( +(fpio.portF & 16) )
        {document.getElementById('fp_red').style.backgroundColor = "red";}
        else
        {document.getElementById('fp_red').style.backgroundColor = "lightgrey";}

        // BEEPER
        fpio.portA = +dataByte[31];
        if ( +(fpio.portA & 128) )
        {document.getElementById('fp_beeper').style.backgroundColor = "yellow";}
        else
        {document.getElementById('fp_beeper').style.backgroundColor = "lightgrey";}


    } // end if - gui

    // Regular text send to terminal log
    // This is MPS processor verbose data and error log
    else
    {
        // append to log textbox
        outputLog.value  += d;

        // set cursor position to bottom of log textbox
        outputLog.scrollTop = outputLog.scrollHeight;
    }


} // end of receiveData

function sendCommand(cmd)
{
    let command = document.getElementById(cmd).value;

    port.write(`${command} \r`);
}

function dragElement(elmnt)
{

const dragMouseDown = (e)=>
{
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
};

    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

     if (document.getElementById(elmnt.id + "header"))
   //  if (document.getElementById(elmnt + "header"))
    {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    }
    else
    {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    }


    function elementDrag(e)
    {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement()
    {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
} // end of dragElement()

const resetStatus =
{
          el: document.getElementById('resetStatus'),
          message:
          [
              '','',                                        // 0,1 not used
              ' External Reset',
              ' Power-up Reset',
              '','', '',                                    // 4,5,6 not used
              ' Brownout Reset',
              '','','','','','','','',                      // 8 - 15 not used
              ' PDI Reset',
              '','','','','','','','','','','','','','','', //17 - 31 not used
              ' Software Reset'
          ]
};

// helper functions
const checkBootloader = (element, sendDelay)=>
{
    console.log(`checking for bootloader. `);
    // element.setAttribute("disabled", true);

    setTimeout(()=>
    {
        port.write('?\r');
        // element.removeAttribute("disabled");
    }, sendDelay);

    hardwareTimeout = setTimeout(()=>
    {
        portMessage.classList.remove('hide');
        portMessage.classList.add('red');
        portMessage.innerHTML =  "No response from hardware. Make sure power is on.";
    }, 3000);
};

const guiRequest = (element, sendDelay)=>
{
    element.target.setAttribute("disabled", true);

    setTimeout(()=>
    {
        port.write('mode gui\r');
        element.target.removeAttribute("disabled");
        console.log(`gui update request sent from  `);
        console.log( element.path[0]);
    }, sendDelay);

    hardwareTimeout = setTimeout(()=>
    {
        portMessage.classList.remove('hide');
        portMessage.classList.add('red');
        portMessage.innerHTML =  "No response from hardware. Make sure power is on.";
    }, 3000);
};

/**
  *  This takes a integer and returns a formated string in hex and binary
  * input  (integer) 13
  * return (string)  "0x0D [0000-1110]"
*/
const convertStatustoStr = (s)=>
{
    let hexStr       = '';
    let binStr       = '';
    let statusStr    = '';

    // convert integer to a uppercase hex string, pad leading '0'
    hexStr = s.toString(16).toUpperCase().padStart(2, '0');

    // convert integer to a binary string, pad leading '0'
    binStr = s.toString(2).padStart(8, '0');
    // insert '-' between nibbles
    binStr = binStr.slice(0,4) + '-' + binStr.slice(4);

    // assemble the formated status string. Ex: "0x0D [0000-1110]"
    statusStr = '0x' + hexStr + ' [' + binStr + ']';

    return statusStr;
};

const portWriteError = (error) =>
{
    portMessage.classList.remove('hide');
    portMessage.classList.add('red');
    portMessage.innerHTML = `Error writing to ${port.path }: ${error}`;
};

// **** Event Listeners for Expander output register button ****
const sendCmdAdd = (element)=>
{
    let addr       = element.target.getAttribute('address') ;
    let regOnData  = element.target.getAttribute('regOnData') ;
    let regOffData = element.target.getAttribute('regOffData') ;
    let btnColor   = element.target.getAttribute('btnColor') ;

    port.write(`poke ${Number(addr)} 1 ${regOnData}\r`, (err)=>
    {
        if (err) { portWriteError(err); }
        else
        {
            element.target.classList.add(btnColor);
            guiRequest(element, 50);
        }
    });
};

const sendCmdRemove = (element)=>
{
    let addr       = element.target.getAttribute('address') ;
    let regOnData  = element.target.getAttribute('regOnData') ;
    let regOffData = element.target.getAttribute('regOffData') ;
    let btnColor   = element.target.getAttribute('btnColor') ;

    port.write(`poke ${Number(addr)} 1 ${regOffData}\r`, (err)=>
    {
        if (err) { portWriteError(err); }
        else
        {
            element.target.classList.remove(btnColor);
            guiRequest(element, 50);
        }
    });
};







const includeDone = ()=>
{
    getElementIdNodes();

 // ***  Event listeners ***
    console.log(`setting event listeners`);

    scanPortsBtn.addEventListener("click", ()=>
    {
        getPortList();
    }, false);

    openCloseBtn.addEventListener("click", (element)=>
    {
        openClosePort(element);
    }, false);

    autoUpdateRadio.addEventListener("click", (element)=>
    {
        element.stopPropagation();

        // auto update IS checked
        if ( element.target.checked )
        {
            RefreshBtn.setAttribute('disabled', true);
            RefreshBtn.style.backgroundColor = 'dimgrey';

            autoUpdateTimeout = setInterval(()=>
            {
                guiRequest(element, 50);
            }, 1000);
        }
        // auto update NOT checked
        else
        {
            RefreshBtn.removeAttribute('disabled');
            RefreshBtn.style.backgroundColor = 'white';
            clearInterval(autoUpdateTimeout);
        }

    }, false);

    RefreshBtn.addEventListener("click", (element)=>
    {
        guiRequest(element, 50);
    }, false);

    resetBtn.addEventListener("click", (element)=>
    {
        port.write('reset\r');
        guiRequest(element, 500);
    }, false);

    document.getElementById('eeprom_util').addEventListener("click", ()=>
    {
        let closeWin = eeprom_winEL.getElementsByClassName("close")[0];

        // stop auto update and reset button
        RefreshBtn.removeAttribute('disabled');
        RefreshBtn.style.backgroundColor = 'white';
        autoUpdateRadio.checked = false;
        clearInterval(autoUpdateTimeout);

        // When the user clicks on <span> (x), close the modal
        closeWin.onclick = ()=>
        {
            eeprom_winEL.style.display = "none";
        };

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = (event) =>
        {
            if (event.target == eeprom_winEL) { eeprom_winEL.style.display = "none"; }
        };

        eeprom_winEL.style.display = "block";
        document.getElementById('saveProgress').classList.add('hide');

    }, false);

    set_voltageEL.addEventListener("click", ()=>
    {
        let closeWin = set_voltageWinEL.getElementsByClassName("close")[0];

        // stop auto update and reset button
        RefreshBtn.removeAttribute('disabled');
        RefreshBtn.style.backgroundColor = 'white';
        autoUpdateRadio.checked = false;
        clearInterval(autoUpdateTimeout);

        // When the user clicks on <span> (x), close the modal
        closeWin.onclick = ()=>
        {
            set_voltageWinEL.style.display = "none";
        };

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = (event) =>
        {
            if (event.target == set_voltageWinEL)
            { set_voltageWinEL.style.display = "none"; }
        };

        set_voltageWinEL.style.display = "block";


    }, false);

    document.getElementById('production').addEventListener("click", (element)=>
    {
        port.write('mode auto\r');
        guiRequest(element, 500);
    }, false);

    document.getElementById('debug').addEventListener("click", (element)=>
    {
        port.write('mode debug\r');
        guiRequest(element, 500);
    }, false);

    document.getElementById('chatty').addEventListener("click", (element)=>
    {
        port.write('mode verbose\r');
        guiRequest(element, 500);
    }, false);

    document.getElementById('silent').addEventListener("click", (element)=>
    {
        port.write('mode silent\r');
        guiRequest(element, 500);
    }, false);

    // change this to add the VISIBLE attribute
    openCloseBtn.classList.remove('notvisible');


    controller[1].el            = document.getElementById('controller1');
    controller[1].battery       = document.getElementById('c1Battery');
    controller[1].AVth          = document.getElementById('c1AVth');
    controller[1].AIth          = document.getElementById('c1AIth');
    controller[1].AStatus       = document.getElementById('c1AStatus');
    controller[1].BVth          = document.getElementById('c1BVth');
    controller[1].BIth          = document.getElementById('c1BIth');
    controller[1].BStatus       = document.getElementById('c1BStatus');
    controller[1].GreenBtn      = document.getElementById('CTRL1Green');
    controller[1].RedBtn        = document.getElementById('CTRL1Red');
    controller[1].MChargeEnBtn  = document.getElementById('CTRL1MChargeEn');
    controller[1].statusEL      = document.getElementById('c1Status');
    controller[1].avolt         = document.getElementById('c1avolt');
    controller[1].bvolt         = document.getElementById('c1bvolt');
    controller[1].acurrent      = document.getElementById('c1acurrent');
    controller[1].bcurrent      = document.getElementById('c1bcurrent');
    controller[1].status        = 0;
    controller[1].greenLedBit7  = 0;
    controller[1].redLedBit6    = 0;
    controller[1].mChargeEnBit3 = 0;

    controller[2].el            = document.getElementById('controller2');
    controller[2].battery       = document.getElementById('c2Battery');
    controller[2].AVth          = document.getElementById('c2AVth');
    controller[2].AIth          = document.getElementById('c2AIth');
    controller[2].AStatus       = document.getElementById('c2AStatus');
    controller[2].BVth          = document.getElementById('c2BVth');
    controller[2].BIth          = document.getElementById('c2BIth');
    controller[2].BStatus       = document.getElementById('c2BStatus');
    controller[2].GreenBtn      = document.getElementById('CTRL2Green');
    controller[2].RedBtn        = document.getElementById('CTRL2Red');
    controller[2].MChargeEnBtn  = document.getElementById('CTRL2MChargeEn');
    controller[2].statusEL      = document.getElementById('c2Status');
    controller[2].avolt         = document.getElementById('c2avolt');
    controller[2].bvolt         = document.getElementById('c2bvolt');
    controller[2].acurrent      = document.getElementById('c2acurrent');
    controller[2].bcurrent      = document.getElementById('c2bcurrent');
    controller[2].status        = 0;
    controller[2].greenLedBit7  = 0;
    controller[2].redLedBit6    = 0;
    controller[2].mChargeEnBit3 = 0;

    controller[3].el            = document.getElementById('controller3');
    controller[3].battery       = document.getElementById('c3Battery');
    controller[3].AVth          = document.getElementById('c3AVth');
    controller[3].AIth          = document.getElementById('c3AIth');
    controller[3].AStatus       = document.getElementById('c3AStatus');
    controller[3].BVth          = document.getElementById('c3BVth');
    controller[3].BIth          = document.getElementById('c3BIth');
    controller[3].BStatus       = document.getElementById('c3BStatus');
    controller[3].GreenBtn      = document.getElementById('CTRL3Green');
    controller[3].RedBtn        = document.getElementById('CTRL3Red');
    controller[3].MChargeEnBtn  = document.getElementById('CTRL3MChargeEn');
    controller[3].statusEL      = document.getElementById('c3Status');
    controller[3].avolt         = document.getElementById('c3avolt');
    controller[3].bvolt         = document.getElementById('c3bvolt');
    controller[3].acurrent      = document.getElementById('c3acurrent');
    controller[3].bcurrent      = document.getElementById('c3bcurrent');
    controller[3].status        = 0;
    controller[3].greenLedBit7  = 0;
    controller[3].redLedBit6    = 0;
    controller[3].mChargeEnBit3 = 0;

    controller[4].el            = document.getElementById('controller4');
    controller[4].battery       = document.getElementById('c4Battery');
    controller[4].AVth          = document.getElementById('c4AVth');
    controller[4].AIth          = document.getElementById('c4AIth');
    controller[4].AStatus       = document.getElementById('c4AStatus');
    controller[4].BVth          = document.getElementById('c4BVth');
    controller[4].BIth          = document.getElementById('c4BIth');
    controller[4].BStatus       = document.getElementById('c4BStatus');
    controller[4].GreenBtn      = document.getElementById('CTRL4Green');
    controller[4].RedBtn        = document.getElementById('CTRL4Red');
    controller[4].MChargeEnBtn  = document.getElementById('CTRL4MChargeEn');
    controller[4].statusEL      = document.getElementById('c4Status');
    controller[4].avolt         = document.getElementById('c4avolt');
    controller[4].bvolt         = document.getElementById('c4bvolt');
    controller[4].acurrent      = document.getElementById('c4acurrent');
    controller[4].bcurrent      = document.getElementById('c4bcurrent');
    controller[4].status        = 0;
    controller[4].greenLedBit7  = 0;
    controller[4].redLedBit6    = 0;
    controller[4].mChargeEnBit3 = 0;


const createExpanderOutputRegisterEventlistner = ()=>
{
    let expander = 0;


    for (expander=1; expander <= 4; expander++)
    {
        controller[expander].GreenBtn.setAttribute('ledState', 'off');
        controller[expander].GreenBtn.addEventListener("click", (element)=>
        {
            portError.innerHTML =  '';
            // led is on, turn off
            if ( element.target.getAttribute('ledState') === "on" )
            {
                element.target.setAttribute('ledState', 'off');
                sendCmdRemove(element);
            }
            // led is off, turn on
            else
            {
                element.target.setAttribute('ledState', 'on');
                sendCmdAdd(element);
            }
        }, false);

        controller[expander].RedBtn.setAttribute('ledState', 'off');
        controller[expander].RedBtn.addEventListener("click", (element)=>
        {
            portError.innerHTML =  '';
            if ( element.target.getAttribute('ledState') === "on" )
            // led is on, turn off
            {
                element.target.setAttribute('ledState', 'off');
                sendCmdRemove(element);
            }
            // led is off, turn on
            else
            {
                element.target.setAttribute('ledState', 'on');
                sendCmdAdd(element);
            }
        }, false);

        controller[expander].MChargeEnBtn.setAttribute('ledState', 'off');
        controller[expander].MChargeEnBtn.addEventListener("click", (element)=>
        {
            portError.innerHTML =  '';
            // led is on, turn off
            if ( element.target.getAttribute('ledState') === "on" )
            {
                element.target.setAttribute('ledState', 'off');
                sendCmdRemove(element);
            }
            // led is off, turn on
            else
            {
                element.target.setAttribute('ledState', 'on');
                sendCmdAdd(element);
            }
        }, false);
    }
};

    // show API dependency versions

//document.getElementById('chrome-version').innerText     = process.versions['chrome'];
//document.getElementById('electron-version').innerText   = process.versions['electron'];
//document.getElementById('node-version').innerText       = process.versions['node'];
//document.getElementById('serialport-version').innerText = packageVersion.version;
//document.getElementById('windows-version').innerText    = process.getSystemVersion();

   //  document.title =  guiVersion;
  //  document.title = `CRPS Ver ${process.env.npm_package_version}`;
    guiVersion = app.getVersion();
    document.title = `CRPS Ver ${guiVersion}`;

    console.log( app.getVersion() );

  //  let {spawn}         = require("child_process");

 //   let prog = document.getElementById('prog');

//    prog.addEventListener("click", (el)=>
//    {
//       let program = {};
//       let cnt = 13;
//       let cnt_handle = 0;
//       let fname = "bootloader\\boot.bat";
//       let userFile = "";
//
//       el.target.setAttribute('disabled', true);
//        bootloadFile.style.visibility = "visible";
//
//
//       cnt_handle = setInterval(function()
//       {
//           cnt--;
//           document.getElementById('bootloadProgressLabel').innerText = cnt + ' sec';
//           document.getElementById('bootloadFile').value = cnt*7.692
//           if ( cnt <= 0) { clearInterval(cnt_handle); }
//       }, 1000);
//
//       fs.writeFile('crpsConfig.txt', selectedPort, (err) => { });
//
//        if ( document.getElementById('hexfile').files.length )
//        { userFile = document.getElementById('hexfile').files[0].path; }
//
//        if (userFile === "") { userFile = "CRPS.hex" ; }
//
//        console.log(`Spawning (${fname}) programming hex file (${userFile}) on port (${selectedPort})`);
//
//        program = spawn(fname, [`${selectedPort}`, `${userFile}`]);
//        program = program.stdout.pipe(process.stdout);
//    }, false); // end of PROG button event listener



    let progResult = "";

    progResult = "bootloader/progResults.log";

    // Check if log file exists
    if ( fs.existsSync(progResult) )
    {
        let data = {};
        let fsHandle = {};

        // monitor file changes and stop watching after first change
        fsHandle = fs.watch(progResult, () =>
        {
            // stop watcing for changes
            fsHandle.close();

            // give a little time for file to unlock
            setTimeout(()=>
            {
                // read file into an array. one line per element
                data = fs.readFileSync(progResult, 'utf8').split('\n');
                // search each element in array for keyword
                data.forEach((line) =>
                {
                    if ( line.includes('Equal!') )
                    { ipcRenderer.send('restart-app'); }
                    else
                    {
                        document.getElementById('bootloadProgressLabel')
                                .innerHTML = 'hex file failed to program';

                        console.log(`hex file failed to program`);
                    }
                });
            }, 50);
        });
    }
    else
    {
        console.log("File does not Exist. Creating new file.")
        fs.writeFile(progResult, '', (err) =>
        {
            if (err) { console.log(err); }

            console.log(`${progResult}  created`);
        });

        // monitor file changes and stop watching after first change
        fsHandle = fs.watch(progResult,
                 {'persistent': false, 'recursive': false, 'encoding': 'utf8', 'signal': 'done'},
                 (eventType, filename) =>
        {
            console.log(` ${progResult} ${filename} ${eventType} file was changed`);

            fsHandle.close();
        //    fs.unwatch(progResult);
            // read file if file changes
           setTimeout(()=>
            {
                data = fs.readFileSync(progResult, 'utf8').split('\n');
                data.forEach((line) =>
                {

                    if ( line.includes('Equal!') )
                    {
                        console.log(`${line} -- equal was found`);
                    }
                });
            }, 50);



        });

   }


// if not exist, create crpsConfig.json
    let configFile = 'crpsConfig.json';
    let crpsConfig = { };

    // define default default CRPS Config object parameters
    crpsConfig =
    {
        lastPort: selectedPort,
        autoConnect: true
    };



    // read CRPS config file if exist
    if ( fs.existsSync(configFile) )
    {
        crpsConfig = fs.readFileSync(configFile, 'utf8');
        crpsConfig = JSON.parse(crpsConfig);
        console.info(' read CRPS config');
        console.dir(crpsConfig);
    }
    // not exist create default file
    else
    {
        fs.writeFile(configFile, JSON.stringify(crpsConfig), (err) =>
        {
            if (err) { console.error(err); }

            console.info(`${configFile}  created`);
        });

    }



    // *** start main code ***

    // create tabs for charger voltage snippet
    container = document.querySelector('.tab-container');
    tabs(container);

    createExpanderOutputRegisterEventlistner();
    getPortList();

    //   file exist, read file and reconnect to COM port
    if ( fs.existsSync('crpsConfig.txt') )
    {
        let config = "crpsConfig.txt";

        selectedPort = fs.readFileSync(config, 'utf8');
        console.log(`file ${config} exist. contains ${selectedPort}`);

        // remove file
        fs.unlink(config, (err) => { console.log( `${config} deleted`); });

        if (selectedPort)
        {
            port = new SerialPort(selectedPort, openOptions);
            parseLine = port.pipe(new Readline(readlineOptions));

            console.log(`reconnected to port ${selectedPort}`);

            // character event
            port.on('data', (c)=>
            {
              //  console.log(`incoming character ${c}`);
        // in bootloader mode first character is  a '?'
        if ( (c[0] === 63) & (hostConnected === "") )
        {
            console.log(`   bootloader connected:  `);
            hostConnected = "bootloader";
            clearTimeout(hardwareTimeout);
            mps_Mode = "bootloader";
            document.getElementById('Bootload').checked = true;
            document.getElementById('Firmware').checked = false;
            document.getElementById('firmwareCtrl').setAttribute('hidden', true);

            // stop auto-update if enabled
            autoUpdateRadio.checked = false;
            RefreshBtn.removeAttribute('disabled');
            RefreshBtn.style.backgroundColor = 'white';
            clearInterval(autoUpdateTimeout);


            // hide un-needed fields
            openCloseBtn.innerText = 'Open Port';
            document.getElementById('connectMessage').innerHTML = 'not connected';
            document.getElementById('controlPanel').style.visibility = 'hidden';
            document.getElementById('systemStatusCTRL').style.visibility = 'hidden';


            // show bootloader program option
            document.getElementById('flashProg').style.visibility = 'visible';

//            setTimeout(()=>
//            {
//                // close port
//                port.drain((e)=> {port.flush((er)=>{port.close();});});
//            }, 50);


        }
    });

            // data string event
            parseLine.on('data', (d)=> { receiveData(d); });

            port.open( (err)=>
            {
                let message = "";

                if (err)
                {
                    if (err.message.includes('Unknown error') )
                    {
                        message = `Error: ${err.message}  Check serial port driver.`;
                    }
                    else
                    {
                 message = `Error: ${err.message} Make sure RealTerm port is closed.`;
                    }
                    portMessage.classList.remove('hide');
                    portMessage.classList.add('red');
                    portMessage.innerHTML = message;
                    return;
                }

                // clear old connect/error messages
                openCloseBtn.innerText = 'Close Port';
                connectMessage.innerHTML = ` Connected to ${portString} `;
                systemStatusCTRL.style.visibility = 'visible';
                portMessage.classList.remove('red');
                portMessage.classList.add('hide');
                portMessage.innerHTML = '';
                outputLog.value = '';
                log.style.visibility = 'visible';
                controlPanel.style.visibility = 'visible';
                checkBootloader(openCloseBtn, 50);
            });
        }

    } // end of if FILE EXISTS

        // make eeprom window dragable
        // dragElement(document.getElementById("eeprom_win"));


    // import a dummy JS file and append to body tag
//    let scriptTag2 = document.createElement('script');
//    scriptTag2.src = 'src/js/dummy.js ';
//    scriptTag2.type = 'text/javascript';
//    document.body.appendChild(scriptTag2);

    // heap
    //  reference: https://www.valentinog.com/blog/node-usage/
    //  reference: https://deepu.tech/memory-management-in-v8/
    // Resident Set stores the actual Javascript code and all memory
    // heap is a memory segment used for storing objects, strings and closures
    // heapTotal is the total size of the allocated heap
    // heapUsed is the actual memory used during the execution of the process
    // external is the memory used by V8 C++ objects bound to JavaScript

//    for (const [key,value] of Object.entries(process.memoryUsage()))
//    {
//        console.log(`Memory: ${key}, ${(value/1048576).toFixed(3)} MB `);
//    }

const closeNotification = ()=>
{
  document.getElementById('notification').classList.add('hidden');
};

const restartApp = ()=>
{
  ipcRenderer.send('restart_app');
};


    notification  = document.getElementById('notification');
    message       = document.getElementById('message');
    restartButton = document.getElementById('restart-button');


    ipcRenderer.on('checking-for-update', () =>
    {
        console.log('checking-for-update');
    });

    ipcRenderer.on('download-progress', (event, data) =>
    {
        console.log(`download-progress: ${data}`);
    });

    ipcRenderer.on('update-not-available', () =>
    {
        console.log('update-not-available');
    });

    ipcRenderer.on('update_available', () =>
    {
        console.log('update available');
        ipcRenderer.removeAllListeners('update_available');
        message.innerText = 'A new update is available. Downloading now...';
        notification.classList.remove('hidden');
    });

    ipcRenderer.on('update_downloaded', () =>
    {
        console.log('update downloaded');
        ipcRenderer.removeAllListeners('update_downloaded');
        message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
        restartButton.classList.remove('hidden');
        notification.classList.remove('hidden');
    });



        console.log( "Ready" );
}; // end of includeDone()



const includeHTML  = async ({startElement="body",
                             htmlAttr    ="include-html",
                             jsAttr      ="include-js",
                             filePath    ="src/grid/",
                             callback    =includeDone}={})=>
{
    let elAttr      = "";
    let jsMod      = "";
    let includeFile = "";
    let template    = "";
    let snipCount   = 0;

m1 = performance.now();
    console.log(`Importing HTML snippets ...`);

    while(1)
    {
        // scan entire document, get first matching html attribute
        elAttr = document.querySelector(startElement)
                         .querySelectorAll('[' + htmlAttr + ']');

        // scan entire document, get first matching js attribute
        jsMod = document.querySelector(startElement)
                         .querySelectorAll('[' + jsAttr + ']');

        // if no matching attributes found break out of loop
        if ( elAttr.length === 0 )
        { console.log(`No more ${htmlAttr} attributes found.`); break; }

        // get filename and create path and extension
        includeFile = elAttr[0].getAttribute(htmlAttr);

        // add path to filename if it does not start with a '/'
        if ( ! includeFile.startsWith("/") )
        { includeFile = filePath + includeFile; }

        // append default file extension if no extension
        if ( ! includeFile.includes(".") ) { includeFile += '.snip'; }

        snipCount++;
        console.log(`    (${snipCount}) inserted '${includeFile}' into ${elAttr[0].outerHTML}`);

        try
        {
            // import HTML snippet file
            template = await fetch(includeFile);
            // capture file contents as text
            template = await template.text();
            // parse text to HTML elements
            template = new DOMParser().parseFromString(template, 'text/html');
            // insert the HTML in element
            elAttr[0].innerHTML = template.body.innerHTML;
            // remove the include attribute from element
            elAttr[0].removeAttribute(htmlAttr);
        }
        // check for errors
        catch(e)
        {
        console.error(`Error fetching '${elAttr[0].outerHTML}' ${e} '${includeFile}'`);
            console.error(`${e} '${includeFile}'`);
            console.warn(`callback '${callback.name}' aborted`);
            template = `error fetching file '${includeFile}'`;
            elAttr[0].innerHTML = template;
            elAttr[0].removeAttribute(htmlAttr);
            return 0;
        }

            // if JS attribute, append JS modules to body
            if ( jsMod.length )
            {

                console.log(`    inserted JS module into body`);
                console.log(jsMod[0]);
                // remove the include attribute from element
                jsMod[0].removeAttribute(jsAttr);
               // jsMod={};
            }
            // no JS modules to import
            else { console.log(`No ${jsAttr} attributes found.`); }

    } // end while loop

m2 = performance.now();
console.log("import time " + (m2 - m1).toFixed(0) + " milliseconds.");
console.log(` `);
    callback();
} // end of includeHTML()


window.onload = function()
{
    console.log("window onload event" );

    includeHTML({startElement: "body",
                 htmlAttr: "include-html",
                 filePath: "src/grid/",
                 callback: includeDone});

    // this would be includeJS that would pick up
    // HTML an attribute 'include-js'
    // javascruipt snippets get loaded into the head of the document
    //
//    let scriptTag1 = document.createElement('script');
//    scriptTag1.src = 'src/js/webviewer.min.js';
//    scriptTag1.type = 'text/javascript';
//    document.getElementsByTagName('head')[0].appendChild(scriptTag1);

};

