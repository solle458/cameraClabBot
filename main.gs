function doPost(e){
  let spreadsheet = SpreadsheetApp.getActive();
  let sheet = spreadsheet.getActiveSheet();
  let printerSheet = spreadsheet.getSheetByName('印刷関連');
  let systemSheet = spreadsheet.getSheetByName('システム関連');
  let paperName = {"KG":"H2", "L判":"I2", "六切":"J2"};
  let data = JSON.parse(e.postData.contents); // LINE から来た json データを JavaScript のオブジェクトに変換する
  let events = data.events;
  for(let i = 0; i < events.length; i++){ // すべてのイベントについて繰り返し処理をする
    let event = events[i];
    let userId = event.source.userId;
    if(event.type == 'follow'){
      let userProfile = getUserProfile(userId);
      let userName = userProfile.displayName;
      let searchedRow = searchRows(sheet, userId.toString());
      if(searchedRow == -1){
        sheet.appendRow([userId, userName]);
      }
    }
    if(event.type == 'unfollow'){
      let searchedRow = searchRows(sheet, userId.toString());
      if(searchedRow != -1){
        sheet.deleteRow(searchedRow);
      }
    }
    if(event.type == 'message'){ // メッセージ受信イベントであるか判定
      if(event.message.type == 'text'){ // 受信したのが普通のテキストメッセージであるか
        loading(userId);
        let lastMessage = systemSheet.getRange(2,1).getValue(), nowMessage = event.message.text;
        systemSheet.getRange(2,1).setValue(nowMessage);
        if(event.message.text == 'KG' || event.message.text == 'L判' || event.message.text == '六切'){
          let nowPaperPos = paperName[event.message.text];
          let range = printerSheet.getRange(nowPaperPos);
          let value = range.getValue();
          let lastRow = printerSheet.getRange(1,3).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow();
          let setRange = [printerSheet.getRange(lastRow+1, 1), printerSheet.getRange(lastRow+1, 2), printerSheet.getRange(lastRow+1,3)];
          let userProfile = getUserProfile(userId);
          let userName = userProfile.displayName;
          setRange[0].setValue(new Date());
          setRange[1].setValue(userName);
          setRange[2].setValue(event.message.text);
          let contents = {
            replyToken: event.replyToken,
            messages: [{type: 'text', text: "残り枚数は" + value + "枚です。\n何枚使用しますか？\n（数字で答えてください）"}],
          };
          reply(contents);
        }
      }
    }
  }
}
