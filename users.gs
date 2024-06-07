function getUserProfile(userId) {
  let url = 'https://api.line.me/v2/bot/profile/' + userId;
  let options = {
    'headers': {
      'Authorization': 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN
    },
    'method': 'get'
  };
  let response = UrlFetchApp.fetch(url, options);
  if (response.getResponseCode() == 200) {
    return JSON.parse(response.getContentText());
  } else {
    return null;
  }
}

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
