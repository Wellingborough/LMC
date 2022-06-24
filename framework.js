
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
  {id:1,  active:"-", line:"00", label:"start", operator:"INP", operand:""},
  {id:2,  active:"-", line:"01", label:"",      operator:"STA", operand:"A"},
  {id:3,  active:"-", line:"02", label:"",      operator:"INP", operand:""},
  {id:4,  active:"-", line:"03", label:"",      operator:"ADD", operand:"A"},
  {id:5,  active:"-", line:"04", label:"",      operator:"OUT", operand:""},
  {id:6,  active:"-", line:"05", label:"",      operator:"HLT", operand:""},
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
  {id:1,  active:"-", line:"00", label:"start", operator:"LDA", operand:"one"},
  {id:2,  active:"-", line:"01", label:"",      operator:"OUT", operand:""},
  {id:3,  active:"-", line:"02", label:"",      operator:"LDA", operand:"zero"},
  {id:4,  active:"-", line:"03", label:"",      operator:"OUT", operand:""},
  {id:5,  active:"-", line:"04", label:"",      operator:"LDA", operand:"count"},
  {id:6,  active:"-", line:"05", label:"",      operator:"SUB", operand:"one"},
  {id:7,  active:"-", line:"06", label:"",      operator:"STA", operand:"count"},
  {id:8,  active:"-", line:"07", label:"",      operator:"BRP", operand:"start"},
  {id:9,  active:"-", line:"08", label:"",      operator:"HLT", operand:""},
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
  {id:21, active:"-", line:"20", label:"one",   operator:"DAT", operand:"1"},
  {id:22, active:"-", line:"21", label:"zero",  operator:"DAT", operand:"0"},
  {id:23, active:"-", line:"22", label:"count", operator:"DAT", operand:"3"},
];

//
// Code example table 3 - Square a given number
//
var codetabledata3 = [
  {id:1,  active:"-", line:"00", label:"start", operator:"INP", operand:""},
  {id:2,  active:"-", line:"01", label:"",      operator:"STA", operand:"number"},
  {id:3,  active:"-", line:"02", label:"",      operator:"LDA", operand:"zero"},
  {id:4,  active:"-", line:"03", label:"",      operator:"STA", operand:"sum"},
  {id:5,  active:"-", line:"04", label:"",      operator:"STA", operand:"count"},
  {id:6,  active:"-", line:"05", label:"loop",  operator:"LDA", operand:"sum"},
  {id:7,  active:"-", line:"06", label:"",      operator:"ADD", operand:"number"},
  {id:8,  active:"-", line:"07", label:"",      operator:"STA", operand:"sum"},
  {id:9,  active:"-", line:"08", label:"",      operator:"LDA", operand:"count"},
  {id:10, active:"-", line:"09", label:"",      operator:"ADD", operand:"one"},
  {id:11, active:"-", line:"10", label:"",      operator:"STA", operand:"count"},
  {id:12, active:"-", line:"11", label:"",      operator:"SUB", operand:"number"},
  {id:13, active:"-", line:"12", label:"",      operator:"BRP", operand:"finish"},
  {id:14, active:"-", line:"13", label:"",      operator:"BRA", operand:"loop"},
  {id:15, active:"-", line:"14", label:"finish",operator:"LDA", operand:"sum"},
  {id:16, active:"-", line:"15", label:"",      operator:"OUT", operand:""},
  {id:17, active:"-", line:"16", label:"",      operator:"HLT", operand:""},
  {id:18, active:"-", line:"17", label:"",      operator:"",    operand:""},
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
var codetabledata4 = [
  {id:1,  active:"-", line:"00", label:"start",   operator:"INP", operand:""},
  {id:2,  active:"-", line:"01", label:"",        operator:"STA", operand:"dividend"},
  {id:3,  active:"-", line:"02", label:"",        operator:"INP", operand:""},
  {id:4,  active:"-", line:"03", label:"",        operator:"STA", operand:"divisor"},
  {id:5,  active:"-", line:"04", label:"",        operator:"LDA", operand:"zero"},
  {id:6,  active:"-", line:"05", label:"",        operator:"STA", operand:"answer"},
  {id:7,  active:"-", line:"06", label:"",        operator:"LDA", operand:"dividend"},
  {id:8,  active:"-", line:"07", label:"loop",    operator:"SUB", operand:"divisor"},
  {id:9,  active:"-", line:"08", label:"",        operator:"STA", operand:"dividend"},
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

//
// Memory table - styled using CSS so that the 'address' rows
// are distinguished from the 'data' rows by lighter/darker background colours?
//
var blankmemorytabledata = [
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
// Default to MEDIUM
// If this is changed, then the HTML for the Settings modal
// needs to have a matching change
//
let settingSpeed = speeds.MEDIUM;


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
var settingShowDataFlows = stashedSettingShowDataFlows;
var settingShowVariables = stashedSettingShowVariables;
var settingShowMemoryAccess = stashedSettingShowMemoryAccess;

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
      {title:"", field:"active", formatter:"traffic", formatterParams:{min:1, max:3, color:["green", "orange", "red"]}, width:25, maxWidth:25, minWidth:25, hozAlign:"center", headerSort:false, download:false, resizable:false},
      {title:"Line", field:"line", width:"10%", widthShrink:3, headerSort:false, resizable:false},
      {title:"Label", field:"label", width:"20%", widthShrink:6, hozAlign:"left", editor:true, headerSort:false, resizable:false},
      {title:"Operator", field:"operator", width:"30%", widthShrink:4, editor:true, headerSort:false, resizable:false},
      {title:"Operand", field:"operand", width:"35%", widthShrink:6, editor:true, headerSort:false, resizable:false},
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
    clearInterval(intervalHandle);
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
      {title:"", field:"m0", width:"10%", widthShrink:1, hozAlign:"center", headerSort:false, resizable:false},
      {title:"", field:"m1", width:"10%", widthShrink:1, hozAlign:"center", headerSort:false, resizable:false},
      {title:"M", field:"m2", width:"10%", widthShrink:1, hozAlign:"center", headerHozAlign:"center", headerSort:false, resizable:false},
      {title:"E", field:"m3", width:"10%", widthShrink:1, hozAlign:"center", headerHozAlign:"center", headerSort:false, resizable:false},
      {title:"M", field:"m4", width:"10%", widthShrink:1, hozAlign:"center", headerHozAlign:"center", headerSort:false, resizable:false},
      {title:"O", field:"m5", width:"10%", widthShrink:1, hozAlign:"center", headerHozAlign:"center", headerSort:false, resizable:false},
      {title:"R", field:"m6", width:"10%", widthShrink:1, hozAlign:"center", headerHozAlign:"center", headerSort:false, resizable:false},
      {title:"Y", field:"m7", width:"10%", widthShrink:1, hozAlign:"center", headerHozAlign:"center", headerSort:false, resizable:false},
      {title:"", field:"m8", width:"10%", widthShrink:1, hozAlign:"center", headerSort:false, resizable:false},
      {title:"", field:"m9", width:"10%", widthShrink:1, hozAlign:"center", headerSort:false, resizable:false},
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
  let formattedPC = programCounter.toString().padStart(2, "0");
  let formattedMAR = memoryAddressRegister.toString().padStart(2, "0");

  drawRegisterValue("MAR", formattedMAR, context);
  drawRegisterValue("MDR", memoryDataRegister, context);
  drawRegisterValue("CIR", currentInstructionRegister, context);
  drawRegisterValue("PC", formattedPC, context);
  drawRegisterValue("SR", statusRegister, context);
  drawRegisterValue("ACC", accumulator, context);

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
    w = canvasInfo.regWidth*0.85;
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
    // PC-to-MAR
    x0 = canvasInfo.x_offset + canvasInfo.regWidth + os;
    y0 = canvasInfo.y_offset + canvasInfo.regHeight/2;

    x1 = canvasInfo.x_offset + canvasInfo.x_increment*2 -os;
    y1 = canvasInfo.y_offset + canvasInfo.regHeight/2;

    points=[[x0, y0], [x1, y1]];
  }
  else if (operation == 1) {
    // MAR-to-Memory
    x0 = canvasInfo.x_offset + canvasInfo.x_increment*2 + canvasInfo.regWidth + os;
    y0 = canvasInfo.y_offset + canvasInfo.regHeight/2;

    x1 = canvasInfo.width;
    y1 = canvasInfo.y_offset + canvasInfo.regHeight/2;

    points=[[x0, y0], [x1, y1]];
  }
  else if (operation == 2) {
    // Memory-to-MDR
    x0 = canvasInfo.x_offset + canvasInfo.x_increment*2 + canvasInfo.regWidth + os;
    y0 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2;

    x1 = canvasInfo.width;
    y1 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2;

    points=[[x0, y0], [x1, y1]];
  }
  else if (operation == 3) {
    // MDR-to-CIR
    x0 = canvasInfo.x_offset + canvasInfo.regWidth + os;
    y0 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2;

    x1 = canvasInfo.x_offset + canvasInfo.x_increment*2 - os; 
    y1 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2;

    points=[[x0, y0], [x1, y1]];
  }
  else if (operation == 4) {
    // NULL?
  }
  else if (operation == 5) {
    // CIR-to-MAR
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
    // ACC-to-ALU
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
    // ALU-to-ACC
    x0 = canvasInfo.x_offset + canvasInfo.x_increment + canvasInfo.regWidth/2;
    y0 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2 + canvasInfo.regHeight*3/2 + os;

    x1 = canvasInfo.x_offset + canvasInfo.x_increment + canvasInfo.regWidth/2;
    y1 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2*2 - os;

    points=[[x0, y0], [x1, y1]];
  }
  else if (operation == 8) {
    // ACC-to-MDR
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
    // MAR-to-Memory
    x0 = canvasInfo.x_offset + canvasInfo.x_increment*2 + canvasInfo.regWidth + os;
    y0 = canvasInfo.y_offset + canvasInfo.regHeight/2;

    x1 = canvasInfo.width;
    y1 = canvasInfo.y_offset + canvasInfo.regHeight/2;

    points=[[x0, y0], [x1, y1]];

    // MDR-to-Memory
    x0 = canvasInfo.x_offset + canvasInfo.x_increment*2 + canvasInfo.regWidth + os;
    y0 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2;

    x1 = canvasInfo.width;
    y1 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.regHeight/2;

    points2=[[x0, y0], [x1, y1]];
  }
  else if (operation == 10) {
    // MDR-to-ACC
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
    // CIR-to-PC
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
  else if (operation == 13) {
    // INPUT-to-ACC
    x0 = canvasInfo.x_offset + canvasInfo.regWidth + os;
    y0 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2*2 + canvasInfo.regHeight/2;

    x1 = canvasInfo.x_offset+canvasInfo.x_increment - os;
    y1 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2*2 + canvasInfo.regHeight/2;

    points=[[x0, y0], [x1, y1]];
  }
  else if (operation == 14) {
    // ACC-to-OUTPUT
    x0 = canvasInfo.x_offset + canvasInfo.x_increment + canvasInfo.regWidth + os;
    y0 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2*2 + canvasInfo.regHeight/2;

    x1 = canvasInfo.x_offset+canvasInfo.x_increment*2 - os;
    y1 = canvasInfo.y_offset + canvasInfo.y_increment1 + canvasInfo.y_increment2*2 + canvasInfo.regHeight/2;

    points=[[x0, y0], [x1, y1]];
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

    var trial = parseInt(userInput)
    
    if ((trial > 999) || (trial < -999)) {
      let logobj=document.getElementById("log-text");
      logobj.value += "> ERROR:  Invalid input value.  Must be between -999 and +999\n";
      logobj.scrollTop = logobj.scrollHeight;
      return;
    }

    
    let logobj=document.getElementById("log-text");
    logobj.value += "> EXECUTE:  Transferring input to accumulator: " + userInput + "\n";
    logobj.scrollTop = logobj.scrollHeight;
    accumulator = parseInt(userInput);

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

  table1.download("pdf", "lmcprogram.pdf", {
        orientation:"portrait", //set page orientation to portrait
        title:"LMC Program", //add title to report
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
// LMC Instruction Set
//
const opcodesLMC = [{mnemonic: "ADD", mc:"1xx", name: "Add", 
                     description: "Add the contents of the given memory location to the accumulator"}, 
                    {mnemonic: "SUB", mc:"2xx", name: "Subtract", 
                     description: "Subtract the contents of the given memory location from the accumulator"},
                    {mnemonic: "STA", mc:"3xx", name: "Store Accumulator", 
                     description: "Copy the value in the Accumulator to the given memory address"},
                    {mnemonic: "LDA", mc:"5xx", name: "Load Accumulator", 
                     description: "Copy the value from the given memory location into the Accumulator"},
                    {mnemonic: "BRA", mc:"6xx", name: "Branch", 
                     description: "Set the Program Counter to the given memory location and execute"
                       +" the next instruction"},
                    {mnemonic: "BRZ", mc:"7xx", name: "Branch if Accumulator Zero", 
                     description: "If the value in the Accumulator is zero,then set the Program Counter"
                       +" to the given memory location and execute the next instruction"},
                    {mnemonic: "BRP", mc:"8xx", name: "Branch if Accumulator Positive", 
                     description: "If the value in the Accumulator is positive, then set the Program"
                       +" Counter to the given memory location and execute the next instruction"},
                    {mnemonic: "INP", mc:"901", name: "Input", 
                     description: "Copy the value from the 'Input' box into the Accumulator"},
                    {mnemonic: "OUT", mc:"902", name: "Output", 
                     description: "Copy the value in the Accumulator to the 'Output' box"},
                    {mnemonic: "DAT", mc:"xxx", name: "Data", 
                     description: "Set the given memory location to the supplied value"},
                    {mnemonic: "HLT", mc:"000", name: "End program", 
                     description: "Instructs the processor to stop executing instructions"},
                   ];


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

var intervalHandler;

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

var execStage = executionStages.FETCH;
var numSubStages = 4;

function nextInstruction() {
  // 
  // Splits the execution of an instruction into Fetch/Decode/Execute
  // so that we can display the changes to the registers
  //
  numSubStages -= 1;

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
    if (numSubStages == 0){
      numSubStages = 1;
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
    if (numSubStages == 0){
      numSubStages = 4;
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

  if (numSubStages == 3) {
    if (settingSpeed != speeds.SUPERFAST) {
      animateBus(ctx, 0);

      let logobj=document.getElementById("log-text");
      logobj.value += "> FETCH:  Reading instruction from RAM\n";
      logobj.scrollTop = logobj.scrollHeight;
    }
    memoryAddressRegister = formattedPC;

  } else if (numSubStages == 2) {
    animateBus(ctx, 1);
    programCounter = programCounter+1;

  } else if (numSubStages == 1) {
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
    clearInterval(intervalHandle);
  }
  
  formattedPC = programCounter.toString().padStart(2, "0");

  var c = document.getElementById("processor-canvas");
  var ctx = c.getContext("2d");

  drawRegisterValue("MAR", memoryAddressRegister, ctx);
  drawRegisterValue("MDR", memoryDataRegister, ctx);
  drawRegisterValue("CIR", currentInstructionRegister, ctx);
  drawRegisterValue("PC", formattedPC, ctx);
  drawRegisterValue("SR", statusRegister, ctx);
  drawRegisterValue("ACC", accumulator, ctx);

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
  // (Should look this up from the table of LMC instructions)
  //
  instructionDetails = "EMPTY";
  instructionCode = "EMPTY";

  if (currentInstructionRegister[0] == "1"){
    // ADD
    var address = currentInstructionRegister.substring(1,3);
    memoryAddressRegister = address;
    numSubStages = 5;
    instructionCode = "ADD";
    drawRegisterValue("DECODER", "ADD ["+address+"]", ctx);
    drawRegisterValue("ALU", "ADD", ctx);
  }

  if (currentInstructionRegister[0] == "2"){
    // SUB
    var address = currentInstructionRegister.substring(1,3);
    memoryAddressRegister = address;
    numSubStages = 5;
    instructionCode = "SUB";
    drawRegisterValue("DECODER", "SUB ["+address+"]", ctx);
    drawRegisterValue("ALU", "SUB", ctx);
  }
        
  if (currentInstructionRegister[0] == "3"){
    // STA
    var address = currentInstructionRegister.substring(1,3);
    memoryAddressRegister = address;
    numSubStages = 2;
    instructionCode = "STA";
    drawRegisterValue("DECODER", "STA ["+address+"]", ctx);
  }
        
  if (currentInstructionRegister[0] == "4"){
    console.log("Unrecognised Command");
    numSubStages = 0;
  }
        
  if (currentInstructionRegister[0] == "5"){
    // LDA
    var address = currentInstructionRegister.substring(1,3);
    memoryAddressRegister = address;
    numSubStages = 4;
    instructionCode = "LDA";
    drawRegisterValue("DECODER", "LDA ["+address+"]", ctx);
  }
        
  if (currentInstructionRegister[0] == "6"){
    // BRA
    var address = currentInstructionRegister.substring(1,3);
    // Nothing to do here...
    numSubStages = 1;
    instructionCode = "BRA";
    drawRegisterValue("DECODER", "BRA ["+address+"]", ctx);
  }
        
  if (currentInstructionRegister[0] == "7"){
    // BRZ
    var address = currentInstructionRegister.substring(1,3);
    // Nothing to do here...
    numSubStages = 1;
    instructionCode = "BRZ";
    drawRegisterValue("DECODER", "BRZ ["+address+"]", ctx);
  }
        
  if (currentInstructionRegister[0] == "8"){
    // BRP
    var address = currentInstructionRegister.substring(1,3);
    // Nothing to do here...
    numSubStages = 1;
    instructionCode = "BRP";
    drawRegisterValue("DECODER", "BRP ["+address+"]", ctx);
  }
        
  if (currentInstructionRegister[0] == "9"){
    // INP/OUT
    var type = currentInstructionRegister.substring(1,3);
    // Nothing to do here...        
    numSubStages = 1;
    if (currentInstructionRegister == "901") {
      instructionCode = "INP";
      drawRegisterValue("DECODER", "INP", ctx);
    } else {
      instructionCode = "OUT";
      drawRegisterValue("DECODER", "OUT", ctx);
    }
  }

  if (currentInstructionRegister == "000"){
    // HLT
    var type = currentInstructionRegister.substring(1,3);
    // Nothing to do here...
    numSubStages = 1;
    instructionCode = "HLT";
    drawRegisterValue("DECODER", "HLT", ctx);
  }
  
  for (let i=0; i < opcodesLMC.length; i++) {
    if (opcodesLMC[i]['mnemonic'] == instructionCode) {
      instructionDetails = opcodesLMC[i]['description'];
      break;
    }
  }

  let logobj=document.getElementById("log-text");
  logobj.value += "> DECODE:  " + currentInstructionRegister + " = " + instructionCode + ": " + instructionDetails + "\n";
  logobj.scrollTop = logobj.scrollHeight;

  formattedPC = programCounter.toString().padStart(2, "0");

  //
  // For the moment, just stop when the PC hits 99
  //
  if (programCounter == 99){
    clearInterval(intervalHandle);
  }

  if (settingSpeed != speeds.SUPERFAST) {
    let dummy = 1.0;
  }
}


function executeInstruction() {
  var c = document.getElementById("processor-canvas");
  var ctx = c.getContext("2d");
  var memory = table2.getData();
  var foundLocation = false;

  if (currentInstructionRegister[0] == "1"){
    // ADD
    if (numSubStages == 4) {
      animateBus(ctx, 5);
    } else if (numSubStages == 3) {
      animateBus(ctx, 1);
    } else if (numSubStages == 2) {
      animateBus(ctx, 2);
      var value = readMemory(memoryAddressRegister);
      memoryDataRegister = value;
    } else if (numSubStages == 1) {
      animateBus(ctx, 6);
    } else {
      animateBus(ctx, 7);
      accumulator += parseInt(memoryDataRegister);
      updateStatusRegister();
    }
  }

  if (currentInstructionRegister[0] == "2"){
    // SUB
    if (numSubStages ==4) {
      animateBus(ctx, 5);
    } else if (numSubStages == 3) {
      animateBus(ctx, 1);
    } else if (numSubStages == 2) {
      animateBus(ctx, 2);
      var value = readMemory(memoryAddressRegister);
      memoryDataRegister = value;
    } else if (numSubStages == 1) {
      animateBus(ctx, 6);
    } else {
      animateBus(ctx, 7);
      accumulator -= parseInt(memoryDataRegister);
      updateStatusRegister();
    }
  }
        
  if (currentInstructionRegister[0] == "3"){
    // STA
    if (numSubStages == 1) {
      animateBus(ctx, 8);
      memoryDataRegister = accumulator;
    } else {
      animateBus(ctx, 9);
      var address = memoryAddressRegister;
      //
      // Now store the value in the Accumulator into memory
      //
      writeMemory(address, accumulator);
    }
  }
        
  if (currentInstructionRegister[0] == "4"){
    console.log("Unrecognised Command");
  }
        
  if (currentInstructionRegister[0] == "5"){
    // LDA
    if (numSubStages == 3) {
      animateBus(ctx, 5);
    } else if (numSubStages == 2 ) {
      animateBus(ctx, 1);
    } else if (numSubStages == 1 ) {
      animateBus(ctx, 2);
      var value = readMemory(memoryAddressRegister);
      memoryDataRegister = value;
    } else {
      animateBus(ctx, 10);
      accumulator = parseInt(memoryDataRegister);
    }
  }
        
  if (currentInstructionRegister[0] == "6"){
    // BRA
    var address = currentInstructionRegister.substring(1,3);
    programCounter = parseInt(address);
    animateBus(ctx, 11);
  }
        
  if (currentInstructionRegister[0] == "7"){
    // BRZ
    var address = currentInstructionRegister.substring(1,3);
    if (accumulator == 0){
      programCounter = parseInt(address);
      animateBus(ctx, 11);
    }
  }
        
  if (currentInstructionRegister[0] == "8"){
    // BRP
    var address = currentInstructionRegister.substring(1,3);

    if (accumulator >= 0){
      programCounter = parseInt(address);
      if (settingSpeed != speeds.SUPERFAST) {
        animateBus(ctx, 11);
        let logobj=document.getElementById("log-text");
        logobj.value += "> EXECUTE:  BRP: Branching as Accumulator is " + accumulator + "\n";
        logobj.scrollTop = logobj.scrollHeight;
      }
    } else {
      if (settingSpeed != speeds.SUPERFAST) {
        var logobj=document.getElementById("log-text");
        logobj.value += "> EXECUTE:  BRP: Not branching as Accumulator is " + accumulator + "\n";
        logobj.scrollTop = logobj.scrollHeight;
      }
    }
  }
        
  if (currentInstructionRegister[0] == "9"){
    // INP/OUT
    var type = currentInstructionRegister.substring(1,3);
        
    if (type == "01"){
//      animateBus(ctx, 4);
      let logobj=document.getElementById("log-text");
      logobj.value += "> EXECUTE:  Waiting for input (to accumulator)\n";
      logobj.scrollTop = logobj.scrollHeight;
      let outobj=document.getElementById("input-text");
      outobj.value = "";
      clearInterval(intervalHandle);
      // Save the current state - either running or step-by-step - so that
      // we can restore that state when user input is complete...
      stateBeforeInput = state;
      changeState(states.RUNNING.BLOCKEDONINPUT);
    } else {
      animateBus(ctx, 14);
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
  }

  if (currentInstructionRegister == "000"){
    let logobj=document.getElementById("log-text");
    logobj.value += "> EXECUTE:  HALT instruction found\n";
    allHalt();
  }
  
  formattedPC = programCounter.toString().padStart(2, "0");

  //
  // For the moment, just stop when the PC hits 99
  //
  if (programCounter == 99){
    clearInterval(intervalHandle);
  }

  var c = document.getElementById("processor-canvas");
  var ctx = c.getContext("2d");

  drawRegisterValue("MAR", memoryAddressRegister, ctx);
  drawRegisterValue("MDR", memoryDataRegister, ctx);
  drawRegisterValue("CIR", currentInstructionRegister, ctx);
  drawRegisterValue("PC", formattedPC, ctx);
  drawRegisterValue("SR", statusRegister, ctx);
  drawRegisterValue("ACC", accumulator, ctx);

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
  clearInterval(intervalHandle);

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
  logobj.value = "> ASSEMBLY:  Started assembly at " + timestamp + "\n";

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

    for (let j=0; j < opcodesLMC.length; j++) {
      if (opcodesLMC[j]['mnemonic'] == operator) {
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

    for (let j=0; j < opcodesLMC.length; j++) {
      if (opcodesLMC[j]['mnemonic'] == operator) {
        //
        // Check whether we have an operand, and if this matches the machine
        // code definition
        // 
        if (operand.trim().length != 0) {
          if (opcodesLMC[j]['mc'].includes("xx")) {
            //
            // If DAT, then just set the memory location to the Data
            // Otherwise, combine the machine code and label value from the
            // Symbol Table
            //
            if (opcodesLMC[j]['mnemonic'] == "DAT") {
              var datum = operand;
              var datumValue = parseInt(datum);
              if ((datumValue < -999) || (datumValue > 999)) {
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

              if (!found) {
                // 
                // If the operand looks like a numeric memory address (0 to 99),
                // and we haven't got a matching entry in the symbol table, then 
                // just use the value.
                //
                var operandValue = parseInt(currentLine['operand']);
                if ((operandValue >= 0) && (operandValue <= 99)) {
                  target = operandValue;
                } else {
                  //let errString = "> Error, line " + i + ": symbol not found: " + currentLine['operand'] + "\n";
                  let errString = "> Error, line " + i + ": symbol not found: " + currentLine['operand'] + " " + operand + "\n";
                  reportAssemblyError(i+1, errString);
                  return;
                }
              }

              target = target.toString();

              if (target.length == 1) {
                target = "0"+target;
              }
              originalmc = opcodesLMC[j]['mc'];
              mc = originalmc.replace("xx", target);
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
          if (opcodesLMC[j]['mc'].includes("xx") && opcodesLMC[j]['mnemonic'] != "DAT") {
            let errString = "> Error, line " + i + ": machine code instruction " + currentLine['operator'] + " requires an operand\n";
            reportAssemblyError(i+1, errString);
            return;
          } else {
            //
            // We have an operand-less instruction, so just use the machine code
            //
            if (opcodesLMC[j]['mnemonic'] == "DAT") {
              mc = "000";
            } else {
              mc = opcodesLMC[j]['mc'];
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
  logobj.value += "> ASSEMBLY:  Assembly completed at " + timestamp + "\n";
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
  var holdingDiv = document.getElementById("processor-schematic");
  //
  // Establish a maximum height for the CPU schematic row - 2/3 of content
  //
  var maxHeight = holdingDiv.clientHeight;

  //
  // Establish a maximum width for the CPU schematic row - 1/2 of holding row
  //
  var maxWidth = holdingDiv.clientWidth;

  console.log("Width, height");
  console.log(maxWidth, maxHeight);


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

        for (var k=0; k < opcodesLMC.length; k++) {
          if (opcodesLMC[k]['mnemonic'] == elements[j]) {
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
    // BUT we don't want to refire the change event!!  Unless we look for a reserved value of course
    //
    // document.getElementById("load-btn").innerHTML = "Null";


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
function saveCode() {
  let resString = "data:text/plain;charset=utf-8,";
  let code = table1.getData();

  for (let i=0; i < code.length; i++) {
    currentLine = code[i];
    resString += currentLine['line'] + "\t" + currentLine['label'] + "\t" + currentLine['operator'] + "\t" + currentLine['operand'] +"\n";
  }

  let element = document.createElement('a');
  element.setAttribute('href', resString);
  element.setAttribute('download', "");
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
}

function saveSettings() {
  // Update the relevant globals here...
  document.getElementById("settings-modal").style.display = "none";

  // Speed is handled by changeSetting() below...
  settingShowDataFlows = document.getElementById("setting-show-data-flows").checked;
  settingShowVariables = document.getElementById("setting-show-variable-values").checked;
  settingShowMemoryAccess = document.getElementById("setting-show-memory-access").checked;
}

function stashOldSettings() {
  stashedSettingSpeed = settingSpeed;
  stashedSettingShowDataFlows = settingShowDataFlows;
  stashedSettingShowVariables = settingShowVariables;
  stashedSettingShowMemoryAccess = settingShowMemoryAccess;

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

