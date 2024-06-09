function doPost(e){
  let spreadsheet = SpreadsheetApp.getActive();
  let sheet = spreadsheet.getActiveSheet();
  let printerSheet = spreadsheet.getSheetByName('印刷関連');
  let systemSheet = spreadsheet.getSheetByName('システム関連');
  let data = JSON.parse(e.postData.contents); // LINE から来た json データを JavaScript のオブジェクトに変換する
  let events = data.events;
  for(let i = 0; i < events.length; i++){ // すべてのイベントについて繰り返し処理をする
    let event = events[i];
    let userId = event.source.userId;
    if(event.type == 'follow' || event.type == 'unfollow'){
      followOrUnfollow(event, userId, sheet);
    }
    if(event.type == 'message'){ // メッセージ受信イベントであるか判定
      if(event.message.type == 'text'){ // 受信したのが普通のテキストメッセージであるか
        loading(userId);
        let lastMessage = systemSheet.getRange(2,1).getValue(), nowMessage = event.message.text;
        systemSheet.getRange(2,1).setValue(nowMessage);
        if(nowMessage == 'KG' || nowMessage == 'L判' || nowMessage == '六切'){
          changePaper(printerSheet, systemSheet, event, userId);
        }else if((lastMessage == 'KG' || lastMessage == 'L判' || lastMessage == '六切') && 0 <= Number(nowMessage) && Number(nowMessage) <= 9999){
          decreasePaper(event, nowMessage, printerSheet, lastMessage);
        }
      }
    }
  }
}
