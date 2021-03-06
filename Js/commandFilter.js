//htmlのタグをエスケープする
function htmlEscape(htmlText) {
  return $('<div/>').text(htmlText).html();
}

//hscalcライブラリのロード
hscalc.load();

class commandViewer {

  let commandList = {};

  setCommandFunction(){
  }
  let regText = new RegExp(command, "g");
  commandFuncView(chatText, command, func_result) {
    const matchText = chatText.match(regText);
    if (matchText) {
      chatText = chatText.replace(command, "");
      chatText = htmlEscape(chatText);
      return (chatText + func_result);
    } else {
      chatText = htmlEscape(chatText);
      return chatText;
    }
  }

  commandImageView(chatText, command, url) {
    const matchText = chatText.match(regText);
    if (matchText) {
      chatText = chatText.replace(command, "");
      chatText = htmlEscape(chatText);
      return (chatText + '<img src="' + url + '" width="100" height="100">');
    } else {
      chatText = htmlEscape(chatText);
      return chatText;
    }
  }
}

//コマンドを読み取り実行結果を得る
function commandFilter(data) {
  switch (true) {
    case /> 931/.test(data):
      data = data.replace(/931/g, "");
      data = htmlEscape(data);
      return (data + '<img src="https://pbs.twimg.com/profile_images/510615322307461120/o-vKGUzY_400x400.jpeg" width="100" height="100">');

    case /> 810/.test(data):
      data = data.replace(/810/g, "");
      data = htmlEscape(data);
      return (data + '<img src="https://pbs.twimg.com/profile_images/710311323561627648/5IbTKZ76.jpg" width="100" height="100">');

    case /> 1919/.test(data):
      data = data.replace(/1919/g, "");
      data = htmlEscape(data);
      return (data + '<img src="http://tn.smilevideo.jp/smile?i=20394692.L" width="100" height="100">');

    case /> 893/.test(data):
      data = data.replace(/893/g, "");
      data = htmlEscape(data);
      return (data + '<img src="http://image01.seesaawiki.jp/b/i/bbsenpai/e118b95c81b903db.jpg" width="100" height="100">');

    case /> hscalc/.test(data):
      let userName = htmlEscape(data.replace(/hscalc.*/g, ""));
      let msg = data.replace(/.*hscalc/g, "");
      let lexerRet = hscalc.lexer(msg);
      if (lexerRet.errorFlag) {
        return userName + "トークンエラー";
      }

      let parser = new hscalc.Parser(lexerRet.tokenList);
      try {
        return userName + parser.doParse();
      } catch (e) {
        return userName + e;
      }

    default:
      data = htmlEscape(data);
      return data;
  }
}


function url_filter(data) {

}
