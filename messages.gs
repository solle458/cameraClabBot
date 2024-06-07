function changePaper(printerSheet, systemSheet, event, userId) {
  let paperName = { "KG": "H2", "L判": "I2", "六切": "J2" };
  let nowPaperPos = paperName[event.message.text];
  let range = printerSheet.getRange(nowPaperPos);
  let value = range.getValue();
  let lastRow = printerSheet.getRange(1, 3).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow();
  systemSheet.getRange('B2').setValue(lastRow);
  let setRange = [printerSheet.getRange(lastRow + 1, 1), printerSheet.getRange(lastRow + 1, 2), printerSheet.getRange(lastRow + 1, 3)];
  let userProfile = getUserProfile(userId);
  let userName = userProfile.displayName;
  setRange[0].setValue(new Date());
  setRange[1].setValue(userName);
  setRange[2].setValue(event.message.text);
  let contents = {
    replyToken: event.replyToken,
    messages: [{ type: 'text', text: "残り枚数は" + value + "枚です。\n何枚使用しますか？\n（数字で答えてください）" }],
  };
  reply(contents);
}

function decreasePaper(event, message, printerSheet, systemSheet, lastMessage){
  let paperName = { "KG": "H2", "L判": "I2", "六切": "J2" };
  let nowPaperPos = paperName[lastMessage];
  let range = printerSheet.getRange(nowPaperPos);
  let value = range.getValue();
  let lastRow = systemSheet.getRange('B2').getValue();
  range.setValue(Number(value) - Number(message));
  let contents = {
    replyToken: event.replyToken,
    messages: [{type: 'text', text: "残り枚数は" + (Number(value) - Number(message)) + "枚です。\nありがとうございました。"}],
  };
  reply(contents);
  printerSheet.getRange(lastRow+1, 4).setValue(message);
}

function reply(contents){
  let channelAccessToken = LINE_CHANNEL_ACCESS_TOKEN;
  let replyURL = "https://api.line.me/v2/bot/message/reply";
  let option = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + channelAccessToken
    },
    payload: JSON.stringify(contents)
  };
  UrlFetchApp.fetch(replyURL, option);
}