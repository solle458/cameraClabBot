function doPost(e){
  let sheet = SpreadsheetApp.getActive().getActiveSheet();
  let data = JSON.parse(e.postData.contents); // LINE から来た json データを JavaScript のオブジェクトに変換する
  let events = data.events;
  for(let i = 0; i < events.length; i++){ // すべてのイベントについて繰り返し処理をする
    let event = events[i];
    if(event.type == 'follow'){
      let userId = event.source.userId;
      let userProfile = getUserProfile(userId);
      let userName = userProfile.displayName;
      sheet.appendRow([new Date(), userId, userName]);
    }
    if(event.type == 'message'){ // メッセージ受信イベントであるか判定
      if(event.message.type == 'text'){ // 受信したのが普通のテキストメッセージであるか
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
