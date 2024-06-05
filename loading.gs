// ローディング機能
function loading(userId) {
  UrlFetchApp.fetch('https://api.line.me/v2/bot/chat/loading/start', {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'chatId': userId,
      'loadingSeconds': 20
    }),
  });
}
