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
