

function createVoteResultJsonStr(leftCount, rightCount) {
    let json = {
        "msg": "投票結果：肯定=" + leftCount + " 否定=" + rightCount,
        "dipeType": leftCount > rightCount ? "debateLeft" : "debateRight",
        "uname": ""
    };
    return JSON.stringify(json);
}


exports.DiscussionNameSpace = class {
    constructor(namespace) {
        this._debate_title = "";
        this._voteFlag = false;

        //投票数のカウント
        this._leftCount = 0;
        this._rightCount = 0;

        //ソケットのイベント
        this.event = (socket) => {
            socket.on("titleSend", (title) => {
                if (this._debate_title != "")
                    return;
                this._leftCount = 0;
                this._rightCount = 0;
                this._debate_title = title;
                namespace.emit("titleSend", this._debate_title);
                setTimeout(() => {
                    namespace.emit("startVote", "");
                    this._voteFlag = true;
                    setTimeout(() => {
                        this._voteFlag = false;
                        this._debate_title = "";
                        namespace.emit("titleSend", this._debate_title);
                        namespace.emit("endVote", "");
                        namespace.emit("msg", createVoteResultJsonStr(this._leftCount, this._rightCount));
                    }, 10 * 1000);
                }, 10 * 1000);
            });
            socket.on("firstTitleSend", (data) => {
                socket.emit("firstTitleSend", this._debate_title);
            });
            socket.on("initVoteFlag", (data) => {
                socket.emit("initVoteFlag", this._voteFlag);
            })
            socket.on("vote", (data) => {
                if (data == "left")
                    this._leftCount++;
                else if (data == "right")
                    this._rightCount++;
            })
        };
    }
}