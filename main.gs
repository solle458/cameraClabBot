function doPost(e){
  let sheet = SpreadsheetApp.getActive().getActiveSheet();
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
        let translatedText = LanguageApp.translate(event.message.text, 'ja', 'en'); // 英訳して
        let contents = {
          replyToken: event.replyToken,
          messages: [{type: 'text', text: translatedText}],
        };
        reply(contents);
      }
    }
  }
}
