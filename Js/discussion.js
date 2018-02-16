const urlLocation = document.location.href;
const urlParam = urlGetParamParse(urlLocation);

//議題定義のソケット定義
const chatConnection = new ChatConnection(decodeURIComponent(urlParam["roomName"]), msgDataAdd);

let voteFlag = false;

//左右に別れるためのロケーション
$('#left').click(() => {
  if (voteFlag == false)
    document.location.href = "discussion.html?stance=debateLeft&roomName=" + urlParam["roomName"];
  else
    chatConnection.socket.emit("vote", "left");
});
$('#right').click(() => {
  if (voteFlag == false)
    document.location.href = "discussion.html?stance=debateRight&roomName=" + urlParam["roomName"];
  else
    chatConnection.socket.emit("vote", "right");
});

$("#com").keydown((e) => {
  let ms = document.myf.com.value;
  let nm = document.myf.name.value;
  let comBox = $('#com').val();
  if (nm != "" && ms != "") {
    if (e.keyCode == 13) {
      // $('#com').val(comBox.replace(/\r|\n|\r\n|&#010/g, '<br>'));
      $('#com').val(comBox.replace("\n", ""));
      chatConnection.setUserData(JSON.stringify({
        name: nm,
        dipeType: urlParam["stance"]
      }));
      chatConnection.sendData(
        JSON.stringify({
          "msg": ms,
          "name": nm.replace(/\r|\n|\r\n/g, ''),
          "dipeType": urlParam["stance"],
          "uname": nm
        })
      );
      $('#com').val(comBox.replace("\n", ""));
      document.myf.com.value = "";
    }
  }
});

$('#chat_send').click(() => {
  const ms = document.myf.com.value;
  const nm = document.myf.name.value;

  if (ms != "" && nm != "") {
    chatConnection.setUserData(JSON.stringify({
      name: nm,
      dipeType: urlParam["stance"]
    }));
    chatConnection.sendData(
      JSON.stringify({
        "msg": ms,
        "name": nm,
        "dipeType": urlParam["stance"],
        "uname": nm
      })
    );
  }
  $('#com').val("");
  document.myf.com.value = "";
});

//urlParam["stance"] == "debateLeft"
//データをチャットメッセージとして追加する関数
const commandFilter = new CommandFilter();

function msgDataAdd(data) {
  console.log(data);
  data = JSON.parse(data);

  let msg = "<div>" + htmlEscape(data.name) + " > " + commandFilter.doCommandFilter(data.msg) + "</div><hr>";

  if (data["dipeType"] == "debateLeft") {
    $('#chat_log').prepend(msg);
    //$('#left_name_area').prepend(data["uname"]);
  } else if (data["dipeType"] == "debateRight") {
    $('#chat_log2').prepend(msg);
    //$('#right_name_area').prepend(data["uname"]);
  }
}

let title_list = new Array();

$("#title_send").click(() => {
  let word = document.myf.title_word.value;
  chatConnection.socket.emit('titleSend', word);
});

chatConnection.socket.on("userListUpdate", (userListStr) => {
  $('#left_name_area').text(userListStr);
});


chatConnection.socket.on('titleSend', (titleData) => {
  $("#titlec").text(titleData).html();
});


chatConnection.socket.on("userListUpdate", (userDataList) => {
  userDataList = JSON.parse(userDataList);
  let leftStr = "";
  let rightStr = "";
  userDataList.forEach(userData => {
    if (userData == undefined)
      return;
    console.log(userData);
    userData = JSON.parse(userData);
    let name = userData.name == undefined ? "none" : userData.name;
    if (userData.dipeType == "debateLeft")
      leftStr += " " + name + " ";
    else if (userData.dipeType == "debateRight")
      rightStr += " " + name + " ";
  });
  $('#left_name_area').text(leftStr);
  $('#right_name_area').text(rightStr);
});

chatConnection.socket.emit('firstTitleSend', "");
chatConnection.socket.on('firstTitleSend', (titleData) => {
  $("#titlec").text(titleData).html();
});


function unsetVoteMode() {
  voteFlag = false;
  $("#left").text("肯定").html();
  $("#right").text("否定").html();
  $("#countDown").text("");
}

function setVoteMode() {
  voteFlag = true;
  $("#left").text("肯定に投票する").html();
  $("#right").text("否定に投票する").html();
}

//
chatConnection.socket.emit("initVoteFlag", "");

//投票状況を取得し、投票中ならbuttonを投票用に変更する
chatConnection.socket.on("initVoteFlag", (VoteFlagData) => {
  if (VoteFlagData) {
    setVoteMode();
  }
});

//投票終了したらbutton元に戻す
chatConnection.socket.on("endVote", (data) => {
  unsetVoteMode();
});

//投票の開始
chatConnection.socket.on("startVote", (data) => {
  setVoteMode();
});

//投票までの時間をカウントダウンする
chatConnection.socket.on("startVoteSecond", (second) => {
  $("#countDown").text("投票まで残り" + second + "秒");
});

//投票終了までの時間をカウントダウンする
chatConnection.socket.on("endVoteSecond", (second) => {
  $("#countDown").text("投票終了まで残り" + second + "秒");
});
