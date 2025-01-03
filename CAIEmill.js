
//
// Function to initialise the two tables (code and memory), called on page load
// Should change this to an initialisation function as it now includes the 
// canvas
//
var table1;
var table2;

//
// The following data are used to achieve some automatic scaling of the CPU
// diagram regWidth and Height are used to scale the registers; busWidth to
// scale the buses
// The x/y variables are used to position and space the registers on the canvas
// The lastBusAnimation variable is used to track which animation occurred most
// recently so that we can remove it after a given period/on next animation
//
let canvasInfo = {
  width: 0,
  height: 0,
  regWidth: 0,
  regHeight: 0,
  busWidth: 0,
  x_offset: 0,
  y_offset: 0,
  x_increment: 0,
  y_increment1: 0,
  y_increment2: 0,
  font: "",
  lastBusAnimation: -1
};

//
// Flag to indicate whether the CPU 'tooltip' is visible or not...
//
let cpuTooltipVisible = false;

//
// Code example table 1 - Input and add two numbers
// (In this and the following examples, I have intentionally moved the variables
// to a blank line in the memory - actually a line below a blank line.  This
// helps the user to easily see the different storage locations for program and
// data.)
//
// The 'active' column is used to show a traffic light - 1, 2, and 3 being
// green, orange, and red.  A value such as '-' means 'do not show anything'.
// The formatter is initialised in the table creation further below.
//
var codetabledata1 = [
  {id:1,  active:"-", line:"00", label:"start", operator:"IN", operand:""},
  {id:2,  active:"-", line:"01", label:"",      operator:"STO", operand:"A"},
  {id:3,  active:"-", line:"02", label:"",      operator:"IN", operand:""},
  {id:4,  active:"-", line:"03", label:"",      operator:"ADD", operand:"A"},
  {id:5,  active:"-", line:"04", label:"",      operator:"OUT", operand:""},
  {id:6,  active:"-", line:"05", label:"",      operator:"END", operand:""},
  {id:7,  active:"-", line:"06", label:"",      operator:"",    operand:""},
  {id:8,  active:"-", line:"07", label:"",      operator:"",    operand:""},
  {id:9,  active:"-", line:"08", label:"",      operator:"",    operand:""},
  {id:10, active:"-", line:"09", label:"",      operator:"",    operand:""},
  {id:11, active:"-", line:"10", label:"",      operator:"",    operand:""},
  {id:12, active:"-", line:"11", label:"",      operator:"",    operand:""},
  {id:13, active:"-", line:"12", label:"",      operator:"",    operand:""},
  {id:14, active:"-", line:"13", label:"",      operator:"",    operand:""},
  {id:15, active:"-", line:"14", label:"",      operator:"",    operand:""},
  {id:16, active:"-", line:"15", label:"",      operator:"",    operand:""},
  {id:17, active:"-", line:"16", label:"",      operator:"",    operand:""},
  {id:18, active:"-", line:"17", label:"",      operator:"",    operand:""},
  {id:19, active:"-", line:"18", label:"",      operator:"",    operand:""},
  {id:20, active:"-", line:"19", label:"",      operator:"",    operand:""},
  {id:21, active:"-", line:"20", label:"A",     operator:"DAT", operand:"0"},
];

//
// Code example table 2 - output 10 four times
//
var codetabledata2 = [
  {id:1,  active:"-", line:"00", label:"start", operator:"LDD", operand:"one"},
  {id:2,  active:"-", line:"01", label:"",      operator:"OUT", operand:""},
  {id:3,  active:"-", line:"02", label:"",      operator:"LDD", operand:"zero"},
  {id:4,  active:"-", line:"03", label:"",      operator:"OUT", operand:""},
  {id:5,  active:"-", line:"04", label:"",      operator:"LDD", operand:"count"},
  {id:6,  active:"-", line:"05", label:"",      operator:"SUB", operand:"one"},
  {id:7,  active:"-", line:"06", label:"",      operator:"STO", operand:"count"},
  {id:8,  active:"-", line:"07", label:"",      operator:"CMP", operand:"zero"},
  {id:9,  active:"-", line:"08", label:"",      operator:"JPE", operand:"start"},
  {id:10, active:"-", line:"09", label:"",      operator:"END",    operand:""},
  {id:11, active:"-", line:"10", label:"",      operator:"",    operand:""},
  {id:12, active:"-", line:"11", label:"",      operator:"",    operand:""},
  {id:13, active:"-", line:"12", label:"",      operator:"",    operand:""},
  {id:14, active:"-", line:"13", label:"",      operator:"",    operand:""},
  {id:15, active:"-", line:"14", label:"",      operator:"",    operand:""},
  {id:16, active:"-", line:"15", label:"",      operator:"",    operand:""},
  {id:17, active:"-", line:"16", label:"",      operator:"",    operand:""},
  {id:18, active:"-", line:"17", label:"",      operator:"",    operand:""},
  {id:19, active:"-", line:"18", label:"",      operator:"",    operand:""},
  {id:20, active:"-", line:"19", label:"",      operator:"",    operand:""},
  {id:21, active:"-", line:"20", label:"one",   operator:"DAT", operand:"1"},
  {id:22, active:"-", line:"21", label:"zero",  operator:"DAT", operand:"0"},
  {id:23, active:"-", line:"22", label:"count", operator:"DAT", operand:"3"},
];

//
// Code example table 3 - Square a given number
//
var codetabledata3 = [
  {id:1,  active:"-", line:"00", label:"start", operator:"IN", operand:""},
  {id:2,  active:"-", line:"01", label:"",      operator:"STO", operand:"number"},
  {id:3,  active:"-", line:"02", label:"",      operator:"LDD", operand:"zero"},
  {id:4,  active:"-", line:"03", label:"",      operator:"STO", operand:"sum"},
  {id:5,  active:"-", line:"04", label:"",      operator:"STO", operand:"count"},
  {id:6,  active:"-", line:"05", label:"loop",  operator:"LDD", operand:"sum"},
  {id:7,  active:"-", line:"06", label:"",      operator:"ADD", operand:"number"},
  {id:8,  active:"-", line:"07", label:"",      operator:"STO", operand:"sum"},
  {id:9,  active:"-", line:"08", label:"",      operator:"LDD", operand:"count"},
  {id:10, active:"-", line:"09", label:"",      operator:"ADD", operand:"one"},
  {id:11, active:"-", line:"10", label:"",      operator:"STO", operand:"count"},
  {id:12, active:"-", line:"11", label:"",      operator:"SUB", operand:"number"},
  {id:13, active:"-", line:"12", label:"",      operator:"CMP", operand:"zero"},
  {id:13, active:"-", line:"13", label:"",      operator:"JPE", operand:"finish"},
  {id:14, active:"-", line:"14", label:"",      operator:"JMP", operand:"loop"},
  {id:15, active:"-", line:"15", label:"finish",operator:"LDD", operand:"sum"},
  {id:16, active:"-", line:"16", label:"",      operator:"OUT", operand:""},
  {id:17, active:"-", line:"17", label:"",      operator:"END", operand:""},
  {id:19, active:"-", line:"18", label:"",      operator:"",    operand:""},
  {id:20, active:"-", line:"19", label:"",      operator:"",    operand:""},
  {id:21, active:"-", line:"20", label:"",      operator:"",    operand:""},
  {id:22, active:"-", line:"21", label:"",      operator:"",    operand:""},
  {id:23, active:"-", line:"22", label:"",      operator:"",    operand:""},
  {id:24, active:"-", line:"23", label:"",      operator:"",    operand:""},
  {id:25, active:"-", line:"24", label:"",      operator:"",    operand:""},
  {id:26, active:"-", line:"25", label:"",      operator:"",    operand:""},
  {id:27, active:"-", line:"26", label:"",      operator:"",    operand:""},
  {id:28, active:"-", line:"27", label:"",      operator:"",    operand:""},
  {id:29, active:"-", line:"28", label:"",      operator:"",    operand:""},
  {id:30, active:"-", line:"29", label:"",      operator:"",    operand:""},
  {id:31, active:"-", line:"30", label:"number",operator:"DAT", operand:""},
  {id:32, active:"-", line:"31", label:"sum",   operator:"DAT", operand:""},
  {id:33, active:"-", line:"32", label:"count", operator:"DAT", operand:""},
  {id:34, active:"-", line:"33", label:"zero",  operator:"DAT", operand:"0"},
  {id:35, active:"-", line:"34", label:"one",   operator:"DAT", operand:"1"},
];

//
// Code example table 4 - Integer division
//
// INCOMPLETE - NEED TO THINK ABOUT HOW TO DO THIS WITH JUST CMP!
// STOPPED AT LINE 09
// Overwritten with a different example
//
var codetabledata5 = [
  {id:1,  active:"-", line:"00", label:"start",   operator:"IN", operand:""},
  {id:2,  active:"-", line:"01", label:"",        operator:"STO", operand:"dividend"},
  {id:3,  active:"-", line:"02", label:"",        operator:"IN", operand:""},
  {id:4,  active:"-", line:"03", label:"",        operator:"STO", operand:"divisor"},
  {id:5,  active:"-", line:"04", label:"",        operator:"LDD", operand:"zero"},
  {id:6,  active:"-", line:"05", label:"",        operator:"STO", operand:"answer"},
  {id:7,  active:"-", line:"06", label:"",        operator:"LDD", operand:"dividend"},
  {id:8,  active:"-", line:"07", label:"loop",    operator:"SUB", operand:"divisor"},
  {id:9,  active:"-", line:"08", label:"",        operator:"STO", operand:"dividend"},
  {id:10, active:"-", line:"09", label:"",        operator:"BRP", operand:"greater"},
  {id:11, active:"-", line:"10", label:"",        operator:"LDA", operand:"answer"},
  {id:12, active:"-", line:"11", label:"",        operator:"OUT", operand:""},
  {id:13, active:"-", line:"12", label:"",        operator:"HLT", operand:""},
  {id:14, active:"-", line:"13", label:"greater", operator:"LDA", operand:"answer"},
  {id:15, active:"-", line:"14", label:"",        operator:"ADD", operand:"one"},
  {id:16, active:"-", line:"15", label:"",        operator:"STA", operand:"answer"},
  {id:17, active:"-", line:"16", label:"",        operator:"LDA", operand:"dividend"},
  {id:18, active:"-", line:"17", label:"",        operator:"BRA", operand:"loop"},
  {id:19, active:"-", line:"18", label:"",        operator:"",    operand:""},
  {id:20, active:"-", line:"19", label:"",        operator:"",    operand:""},
  {id:21, active:"-", line:"20", label:"zero",    operator:"DAT", operand:"0"},
  {id:22, active:"-", line:"21", label:"one",     operator:"DAT", operand:"1"},
  {id:23, active:"-", line:"22", label:"answer",  operator:"DAT", operand:""},
  {id:24, active:"-", line:"23", label:"dividend",operator:"DAT", operand:""},
  {id:25, active:"-", line:"24", label:"divisor", operator:"DAT", operand:""},
];

var codetabledata4 = [
  {id:1,  active:"-", line:"00", label:"START",   operator:"LDR", operand:"#0"},
  {id:2,  active:"-", line:"01", label:"",        operator:"IN", operand:""},
  {id:3,  active:"-", line:"02", label:"",        operator:"STO", operand:"CHAR"},
  {id:4,  active:"-", line:"03", label:"COMPARE", operator:"LDX", operand:"V1"},
  {id:5,  active:"-", line:"04", label:"",        operator:"CMP", operand:"CHAR"},
  {id:6,  active:"-", line:"05", label:"",        operator:"JPE", operand:"YES"},
  {id:7,  active:"-", line:"06", label:"",        operator:"INC", operand:"IX"},
  {id:8,  active:"-", line:"07", label:"",        operator:"CMR", operand:"#5"},
  {id:9,  active:"-", line:"08", label:"",        operator:"JPE", operand:"NO"},
  {id:10, active:"-", line:"09", label:"",        operator:"JMP", operand:"COMPARE"},
  {id:11, active:"-", line:"10", label:"YES",     operator:"LDM", operand:"#86"},
  {id:12, active:"-", line:"11", label:"",        operator:"OUT", operand:""},
  {id:13, active:"-", line:"12", label:"",        operator:"END", operand:""},
  {id:14, active:"-", line:"13", label:"NO",      operator:"LDM", operand:"#67"},
  {id:15, active:"-", line:"14", label:"",        operator:"OUT", operand:""},
  {id:16, active:"-", line:"15", label:"",        operator:"END", operand:""},
  {id:17, active:"-", line:"16", label:"CHAR",    operator:"DAT", operand:""},
  {id:18, active:"-", line:"17", label:"V1",      operator:"DAT", operand:"65"},
  {id:19, active:"-", line:"18", label:"V2",      operator:"DAT", operand:"69"},
  {id:20, active:"-", line:"19", label:"V3",      operator:"DAT", operand:"73"},
  {id:21, active:"-", line:"20", label:"V4",      operator:"DAT", operand:"79"},
  {id:22, active:"-", line:"21", label:"V5",      operator:"DAT", operand:"85"},
];

//
// Memory table - styled using CSS so that the 'address' rows
// are distinguished from the 'data' rows by lighter/darker background colours?
//
var blankmemorytabledatadenary = [
  {id:1,  m0:"00",  m1:"01",  m2:"02",  m3:"03",  m4:"04",  m5:"05",  m6:"06",  m7:"07",  m8:"08",  m9:"09"},
  {id:2,  m0:"", m1:"", m2:"", m3:"", m4:"", m5:"", m6:"", m7:"", m8:"", m9:""},
  {id:3,  m0:"10",  m1:"11",  m2:"12",  m3:"13",  m4:"14",  m5:"15",  m6:"16",  m7:"17",  m8:"18",  m9:"19"},
  {id:4,  m0:"", m1:"", m2:"", m3:"", m4:"", m5:"", m6:"", m7:"", m8:"", m9:""},
  {id:5,  m0:"20",  m1:"21",  m2:"22",  m3:"23",  m4:"24",  m5:"25",  m6:"26",  m7:"27",  m8:"28",  m9:"29"},
  {id:6,  m0:"", m1:"", m2:"", m3:"", m4:"", m5:"", m6:"", m7:"", m8:"", m9:""},
  {id:7,  m0:"30",  m1:"31",  m2:"32",  m3:"33",  m4:"34",  m5:"35",  m6:"36",  m7:"37",  m8:"38",  m9:"39"},
  {id:8,  m0:"", m1:"", m2:"", m3:"", m4:"", m5:"", m6:"", m7:"", m8:"", m9:""},
  {id:9,  m0:"40",  m1:"41",  m2:"42",  m3:"43",  m4:"44",  m5:"45",  m6:"46",  m7:"47",  m8:"48",  m9:"49"},
  {id:10, m0:"", m1:"", m2:"", m3:"", m4:"", m5:"", m6:"", m7:"", m8:"", m9:""},
  {id:11, m0:"50",  m1:"51",  m2:"52",  m3:"53",  m4:"54",  m5:"55",  m6:"56",  m7:"57",  m8:"58",  m9:"59"},
  {id:12, m0:"", m1:"", m2:"", m3:"", m4:"", m5:"", m6:"", m7:"", m8:"", m9:""},
  {id:13, m0:"60",  m1:"61",  m2:"62",  m3:"63",  m4:"64",  m5:"65",  m6:"66",  m7:"67",  m8:"68",  m9:"69"},
  {id:14, m0:"", m1:"", m2:"", m3:"", m4:"", m5:"", m6:"", m7:"", m8:"", m9:""},
  {id:15, m0:"70",  m1:"71",  m2:"72",  m3:"73",  m4:"74",  m5:"75",  m6:"76",  m7:"77",  m8:"78",  m9:"79"},
  {id:16, m0:"", m1:"", m2:"", m3:"", m4:"", m5:"", m6:"", m7:"", m8:"", m9:""},
  {id:17, m0:"80",  m1:"81",  m2:"82",  m3:"83",  m4:"84",  m5:"85",  m6:"86",  m7:"87",  m8:"88",  m9:"89"},
  {id:18, m0:"", m1:"", m2:"", m3:"", m4:"", m5:"", m6:"", m7:"", m8:"", m9:""},
  {id:19, m0:"90",  m1:"91",  m2:"92",  m3:"93",  m4:"94",  m5:"95",  m6:"96",  m7:"97",  m8:"98",  m9:"99"},
  {id:20, m0:"", m1:"", m2:"", m3:"", m4:"", m5:"", m6:"", m7:"", m8:"", m9:""},
];

var blankmemorytabledatahex = [
  {id:1,  m0:"0000",  m1:"0001",  m2:"0002",  m3:"0003",  m4:"0004",  m5:"0005",  m6:"0006",  m7:"0007",  m8:"0008",  m9:"0009"},
  {id:2,  m0:"", m1:"", m2:"", m3:"", m4:"", m5:"", m6:"", m7:"", m8:"", m9:""},
  {id:3,  m0:"000A",  m1:"000B",  m2:"000C",  m3:"000D",  m4:"000E",  m5:"000F",  m6:"0010",  m7:"0011",  m8:"0012",  m9:"0013"},
  {id:4,  m0:"", m1:"", m2:"", m3:"", m4:"", m5:"", m6:"", m7:"", m8:"", m9:""},
  {id:5,  m0:"0014",  m1:"0015",  m2:"0016",  m3:"0017",  m4:"0018",  m5:"0019",  m6:"001A",  m7:"001B",  m8:"001C",  m9:"001D"},
  {id:6,  m0:"", m1:"", m2:"", m3:"", m4:"", m5:"", m6:"", m7:"", m8:"", m9:""},
  {id:7,  m0:"001E",  m1:"001F",  m2:"0020",  m3:"0021",  m4:"0022",  m5:"0023",  m6:"0024",  m7:"0025",  m8:"0026",  m9:"0027"},
  {id:8,  m0:"", m1:"", m2:"", m3:"", m4:"", m5:"", m6:"", m7:"", m8:"", m9:""},
  {id:9,  m0:"0028",  m1:"0029",  m2:"002A",  m3:"002B",  m4:"002C",  m5:"002D",  m6:"002E",  m7:"002F",  m8:"0030",  m9:"0031"},
  {id:10, m0:"", m1:"", m2:"", m3:"", m4:"", m5:"", m6:"", m7:"", m8:"", m9:""},
  {id:11, m0:"0032",  m1:"0033",  m2:"0034",  m3:"0035",  m4:"0036",  m5:"0037",  m6:"0038",  m7:"0039",  m8:"003A",  m9:"003B"},
  {id:12, m0:"", m1:"", m2:"", m3:"", m4:"", m5:"", m6:"", m7:"", m8:"", m9:""},
  {id:13, m0:"003C",  m1:"003D",  m2:"003E",  m3:"003F",  m4:"0040",  m5:"0041",  m6:"0042",  m7:"0043",  m8:"0044",  m9:"0045"},
  {id:14, m0:"", m1:"", m2:"", m3:"", m4:"", m5:"", m6:"", m7:"", m8:"", m9:""},
  {id:15, m0:"0046",  m1:"0047",  m2:"0048",  m3:"0049",  m4:"004A",  m5:"004B",  m6:"004C",  m7:"004D",  m8:"004E",  m9:"004F"},
  {id:16, m0:"", m1:"", m2:"", m3:"", m4:"", m5:"", m6:"", m7:"", m8:"", m9:""},
  {id:17, m0:"0050",  m1:"0051",  m2:"0052",  m3:"0053",  m4:"0054",  m5:"0055",  m6:"0056",  m7:"0057",  m8:"0058",  m9:"0059"},
  {id:18, m0:"", m1:"", m2:"", m3:"", m4:"", m5:"", m6:"", m7:"", m8:"", m9:""},
  {id:19, m0:"005A",  m1:"005B",  m2:"005C",  m3:"005D",  m4:"005E",  m5:"005F",  m6:"0060",  m7:"0061",  m8:"0062",  m9:"0063"},
  {id:20, m0:"", m1:"", m2:"", m3:"", m4:"", m5:"", m6:"", m7:"", m8:"", m9:""},
];

// Default to hexdecimal display
var blankmemorytabledata = blankmemorytabledatahex;

// Settings

//
// Execution speeds - we also have the Next button which steps.
//
const speeds = {
  SUPERSLOW: "<i class='fa-regular fa-hand'></i>  Explain Everything - around 2 seconds per cycle",
  SLOW: "<i class='fa-solid fa-person-walking'></i>  Run Slow - about 1 second per cycle",
  MEDIUM: "<i class='fa-solid fa-person-running'></i>  Run at Medium speed - about 0.5 seconds per cycle",
  FAST: "<i class='fa-solid fa-bicycle'></i>  Run at Fast speed - about 0.25 seconds per cycle",
  SUPERFAST: "<i class='fa-solid fa-rocket'></i>  Just Run!  About 0.1 seconds per cycle",
}



//
// STOPPING is needed in order to cleanly complete the current instruction
// (through to the end of execution) to support pause/resume/step.
//
const states = {
  UNASSEMBLED: "Unassembled",
  ASSEMBLED: "Assembled",
  RUNNING: {
    "ACTIVE": "Active",
    "BLOCKEDONINPUT": "Waiting for input",
    "PAUSED": "Paused",
    "STOPPING": "Stopping...",
  },
  STOPPED: "Stopped",
  HALTED: "Halted",
}

var stashedSettingSpeed = speeds.MEDIUM;

var stashedSettingShowDataFlows = true;
var stashedSettingShowVariables = true;
var stashedSettingShowMemoryAccess = true;
var stashedSettingMemoryDataInHex = true;

var settingShowDataFlows = stashedSettingShowDataFlows;
var settingShowVariables = stashedSettingShowVariables;
var settingShowMemoryAccess = stashedSettingShowMemoryAccess;
var settingMemoryDataInHex = stashedSettingMemoryDataInHex;

//
// Default to MEDIUM
// If this is changed, then the HTML for the Settings modal
// needs to have a matching change
//
let settingSpeed = speeds.MEDIUM;

// Main function
function filltable() {

  var codetabledata = [
    {id:1,  active:"-", line:"00", label:"", operator:"", operand:""},
  ];


  Tabulator.extendModule("keybindings", "actions", {
    "deleteSelectedRows":function(){ //delete selected rows
      let rows = this.table.getSelectedRows();
      let currentData = this.table.getData();

      //
      // To make this multi-select safe, we build an array
      // of ids for the selected rows, then get the data array
      // and use splice to remove the rows, then work through
      // and set the ids and linenumbers properly, and finally
      // call replaceData() on the table.
      //
      let rowIdsToDelete = [];

      rows.forEach(function(row){
        rowIdsToDelete.push(row.getIndex());
        row.deselect();
      });
      
      if (rowIdsToDelete.length != 1){
        console.log("Asked to delete a number of rows other than one - bailing.");
        return;
      }

      currentData.splice(rowIdsToDelete[0]-1, 1);

      //
      // Renumber the remaining items
      //
      for (let i=rowIdsToDelete[0]-1; i < currentData.length; i++) {
        currentData[i]['id']--;
        let lineNo = (currentData[i]['id']-1).toString().padStart(2, "0");
        currentData[i]['line'] = lineNo;
      }

      //
      // Add in a new row 99 to keep to 100 rows...
      //
      currentData.splice(99, 0, {id:100, active:"-", line:"99", label:"", operator:"", operand:""});

      this.table.replaceData(currentData);
      
    },
  });  

  Tabulator.extendModule("keybindings", "actions", {
    "deselectAllRows":function(){ //deselect selected rows
      var rows = this.table.getSelectedRows();

      rows.forEach(function(row){
        row.deselect();
      });
    },
  });  

  Tabulator.extendModule("keybindings", "actions", {
    "arrowNavNext":function(){ //move to next cell
      this.table.navigateNext();
    },
  });  

  Tabulator.extendModule("keybindings", "actions", {
    "arrowNavPrev":function(){ //move to next cell
      this.table.navigatePrev();
    },
  });  


  Tabulator.extendModule("keybindings", "actions", {
    "insertRow":function(){ //insert new row
      let currentData = this.table.getData();

      //  
      // Get index of currently selected row, use first row as a default
      //      
      let currentRow = 1;
      let rows = this.table.getSelectedRows();
      if (rows.length != 0) {
        currentRow = rows[0].getIndex();
      }

      //
      // Insert a new row
      //
      currentData.splice(currentRow-1, 0, {id:currentRow, active:"-", line:(currentRow-1).toString().padStart(2, "0"), label:"", operator:"", operand:""});

      //
      // Renumber the remaining items
      //
      for (let i=currentRow; i < currentData.length; i++) {
        currentData[i]['id']++;
        let lineNo = (currentData[i]['id']-1).toString().padStart(2, "0");
        currentData[i]['line'] = lineNo;
      }

      //
      // Remove row 100 to keep to 100 rows (0..99)...
      //
      currentData.splice(100, 1);
       
      //  
      // Note - using setData() rather than replaceData() causes some 
      // drawing issues (the last row is gray, even though data are present)
      //
      this.table.replaceData(currentData);
    },
  });  

  while (codetabledata.length < 100) {
    let newrowno = codetabledata.length+1
    codetabledata.push({id:newrowno, active: "-", line:(newrowno-1).toString().padStart(2, "0"), label:"", operator:"", operand:""});
  }

  //
  // For future expansion, we have a traffic light formatter on the 'active'
  // column.  Currently this is either blank (for a value of '-') or green
  // (for a value of 1) to show the currently executing line.  I plan to add
  // break points in red (value 3), and to use orange (value 2) to indicate
  // that we are stopped at the current break point.
  //
  // Look at the column width settings again when I have time - the current
  // approach to setting a narrow and fixed active column is a bit hacky.
  //
  // dowload is set to false on the active column to exclude it from the
  // PDF produced for printing.
  //
  // We should also look at downloadDataFormatter in Tabulator as a way of
  // removing the blank lines from the download data before passing it to
  // jsPDF.  I think we could start at line 99 and remove the current line
  // if label/operator/operand are all blank.  Stopping when we find anything
  // that is not blank - this should protect any blank lines separating code
  // from data for example.
  //
  
  //
  //Safari has a slightly different interpretation of the height of the 
  // viewport, so 95vh on desktop browsers is different to 95 vh on iPad
  // So, we need to allow for this with some hacky JavaScript ... which
  // is still not working.  I have reverted to setting the darn thing
  // in html.
  //
  let percent = 90;
  
  var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
  var is_safari = navigator.userAgent.indexOf("Safari") > -1;

  if ((is_chrome)&&(is_safari)) { is_safari = false; }
  
  if (is_safari){
    percent = 50;
    document.getElementById("codetableholder").style.maxHeight = '${percent}vh';
}
  
//  document.getElementById("codetableholder").style.'max-height' = '${percent}vh';
  
  table1 = new Tabulator("#code-table", {
    maxHeight:'${percent}vh', // set height of table (in CSS or here)
    data:codetabledata, //assign data to table
    tabEndNewRow:true,
    history:true,
    layout:"fitColumns", //fit columns to width of table (optional)
    columns:[ 
      {title:"", field:"active", formatter:"traffic", formatterParams:{min:1, max:3, color:["green", "orange", "red"]}, width:25, maxWidth:25, minWidth:25, hozAlign:"center", headerSort:false, download:false},
      {title:"Line", field:"line", width:"10%", widthShrink:3, headerSort:false},
      {title:"Label", field:"label", width:"20%", widthShrink:6, hozAlign:"left", editor:true, headerSort:false},
      {title:"Operator", field:"operator", width:"30%", widthShrink:4, editor:true, headerSort:false},
      {title:"Operand", field:"operand", width:"35%", widthShrink:6, editor:true, headerSort:false},
    ],
    selectable:1,
    keybindings:{
        "deleteSelectedRows" : "46", //bind clear function to delete
        "deselectAllRows": "27",
        "insertRow": "45",
        "arrowNavNext": "39",
        "arrowNavPrev": "37",
    },
    history:true,
    downloadRowRange:"selected", //print only currently selected rows
  });

  table1.on("cellEdited", function(data){ // fired if the user edits the table, but not programmatic changes...
    if (intervalHandle != null) {
      clearInterval(intervalHandle);
    }
    changeState(states.UNASSEMBLED);
  });

  table1.on("rowAdded", function(row) {
    handleNewRow(row);
  });


  //
  // Memory Table
  //  
  table2 = new Tabulator("#memory-table", {
    maxHeight:"600px", // set height of table (in CSS or here)
    data:blankmemorytabledata, //assign data to table
    clipboard:false,
    layout:"fitColumns", //fit columns to width of table (optional)
    columns:[ //Define Table Columns
      {title:"", field:"m0", width:"10%", widthShrink:1, hozAlign:"center", headerSort:false},
      {title:"", field:"m1", width:"10%", widthShrink:1, hozAlign:"center", headerSort:false},
      {title:"M", field:"m2", width:"10%", widthShrink:1, hozAlign:"center", headerHozAlign:"center", headerSort:false},
      {title:"E", field:"m3", width:"10%", widthShrink:1, hozAlign:"center", headerHozAlign:"center", headerSort:false},
      {title:"M", field:"m4", width:"10%", widthShrink:1, hozAlign:"center", headerHozAlign:"center", headerSort:false},
      {title:"O", field:"m5", width:"10%", widthShrink:1, hozAlign:"center", headerHozAlign:"center", headerSort:false},
      {title:"R", field:"m6", width:"10%", widthShrink:1, hozAlign:"center", headerHozAlign:"center", headerSort:false},
      {title:"Y", field:"m7", width:"10%", widthShrink:1, hozAlign:"center", headerHozAlign:"center", headerSort:false},
      {title:"", field:"m8", width:"10%", widthShrink:1, hozAlign:"center", headerSort:false},
      {title:"", field:"m9", width:"10%", widthShrink:1, hozAlign:"center", headerSort:false},
    ],	
  });


  //
  // Processor schematic canvas
  //
  var c = document.getElementById("processor-canvas");
  var ctx = c.getContext("2d");
  
  scaleCanvas();

  drawCPU(ctx);


  // Configure CPU buttons
  document.getElementById("run-btn").disabled = true;
  document.getElementById("stop-btn").disabled = true;
  document.getElementById("resume-btn").disabled = true;
  document.getElementById("next-btn").disabled = true;

  //
  // Set up file handler
  //
  document.getElementById("load-btn").addEventListener('change', handleFile, false);

}

// 
// Ensure that new rows (resulting from a tab action on the last cell) have valid blank
// contents and a line number.
// 
function handleNewRow(row) {
  var numRows = table1.getDataCount();
  numRows -= 1;
  row.update({line:numRows.toString(), label:"", operator:"", operand:""});
}



//
// Draw the CPU, scaling to the size of the canvas
//
function drawCPU(context) {

  context.clearRect(0, 0, canvasInfo.width, canvasInfo.height);

  context.save();

  //
  // Draw the buses first
  //
  xstart = canvasInfo.x_offset + canvasInfo.regWidth/2;
  ystart = canvasInfo.y_offset + canvasInfo.regHeight/2;
  xend = canvasInfo.width;
  yend = ystart;
  drawBus(context, xstart, ystart, xend, yend); // PC->MAR->

  ystart += canvasInfo.y_increment1;
  yend = ystart;
  drawBus(context, xstart, ystart, xend, yend); // CIR->MDR->

  ystart += canvasInfo.y_increment2*2;
  xend = canvasInfo.x_offset + 2*canvasInfo.x_increment + canvasInfo.regWidth/2;
  yend = ystart;
  drawBus(context, xstart, ystart, xend, yend); // INPUT->ACC->OUTPUT

  xstart = canvasInfo.x_offset + canvasInfo.x_increment - canvasInfo.regWidth/2;
  ystart = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2 - canvasInfo.regHeight*1.5;
  xend = xstart;
  yend = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2 + canvasInfo.y_increment2*2;
  drawBus(context, xstart, ystart, xend, yend); // P1 INPUT->ALU

  xstart = canvasInfo.x_offset + canvasInfo.x_increment;
  ystart = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2 - canvasInfo.regHeight*1.5;
  xend = xstart;
  yend = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2;
  drawBus(context, xstart, ystart, xend, yend); // P3 INPUT->ALU

  xstart = canvasInfo.x_offset + canvasInfo.x_increment - canvasInfo.regWidth/2;
  xstart -= canvasInfo.busWidth /2;
  ystart = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2 - canvasInfo.regHeight*1.5;
  xend = canvasInfo.x_offset + canvasInfo.x_increment;
  xend += canvasInfo.busWidth/2;
  yend = ystart;
  drawBus(context, xstart, ystart, xend, yend); // P2 INPUT->ALU

  xstart = canvasInfo.x_offset + canvasInfo.x_increment - canvasInfo.regWidth/2;
  ystart = canvasInfo.y_offset + canvasInfo.regHeight/2;
  xend = xstart;
  yend = ystart + canvasInfo.y_increment1;
  drawBus(context, xstart, ystart, xend, yend); // PC-MAR->CIR-MDR

  xstart = canvasInfo.x_offset + canvasInfo.x_increment + canvasInfo.regWidth;
  ystart = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2;
  xend = xstart;
  yend = ystart + canvasInfo.y_increment2;
  yend = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2;
  drawBus(context, xstart, ystart, xend, yend); // CIR-MDR->ALU

  xstart = canvasInfo.x_offset + canvasInfo.x_increment*2 - canvasInfo.regWidth/2;
  ystart = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2;
  xend = xstart;
  yend = ystart + canvasInfo.y_increment2*2;
  drawBus(context, xstart, ystart, xend, yend); // CIR-MDR->ACC-OUTPUT

  xstart = canvasInfo.x_offset + canvasInfo.x_increment + canvasInfo.regWidth/2;
  ystart = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2 + canvasInfo.regHeight/2;
  xend = xstart;
  yend = ystart + canvasInfo.y_increment2;
  drawBus(context, xstart, ystart, xend, yend); // ALU->ACC

  //
  // Overlay the registers
  // (Use a drop shadow)
  //

  context.shadowColor = '#898';
  context.shadowBlur = 20;
  context.shadowOffsetX = 20;
  context.shadowOffsetY = 20;
  context.fill();

  xpos = canvasInfo.x_offset;
  ypos = canvasInfo.y_offset;
  drawRegister(context, "PC",      xpos, ypos, canvasInfo.regWidth, canvasInfo.regHeight, '#FB8738');

  xpos += 2*canvasInfo.x_increment;
  drawRegister(context, "MAR",     xpos, ypos, canvasInfo.regWidth, canvasInfo.regHeight, '#FB8738');

  xpos = canvasInfo.x_offset + canvasInfo.x_increment;
  ypos = canvasInfo.y_offset + canvasInfo.y_increment1/2;
  drawRegister(context, "IX",     xpos, ypos, canvasInfo.regWidth, canvasInfo.regHeight, '#FB8738');

  xpos = canvasInfo.x_offset;
  ypos = canvasInfo.y_offset + canvasInfo.y_increment1;
  drawRegister(context, "CIR",     xpos, ypos, canvasInfo.regWidth, canvasInfo.regHeight, '#FB8738');

  xpos += 2*canvasInfo.x_increment;
  drawRegister(context, "MDR",     xpos, ypos, canvasInfo.regWidth, canvasInfo.regHeight, '#79B94F');

  xpos = canvasInfo.x_offset;
  ypos = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2;
  drawRegister(context, "DECODER", xpos, ypos, canvasInfo.regWidth, canvasInfo.regHeight, '#FB8738');

  xpos += 2*canvasInfo.x_increment;  
  drawRegister(context, "SR",      xpos, ypos, canvasInfo.regWidth, canvasInfo.regHeight, '#79B94F');

  xpos = canvasInfo.x_offset;
  ypos = canvasInfo.y_offset + canvasInfo.y_increment1 + (2*canvasInfo.y_increment2);
  drawRegister(context, "INPUT",   xpos, ypos, canvasInfo.regWidth, canvasInfo.regHeight, '#C0D4F5');

  xpos += canvasInfo.x_increment;
  drawRegister(context, "ACC",     xpos, ypos, canvasInfo.regWidth, canvasInfo.regHeight, '#79B94F');

  xpos += canvasInfo.x_increment;
  drawRegister(context, "OUTPUT",  xpos, ypos, canvasInfo.regWidth, canvasInfo.regHeight, '#C0D4F5');

  

  xpos = canvasInfo.x_offset + canvasInfo.x_increment;
  ypos = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2;
  drawALU(context,      "ALU",     xpos, ypos, canvasInfo.regWidth, canvasInfo.regHeight, '#79B94F');

  context.restore();

  //
  // Update the register values
  //
  let formattedPC = programCounter.toString().padStart(4, "0");
  let formattedMAR = memoryAddressRegister.toString().padStart(4, "0");

  drawRegisterValue("MAR", formattedMAR, context);
  drawRegisterValue("MDR", memoryDataRegister, context);
  drawRegisterValue("CIR", currentInstructionRegister, context);
  drawRegisterValue("PC", formattedPC, context);
  drawRegisterValue("SR", statusRegister, context);
  drawRegisterValue("ACC", accumulator, context);
  drawRegisterValue("IX", ix, context);

  drawRegisterValue("ALU", "", context);
  drawRegisterValue("INP", "", context);
  drawRegisterValue("OUT", "", context);
  drawRegisterValue("DECODER", "", context);

}


//
// Draw a single register - x, y are the coordinates for the top left corner
//
function drawRegister(context, name, x, y, w, h, colour) {
  let cWidth = context.canvas.clientWidth;

  context.fillStyle = colour;

  context.fillRect(x, y, w, h);
  context.strokeStyle = '#000000';
  context.lineWidth = 1;
  context.strokeRect(x, y, w, h);

  context.font = canvasInfo.font;
  context.fillStyle = "#000000";
  context.fillText(name, x, y-5);

}

//
// Special function for the ALU shape
//
function drawALU(context, name, x, y, w, h, colour) {

  xoffset = w/4
  yoffset = w/6

  context.beginPath();
  context.moveTo(x-xoffset, y-yoffset);
  context.lineTo(x+xoffset, y-yoffset);
  context.lineTo(x+(w/2), y+yoffset);
  context.lineTo(x+w-xoffset, y-yoffset);
  context.lineTo(x+w+xoffset, y-yoffset);
  context.lineTo(x+(w/2)+xoffset, y+h+yoffset);
  context.lineTo(x+(w/2)-xoffset, y+h+yoffset);
  context.lineTo(x-xoffset, y-yoffset);
  context.closePath();

  context.fillStyle = colour;
  context.strokeStyle = '#000000';
  context.lineWidth = 1;
  context.fill();
  context.stroke();

  //
  // Clear the path for any future redrawing of the CPU
  //
  context.beginPath();
  context.closePath();

  context.font = canvasInfo.font;
  context.fillStyle = "#000000";
  length = context.measureText(name).width;
  context.fillText(name, x+(w/2)-(length/2), y-5-yoffset);

}


//
// Write the register value in the approriate place.
// Should move the common code with drawRegister()
// somewhere sensible
//
function drawRegisterValue(register, value, context) { 
  let x = 10;
  let y = 10;
  let mainColour = "#CCCCCC";
  
  context.save();

  if (register == "MAR"){
    x = canvasInfo.x_offset + 2*canvasInfo.x_increment;
    y = canvasInfo.y_offset;
    mainColour = "#FB8738";
  } else if (register == "MDR") {
    x = canvasInfo.x_offset + 2*canvasInfo.x_increment;
    y = canvasInfo.y_offset + canvasInfo.y_increment1;
    mainColour = "#79B94F";
  } else if (register == "CIR") {
    x = canvasInfo.x_offset;
    y = canvasInfo.y_offset + canvasInfo.y_increment1;
    mainColour = "#FB8738";
  } else if (register == "PC") {
    x = canvasInfo.x_offset;
    y = canvasInfo.y_offset;
    mainColour = "#FB8738";
  } else if (register == "ACC") {
    x = canvasInfo.x_offset + canvasInfo.x_increment;
    y = canvasInfo.y_offset + canvasInfo.y_increment1 + 2*canvasInfo.y_increment2;
    mainColour = "#79B94F";
  } else if (register == "SR") {
    x = canvasInfo.x_offset + 2*canvasInfo.x_increment;
    y = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2;
    mainColour = "#79B94F";
  } else if (register == "ALU") {
    x = canvasInfo.x_offset + canvasInfo.x_increment + canvasInfo.regWidth/4;
    y = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2 + canvasInfo.regHeight/2;
    mainColour = "#79B94F";
  } else if (register == "INP") {
    x = canvasInfo.x_offset;
    y = canvasInfo.y_offset + canvasInfo.y_increment1 + 2*canvasInfo.y_increment2;
    mainColour = "#C0D4F5";
  } else if (register == "OUT") {
    x = canvasInfo.x_offset + 2*canvasInfo.x_increment;
    y = canvasInfo.y_offset + canvasInfo.y_increment1 + 2*canvasInfo.y_increment2;
    mainColour = "#C0D4F5";
  } else if (register == "DECODER"){
    x = canvasInfo.x_offset;
    y = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2;
    mainColour = "#FB8738";
  } else if (register == "IX"){
    x = canvasInfo.x_offset + canvasInfo.x_increment;
    y = canvasInfo.y_offset + canvasInfo.y_increment1/2;
    mainColour = "#FB8738";
  }
    
  context.shadowBlur = 0;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;

  // Draw Value in bounding box
  context.font = canvasInfo.font;

  // Clear the current value (ALU is smaller in the label area)
  context.fillStyle = mainColour;
  if (register == "ALU") {
    w = canvasInfo.regWidth*0.5;
    h = canvasInfo.regHeight*0.8;
    context.fillRect(x+1, y+1, w-1, h-1);
  } else {
    //w = canvasInfo.regWidth*0.85;
    w = canvasInfo.regWidth*0.95;
    h = canvasInfo.regHeight*0.8;
    context.fillRect(x+2, y+2, w-2, h-2);
  }

  // Write the new value
  context.fillStyle = "#000000";
  
  //
  // This is a bit of a hack - the ALU needs centred text, as
  // opposed to all other registers which are left aligned.
  // As the ALU always has a three letter label, we can get
  // away with just nudging the offset to the left a litte,
  // but we should really calculate the text extent and use
  // that to get the offset
  //
  if (register == "ALU") {
    x_offset = canvasInfo.regWidth*0.06;
  } else {
    x_offset = canvasInfo.regWidth*0.1;
  }
  y_offset = canvasInfo.regHeight*0.6;

  context.fillText(value, x+x_offset, y+y_offset);

  context.restore();
}

function drawBus(context, x1, y1, x2, y2) {
  x = 0;
  y = 0;
  w = canvasInfo.busWidth;
  h = canvasInfo.busWidth;

  context.save();

  context.fillStyle = '#5b9bd5';

  if ( x1 == x2 ) {
    // Bus is vertical
    x = x1 - w/2;
    y = y1;
    h = y2 - y1;
  }
  else if ( y1 == y2 ) {
    // Bus is horizontal
    y = y1 - h/2;
    x = x1;
    w = x2 - x1;
  }

  context.fillRect(x, y, w, h);

  context.restore();
}

//
// This is a bit nasty, but I cannot think of a better way at present
// We have hard-wired 'stages'; 0 = PC-to-MAR; 1 = MAR-to-MEMORY; 
// 2 = MEMORY-to-MDR; etc.  For each of these stages we can work out
// where we need to animate some movement of data.  Initially, we can
// just draw some dots...
//
function animateBus(context, operation) {

  if (settingShowDataFlows  == false) {
    return;
  }
  
  context.save();

  if (canvasInfo.lastBusAnimation == -1) {
    animateBus2(context, operation, false)
  } else {
    animateBus2(context, canvasInfo.lastBusAnimation, true);
    animateBus2(context, operation, false)
  }
  canvasInfo.lastBusAnimation = operation;
  context.restore();
}

function animateBus2(context, operation, erase) {

  let os = 6;
  let points = [];
  let points2 = [];

  context.save();
  
  context.lineWidth = 6;
  context.lineCap = "round";
  context.lineJoin = "round";
  //context.setLineDash([1, 2, 3]);
  context.strokeStyle = '#9933cc';
  if (erase == true) {
    // Web browsers are somewhat suboptimal when drawing over lines
    // We need to increase the area covered by the 'erasing' line
    // just a little to counteract this, so we increase the width
    // and reduce the offset.
    os = 5;
    context.lineWidth = 8;
    context.strokeStyle = '#5b9bd5';
  }

  if ( operation == 0 ) {
    // PC-to-MAR (First stage of FETCH)
    x0 = canvasInfo.x_offset + canvasInfo.regWidth + os;
    y0 = canvasInfo.y_offset + canvasInfo.regHeight/2;

    x1 = canvasInfo.x_offset + canvasInfo.x_increment*2 -os;
    y1 = canvasInfo.y_offset + canvasInfo.regHeight/2;

    points=[[x0, y0], [x1, y1]];
  }
  else if (operation == 1) {
    // MAR-to-Memory (Second stage of FETCH)
    x0 = canvasInfo.x_offset + canvasInfo.x_increment*2 + canvasInfo.regWidth + os;
    y0 = canvasInfo.y_offset + canvasInfo.regHeight/2;

    x1 = canvasInfo.width;
    y1 = canvasInfo.y_offset + canvasInfo.regHeight/2;

    points=[[x0, y0], [x1, y1]];
  }
  else if (operation == 2) {
    // Memory-to-MDR  (Third stage of FETCH)
    x0 = canvasInfo.x_offset + canvasInfo.x_increment*2 + canvasInfo.regWidth + os;
    y0 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2;

    x1 = canvasInfo.width;
    y1 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2;

    points=[[x0, y0], [x1, y1]];
  }
  else if (operation == 3) {
    // MDR-to-CIR  (Fourth stage of FETCH)
    x0 = canvasInfo.x_offset + canvasInfo.regWidth + os;
    y0 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2;

    x1 = canvasInfo.x_offset + canvasInfo.x_increment*2 - os; 
    y1 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2;

    points=[[x0, y0], [x1, y1]];
  }
  else if (operation == 4) {
    // Not used in LMC - Will be MDR-to-MAR for indirect operations
  }
  else if (operation == 5) {
    // CIR-to-MAR (Direct Adddressing?  Use operand in CIR as address)
    x0 = canvasInfo.x_offset + canvasInfo.regWidth + os;
    y0 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2;

    x1 = canvasInfo.x_offset + canvasInfo.x_increment - canvasInfo.regWidth/2;
    y1 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2;

    x2 = canvasInfo.x_offset + canvasInfo.x_increment - canvasInfo.regWidth/2;
    y2 = canvasInfo.y_offset + canvasInfo.regHeight/2;

    x3 = canvasInfo.x_offset + canvasInfo.x_increment*2 - os;
    y3 = canvasInfo.y_offset + canvasInfo.regHeight/2;

    points2=[[x0, y0], [x1, y1], [x2, y2], [x3, y3]];
  }
  else if (operation == 6) {
    // ACC-to-ALU (Arithmetic operation involving values in ACC and MDR)
    x0 = canvasInfo.x_offset + canvasInfo.x_increment - os;
    y0 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2*2 + canvasInfo.regHeight/2;

    x1 = canvasInfo.x_offset + canvasInfo.x_increment - canvasInfo.regWidth/2;
    y1 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2*2 + canvasInfo.regHeight/2;


    x2 = canvasInfo.x_offset + canvasInfo.x_increment - canvasInfo.regWidth/2;
    y2 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2 - canvasInfo.regHeight*1.5;

    x3 = canvasInfo.x_offset + canvasInfo.x_increment;
    y3 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2 - canvasInfo.regHeight*1.5;

    x4 = canvasInfo.x_offset + canvasInfo.x_increment;
    y4 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2 - canvasInfo.regWidth/6 - os;

    points=[[x0, y0], [x1, y1], [x2, y2], [x3, y3], [x4, y4]];


    // MDR-to-ALU *
    x0 = canvasInfo.x_offset + canvasInfo.x_increment*2 - os;
    y0 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2;

    x1 = canvasInfo.x_offset + canvasInfo.x_increment + canvasInfo.regWidth;
    y1 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2;

    x2 = canvasInfo.x_offset + canvasInfo.x_increment + canvasInfo.regWidth;
    y2 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2 - canvasInfo.regWidth/6 - os;

    points2=[[x0, y0], [x1, y1], [x2, y2]];
  }
  else if (operation == 7) {
    // ALU-to-ACC (Output results from ALU to ACC)
    x0 = canvasInfo.x_offset + canvasInfo.x_increment + canvasInfo.regWidth/2;
    y0 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2 + canvasInfo.regHeight*3/2 + os;

    x1 = canvasInfo.x_offset + canvasInfo.x_increment + canvasInfo.regWidth/2;
    y1 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2*2 - os;

    points=[[x0, y0], [x1, y1]];
  }
  else if (operation == 8) {
    // ACC-to-MDR (Write value in ACC to memory address in CIR)
    x0 = canvasInfo.x_offset + canvasInfo.x_increment*2 - os;
    y0 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2;

    x1 = canvasInfo.x_offset + canvasInfo.x_increment*2 - canvasInfo.regWidth/2;
    y1 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2;

    x2 = canvasInfo.x_offset + canvasInfo.x_increment*2 - canvasInfo.regWidth/2;
    y2 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2*2 + canvasInfo.regHeight/2;

    x3 = canvasInfo.x_offset + canvasInfo.x_increment + canvasInfo.regWidth + os;
    y3 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2*2 + canvasInfo.regHeight/2;

    points=[[x0, y0], [x1, y1], [x2, y2], [x3, y3]];


    // CIR-to-MAR
    x0 = canvasInfo.x_offset + canvasInfo.regWidth + os;
    y0 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2;

    x1 = canvasInfo.x_offset + canvasInfo.x_increment - canvasInfo.regWidth/2
    y1 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2;

    x2 = canvasInfo.x_offset + canvasInfo.x_increment - canvasInfo.regWidth/2;
    y2 = canvasInfo.y_offset + canvasInfo.regHeight/2;

    x3 = canvasInfo.x_offset + canvasInfo.x_increment*2 - os;
    y3 = canvasInfo.y_offset + canvasInfo.regHeight/2;

    points2=[[x0, y0], [x1, y1], [x2, y2], [x3, y3]];
  }
  else if (operation == 9) {
    // MAR-to-Memory (Memory read; MAR-to-Memory, Memory-to-MDR)
    x0 = canvasInfo.x_offset + canvasInfo.x_increment*2 + canvasInfo.regWidth + os;
    y0 = canvasInfo.y_offset + canvasInfo.regHeight/2;

    x1 = canvasInfo.width;
    y1 = canvasInfo.y_offset + canvasInfo.regHeight/2;

    points=[[x0, y0], [x1, y1]];

    // Memory-to-MDR
    x0 = canvasInfo.x_offset + canvasInfo.x_increment*2 + canvasInfo.regWidth + os;
    y0 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2;

    x1 = canvasInfo.width;
    y1 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2;

    points2=[[x0, y0], [x1, y1]];
  }
  else if (operation == 10) {
    // MDR-to-ACC (contents of MDR to ACC - Load)
    x0 = canvasInfo.x_offset + canvasInfo.x_increment*2 - os;
    y0 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2;

    x1 = canvasInfo.x_offset + canvasInfo.x_increment*2 - canvasInfo.regWidth/2;
    y1 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2;

    x2 = canvasInfo.x_offset + canvasInfo.x_increment*2 - canvasInfo.regWidth/2;
    y2 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2*2 + canvasInfo.regHeight/2;

    x3 = canvasInfo.x_offset + canvasInfo.x_increment + canvasInfo.regWidth + os;
    y3 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2*2 + canvasInfo.regHeight/2;

    points=[[x0, y0], [x1, y1], [x2, y2], [x3, y3]];
  }
  else if (operation == 11) {
    // CIR-to-PC (Branch/Jump)
    x0 = canvasInfo.x_offset + canvasInfo.regWidth + os;
    y0 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2;

    x1 = canvasInfo.x_offset + canvasInfo.x_increment - canvasInfo.regWidth/2
    y1 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2;

    x2 = canvasInfo.x_offset + canvasInfo.x_increment - canvasInfo.regWidth/2;
    y2 = canvasInfo.y_offset + canvasInfo.regHeight/2;

    x3 = canvasInfo.x_offset + canvasInfo.regWidth + os;
    y3 = canvasInfo.y_offset + canvasInfo.regHeight/2;

    points=[[x0, y0], [x1, y1], [x2, y2], [x3, y3]];
  }
  else if (operation == 12) {
    // Not used in LMC - Will be CIR-to-ACC in CAIE for Immediate
  }
  else if (operation == 13) {
    // INPUT-to-ACC (Plain old input)
    x0 = canvasInfo.x_offset + canvasInfo.regWidth + os;
    y0 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2*2 + canvasInfo.regHeight/2;

    x1 = canvasInfo.x_offset+canvasInfo.x_increment - os;
    y1 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2*2 + canvasInfo.regHeight/2;

    points=[[x0, y0], [x1, y1]];
  }
  else if (operation == 14) {
    // ACC-to-OUTPUT (Plain old output)
    x0 = canvasInfo.x_offset + canvasInfo.x_increment + canvasInfo.regWidth + os;
    y0 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2*2 + canvasInfo.regHeight/2;

    x1 = canvasInfo.x_offset+canvasInfo.x_increment*2 - os;
    y1 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2*2 + canvasInfo.regHeight/2;

    points=[[x0, y0], [x1, y1]];
  }
  else if (operation == 20) {
    // ACC-to-ALU (Arithmetic operation involving values in ACC and CIR)
    x0 = canvasInfo.x_offset + canvasInfo.x_increment - os;
    y0 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2*2 + canvasInfo.regHeight/2;

    x1 = canvasInfo.x_offset + canvasInfo.x_increment - canvasInfo.regWidth/2;
    y1 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2*2 + canvasInfo.regHeight/2;

    x2 = canvasInfo.x_offset + canvasInfo.x_increment - canvasInfo.regWidth/2;
    y2 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2 - canvasInfo.regHeight*1.5;

    x3 = canvasInfo.x_offset + canvasInfo.x_increment;
    y3 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2 - canvasInfo.regHeight*1.5;

    x4 = canvasInfo.x_offset + canvasInfo.x_increment;
    y4 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2 - canvasInfo.regWidth/6 - os;

    points=[[x0, y0], [x1, y1], [x2, y2], [x3, y3], [x4, y4]];


    // CIR-to-ALU *
    x0 = canvasInfo.x_offset + canvasInfo.regWidth + os;
    y0 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2;

    x1 = canvasInfo.x_offset + canvasInfo.x_increment + canvasInfo.regWidth;
    y1 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2;

    x2 = canvasInfo.x_offset + canvasInfo.x_increment + canvasInfo.regWidth;
    y2 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2 - canvasInfo.regWidth/6 - os;

    points2=[[x0, y0], [x1, y1], [x2, y2]];
  }
    
  if (points.length != 0) {
    context.beginPath();
    context.moveTo(points[0][0], points[0][1]);
    for (index=1; index<points.length; index++) {
      context.lineTo(points[index][0], points[index][1]);
    }
    context.stroke();
  }

  if (points2.length != 0) {
    context.beginPath();
    context.moveTo(points2[0][0], points2[0][1]);
    for (index=1; index<points2.length; index++) {
      context.lineTo(points2[index][0], points2[index][1]);
    }
    context.stroke();
  }
  
  //
  // Clear path for future drawing
  //
  context.beginPath();
  context.closePath();

  context.restore();
}



//
// Return the delay in milliseconds corresponding to the current speed
//
function getDelay(){
  var newDelay = 500;
  switch(settingSpeed) {
    case speeds.SUPERSLOW:
      newDelay = 2000;
      break;
    case speeds.SLOW:
      newDelay = 1000;
      break;
    case speeds.MEDIUM:
      newDelay = 500;
      break;
    case speeds.FAST:
      newDelay = 250;
      break;
    case speeds.SUPERFAST:
      newDelay = 1;
      break;
    default:
      newDelay = 500;
      break;
  }
  return(newDelay);
}

let state = states.UNASSEMBLED;
let stateBeforeInput = states.UNASSEMBLED;

function processInput(){
  //
  // Check that we are waiting for user input...
  //
  if (state == states.RUNNING.BLOCKEDONINPUT){
    //
    // ... if so, process it and start running again
    //
    userInput = document.getElementById("input-text").value;

    if (userInput.length == 0) {
      let logobj=document.getElementById("log-text");
      logobj.value += "> ERROR:  Invalid input value.\n";
      logobj.scrollTop = logobj.scrollHeight;
      return;
    }

    //
    // New for CIE - allow the following input type markers:
    //   B or b for binary
    //   & for hexadecimal
    //   # for denary (for compatability with exam papers and textbooks, not required)
    //   ' for ASCII
    //
    // Input without any marker is treated as denary.  We should handle negative numbers
    // but this is a matter for future expansion
    //
    let logobj=document.getElementById("log-text");
    const regexbinary = /^[0-1]+$/;
    const regexhexadecimal = /^[A-Fa-f0-9]+$/;
    const regexdenary = /^[0-9]+$/;
    let trial = 0;
    let trialValid = false;

    switch (userInput.charAt(0)) {
      case 'B':
      case 'b':
        userInput = userInput.slice(1);
        if (regexbinary.test(userInput)){
          trial = parseInt(userInput, 2);
          trialValid = true;
        } else {
          logobj.value += userInput;
          logobj.value += " (Problem)";
          logobj.value += "\n";
          logobj.scrollTop = logobj.scrollHeight;
        }
        break;
      case '&':
        userInput = userInput.slice(1);
        if (regexhexadecimal.test(userInput)){
          trial = parseInt(userInput, 16);
          trialValid = true;
        } else {
          logobj.value += userInput;
          logobj.value += " (Problem)";
          logobj.value += "\n";
          logobj.scrollTop = logobj.scrollHeight;
        }
        break;
      case '#':
        userInput = userInput.slice(1);
        if (regexdenary.test(userInput)){
          trial = parseInt(userInput, 10);
          trialValid = true;
        } else {
          logobj.value += userInput;
          logobj.value += " (Problem)";
          logobj.value += "\n";
          logobj.scrollTop = logobj.scrollHeight;
        }
        break;
      case '\'':
        trial = parseInt(userInput.charCodeAt(1),10)
        trialValid = true;
        break;
      default:
        if (regexdenary.test(userInput)){
          trial = parseInt(userInput, 10);
          trialValid = true;
        } else {
          logobj.value += userInput;
          logobj.value += " (Problem)";
          logobj.value += "\n";
          logobj.scrollTop = logobj.scrollHeight;
        }
    }
            
    if (!trialValid) {
      logobj.value += "> ERROR:  Invalid input value.\n";
      logobj.scrollTop = logobj.scrollHeight;
      return;
    }

    logobj.value += "> EXECUTE:  Transferring input to accumulator: " + trial.toString() + "\n";
    logobj.scrollTop = logobj.scrollHeight;
    accumulator = trial;

    var c = document.getElementById("processor-canvas");
    var ctx = c.getContext("2d");
    
    if (settingSpeed != speeds.SUPERFAST) {
      animateBus(ctx, 13);
    }

    // Update the Input Mailbox
    drawRegisterValue("INP", accumulator, ctx);
    // Update the Accumulator
    drawRegisterValue("ACC", accumulator, ctx);

    //
    // If we are stepping through code, then stop (as we have completed execution of the
    // INP instruction, otherwise just pick up from where we suspended to process the INP
    //
    if (stateBeforeInput == states.RUNNING.STOPPING){
      changeState(states.STOPPED);
    } else {
      changeState(stateBeforeInput);
      intervalHandle = setInterval(nextInstruction, getDelay());
    }

  }
  else {
    //
    // ... if not, log and ignore
    //
    let logobj=document.getElementById("log-text");
    logobj.value += "> Input fired, but processor not waiting: " + state + " - ignored\n";
    logobj.scrollTop = logobj.scrollHeight;
  }
}


//
// Use the jspdf plugin (referenced in the HTML header)
// Select the rows that we want to print (so that blank lines of code are omitted)
//
function printCode(){
  var data = table1.getData();
  var lastLine = 99;

  // Deselect all rows
  table1.deselectRow();
  
  for (i=99; i>0; i--) {
    var row = data[i];
    if ((row['label'] != "") || (row['operator'] != "") || (row['operand'] != "")) {
      lastLine = i + 1;
      break;
    }
  }

  for (i=0; i<=lastLine; i++) {
    table1.selectRow(i)
  }

  table1.download("pdf", "caieprogram.pdf", {
        orientation:"portrait", //set page orientation to portrait
        title:"CAIE Assembler Program", //add title to report
  });
  
  for (i=0; i<=lastLine; i++) {
    table1.deselectRow(i)
  }
}

//
// HTML version - need to uncomment two lines in the table1 constructor call
//
//function printCode(){
//  table1.print(false, true);
//}


//
// CAIE Instruction Set
// machine code (mc below) should be interpreted as two hex digits
// +--------------------------------+----------------+------+------+
// |           4 bits               |     2 bits     | 1 bit| 1 bit|
// +--------------------------------+----------------+------+------+
// |       Instruction Code         |    AMC         | RMC  | OPMC |
// +--------------------------------+----------------+------+------+
//
// AMC Values are
// 00 = Immediate Addressing
// 01 = Direct Addressing
// 10 = Indirect Addressing
// 11 = Indexed Addressing
//
// RMC Values are:
// 1 = Accumulator
// 0 = IX
//
// OPMC Values are dependent on the instruction, but are basically:
// 0 = first variant
// 1 = second variant
//
// So, for example, MOV = variant 0, STO = variant 1; 
// JPE = variant 0, JNE = variant 1
// LSL = variant 0, LSR = variant 1
//
//(Need some convenience functions for these mappings)
//
// The substages array contains the bus animation indices, somewhat confusingly
// in reverse order (as currentSubStage counts down, it makes it easier to use
// the currentSubStage value as the index).  All need double-checking.
//
const opcodesCAIE = [{mnemonic: "END", mc:"00", name: "End program", 
                     description: "Instructs the processor to stop executing instructions",
                     substages: []},
                     // Animation performed in processInput(), so no substages here.
                     {mnemonic: "IN", mc:"12", name: "Input", 
                     description: "Copy the value from the 'Input' box into the Accumulator",
                     substages: []},
                     {mnemonic: "LDM", mc:"22", name: "Load Accumulator", 
                     description: "Load the number n to the accumulator.  Immediate addressing",
                     substages: [12]}, 
                     {mnemonic: "LDD", mc:"26", name: "Load Accumulator", 
                     description: "Load the contents of the given memory location to the accumulator.  Direct addressing",
                     substages: [10, 2, 1, 5]},
                     {mnemonic: "LDI", mc:"2A", name: "Load Accumulator", 
                     description: "Use the contents of the given memory location as an addrees.  Load the contents of that address to the accumulator.  Indirect addressing",
                     substages: [10, 2, 1, 4, 2, 1, 5]},
                     {mnemonic: "LDX", mc:"2E", name: "Load Accumulator", 
                     description: "Load the contents of the given memory location + the IX register to the accumulator.  Indexed addressing",
                     substages: [10, 9, 5]},
                     {mnemonic: "LDR", mc:"20", name: "Load Index Register", 
                     description: "Load the number n to the index register.  Immediate addressing",
                     substages: [99]},
                     {mnemonic: "MOV", mc:"30", name: "Move Accumulator", 
                     description: "Copy the contents of the accumulator to the index register",
                     substages: [99]},
                     {mnemonic: "STO", mc:"35", name: "Store Accumulator", 
                     description: "Copy the value in the Accumulator to the given memory address",
                     substages: [9, 8]},
                     {mnemonic: "ADD", mc:"42", name: "Add to Accumulator", 
                     description: "Add the number n to the Accumulator.  Immediate addressing",
                     substages: [7, 20]},
                     {mnemonic: "ADD", mc:"46", name: "Add to Accumulator", 
                     description: "Add the value from the given memory location to the Accumulator.  Direct addressing",
                     substages: [7, 6, 2, 1, 5]},
                     {mnemonic: "SUB", mc:"52", name: "Subtract from Accumulator", 
                     description: "Subtract the number n from the Accumulator.  Immediate addressing",
                     substages: [7, 20]},
                     {mnemonic: "SUB", mc:"56", name: "Subtract from Accumulator", 
                     description: "Subtract the value at the given memory location from the Accumulator.  Direct addressing",
                     substages: [7, 6, 2, 1, 5]},
                     {mnemonic: "INC", mc:"60", name: "Add 1 to Accumulator", 
                     description: "Increment the value in the Accumulator",
                     substages: []},
                     {mnemonic: "INC", mc:"62", name: "Add 1 to Index Register", 
                     description: "Increment the value in the Index Register",
                     substages: []},
                     {mnemonic: "DEC", mc:"70", name: "Decrement the Accumulator", 
                     description: "Decrement the value in the Accumulator",
                     substages: []},
                     {mnemonic: "DEC", mc:"72", name: "Decrement the Index Register", 
                     description: "Decrement the value in the Index Register",
                     substages: []},
                     {mnemonic: "JMP", mc:"82", name: "Jump", 
                     description: "Jump to the given memory location",
                     substages: [11]},
                     {mnemonic: "CMP", mc:"92", name: "Compare", 
                     description: "Compare the contents of the Accumulator with the number n.",
                     substages: [7, 20]},
                     {mnemonic: "CMP", mc:"96", name: "Compare", 
                     description: "Compare the contents of the Accumulator with the contents of the given memory address.",
                     substages: [10, 2, 1, 5]},
                     {mnemonic: "CMI", mc:"9A", name: "Compare", 
                     description: "Compare the contents of the Accumulator with the contents of the given memory address, twice...",
                     substages: [10, 2, 1, 4, 2, 1, 5]},
                     {mnemonic: "CMR", mc:"90", name: "Compare", 
                     description: "Compare the contents of the Index Register with the number n.",
                     substages: [7, 20]},
                     {mnemonic: "CMR", mc:"94", name: "Compare", 
                     description: "Compare the contents of the Index Register with the contents of the given memory address.",
                     substages: [10, 2, 1, 5]},
                     {mnemonic: "JPE", mc:"A2", name: "Jump if equal", 
                     description: "Jump to the given memory location if the previous Compare operation was True",
                     substages: [11]},
                     {mnemonic: "JPN", mc:"A3", name: "Jump if not equal", 
                     description: "Jump to the given memory location if the previous compare operation was False",
                     substages: [11]},
                     {mnemonic: "OUT", mc:"B2", name: "Output", 
                     description: "Copy the value in the Accumulator to the 'Output' box",
                     substages: [14]},
                     {mnemonic: "AND", mc:"C2", name: "Bitwise AND", 
                     description: "Bitwise AND the value in the Accumulator with the value supplied",
                     substages: [7, 20]},
                     {mnemonic: "AND", mc:"C6", name: "Bitwise AND", 
                     description: "Bitwise AND the value in the Accumulator with the contents of the memory address supplied",
                     substages: [7, 6, 2, 1]},
                     {mnemonic: "XOR", mc:"D2", name: "Bitwise XOR", 
                     description: "Bitwise XOR the value in the Accumulator with the value supplied",
                     substages: [7, 20]},
                     {mnemonic: "XOR", mc:"D6", name: "Bitwise XOR", 
                     description: "Bitwise XOR the value in the Accumulator with the contents of the memory address supplied",
                     substages: [7, 6, 2, 1]},
                     {mnemonic: "OR", mc:"E2", name: "Bitwise OR", 
                     description: "Bitwise OR the value in the Accumulator with the value supplied",
                     substages: [7, 20]},
                     {mnemonic: "OR", mc:"E6", name: "Bitwise OR", 
                     description: "Bitwise OR the value in the Accumulator with the contents of the memory address  supplied",
                     substages: [7, 6, 2, 1]},
                     {mnemonic: "LSL", mc:"F2", name: "Logical Shift Left", 
                     description: "Shift the value in the Accumulator to the left n places",
                     substages: [7, 20]},
                     {mnemonic: "LSR", mc:"F3", name: "Logical Shift Right", 
                     description: "Shift the value in the Accumulator to the right n places",
                     substages: [7, 20]},
                     {mnemonic: "DAT", mc:"None", name: "Data", 
                     description: "Indicates a memory location holding data",
                     substages: []},
                   ];

//
// Given a string representing the hex instruction, return the addressing mode
//
function getAddressMode(mc) {
  let denaryValue = parseInt(mc, 16);
  let binaryString = denaryValue.toString(2).padStart(8,'0');
  let addressMode = binaryString.slice(4,6);

  let retval = "Undefined";
  
  switch (addressMode) {
    case "00":
      retval = "Immediate";
      break;
    case "01":
      retval = "Direct";
      break;
    case "10":
      retval = "Indirect";
      break;
    case "11":
      retval = "Indexed";
      break;
  }
  return retval
}

//
// Given a string representing the hex instruction, return the register mode
//
function getRegisterMode(mc) {
  let denaryValue = parseInt(mc, 16);
  let binaryString = denaryValue.toString(2).padStart(8,'0');
  let registerMode = binaryString.slice(6,7);

  let retval = "Undefined";
  
  switch (registerMode) {
    case "0":
      retval = "IX";
      break;
    case "1":
      retval = "ACC";
      break;
  }
  return retval
}

//
// Given a string representing the hex instruction, return the operating mode
// This is a bit nasty as the operating mode depends on the operation
// For Logical Shifts (IMC=1111)
//   0 = Left
//   1 = Right
//
// For Conditional Jumps (IMC=1010)
//   0 = EQ
//   1 = NE
//
// For Move/Store (IMC=0011)
//   0 = MOV (Acc -> IX)
//   1 = STO (Acc -> Memory)
// 
//
function getOperatingMode(mc) {
  let denaryValue = parseInt(mc, 16);
  let binaryString = denaryValue.toString(2).padStart(8,'0');
  let operatingMode = binaryString.slice(7,8);
  let instructionMode = binaryString.slice(0,4);

  let retval = "Undefined";
  
  switch (operatingMode) {
    case "0":
      if (instructionMode == "0011") {
        retval = "MOV";
      }
      else if (instructionMode == "1010") {
        retval = "JPE";
      }
      else {
        retval = "LSL";
      }
      break;
    case "1":
      if (instructionMode == "0011") {
        retval = "STO";
      }
      else if (instructionMode == "1010") {
        retval = "JNE";
      }
      else {
        retval = "LSR";
      }
      break;
  }
  return retval
}

const symbolTable = [];
var symbolCount = 0;

//
// Function to 'run' the assembler code
//
var programCounter = 0;
var previousProgramCounter = 0;
var accumulator = 0;
var memoryDataRegister = 0;
var memoryAddressRegister = 0;
var currentInstructionRegister = 0;
var statusRegister = "00000000";
var ix = 0;

var intervalHandle;

function runCode() {

  //
  // If the program has already run once or more, then we need to
  // clear the current line indicator
  //
  if (previousProgramCounter != 0) {
    table1.updateData([{id:previousProgramCounter, active: "-"}]);
  }

  //
  // Read contents of memory table and execute instructions
  //
  programCounter = 0;
  previousProgramCounter = 0;
  accumulator = 0;
  memoryDataRegister = 0;
  memoryAddressRegister = 0;
  currentInstructionRegister = 0;
  ix = 0;
  execStage = executionStages.FETCH;
  numSubStages = 4;

  changeState(states.RUNNING.ACTIVE);

  intervalHandle = setInterval(nextInstruction, getDelay());
  
  let logobj=document.getElementById("log-text");
  logobj.value += "> Starting execution...\n";
  logobj.scrollTop = logobj.scrollHeight;

  //
  // Clear Input and Output boxes
  //
  let inp=document.getElementById("input-text");
  inp.value = "";
  let outp=document.getElementById("output-text");
  outp.value = "";

  //
  // Show registered in initial state
  //
  var c = document.getElementById("processor-canvas");
  var ctx = c.getContext("2d");

  drawCPU(ctx)

}

//
// This is the 'resume' option - no need to check/change/clear
// anything, just restart.
//
function allAhead() {
  changeState(states.RUNNING.ACTIVE);

  intervalHandle = setInterval(nextInstruction, getDelay());
}


function stepCode() {
  changeState(states.RUNNING.STOPPING);

  intervalHandle = setInterval(nextInstruction, getDelay());
}


var previousHighlightRow = -1;
var previousHighlightCellName = "m-1";

const executionStages = {
  FETCH: "fetch",
  DECODE: "decode",
  EXECUTE: "execute",
}

//
// currentSubStage is used in FETCH and in EXECUTE in slightly different ways
// 1.  For FETCH, we always set it to 4, for the PC-MAR, MAR-Memory, Memory-MDR,
//     MDR-CIR substages.
// 2.  For EXECUTE, we set the number of substages from the instruction metadata
//
var execStage = executionStages.FETCH;
var currentSubStage = 4;

function nextInstruction() {
  // 
  // Splits the execution of an instruction into Fetch/Decode/Execute
  // so that we can display the changes to the registers
  //
  currentSubStage -= 1;

  if (settingSpeed != speeds.SUPERFAST) {
    // Remove any memory read/write highlight
    if (previousHighlightRow != -1){
      previousHighlightCell = previousHighlightRow.getCell(previousHighlightCellName);
      // Need to get the current background colour, not just hardcode it...
      previousHighlightCell.getElement().style.backgroundColor="#666666";
      previousHighlightRow = -1;
    }
  }

  if (execStage == executionStages.FETCH){
    fetchInstruction();
    if (currentSubStage == 0){
      currentSubStage = 1;
      execStage = executionStages.DECODE;
    }
    return;
  }

  if (execStage == executionStages.DECODE){
    let dummy = 1.0;

    decodeInstruction();
    execStage = executionStages.EXECUTE;

    return;
  }

  if (execStage == executionStages.EXECUTE){
    let dummy = 1.0;

    executeInstruction();
    if (currentSubStage == 0){
      currentSubStage = 4;
      execStage = executionStages.FETCH;

      if ( state == states.RUNNING.STOPPING ) {
       changeState(states.STOPPED);
       clearInterval(intervalHandle);
      }
    }
    return;
  }
}


//
// Retrieve next instruction
//
function fetchInstruction() {
  var c = document.getElementById("processor-canvas");
  var ctx = c.getContext("2d");

  let formattedPC = programCounter.toString().padStart(2, "0");

  if (currentSubStage == 3) {
    if (settingSpeed != speeds.SUPERFAST) {
      animateBus(ctx, 0);

      let logobj=document.getElementById("log-text");
      logobj.value += "> FETCH:  Reading instruction from RAM\n";
      logobj.scrollTop = logobj.scrollHeight;
    }
    memoryAddressRegister = formattedPC;

  } else if (currentSubStage == 2) {
    animateBus(ctx, 1);
    programCounter = programCounter+1;

  } else if (currentSubStage == 1) {
    //
    // Get the memory contents from the next row, update the CIR
    //
    animateBus(ctx, 2);
    memorydata = readMemory(memoryAddressRegister);
    memoryDataRegister = memorydata;
  } else {
    animateBus(ctx, 3);
    currentInstructionRegister = memoryDataRegister;

    if (settingSpeed != speeds.SUPERFAST) {
      // Remove memory read highlight
      if (previousHighlightRow != -1){
        previousHighlightCell = previousHighlightRow.getCell(previousHighlightCellName);
        // Need to get the current background colour, not just hardcode it...
        previousHighlightCell.getElement().style.backgroundColor="#666666";
        previousHightlightRow = -1;
      }
    }
  }  


  //
  // For the moment, just stop when the PC hits 99
  //
  if (programCounter == 99){
    if (intervalHandle != null) {
      clearInterval(intervalHandle);
    }
  }
  
  formattedPC = programCounter.toString().padStart(4, "0");

  var c = document.getElementById("processor-canvas");
  var ctx = c.getContext("2d");

  drawRegisterValue("MAR", memoryAddressRegister, ctx);
  drawRegisterValue("MDR", memoryDataRegister, ctx);
  drawRegisterValue("CIR", currentInstructionRegister, ctx);
  drawRegisterValue("PC", formattedPC, ctx);
  drawRegisterValue("SR", statusRegister, ctx);
  drawRegisterValue("ACC", accumulator, ctx);
  drawRegisterValue("IX", ix, ctx);

  if (settingSpeed != speeds.SUPERFAST) {
    let dummy = 1.0;
  }
}


function decodeInstruction() {
  var c = document.getElementById("processor-canvas");
  var ctx = c.getContext("2d");

  //
  // Temporary code to highlight the current line in the
  // code table and blank out the previous line
  //  
  table1.updateData([{id:previousProgramCounter, active: "-"}]);
  table1.updateData([{id:programCounter, active: "1"}]);
  previousProgramCounter = programCounter;

  //
  // Now process the instruction
  //
  //
  instructionDetails = "EMPTY";
  instructionCode = "EMPTY";
  subStages = []
  addressMode = "Undefined";

  var foundOpcode = false;
  operator = currentInstructionRegister.substring(0,2);

  //
  // Match on the hex opcode, so we always get the right instruction
  //
  for (let j=0; j < opcodesCAIE.length; j++) {
    if (opcodesCAIE[j]['mc'] == operator) {
      foundOpcode = true;
      instructionCode = opcodesCAIE[j]['mnemonic'];
      instructionDetails = currentInstructionRegister.substring(2,6);
      subStages = opcodesCAIE[j]['substages'];
      addressMode = getAddressMode(operator);
      console.log("Address mode is; ", addressMode)
    }
  }

  //
  // In all of the following, the currentSubStage should be set using the
  // length of the subStages list provided in the instruction
  // The code should then be further refactored to use metadata rather than
  // hard-coding instruction details
  //
  if (instructionCode == "ADD" && (getAddressMode(operator) == "Direct")){
    // ADD (Direct)
    var address = instructionDetails;
    memoryAddressRegister = address;
    currentSubStage = 5;
    drawRegisterValue("DECODER", "ADD ["+address+"]", ctx);
    drawRegisterValue("ALU", "ADD", ctx);
  }

  if (instructionCode == "ADD" && (getAddressMode(operator) == "Immediate")){
    // ADD (Immediate)
    var value = instructionDetails;
    currentSubStage = 1;
    drawRegisterValue("DECODER", "ADD "+value, ctx);
    drawRegisterValue("ALU", "ADD", ctx);
  }

  if (instructionCode == "IN"){
    // IN
    instructionCode = "INP"
    currentSubStage = 1;
    drawRegisterValue("DECODER", "INPUT", ctx);
  }

  if (instructionCode == "SUB" && (getAddressMode(operator) == "Direct")){
    // SUB (Direct)
    var address = instructionDetails;
    memoryAddressRegister = address;
    currentSubStage = subStages.length;
    drawRegisterValue("DECODER", "SUB ["+address+"]", ctx);
    drawRegisterValue("ALU", "SUB", ctx);
  }

  if (instructionCode == "SUB" && (getAddressMode(operator) == "Immediate")){
    // SUB (Immediate)
    var value = instructionDetails;
    currentSubStage = subStages.length;
    drawRegisterValue("DECODER", "SUB "+value, ctx);
    drawRegisterValue("ALU", "SUB", ctx);
  }

  if (instructionCode == "STO"){
    // STO
    var address = instructionDetails;
    memoryAddressRegister = address;
    currentSubStage = subStages.length;
    instructionCode = "STO";
    drawRegisterValue("DECODER", "STO ["+address+"]", ctx);
  }
                
  if (instructionCode == "LDM"){
    // Load Accumulator (Immediate)
    currentSubStage = subStages.length;
    var value = instructionDetails;
    drawRegisterValue("DECODER", "LDM "+value, ctx);
  }

  if (instructionCode == "LDR"){
    // LDR
    currentSubStage = subStages.length;
    var value = instructionDetails;
    drawRegisterValue("DECODER", "LDR "+value, ctx);
  }

  if (instructionCode == "LDD"){
    // LDD
    var address = instructionDetails;
    memoryAddressRegister = address;
    currentSubStage = subStages.length;
    drawRegisterValue("DECODER", "LDD ["+address+"]", ctx);
  }

  if (instructionCode == "LDI"){
    // Load Accumulator (Indirect)
    var address = instructionDetails;
    memoryAddressRegister = address;
    currentSubStage = subStages.length;
    drawRegisterValue("DECODER", "LDI [["+address+"]]", ctx);
  }

  if (instructionCode == "LDX"){
    // LDX
    currentSubStage = subStages.length;
    //var address = parseInt(instructionDetails,16) + parseInt(ix, 16);
    var base = parseInt(instructionDetails,10);
    var address = parseInt(instructionDetails,10) + parseInt(ix, 10);
    //memoryAddressRegister = address.toString(16);
    memoryAddressRegister = address.toString(10);
    drawRegisterValue("DECODER", "LDX ["+base+"+IX]", ctx);
  }

  if (instructionCode == "MOV"){
    // MOV (ACC to IX)
    currentSubStage = subStages.length;
    drawRegisterValue("DECODER", "MOV ACC", ctx);
  }

  if (instructionCode == "INC"){
    // INC
    let mode = getRegisterMode(operator);
    currentSubStage = 1;
    drawRegisterValue("DECODER", "INC "+mode, ctx);
  }
  
  if (instructionCode == "DEC"){
    // DEC
    let mode = getRegisterMode(operator);
    currentSubStage = 1;
    drawRegisterValue("DECODER", "DEC "+mode, ctx);
  }

  if (instructionCode == "JMP"){
    // JMP:
    var address = instructionDetails;
    currentSubStage = subStages.length;
    drawRegisterValue("DECODER", "JMP ["+address+"]", ctx);
  }

  if (instructionCode == "JPE"){
    // JPE:
    var address = instructionDetails;
    currentSubStage = subStages.length;
    drawRegisterValue("DECODER", "JPE ["+address+"]", ctx);
  }
  
  if (instructionCode == "JPN"){
    // JPN
    var address = instructionDetails;
    currentSubStage = subStages.length;
    drawRegisterValue("DECODER", "JPN ["+address+"]", ctx);
  }
        
  if (instructionCode == "CMP" && (getAddressMode(operator) == "Immediate")){
    // CMP
    var value = instructionDetails;
    currentSubStage = 1;
    drawRegisterValue("DECODER", "CMP "+value, ctx);
  }

  if (instructionCode == "CMP" && (getAddressMode(operator) == "Direct")){
    // CMP
    var address = instructionDetails;
    memoryAddressRegister = address;
    currentSubStage = subStages.length;
    drawRegisterValue("DECODER", "CMP ["+address+"]", ctx);
  }

  if (instructionCode == "CMR" && (getAddressMode(operator) == "Immediate")){
    // CMR
    var value = instructionDetails;
    currentSubStage = 1;
    drawRegisterValue("DECODER", "CMR "+value, ctx);
  }

  if (instructionCode == "CMR" && (getAddressMode(operator) == "Direct")){
    // CMR
    var address = instructionDetails;
    memoryAddressRegister = address;
    currentSubStage = subStages.length;
    drawRegisterValue("DECODER", "CMR ["+address+"]", ctx);
  }

  if (instructionCode == "CPI"){
    // CPI
    var address = instructionDetails;
    memoryAddressRegister = address;
    currentSubStage = subStages.length;
    drawRegisterValue("DECODER", "CPI [["+address+"]]", ctx);
  }

  if (instructionCode == "AND" && (getAddressMode(operator) == "Immediate")){
    // AND (Immediate)
    var value = instructionDetails
    currentSubStage = subStages.length;
    drawRegisterValue("DECODER", "AND "+value, ctx);
  }
  
  if (instructionCode == "AND" && (getAddressMode(operator) == "Direct")){
    // AND (Direct)
    var address = instructionDetails;
    currentSubStage = subStages.length;
    drawRegisterValue("DECODER", "AND ["+address+"]", ctx);
  }

  if (instructionCode == "XOR" && (getAddressMode(operator) == "Immediate")){
    // XOR (Immediate)
    var value = instructionDetails;
    currentSubStage = subStages.length;
    drawRegisterValue("DECODER", "XOR "+value, ctx);
  }

  if (instructionCode == "XOR" && (getAddressMode(operator) == "Direct")){
    // XOR (Direct)
    var address = instructionDetails;
    currentSubStage = subStages.length;
    drawRegisterValue("DECODER", "XOR ["+address+"]", ctx);
  }

  if (instructionCode == "OR" && (getAddressMode(operator) == "Immediate")){
    // OR (Immediate)
    var value = instructionDetails;
    currentSubStage = subStages.length;
    drawRegisterValue("DECODER", "OR "+value, ctx);
  }

  if (instructionCode == "OR" && (getAddressMode(operator) == "Direct")){
    // OR (Direct)
    var address = instructionDetails;
    currentSubStage = subStages.length;
    drawRegisterValue("DECODER", "OR ["+address+"]", ctx);
  }

  if (instructionCode == "LSL"){
    // LSL
    let places = instructionDetails;
    currentSubStage = 1;
    drawRegisterValue("DECODER", "LSL "+places, ctx);
  }

  if (instructionCode == "LSR"){
    // LSR
    let places = instructionDetails;
    currentSubStage = 1;
    drawRegisterValue("DECODER", "LSR "+places, ctx);
  }

  if (instructionCode == "OUT"){
    // OUT
    currentSubStage = subStages.length;
    drawRegisterValue("DECODER", "OUT ACC", ctx);
  }

  if (instructionCode == "END"){
    // END
    currentSubStage = 1;
    drawRegisterValue("DECODER", "END", ctx);
  }
 
  let logobj=document.getElementById("log-text");
  logobj.value += "> DECODE:  " + currentInstructionRegister + " = " + instructionCode + ": " + instructionDetails + "\n";
  logobj.scrollTop = logobj.scrollHeight;

  formattedPC = programCounter.toString().padStart(2, "0");

  //
  // For the moment, just stop when the PC hits 99
  //
  if (programCounter == 99){
    if (intervalHandle != null) {
      clearInterval(intervalHandle);
    }
  }

  if (settingSpeed != speeds.SUPERFAST) {
    let dummy = 1.0;
  }
}


//
// Significant rework required when/if we switch memory addresses to hex
// Currently we have a dog's breakfast of hex instruction codes and
// decimal/denary addresses.  All of the CIE examples use decimal/denary
// memory addresses, so perhaps we should switch to decmial/denary
// instruction codes
//
function executeInstruction() {
  var c = document.getElementById("processor-canvas");
  var ctx = c.getContext("2d");
  var memory = table2.getData();
  var foundLocation = false;

  var foundOpcode = false;
  operator = currentInstructionRegister.substring(0,2);
  
  for (let j=0; j < opcodesCAIE.length; j++) {
    if (opcodesCAIE[j]['mc'] == operator) {
      foundOpcode = true;
      instructionCode = opcodesCAIE[j]['mnemonic'];
      instructionDetails = currentInstructionRegister.substring(2,6);
    }
  }

  if (instructionCode == "ADD" && (getAddressMode(operator) == "Direct")){
    // ADD (Direct)
    animateBus(ctx, subStages[currentSubStage]);
    if (currentSubStage == 2) {
      var value = readMemory(memoryAddressRegister);
      memoryDataRegister = value;
    } else if (currentSubStage == 0){
      accumulator += parseInt(memoryDataRegister);
      updateStatusRegister();
    }
  }

  if (instructionCode == "ADD" && (getAddressMode(operator) == "Immediate")){
    // ADD (Immediate)
    animateBus(ctx, subStages[currentSubStage]);
    if (currentSubStage == 0) {
      accumulator += parseInt(instructionDetails);
      updateStatusRegister();
    }
  }

  if (instructionCode == "SUB" && (getAddressMode(operator) == "Direct")){
    // SUB
    animateBus(ctx, subStages[currentSubStage]);
    if (currentSubStage == 2) {
      var value = readMemory(memoryAddressRegister);
      memoryDataRegister = value;
    } else if (currentSubStage == 0) {
      accumulator -= parseInt(memoryDataRegister);
      updateStatusRegister();
    }
  }

  if (instructionCode == "SUB" && (getAddressMode(operator) == "Immediate")){
    // SUB (Immediate)
    animateBus(ctx, subStages[currentSubStage]);
    if (currentSubStage == 0) {
      accumulator -= parseInt(instructionDetails);
      updateStatusRegister();
    }
  }


  if ((instructionCode == "INC") && (getRegisterMode(operator) == "ACC")){
    // animateBus(ctx, subStages[currentSubStage]);

    if (currentSubStage == 0 ) {
      accumulator = accumulator + 1;
    }
  }

  if ((instructionCode == "INC") && (getRegisterMode(operator) == "IX")){
    // animateBus(ctx, subStages[currentSubStage]);

    if (currentSubStage == 0 ) {
      ix = ix + 1;
    }
  }

  if ((instructionCode == "DEC") && (getRegisterMode(operator) == "ACC")){
    // animateBus(ctx, subStages[currentSubStage]);

    if (currentSubStage == 0 ) {
      accumulator = accumulator - 1;
    }
  }

  if ((instructionCode == "DEC") && (getRegisterMode(operator) == "IX")){
    // animateBus(ctx, subStages[currentSubStage]);

    if (currentSubStage == 0) {
      ix = ix - 1;
    }
  }

  if (instructionCode == "STO"){
    // STO
    animateBus(ctx, subStages[currentSubStage]);
    
    if (currentSubStage == 1) {
      memoryDataRegister = accumulator;
    } else if (currentSubStage == 0) {
      var address = memoryAddressRegister;
      writeMemory(address, accumulator);
    }
  }
  
  if (instructionCode == "LDD" || instructionCode == "LDX"){
    // Load Accumulator (Direct)
    // Load Accumulator (Indexed) and MAR has already been set
    animateBus(ctx, subStages[currentSubStage]);

    if (currentSubStage == 1 ) {
      var value = readMemory(memoryAddressRegister);
      memoryDataRegister = value;
    } else if (currentSubStage == 0 ) {
      accumulator = parseInt(memoryDataRegister);
    }
  }

  if (instructionCode == "LDI"){
    // Load Accumulator (Indirect)
    animateBus(ctx, subStages[currentSubStage]);

    if (currentSubStage == 4 ) {
      var address = instructionDetails;
      memoryAddressRegister = address;
    } else if (currentSubStage == 3 ) {
      let value = readMemory(memoryAddressRegister);
      memoryDataRegister = value;
    } else if (currentSubStage == 2 ) {
      memoryAddressRegister = memoryDataRegister;
    } else if (currentSubStage == 1 ) {
      var value = readMemory(memoryAddressRegister);
      memoryDataRegister = value;
    } else if (currentSubStage == 0 ) {
      accumulator = parseInt(memoryDataRegister);
    }
  }

  if ((instructionCode == "AND") && (getAddressMode(operator) == "Immediate")) {
    // AND value in Accumulator with given value (Immediate)
    animateBus(ctx, subStages[currentSubStage]);

    if ( currentSubStage == 0 ) {
      let mask = instructionDetails;
      let maskDenary = parseInt(mask, 16);
      accumulator = accumulator & maskDenary;
    }
  }

  if ((instructionCode == "AND") && (getAddressMode(operator) == "Direct")) {
    // AND value in Accumulator with value at address (Direct)
    animateBus(ctx, subStages[currentSubStage]);

    if ( currentSubStage == 0 ) {
      let mask = memoryDataRegister;
      let maskDenary = parseInt(mask, 16);
      accumulator = accumulator & maskDenary;
    }
  }

  if ((instructionCode == "XOR") && (getAddressMode(operator) == "Immediate")) {
    // XOR value in Accumulator with given value (Immediate)
    animateBus(ctx, subStages[currentSubStage]);

    if ( currentSubStage == 0 ) {
      let mask = instructionDetails;
      let maskDenary = parseInt(mask, 16);
      accumulator = accumulator ^ maskDenary;
    }
  }

  if ((instructionCode == "XOR") && (getAddressMode(operator) == "Direct")) {
    // XOR value in Accumulator with value at address (Direct)
    animateBus(ctx, subStages[currentSubStage]);

    if ( currentSubStage == 0 ) {
      let mask = memoryDataRegister;
      let maskDenary = parseInt(mask, 16);
      accumulator = accumulator ^ maskDenary;
    }
  }

  if ((instructionCode == "OR") && (getAddressMode(operator) == "Immediate")) {
    // OR value in Accumulator with given value (Immediate)
    animateBus(ctx, subStages[currentSubStage]);

    if ( currentSubStage == 0 ) {
      let mask = instructionDetails;
      let maskDenary = parseInt(mask, 16);
      accumulator = accumulator | maskDenary;
    }
  }

  if ((instructionCode == "OR") && (getAddressMode(operator) == "Direct")) {
    // OR value in Accumulator with value at address (Direct)
    animateBus(ctx, subStages[currentSubStage]);

    if ( currentSubStage == 0 ) {
      let mask = memoryDataRegister;
      let maskDenary = parseInt(mask, 16);
      accumulator = accumulator | maskDenary;
    }
  }

  if (instructionCode == "LSL") {
    // Logical Shift Left value in Accumulator by n places
    animateBus(ctx, subStages[currentSubStage]);

    if ( currentSubStage == 0 ) {
      let places = instructionDetails;
      let placesDenary = parseInt(places, 16);
      accumulator = accumulator << placesDenary;
    }
  }

  if (instructionCode == "LSR") {
    // Logical Shift Right value in Accumulator by n places
    animateBus(ctx, subStages[currentSubStage]);

    if ( currentSubStage == 0 ) {
      let places = instructionDetails;
      let placesDenary = parseInt(places, 16);
      accumulator = accumulator >> placesDenary;
    }
  }

  //
  // Need to think about how these should work for immediate values.
  // The LMC code did a parseInt(), which was fine as all values and
  // addresses were denary.  Now we have a mixture of denary and hex
  // with the intention of moving to all hex.  For the moment I have
  // used a parseInt(x,16) so that we see a true value for x, even
  // if it is currently in denary...
  //
  // Scratch the above - we should follow the convention of using
  // # for denary
  // #B for binary
  // #& for hexadecimal
  //
  // For the moment, just work in denary
  //
  if (instructionCode == "LDM"){
    // Load Accumulator (Immediate)
    // Need to add a bus animation from CIR to ACC
    //animateBus(ctx, subStages[currentSubStage]);

    if (currentSubStage == 0 ) {
      //accumulator = parseInt(instructionDetails, 16);
      accumulator = parseInt(instructionDetails);
    }
  }

  if (instructionCode == "LDR"){
    // Load IX (Immediate)
    // Need to add a bus animation from CIR to IX
    //animateBus(ctx, subStages[currentSubStage]);

    if (currentSubStage == 0 ) {
      // ix = parseInt(instructionDetails, 16);
      ix = parseInt(instructionDetails);
    }
  }

  if (instructionCode == "MOV"){
    // Move ACC to IX
    // Need to add a bus animation from ACC to IX
    //animateBus(ctx, subStages[currentSubStage]);

    if (currentSubStage == 0 ) {
      ix = parseInt(accumulator);
    }
  }

  //
  // Need to think about hex/denary in the following
  //  
  //  Our approach here is ... interesting.
  //  Following the x86 instruction set, the CMx instructions should
  //  leave the value in the ACC unmodified, but we do want to set
  //  the SR flags (particularly Z) so that the JPx instructions
  //  work.  So, we overwrite the ACC, call updateStatusRegister()
  //  and then restore the ACC, modelling the use of the ACC for
  //  subtraction (which is what the CMx does), and also keeping any
  //  SR manipulation in one place.
  //
  if (instructionCode == "CMI") {
    // CMI (Immediate)
    animateBus(ctx, subStages[currentSubStage]);

    if (currentSubStage == 4 ) {
      var address = instructionDetails;
      memoryAddressRegister = address;
    } else if (currentSubStage == 3 ) {
      let value = readMemory(memoryAddressRegister);
      memoryDataRegister = value;
    } else if (currentSubStage == 2 ) {
      memoryAddressRegister = memoryDataRegister;
    } else if (currentSubStage == 1 ) {
      var value = readMemory(memoryAddressRegister);
      memoryDataRegister = value;
    } else if (currentSubStage == 0 ) {
      //let value = parseInt(memoryDataRegister,16);
      let value = parseInt(memoryDataRegister);
      let originalAccumulator = accumulator;
      if (accumulator == value) {
        accumulator = 0;
      } else {
        accumulator = 1;
      }
      updateStatusRegister();
      accumulator = originalAccumulator;
    }
  }

  if ((instructionCode == "CMP") && (getAddressMode(operator) == "Immediate")) {
    // CMP (Immediate)
    animateBus(ctx, subStages[currentSubStage]);

    var value = parseInt(instructionDetails);
    let originalAccumulator = accumulator;
    if (accumulator == value) {
      accumulator = 0;
    } else {
      accumulator = 1;
    }
    updateStatusRegister();
    accumulator = originalAccumulator;
  }

  if ((instructionCode == "CMP") && (getAddressMode(operator) == "Direct")) {
    // CMP (Direct)
    animateBus(ctx, subStages[currentSubStage]);

    if (currentSubStage == 1 ) {
      var value = readMemory(memoryAddressRegister);
      memoryDataRegister = value;
    } else if (currentSubStage == 0 ) {
      //let value = parseInt(memoryDataRegister,16);
      let value = parseInt(memoryDataRegister);
      let originalAccumulator = accumulator;
      if (accumulator == value) {
        accumulator = 0;
      } else {
        accumulator = 1;
      }
      updateStatusRegister();
      accumulator = originalAccumulator;
    }
  }

  if ((instructionCode == "CMR") && (getAddressMode(operator) == "Immediate")) {
    // CMR (Immediate)
    animateBus(ctx, subStages[currentSubStage]);

    var value = parseInt(instructionDetails);
    let originalAccumulator = accumulator;
    if (ix == value) {
      accumulator = 0;
    } else {
      accumulator = 1;
    }
    updateStatusRegister();
    accumulator = originalAccumulator;
  }

  if ((instructionCode == "CMR") && (getAddressMode(operator) == "Direct")) {
    // CMR (Direct)
    animateBus(ctx, subStages[currentSubStage]);

    if (currentSubStage == 1 ) {
      var value = readMemory(memoryAddressRegister);
      memoryDataRegister = value;
    } else if (currentSubStage == 0 ) {
      //let value = parseInt(memoryDataRegister,16);
      let value = parseInt(memoryDataRegister);
      let originalAccumulator = accumulator;
      if (ix == value) {
        accumulator = 0;
      } else {
        accumulator = 1;
      }
      updateStatusRegister();
      accumulator = originalAccumulator;
    }
  }

  if (instructionCode == "JMP"){
    // JMP
    animateBus(ctx, subStages[currentSubStage]);

    var address = instructionDetails;
    programCounter = parseInt(address);
  }
        
  if (instructionCode == "JPN"){
    //
    // JPN
    // Should follow a CMP/CMI instruction which will set the Zero flag of the SR to
    // 1 if the ACC/IX matched the given value, 0 otherwise
    //
    var zeroFlag = statusRegister.charAt(6);
    
    var address = instructionDetails;
    if (zeroFlag == '0'){
      programCounter = parseInt(address);
      if (settingSpeed != speeds.SUPERFAST) {
        animateBus(ctx, subStages[currentSubStage]);
        let logobj=document.getElementById("log-text");
        logobj.value += "> EXECUTE:  JPN: Branching as SR Zero Flag is " + zeroFlag + "\n";
        logobj.scrollTop = logobj.scrollHeight;
      }
    } else {
      if (settingSpeed != speeds.SUPERFAST) {
        var logobj=document.getElementById("log-text");
        logobj.value += "> EXECUTE:  JPN: Not branching as SR Zero Flag is " + zeroFlag + "\n";
        logobj.scrollTop = logobj.scrollHeight;
      }
    }
  }
        
  if (instructionCode == "JPE"){
    //
    // JPE
    // Should follow a CMP/CMI instruction which will set the Zero flag of the SR to
    // 1 if the ACC/IX matched the given value, 0 otherwise
    //
    var zeroFlag = statusRegister.charAt(6);

    var address = instructionDetails;
    if (zeroFlag == '1'){
      programCounter = parseInt(address);
      if (settingSpeed != speeds.SUPERFAST) {
        animateBus(ctx, subStages[currentSubStage]);
        let logobj=document.getElementById("log-text");
        logobj.value += "> EXECUTE:  JPE: Branching as SR Zero Flag is " + zeroFlag + "\n";
        logobj.scrollTop = logobj.scrollHeight;
      }
    } else {
      if (settingSpeed != speeds.SUPERFAST) {
        var logobj=document.getElementById("log-text");
        logobj.value += "> EXECUTE:  JPE: Not branching as SR Zero Flag is " + zeroFlag + "\n";
        logobj.scrollTop = logobj.scrollHeight;
      }
    }
  }
        
  if (instructionCode == "IN"){
    let logobj=document.getElementById("log-text");
    logobj.value += "> EXECUTE:  Waiting for input (to accumulator)\n";
    logobj.scrollTop = logobj.scrollHeight;
    let outobj=document.getElementById("input-text");
    outobj.value = "";
    if (intervalHandle != null) {
      clearInterval(intervalHandle);
    }
    // Save the current state - either running or step-by-step - so that
    // we can restore that state when user input is complete...
    stateBeforeInput = state;
    changeState(states.RUNNING.BLOCKEDONINPUT);
  } 
  
  if (instructionCode == "OUT"){
    animateBus(ctx, subStages[currentSubStage]);
    let outobj=document.getElementById("output-text");
    outobj.value += parseInt(accumulator) + "\n";
    outobj.scrollTop = outobj.scrollHeight;

    let logobj=document.getElementById("log-text");
    logobj.value += "> EXECUTE:  OUT: Transferring value in Accumulator to Output\n";
    logobj.scrollTop = logobj.scrollHeight;

    // Update the Output Mailbox
    var c = document.getElementById("processor-canvas");
    var ctx = c.getContext("2d");
    drawRegisterValue("OUT", accumulator, ctx);
  }

  if (instructionCode == "END"){
    let logobj=document.getElementById("log-text");
    logobj.value += "> EXECUTE:  HALT instruction found\n";
    allHalt();
  }
  
  formattedPC = programCounter.toString().padStart(4, "0");

  //
  // For the moment, just stop when the PC hits 99
  //
  if (programCounter == 99){
    if (intervalHandle != null) {
      clearInterval(intervalHandle);
    }
  }

  var c = document.getElementById("processor-canvas");
  var ctx = c.getContext("2d");

  drawRegisterValue("MAR", memoryAddressRegister, ctx);
  drawRegisterValue("MDR", memoryDataRegister, ctx);
  drawRegisterValue("CIR", currentInstructionRegister, ctx);
  drawRegisterValue("PC", formattedPC, ctx);
  drawRegisterValue("SR", statusRegister, ctx);
  drawRegisterValue("ACC", accumulator, ctx);
  drawRegisterValue("IX", ix, ctx);

  if (settingSpeed != speeds.SUPERFAST) {
    let dummy = 1.0;
  }
}

function allStop(){
  changeState(states.RUNNING.STOPPING);

  if (previousHighlightRow != -1){
    previousHighlightCell = previousHighlightRow.getCell(previousHighlightCellName);
    // Need to get the current background colour, not just hardcode it...
    previousHighlightCell.getElement().style.backgroundColor="#666666";
    previousHighlightRow = -1;
  }
}

function allHalt(){
  changeState(states.HALTED);
  if (intervalHandle != null) {
    clearInterval(intervalHandle);
  }

  if (previousHighlightRow != -1){
    previousHighlightCell = previousHighlightRow.getCell(previousHighlightCellName);
    // Need to get the current background colour, not just hardcode it...
    previousHighlightCell.getElement().style.backgroundColor="#666666";
    previousHighlightRow = -1;
  }
}

function updateStatusRegister() {
  if (accumulator > 999) {
    bit0 = "1"; // OVERFLOW
    bit1 = "0"; // ZERO
    bit2 = "1"; // POSITIVE
  }
  else if (accumulator > 0) {
    bit0 = "0";
    bit1 = "0";
    bit2 = "1";
  }
  else if (accumulator == 0) {
    bit0 = "0";
    bit1 = "1";
    bit2 = "1";
  } else if (accumulator < -999) {
    bit0 = "1";
    bit1 = "0";
    bit2 = "0";
  } else {
    bit0 = "0";
    bit1 = "0";
    bit2 = "0";
  }

  statusRegister = "00000" + bit2 + bit1 + bit0;
}


//
// Memory write function
//
function writeMemory(addressString, data){

  address = parseInt(addressString);
  addressString = addressString.padStart(2, "0");

  if (settingSpeed != speeds.SUPERFAST) {
    let logobj=document.getElementById("log-text");
    logobj.value += "> EXECUTE:  Writing memory at " + addressString + ": Contents: " + data + "\n";
    logobj.scrollTop = logobj.scrollHeight;
  }

  if (address > 99){
    console.log("Error - memory address out of range: " + addressString);
    return;
  }

  if (address < 0){
    console.log("Error - memory address out of range: " + addressString);
    return;
  }

  var memory = table2.getData();

  //
  // For the row number, we need to account for the 'address' rows being
  // interspersed with data rows (hence the 2 *) and the offset for the
  // first row being 1, rather than 0
  //
  var rownum = 2 * (Math.floor(address / 10) + 1);

  var colnum = (address % 10);
  var colref = 'm' + colnum.toString();

  //
  // We may need to check that all browsers support this ES6 feature (using
  // a variable as a property name).  I think everything relatively new will
  // be OK.
  //
  table2.updateData([{id:rownum, [colref]: data}]);

  //
  // Highlight an individual cell in tabulator
  //
  if ( (settingSpeed != speeds.SUPERFAST) && (settingShowMemoryAccess == true)) {
    var highlightrow = table2.getRow(rownum-1);
    var highlightcell = highlightrow.getCell(colref);
    highlightcell.getElement().style.backgroundColor="#EE00EE";
  
    previousHighlightRow = highlightrow;
    previousHighlightCellName = colref;
  }

  //
  // If we are writing a variable, then update the corresponding value in the code table
  // We should make this subject to a setting, as I'm not sure that updating the code
  // table is always going to be the right thing to do.  At the very least we would
  // have to reset the values at the start of the next run, or... would we?  This could
  // actually make it more obvious that running for a second time means that we need to
  // initialise the variables properly - could be quite healthy...
  //
  if (settingShowVariables == true) { 
    for (let i=0; i < symbolTable.length; ++i) {
      if (symbolTable[i]['value'] == address) {

        // Find the label...
        let code = table1.getData();
        for ( let j=0; j < code.length; ++j) {
          row = code[j];
          if (row['label'] == symbolTable[i]['symbol']) {
            table1.updateData([{id:(j+1), operand:data.toString()}])
          }
        }
        break;
      }
    }
  }
  
}

//
// Memory lookup function
//
function readMemory(addressString){

  address = parseInt(addressString);
  addressString = addressString.padStart(2, "0");
  
  if (address > 99){
    console.log("Error - memory address out of range: " + addressString);
    return;
  }

  if (address < 0){
    console.log("Error - memory address out of range: " + addressString);
    return;
  }

  var memory = table2.getData();

  //
  // For the row number, we need to account for the 'address' rows being
  // interspersed with data rows (hence the 2 *) and the offset for the
  // first row being 1, rather than 0
  //
  var rownum = 2 * (Math.floor(address / 10) + 1);

  // Remember that there is a difference between row numbering in the 
  // Tabulator grid (which is one based) and the row numbering in
  // the data array underlying the grid (which is zero based).
  rownum -= 1;

  var colnum = (address % 10);
  var colref = 'm' + colnum.toString();

  var row = memory[rownum];

  memorycontentdata = row[[colref]];

  if (settingSpeed != speeds.SUPERFAST) {
    let logobj=document.getElementById("log-text");
    if (execStage == executionStages.FETCH) {
      logobj.value += ">    Reading memory at " + addressString + ": Contents: " + memorycontentdata + "\n";
    } else {
      logobj.value += "> EXECUTE:  Reading memory at " + addressString + ": Contents: " + memorycontentdata + "\n";
    }
    logobj.scrollTop = logobj.scrollHeight;
  }

  //
  // Highlight an individual cell in tabulator
  //
  if ((settingSpeed != speeds.SUPERFAST) && (settingShowMemoryAccess == true)) {
    var highlightrow = table2.getRow(rownum);
    var highlightcell = highlightrow.getCell(colref);
    highlightcell.getElement().style.backgroundColor="#339933";
  
    previousHighlightRow = highlightrow;
    previousHighlightCellName = colref;
  }
  // Force memory content to string.  Testing the Quine exposed a problem with values
  // stored as numbers...
  return(memorycontentdata.toString());
}


//
// Function to 'assemble' the assembler code
//
function assembleCode() {
  let code = table1.getData();

  table2.setData(blankmemorytabledata);

  //
  // Clear log (by setting logobj value to a new string) and log start time
  //
  var timestamp = new Date().toLocaleTimeString('en-GB', {hour: "numeric", minute: "numeric", second: "numeric"});
  var logobj=document.getElementById("log-text");
  logobj.value = "> CAIE ASSEMBLY:  Started assembly at " + timestamp + "\n";

  //
  // Clear out Symbol Table (in a memory-friendly way) and reset count
  //
  symbolTable.splice(0, symbolTable.length);
  symbolCount = 0;
  
  //
  // First pass - construct symbol table and check OpCodes
  //
  for (let i=0; i < code.length; i++) {
    currentLine = code[i];

    // Sanitise the label, operator and operand by converting to
    // uppercase and stripping any whitespace
    
    let operator = currentLine['operator']
    operator = operator.trim()
    operator = operator.toUpperCase()

    let operand = currentLine['operand']
    operand = operand.trim()
    operand = operand.toUpperCase()

    let label = currentLine['label']
    label = label.trim()
    label = label.toUpperCase()

    // console.log(currentLine);

    if (label != '') {
      //
      // We have a symbol - check that it is new, and add it
      //
      for (let s=0; s < symbolTable.length; s++) {
        if (symbolTable[s]['symbol'] == label) {
          let errString = "> Error, line " + i + ": duplicate symbol: " + symbolTable[s]['symbol'] + "\n";
          reportAssemblyError(i+1, errString);
          return;
        }
      }
      symbolTable.push({"symbol": label, "value": i });
    }

    var foundOpcode = false;

    //
    // In the first pass, we just need to match the opcode mnemonic, without worrying about the addressing
    // mode, register mode or operation mode.  These are matters for the second pass.
    //
    for (let j=0; j < opcodesCAIE.length; j++) {
      if (opcodesCAIE[j]['mnemonic'] == operator) {
        foundOpcode = true;
      }
    }

    if (!foundOpcode && operator != "") {
      let errString = "> Error, line " + i + ": unrecognised opcode: " + currentLine['operator'] + "\n";
      reportAssemblyError(i+1, errString);
      return;
    }
  }
  logobj.value += "> ASSEMBLY:  Symbol table built\n";
  logobj.scrollTop = logobj.scrollHeight;

  //
  // Second pass - assemble into machine code and store in memory
  //
  var memory = table2.getData();

  for (let i=0; i < code.length; i++) {
    currentLine = code[i];

    // Sanitise the label, operator and operand by converting to
    // uppercase and stripping any whitespace
    
    let operator = currentLine['operator']
    operator = operator.trim()
    operator = operator.toUpperCase()

    let operand = currentLine['operand']
    operand = operand.trim()
    operand = operand.toUpperCase()

    let label = currentLine['label']
    label = label.trim()
    label = label.toUpperCase()
    
    //
    // Look up the opcode (skip if no operator present)
    //
    if (operator == "") {
      continue;
    }

    var mc = "";

    for (let j=0; j < opcodesCAIE.length; j++) {
      if (opcodesCAIE[j]['mnemonic'] == operator) {
        //
        // Check whether we have an operand, and if this matches the machine
        // code definition
        // 
        // Everything requires an operand with the exception of IN, OUT, END and DAT
        // 
        // A further change required for CAIE here, as we have the same instruction code
        // with different addressing modes, e.g. ADD [label] and ADD [value]
        //
        // This is a non-trivial change, as we have some instructions which already have
        // the AMC, RMC, and OPMC bits set uniquely, and some which exist in several
        // modes.  The former are fine left as they are, but for the latter, we need to 
        // either check whether we have the 'right' one and break/continue OR we need to
        // just take the first match and override the AMC/RMC/OPMC as necessary.
        //
        // Instructions in this second group are:
        // ADD, SUB, INC, DEC, CMP, AND, XOR, OR
        //
        // I've looked at clouds from both sides now, and I think it is best/easiest to
        // check whether we have the 'right' one and continue if not...
        // So, we should grab the AMC, OPMC and RMC bits from the original code, and then
        // override these values if necessary during processing, and then check whether they
        // have been changed in processing of the line.  If they have, then we need to
        // continue the for loop which iterates the opcodesCAIE array.
        //
        
        let hexmc = opcodesCAIE[j]['mc'];
        let tablemc = parseInt(hexmc,16).toString(2).padStart(8);
        
        let originalAMC = tablemc.substring(4,6);
        let modifiedAMC = tablemc.substring(4,6);
        let originalRMC = tablemc.substring(6,7);
        let modifiedRMC = tablemc.substring(6,7);
        let originalOPMC = tablemc.substring(7,8)
        let modifiedOPMC = tablemc.substring(7,8)

        if (operand.trim().length != 0) {
          if (opcodesCAIE[j]['mnemonic']!="IN" && opcodesCAIE[j]['mnemonic']!="OUT" && opcodesCAIE[j]['mnemonic']!="END") {
            //
            // If DAT, then just set the memory location to the Data
            // Otherwise, combine the machine code and label value from the
            // Symbol Table
            // CAIE CHANGE REQUIRED - DATA MARKER?
            //
            if (opcodesCAIE[j]['mnemonic'] == "DAT") {
              var datum = operand;
              var datumValue = parseInt(datum);
              if ((datumValue < -32768) || (datumValue > 32767)) {
                let errString = "> Error, line " + i + ": value out of range: " + currentLine['operand'] + "\n";
                reportAssemblyError(i+1, errString);
                return;
              }
              datum = datum.toString().padStart(3, "0");

              mc = datum;
            } else {
              //
              // Lookup label in Symbol Table
              //
              let target = "yy";
              let found = false;
              for (let s=0; s < symbolTable.length; s++) {
                if ( symbolTable[s]['symbol'] == operand) {
                  target = symbolTable[s]['value'];
                  found = true;
                }
              }

              //
              // Check for IX/ACC for the INC/DEC instructions
              // Check for IX for the MOV instruction
              //
              if (!found && currentLine['operand'] == "ACC") {
                if (opcodesCAIE[j]['mnemonic'] == "INC" || opcodesCAIE[j]['mnemonic'] == "DEC"){
                  console.log("Found DEC or INC with ACC");
                  modifiedRMC = "1"
                  target="0000";
                  found = true
                }
                else {
                  let errString = "> Error, line " + i + ": ACC is not a target for: " + currentLine['operand'] + "\n";
                  reportAssemblyError(i+1, errString);
                  return;
                }
              }

              if (!found && currentLine['operand'] == "IX") {
                if (opcodesCAIE[j]['mnemonic'] == "INC" || opcodesCAIE[j]['mnemonic'] == "DEC"){
                  console.log("Found INC/DEC with IX");
                  modifiedRMC = "0"
                  target="0000";
                  found = true
                }
                else if (opcodesCAIE[j]['mnemonic'] == "MOV"){
                  console.log("Found MOV with IX");
                  modifiedRMC = "0"
                  target="0000";
                  found = true
                }
                else {
                  let errString = "> Error, line " + i + ": IX is not a target for: " + currentLine['operand'] + "\n";
                  reportAssemblyError(i+1, errString);
                  return;
                }
              }

              if (!found) {
                //
                // We now know that we have an operand which is not a symbolic label.
                // Nor is it 'IX' or 'ACC' for the INC/DEC/MOV instructions.
                //
                // The remaining possibilities are:
                // 
                // #B plus 16 'bits' (1 or 0 characters)
                // #& plus 4 hexadecimal characters (0-9 and a-f or A-F)
                // # plus 1-5 decimal digits up to 65535
                // (If we do not require leading zeroes for denary, should we require it for binary and hex?)
                //
                // Finally, if the operand looks like a numeric memory address (0 to 65535),
                // and we haven't got a matching entry in the symbol table, then 
                // just use the value.
                //
                // Set the numberIndicator and numberBase 'optimistically'
                let currentOperand = currentLine['operand'];
                let numberIndicator = 0;
                let numberBase = 0;
                
                if (currentOperand.length > 1) {
                  numberIndicator = currentOperand.substring(0,1);
                  numberBase = currentOperand.substring(1,2);
                }
                
                if (numberIndicator == '#') {
                  if (numberBase == 'B' || numberBase == 'b') {
                    let binaryValue = currentOperand.substring(2);

                    // Check that the binary value contains only '1' and '0' characters
                    // and that it is no more than 16 bits in length
                    // Easier to do this as a negative check for anything other than
                    // the desired chars.
                    let pattern = /[^0-1]/
                    let formatIncorrect = binaryValue.match(pattern);
                    let lengthIncorrect = (binaryValue.length > 16) || (binaryValue.length < 1);
                    if (formatIncorrect || lengthIncorrect) {
                      let errString = "> Error, line " + i + ": Malformed binary value: " + binaryValue + "\n";
                      reportAssemblyError(i+1, errString);
                      return;
                    }
                    // Set the AMC to Immediate (00)
                    modifiedAMC = "00";
                    // Probably should convert to decimal
                    //target=parseInt(binaryValue,2).toString(16);
                    target=parseInt(binaryValue,2).toString(10);
                    console.log("Binary value", binaryValue);
                    found = true;
                    
                  }
                  else if (numberBase == '&') {
                    let hexValue = currentOperand.substring(2);

                    // Check that the hexadecimal value contains only valid characters
                    // and that it is no more than 4 digits in length
                    let pattern = /[^0-9a-f]/i;
                    let formatIncorrect = hexValue.match(pattern);
                    let lengthIncorrect = (hexValue.length > 4) || (hexValue.length < 1);
                    if (formatIncorrect || lengthIncorrect) {
                      let errString = "> Error, line " + i + ": Malformed hexadecimal value: " + hexValue + "\n";
                      reportAssemblyError(i+1, errString);
                      return;
                    }
                    // Set the AMC to Immediate (00)
                    modifiedAMC = "00";
                    // Probably should convert to decimal
                    //target = hexValue;
                    target = parseInt(hexValue,16).toString(10);
                    console.log("Hexadecimal value", hexValue);
                    found = true;
                  }
                  else {
                    let denaryValue = currentOperand.substring(1);

                    // Check that the denary value contains only valid characters
                    // and that it is  between -32768 and +32767
                    // Being the limits for 16 bits using twos complement
                    let pattern = /[^0-9, ^-]/;
                    let formatIncorrect = denaryValue.match(pattern);
                    let lengthIncorrect = (parseInt(denaryValue) < -32768) || (parseInt(denaryValue) > 32767);
                    if (formatIncorrect || lengthIncorrect) {
                      let errString = "> Error, line " + i + ": Malformed denary value: " + denaryValue + "\n";
                      reportAssemblyError(i+1, errString);
                      return;
                    }
                    modifiedAMC = "00";
                    // For the moment, use decimal for memory addresses
                    // target = parseInt(denaryValue, 10).toString(16);
                    target = parseInt(denaryValue, 10).toString(10);
                    console.log("Denary value", denaryValue);
                    found = true;
                  }
                }
                else {
                  console.log("Could be an ASCII char, who knows?", opcodesCAIE[j]['mnemonic']);
                  found = true;
                }
              }

              //
              // Check whether we matched the AMC/OPMC/RMC:
              if ((originalAMC != modifiedAMC) || (originalOPMC != modifiedOPMC) || (originalRMC != modifiedRMC)) {
                console.log("Failed to match: ", opcodesCAIE[j]['mnemonic']);
                continue;
              }
              target = target.toString().padStart(4, '0');

              originalmc = opcodesCAIE[j]['mc'];
              mc = originalmc + target;
            }
          } else {
            let errString = "> Error, line " + i + ": machine code instruction " + currentLine['operator'] + " should not have an operand\n";
            reportAssemblyError(i+1, errString);
            return;
          }
        }
        else {
          //
          // If we expect an operand but have none, report an error, unless the
          // opcode is DAT, in which case an absent operand is OK.
          //
          if (opcodesCAIE[j]['mnemonic']!="IN" && opcodesCAIE[j]['mnemonic']!="OUT" && opcodesCAIE[j]['mnemonic']!="END" && opcodesCAIE[j]['mnemonic'] != "DAT") {
            let errString = "> Error, line " + i + ": machine code instruction " + currentLine['operator'] + " requires an operand\n";
            reportAssemblyError(i+1, errString);
            return;
          } else {
            //
            // We have an operand-less instruction, so just use the machine code
            //
            if (opcodesCAIE[j]['mnemonic'] == "DAT") {
              mc = "000000";
            } else {
              mc = opcodesCAIE[j]['mc']+"0000";
            }
          }
        }
      }
    }
    //
    // Now figure out where to write the machine code
    //
    // For the row number, we need to account for the 'address' rows being
    // interspersed with data rows (hence the 2 *) and the offset for the
    // first row being 1, rather than 0
    //
    var rownum = 2 * (Math.floor(i / 10) + 1);
    var colnum = (i % 10);
    var colref = 'm' + colnum.toString();

    //
    // We may need to check that all browsers support this ES6 feature (using
    // a variable as a property name).  I think everything relatively new will
    // be OK.
    //
    table2.updateData([{id:rownum, [colref]: mc}]);
  }

  var timestamp = new Date().toLocaleTimeString('en-GB', {hour: "numeric", minute: "numeric", second: "numeric"});
  logobj.value += "> CAIE ASSEMBLY:  Assembly completed at " + timestamp + "\n";
  logobj.scrollTop = logobj.scrollHeight;
  changeState(states.ASSEMBLED);

  
  //
  // Clear the current line indicator (if a program has previously run)
  //
  if (previousProgramCounter != 0) {
    table1.updateData([{id:previousProgramCounter, active: "-"}]);
  }

  // 
  // Clear the bus animation from any previous run
  //
  var c = document.getElementById("processor-canvas");
  var ctx = c.getContext("2d");

  if (canvasInfo.lastBusAnimation != -1) {
    animateBus2(ctx, canvasInfo.lastBusAnimation, true);
  }

  //
  // Clear all register values...
  //
  programCounter = 0;
  previousProgramCounter = 0;
  accumulator = 0;
  memoryDataRegister = 0;
  memoryAddressRegister = 0;
  currentInstructionRegister = 0;
  statusRegister = "00000000";
  ix = 0;
  
  //
  // Refresh the CPU diagram
  //  

  drawCPU(ctx);

  return;
}


function reportAssemblyError(lineNo, errString){
  var logobj=document.getElementById("log-text");

  logobj.value += errString;
  logobj.value += "> ASSEMBLY:  Assembly failed\n";
  logobj.scrollTop = logobj.scrollHeight;
  table1.deselectRow();
  table1.selectRow(lineNo);
}


//
// State changes - enable/disable buttons in here.
//
function changeState(newState){
  state = newState;
  let newLabel = "Ready";

  switch (newState) {
    case states.UNASSEMBLED:
      newLabel="Unassembled";
      document.getElementById("run-btn").disabled = true;
      document.getElementById("stop-btn").disabled = true;
      document.getElementById("resume-btn").disabled = true;      
      document.getElementById("next-btn").disabled = true;

      // Clear output console...
      let logobj=document.getElementById("log-text");
      logobj.value = "";
      
      break;

    case states.ASSEMBLED:
      newLabel="Assembled into memory";
      document.getElementById("run-btn").disabled = false;
      document.getElementById("next-btn").disabled = false;
      document.getElementById("resume-btn").disabled = true;      
      document.getElementById("next-btn").disabled = false;      
      break;

    case states.RUNNING.STOPPING:
      //  Will be followed by a transition to STOPPED when execution of the
      //  current instruction has completed.
      newLabel="Stopping when the current instruction has completed";
      document.getElementById("run-btn").disabled = true;
      document.getElementById("stop-btn").disabled = true;      
      document.getElementById("resume-btn").disabled = true;      
      document.getElementById("next-btn").disabled = true;      
      break;

    case states.STOPPED:
      newLabel="Stopped";
      document.getElementById("run-btn").disabled = false;
      document.getElementById("stop-btn").disabled = true;      
      document.getElementById("resume-btn").disabled = false;      
      document.getElementById("next-btn").disabled = false;      
      break;

    case states.HALTED:
      newLabel="Halted";
      document.getElementById("run-btn").disabled = false;
      document.getElementById("stop-btn").disabled = true;      
      document.getElementById("resume-btn").disabled = true;      
      document.getElementById("next-btn").disabled = true;      
      break;

    case states.RUNNING.ACTIVE:
      newLabel="Running - active";
      document.getElementById("run-btn").disabled = true;
      document.getElementById("stop-btn").disabled = false;
      document.getElementById("resume-btn").disabled = true;      
      document.getElementById("next-btn").disabled = true;      
      break;

    case states.RUNNING.BLOCKEDONINPUT:
      newLabel="Waiting for user input";
      document.getElementById("stop-btn").disabled = true;
      document.getElementById("resume-btn").disabled = true;      
      document.getElementById("next-btn").disabled = true;      
      break;

    default:
      newLabel="Unrecognised state";
      break;
  }

  let label=document.getElementById("state-label");
  label.innerHTML=newLabel;

  return;
}




// 
// body resized - reset the canvas and scale...
//
function resizeEvent(){
  var c = document.getElementById("processor-canvas");
  var ctx = c.getContext("2d");

  scaleCanvas();

  drawCPU(ctx);
}

//
// When we set the canvas size, we need to look at the height and width of
// the holding row...
//
function scaleCanvas(){
  var holdingRow = document.getElementById("processor-memory-row");
  // codetableholder used as a proxy for the content; the content div
  // resizes beyond the visible window.
  var content = document.getElementById("codetableholder");

  //
  // Establish a maximum height for the CPU schematic row - 2/3 of content
  //
  var maxHeight = content.offsetHeight * 2 / 3;

  //
  // Establish a maximum width for the CPU schematic row - 1/2 of holding row
  //
  var maxWidth = holdingRow.offsetWidth / 2;


  // 
  // Figure out whether maxWidth or maxHeight is the limiting factor when 
  // maintaining the aspect ratio of 4:3.
  //
  var cNewWidth = 0;
  var cNewHeight = 0;

  if (maxWidth > (maxHeight * 4 / 3)){
    // Limit is maxHeight
    cNewHeight = maxHeight;
    cNewWidth = maxHeight * 4 / 3;
  } else {
    // Limit is maxWidth
    cNewWidth = maxWidth;
    cNewHeight = maxWidth * 3 / 4;
  }

  //
  // Cheat factor - reduce by 1 x aspect ratio to ensure fit.
  //
  cNewWidth -= 4;
  cNewHeight -= 3;

  //
  // Resize and redraw the canvas
  //
  var c = document.getElementById("processor-canvas");
  var ctx = c.getContext("2d");

  c.width = cNewWidth
  c.height = cNewHeight;

  ctx.clearRect(0, 0, c.width, c.height);

  //
  // See earlier comment - this should be refactored into a configureCanvas function
  //
  canvasInfo.width = c.width;
  canvasInfo.height = c.height;
  canvasInfo.regWidth = c.width*0.16;
  canvasInfo.regHeight = c.height*0.08;
  canvasInfo.busWidth = c.width*0.026;
  canvasInfo.x_offset = 40;
  canvasInfo.y_offset = 40;
  canvasInfo.x_increment = c.width*0.325;
  canvasInfo.y_increment1 = c.height*0.2;
  canvasInfo.y_increment2 = c.height*0.25;

  //
  // Pick an appropriate font size for the width of the canvas
  // We could probably do something smarter...
  //
  canvasInfo.font = "18px Arial";

  if (c.width > 800) {
    canvasInfo.font = "20px Arial";
  } else if (c.width > 700) {
    canvasInfo.font = "18px Arial";
  } else if (c.width > 600) {
    canvasInfo.font = "16px Arial";
  } else if (c.width > 500) {
    canvasInfo.font = "14px Arial";
  } else if (c.width > 400) {
    canvasInfo.font = "10px Arial";
  } else if (c.width > 350) {
    canvasInfo.font = "9px Arial";
  } else if (c.width > 300) {
    canvasInfo.font = "8px Arial";
  } else {
    canvasInfo.font = "6px Arial";
  }

  //
  // Fix the memory table height to the canvas height
  //
  let tableHeight = parseInt(cNewHeight, 10);

  document.getElementById("memory-table").setAttribute("style", "height: "+tableHeight.toString()+"px;");

//  let logobj=document.getElementById("log-text");
//  logobj.value += "> " + canvasInfo.font + "\n";
//  logobj.scrollTop = logobj.scrollHeight;

}


//
// Respond to file load
//
function handleFile() {
  let logobj=document.getElementById("log-text");
  logobj.value += "> File Selected!\n";
  logobj.scrollTop = logobj.scrollHeight;

  let newData=[];

  let codeReader = new FileReader();

  // Replace this with something to parse the text and load up the code table!

  codeReader.onload = function(event) {
    let logobj=document.getElementById("log-text");
    logobj.value += "> File read\n";
    logobj.scrollTop = logobj.scrollHeight;

    //
    // Split the file object into lines...
    //
    let textLines = event.target.result.split("\n");

    //
    // Check whether each line starts with a line number
    //
    let lineNumbers = true;
    for (var i=0; i<textLines.length; i++) {
      let elements = textLines[i].split(/\s+/);
      let isNum = /^\d+$/.test(elements[0]);
      if (!isNum) {
        lineNumbers = false;
        break;
      }
    }

    if (lineNumbers) {
      logobj.value += "> File has line numbers\n";      
    } else {
      logobj.value += "> No line numbers found\n";
    }

    //
    // Process each line
    //
    for (var i=0; i<textLines.length; i++) {
      let elements = textLines[i].split(/\s+/);
      let foundOperator = false;
      let operatorIndex = -1;
      
      for (var j=0; j<elements.length; j++) {

        for (var k=0; k < opcodesCAIE.length; k++) {
          if (opcodesCAIE[k]['mnemonic'] == elements[j]) {
            foundOperator = true;
            operatorIndex = j;
            break;
          }
        }
      }

      if (foundOperator) {
        
        let strLine="";
        let lineVal = "";
        let labelVal = "";
        let operatorVal = "";
        let operandVal = "";
        
        if (lineNumbers){
          if (operatorIndex==1) {
            if (elements.length==2) {
              //  lineno <blank> operator <blank>
              lineVal = elements[0].padStart(2, "0");
              labelVal = "";
              operatorVal = elements[1];
              operandVal = "";
            } else {
              //  lineno <blank> operator operand
              lineVal = elements[0].padStart(2, "0");
              labelVal = "";
              operatorVal = elements[1];
              operandVal = elements[2];
            }
          } else if (operatorIndex==2) {
            if (elements.length==3) {
              //  lineno label operator <blank>
              lineVal = elements[0].padStart(2, "0");
              labelVal = elements[1];
              operatorVal = elements[2];
              operandVal = "";
            } else {
              //  lineno label operator operand
              lineVal = elements[0].padStart(2, "0");
              labelVal = elements[1];
              operatorVal = elements[2];
              operandVal = elements[3];
            }
          } else {
            logobj.value += "Cannot make sense of line...\n";
          }
          newData.push({id:(i+1), active:"-", line:lineVal, label:labelVal, operator:operatorVal, operand:operandVal});
        } else {
          // Deal with no line numbers...
          if (operatorIndex==0) {
            if (elements.length==1) {
              // <blank> operator <blank>
              lineVal = (i+1).toString().padStart(2, "0");
              labelVal = "";
              operatorVal = elements[0];
              operandVal = "";
            } else {
              //  <blank> operator operand
              lineVal = (i+1).toString().padStart(2, "0");
              labelVal = "";
              operatorVal = elements[0];
              operandVal = elements[1];
            }
          } else if (operatorIndex==1) {
            if (elements.length==2) {
              //  label operator <blank>
              lineVal = (i+1).toString().padStart(2, "0");
              labelVal = elements[0];
              operatorVal = elements[1];
              operandVal = "";
            } else {
              //  label operator operand
              lineVal = (i+1).toString().padStart(2, "0");
              labelVal = elements[0];
              operatorVal = elements[1];
              operandVal = elements[2];
            }
          } else {
            logobj.value += "Cannot make sense of line...\n";
          }
          newData.push({id:(i+1), active:"-", line:lineVal, label:labelVal, operator:operatorVal, operand:operandVal});
        } 
      }
      else {
        //
        // Blank line found - just push it...
        //
        lineVal = i.toString().padStart(2, "0");
        newData.push({id:(i+1), active:"-", line:lineVal, label:"", operator:"", operand:""});
      }
      changeState(states.UNASSEMBLED);
    }

    while (newData.length < 100) {
      newData.push({id:(newData.length+1), active:"-", line:newData.length.toString().padStart(2, "0"), label:"", operator:"", operand:""});
    }

    table1.setData(newData)
    .then(function(){
      logobj.value += "> data added to table\n";
    })
    .catch(function(error){
      logobj.value += "> ERROR: " + error +"\n";
    });

    // We need to change the value of the load button here, so that we can reload the same file
    // BUT we don't want to refire the change event!
    //
    document.getElementById("load-btn").removeEventListener('change', handleFile, false);
    document.getElementById("load-btn").value = null;
    document.getElementById("load-btn").addEventListener('change', handleFile, false);
  };

  codeReader.readAsText(this.files[0]);
}

//
// Save the contents of the code table to local file system
//
// Grab the contents of the code table,
// format it into a data resource
// shimmy a new anchor onto the DOM with a download attribute
// click it
// remove it...
//
// This fails with the CAIE instructions set because of characters
// such as '#' and '&'.
//
// Try escaping these characters.  While a point solution is not
// ideal, there are just two problematic cases in the CAIE set.
//
function saveCode() {
  let resString = "data:text/plain;charset=UTF-8,";
  let code = table1.getData();

  for (let i=0; i < code.length; i++) {
    currentLine = code[i];
    //
    // Nasty - if we have a blank line at the end of the file, then our reader
    // detects that there is a missing line number, so assumes line numbers
    // are not present.  Current hacky solution is to detect the last line
    // and omit the CR.
    //
    let sanitise = encodeURIComponent(currentLine['operand']);

    if (i==code.length-1) {
      resString += currentLine['line'] + "%09" + currentLine['label'] + "%09" + currentLine['operator'] + "%09" + sanitise;
    } else {
      resString += currentLine['line'] + "%09" + currentLine['label'] + "%09" + currentLine['operator'] + "%09" + sanitise +"%0A";
    }
  }

  let element = document.createElement('a');
  element.setAttribute('href', resString);
  element.setAttribute('download', "LMCProgram");
  element.style.display='none';
  
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

//
// Functions for the settings modal.
//
function cancelSettings() {
  document.getElementById("settings-modal").style.display = "none";

  settingSpeed = stashedSettingSpeed;
  settingShowDataFlows = stashedSettingShowDataFlows;
  settingShowVariables = stashedSettingShowVariables;
  settingShowMemoryAccess = stashedSettingShowMemoryAccess;
  settingMemoryDataInHex = stashedSettingMemoryDataInHex;
}

function saveSettings() {
  // Update the relevant globals here...
  document.getElementById("settings-modal").style.display = "none";

  // Speed is handled by changeSetting() below...
  settingShowDataFlows = document.getElementById("setting-show-data-flows").checked;
  settingShowVariables = document.getElementById("setting-show-variable-values").checked;
  settingShowMemoryAccess = document.getElementById("setting-show-memory-access").checked;
  settingMemoryDataInHex = document.getElementById("setting-memory-data-in-hex").checked;

  // If the user has changed the Hex/Denary setting, reset the Memory table
  if (settingMemoryDataInHex != stashedSettingMemoryDataInHex) {
    if (settingMemoryDataInHex) {
      blankmemorytabledata = blankmemorytabledatahex;
    } else {
      blankmemorytabledata = blankmemorytabledatadenary;
    }
    table2.replaceData(blankmemorytabledata);
  }
}

function stashOldSettings() {
  stashedSettingSpeed = settingSpeed;
  stashedSettingShowDataFlows = settingShowDataFlows;
  stashedSettingShowVariables = settingShowVariables;
  stashedSettingShowMemoryAccess = settingShowMemoryAccess;
  stashedSettingMemoryDataInHex = settingMemoryDataInHex;

  let speedValue = 0;
  let newText = "some new text";
  
  switch(settingSpeed) {
    case speeds.SUPERSLOW:
      speedValue = 0;
      newText = speeds.SUPERSLOW;
      break;
    case speeds.SLOW:
      speedValue = 1;
      newText = speeds.SLOW;
      break;
    case speeds.MEDIUM:
      speedValue = 2;
      newText = speeds.MEDIUM;
      break;
    case speeds.FAST:
      speedValue = 3;
      newText = speeds.FAST;
      break;
    case speeds.SUPERFAST:
      speedValue = 4;
      newText = speeds.SUPERFAST;
      break;
    default:
      break;
  }
  
  document.getElementById("setting-speed").value = speedValue;
  document.getElementById("speed-display").innerHTML = newText;
  document.getElementById("setting-show-data-flows").checked = settingShowDataFlows;
  document.getElementById("setting-show-variable-values").checked = settingShowVariables;
  document.getElementById("setting-show-memory-access").checked = settingShowMemoryAccess;
  document.getElementById("setting-memory-data-in-hex").checked = settingMemoryDataInHex;
}

function changeSetting(target) {

  speedSelected = document.getElementById("setting-speed").value;
  let newText = "Some new text";

  switch(speedSelected) {
    case "0":
      newText = speeds.SUPERSLOW;
      settingSpeed = speeds.SUPERSLOW;
      break;
    case "1":
      newText = speeds.SLOW;
      settingSpeed = speeds.SLOW;
      break;
    case "2":
      newText = speeds.MEDIUM;
      settingSpeed = speeds.MEDIUM;
      break;
    case "3":
      newText = speeds.FAST;
      settingSpeed = speeds.FAST;
      break;
    case "4":
      newText = speeds.SUPERFAST;
      settingSpeed = speeds.SUPERFAST;
      break;
    default:
      newText = speeds.SUPERSLOW;
      settingSpeed = speeds.SUPERSLOW;
      break;
  }
  document.getElementById("speed-display").innerHTML = newText;
}

//
// Functions for the about modal.
//
function closeAbout() {
  document.getElementById("about-modal").style.display = "none";
}

//
// Functions for the help modal.
//
function closeHelp() {
  document.getElementById("help-modal").style.display = "none";
}

//
// Functions for the examples modal.
//
function closeExamples() {
  document.getElementById("examples-modal").style.display = "none";
}

function loadExample() {
  // Dismiss modal
  document.getElementById("examples-modal").style.display = "none";

  // Reset state
  changeState(states.UNASSEMBLED);

  // Let the user know we're loading the example
  let logobj=document.getElementById("log-text");
  logobj.value += "> Example selected\n";
  logobj.scrollTop = logobj.scrollHeight;


  // Figure out which example was selected and load it. 
  let exampleRadioButtons = document.getElementsByName("example_select");

  for (var i=0; i<exampleRadioButtons.length; i++){
    if (exampleRadioButtons[i].checked == true){
      let codetabledata = codetabledata1;

      if (exampleRadioButtons[i].value == 1){
        codetabledata = codetabledata1;
      } else if (exampleRadioButtons[i].value == 2) {
        codetabledata = codetabledata2;
      } else if (exampleRadioButtons[i].value == 3) {
        codetabledata = codetabledata3;
      } else {
        codetabledata = codetabledata4;
      }
          
      while (codetabledata.length < 100) {
        let newrowno = codetabledata.length+1
        codetabledata.push({id:newrowno, active:"-", line:(newrowno-1).toString().padStart(2, "0"), label:"", operator:"", operand:""});
      }

      table1.setData(codetabledata)
      .then(function(){
        logobj.value += "> data added to table\n";
      })
      .catch(function(error){
        logobj.value += "> ERROR: " + error +"\n";
      });
    }
  }
}

//
// This might be better done as a set of regions that the drawCPU()
// code populates (making sure we clear it out first!), and then
// we check here.  At the moment, we have repeated code/knowledge
// about where each register is located here and in drawCPU()
//
function canvasHitCheck(x, y) {

  let hitRegister = false;
  let description = "None";

  let tooltipX = x;
  let tooltipY = y;
  let tooltipWidth = canvasInfo.width/1.5;

  //
  // If we are currently running, do not allow the 'tooltip' to
  // be shown
  //
  if ((state == states.RUNNING.ACTIVE) ||
      (state == states.RUNNING.BLOCKEDONINPUT) ||
      (state == states.RUNNING.PAUSED) ||
      (state == states.RUNNING.STOPPING) ||
      (state == states.STOPPED)) {
    return;
  }

  // Work out some adjustment values based on the canasInfo size
  yoffset1 = canvasInfo.height/6;
  yoffset2 = canvasInfo.height/4;
  yoffset3 = canvasInfo.height/3;

  //
  // Check whether the user clicked on a register, and if so, which
  //
  x1 = canvasInfo.x_offset;
  x2 = x1 + canvasInfo.x_increment;
  x3 = x2 + canvasInfo.x_increment;

  y1 = canvasInfo.y_offset;
  y2 = y1 + canvasInfo.y_increment1;
  y3 = y2 + canvasInfo.y_increment2;
  y4 = y3 + canvasInfo.y_increment2;

 
  if (x >= x1 && x <= x1+canvasInfo.regWidth) {

    //
    // Left-hand column, move tooltip slightly to the right
    // Adjust the Y position depending on which register was clicked
    //
    tooltipX += 20;

    if (y >= y1 && y <= y1+canvasInfo.regHeight) {
      description = "Program Counter\nThe Program Counter contains the address of the next instruction to be fetched from memory.\nIf you watch carefully as a program is running, you will see that the PC immediately increments by one as soon as an instruction is read from Memory.\nThe Branching instructions ('BRA', 'BRZ', and 'BRP') can change the value in the PC, causing program execution to 'jump' to the new address in Memory.";
      hitRegister = true;
    } else if (y >= y2 && y <= y2+canvasInfo.regHeight) {
      description = "Current Instruction Register\nThe Current Instruction Register contains the last instruction fetched from Memory via the MDR.  Before the instruction can be executed, it must be decoded into a set of signals by the DECODER component.";
      hitRegister = true;
      tooltipY -= yoffset1;
    } else if (y >= y3 && y <= y3+canvasInfo.regHeight) {
      description = "Decoder\nThe Decoder takes the instruction code from the CIR and turns it into a set of signals to control the execution of the instruction.";
      hitRegister = true;
      tooltipY -= yoffset2;
    } else if (y >= y4 && y <= y4+canvasInfo.regHeight) {
      description = "Input\nThe 'mailbox' used to hold user input before it is moved to the Accumulator.  When an 'INP' instruction is executed, the user is prompted to enter a value which will be placed into this 'mailbox' and then moved into the Accumulator.";
      hitRegister = true;
      tooltipY -= yoffset3;
    }

  //
  // This needs to be split into ALU and ACC, as the ACC
  // is wider and higher than any other register...
  //
  } else if (x >= x2 && x <= x2+canvasInfo.regWidth) {

    //
    // Middle column, move tooltip to the left
    // Adjust the Y position depending on which register was clicked
    //
    tooltipX -= tooltipWidth/2;

    if (y >= y3 && y <= y3+canvasInfo.regHeight) {
      description = "Arithmetic and Logic Unit\nThe Arithmetic and Logic Unit is responsible for the 'ADD' and 'SUB' operations.  In a modern processor, the ALU would be much more complex of course, but the Little Man Computer instruction set only has these two arithmetic operations.";
      hitRegister = true;
      tooltipY -= yoffset2;
    } else if (y >= y4 && y <= y4+canvasInfo.regHeight) {
      description = "Accumulator\nThe Accumulator normally holds the result of the latest operation carried out by the ALU, but a value can also be directly loaded into the Accumulator from Memory, using the 'LDA' instruction.  We can also write the current value of the Accumulator into Memory using the 'STA' instruction.  Finally, the Accumulator can be loaded from user input (the 'INP' instruction) or used as output to the user (the 'OUT' instruction).";
      hitRegister = true;
      tooltipY -= yoffset3;
    }

  } else if (x >= x3 && x <= x3+canvasInfo.regWidth) {

    //
    // Right-hand column, move tooltip significantly to the left
    // Adjust the Y position depending on which register was clicked
    //
    tooltipX -= tooltipWidth + 20;

    if (y >= y1 && y <= y1+canvasInfo.regHeight) {
      description = "Memory Address Register\nThe Memory Address Register holds an address for a Memory location which is about to be read from, or written to.  In a read operation (which could be fetching an instruction or reading data), the value at the memory address will be retrieved and placed in the MDR.  In a write operation (as part of an 'STA' instruction), the value in the MDR will be written to Memory at this address.";
      hitRegister = true;
    } else if (y >= y2 && y <= y2+canvasInfo.regHeight) {
      description = "Memory Data Register\nThe Memory Data Register holds a value which has either been read from Memory, or which is about to be written to Memory.  It is important to note that this value can be either an instruction or data.  In the case of an instruction, this will always have been read from Memory as part of the Fetch-Execute-Decode cycle.  In the case of data, the value may have been read from memory (in an 'LDA', 'SUB' or 'ADD' instruction) or be written to Memory (in an 'STA' instruction).";
      hitRegister = true;
      tooltipY -= yoffset1;
    } else if (y >= y3 && y <= y3+canvasInfo.regHeight) {
      description = "Status Register\nThe Status Register is an important component in any modern processor.  When the ALU has completed an operation, the Status Register is updated with information about that operation.  In this simulator, only three bits are used: the Least Significant Bit (bit 0) is an overflow flag - if the result of an addition is greater than 999, or the result of a subtraction is less than -999, this flag will be set to 1.  Bit 1 is used to record whether the result of an operation is zero, and bit 2 is used to record whether the result of an operation is positive (zero or more).  Bits 1 and 2 are used in the 'BRZ' and 'BRP' operations.";
      hitRegister = true;
      tooltipY -= yoffset2;
    } else if (y >= y4 && y <= y4+canvasInfo.regHeight) {
      description = "Output\nThe 'mailbox' used to hold output from the Accumulator.  When an 'OUT' instruction is executed, the value currently held in the Accumulator is moved into this mailbox and then displayed to the user.";
      hitRegister = true;
      tooltipY -= yoffset3;
    }
  }

  if (cpuTooltipVisible == false){
  
    if (hitRegister) {
      let c = document.getElementById('processor-canvas');
      let ctx = c.getContext('2d');

      ctx.save();
      ctx.font = canvasInfo.font;

      //
      // Approximation - use the width of a capital 'M' as a proxy for font height
      //
      let lineHeight = (ctx.measureText('MM').width);
      console.log(lineHeight);

      writeDescription(ctx, description, tooltipX, tooltipY, tooltipWidth, lineHeight);
      ctx.restore();

      cpuTooltipVisible = true;
    }

  } else {

    let c = document.getElementById('processor-canvas');
    let ctx = c.getContext('2d');

    cpuTooltipVisible = false;
    
    drawCPU(ctx);

    if (hitRegister) {

      ctx.save();
      ctx.font = canvasInfo.font;

      //
      // Approximation - use the width of a capital 'M' as a proxy for font height
      //
      let lineHeight = (ctx.measureText('MM').width);
      console.log(lineHeight);

      writeDescription(ctx, description, tooltipX, tooltipY, tooltipWidth, lineHeight);
      ctx.restore();

      cpuTooltipVisible = true;
    }

  }
}

//
// Split the text into lines which are a maximum of line_width in
// length, then render them as a sort of tooltip.
//
function writeDescription(context, text, x, y, line_width, line_height)
{
  var line_count = 0;
  var line = '';
  var paragraphs = text.split('\n');

  var text_lines = [];
  
  for (var i = 0; i < paragraphs.length; i++) {
    var words = paragraphs[i].split(' ');
    for (var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > line_width && n > 0) {
        text_lines.push(line);
        line = words[n] + ' ';
        line_count += 1;
      } else {
        line = testLine;
      }
    }
    text_lines.push(line);
    line_count += 1;
    line = '';
  }

  //
  // Draw a bounding rectangle to give the tooltip some definition
  //

  // Offset to give a little blank space at the top of the tooltip
  yoffset = canvasInfo.height/18;

  context.strokeStyle = '#999999';
  context.strokeRect(x-10, y-yoffset, line_width+10, (line_height*line_count)+20);

  context.globalAlpha=0.9;
  context.fillStyle = '#eeeeee';
  context.fillRect(x-10, y-yoffset, line_width+10, (line_height*line_count)+20);
  context.fillStyle = '#000000';
  context.globalAlpha=1.0;

  for (var i = 0; i < text_lines.length; i++) {
    context.fillText(text_lines[i], x, y);
    line = words[n] + ' ';
    y += line_height;
  }
}


function clearCode(){
  var codetabledata = [
    {id:1,  active:"-", line:"00", label:"", operator:"", operand:""},
  ];

  while (codetabledata.length < 100) {
    let newrowno = codetabledata.length+1
    codetabledata.push({id:newrowno, active:"-", line:(newrowno-1).toString().padStart(2, "0"), label:"", operator:"", operand:""});
  }

  table1.setData(codetabledata);
}

//
// Auth0 code
//
let auth0Client = null;
const fetchAuthConfig = () => fetch("/LMC/auth_config.json");
const configureClient = async () => {
  console.log("In Auth0 code, configureClient");
  const response = await fetchAuthConfig();
  const config = await response.json();

  auth0Client = await auth0.createAuth0Client({
    domain: config.domain,
    clientId: config.clientId
  });
};

const updateUI = async () => {
  console.log("In Auth0 code, updateUI");
  const isAuthenticated = await auth0Client.isAuthenticated();

  document.getElementById("btn-logout").disabled = !isAuthenticated;
  document.getElementById("btn-login").disabled = isAuthenticated;
};

const login = async () => {
  await auth0Client.loginWithRedirect({
    authorizationParams: {
      redirect_uri: window.location.origin
    }
  });
};
