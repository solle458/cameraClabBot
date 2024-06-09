function searchRows(sheet, targetString) {
  const textObject = sheet.createTextFinder(targetString).matchEntireCell(true);
  const results = textObject.findAll();
  if (results.length == 0) {
    return -1;
  } else {
    let row = results[0].getRow();
    return row;
  }
}

function followOrUnfollow(event, userId, sheet) {
  if (event.type == 'follow') {
    let userProfile = getUserProfile(userId);
    let userName = userProfile.displayName;
    let searchedRow = searchRows(sheet, userId.toString());
    if (searchedRow == -1) {
      sheet.appendRow([userId, userName]);
    }
  }
  if (event.type == 'unfollow') {
    let searchedRow = searchRows(sheet, userId.toString());
    if (searchedRow != -1) {
      sheet.deleteRow(searchedRow);
    }
  }
}
