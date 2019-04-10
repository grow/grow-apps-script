function onOpen() {
  SpreadsheetApp.getUi()
      .createMenu('Copywriting')
      .addItem('Approve tab', 'markTabApproved')
      .addSeparator()
      .addItem('Add draft marker to tab', 'markTabDraftEnabled')
      .addItem('Remove draft marker', 'markTabDraftDisabled')
      .addSeparator()
      .addItem('Alphabetize tabs (slow)', 'sortSheets')
      .addToUi();
}

function getDraftTabNames() {
  var names = [];
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  for (var i=0; i < sheets.length; i++) {
    var name = sheets[i].getName();
    if (name.indexOf('*') == 0) {
      names.push([name]);
    }
  };
  return names;
}

function markTabApproved() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var name = sheet.getName();
  if (name.indexOf('*') == 0) {
    sheet.setName(name.slice(1));
    SpreadsheetApp.getActiveSpreadsheet().toast('Tab marked approved.', 'Copywriting');
  } else {
    SpreadsheetApp.getActiveSpreadsheet().toast("Tab isn't dirty. Nothing to approve.", 'Copywriting');
  }
}

function markTabDraftDisabled() {
  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.setTabColor(null); // Unset the color.
  SpreadsheetApp.getActiveSpreadsheet().toast('Draft marker removed.', 'Copywriting');
}

function markTabDraftEnabled() {
  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.setTabColor('ff0000'); // Set the color to red.
  //sheet.setTabColor(null); // Unset the color.
  SpreadsheetApp.getActiveSpreadsheet().toast('Tab marked draft. Content will be blocked from release to prod.', 'Copywriting');
}

function sortSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetNameArray = [];
  var sheets = ss.getSheets();
   
  for (var i = 0; i < sheets.length; i++) {
    sheetNameArray.push(sheets[i].getName());
  }
  
  sheetNameArray.sort();
     
  for( var j = 0; j < sheets.length; j++ ) {
    ss.setActiveSheet(ss.getSheetByName(sheetNameArray[j]));
    ss.moveActiveSheet(j + 1);
  }
}

function onEdit(e) {
  // Highlights edited cells.
  var range = e.range;
  var value = range.getValue();
  var column = range.getColumn();
  if (value) {
    if (column >= 2) {
      range.setBackground('#F7EDC3');
    }
  } else {
    range.setBackground(null);
  }
  // range.setNote('Last modified: ' + new Date());
  
  // Mark the tab as dirty.
  var sheet = range.getSheet();
  var name = sheet.getName();
  if (name.indexOf('*') != 0) {
    sheet.setName('*' + name);
    SpreadsheetApp.getActiveSpreadsheet().toast('Tab marked as dirty. Changes must be approved in order to be ingested.', 'Copywriting');
  }
  //sheet.setTabColor('ff0000'); // Set the color to red.
  //sheet.setTabColor(null); // Unset the color.
}
