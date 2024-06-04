function searchRows(sheet, targetString) {
  const textObject = sheet.createTextFinder(targetString).matchEntireCell(true);
  const results = textObject.findAll();
  if(results.length == 0)return -1;
  else let row = results[0].getRow();
  return row;
}
