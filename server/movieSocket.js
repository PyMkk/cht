const escape = require('escape-html');

const https = require('https');
function timeToNum(time) {
    const parse = time.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const h = Number(parse[1] ? parse[1] : 0);
    const m = Number(parse[2] ? parse[2] : 0);
    const s = Number(parse[3] ? parse[3] : 0);
    return h * 60 * 60 + m * 60 + s;
}

function getYoutubeTime(videoId) {
    const url = "https://www.googleapis.com/youtube/v3/videos?id=" + videoId + "&part=contentDetails&key=AIzaSyALEbFV3NAal5rVp5eWa9iYDld8gq6pQOc"
    https.get(url, (res) => {
        let body = '';
        res.setEncoding('utf8');

        res.on('data', (chunk) => {
            body += chunk;
        });

        res.on('end', (res) => {
            console.log(timeToNum(JSON.parse(body).items[0].contentDetails.duration));
        });
    }).on('error', (e) => {
        console.log(e.message); //エラー時
    });
}

//ディスカッション名前空間にソケットイベントをバインドするクラス
exports.movieNameSpace = class {
    constructor(namespace) {
        this._videoId = "AN3YqXbWgOs";
        this._currentSeek = 0;
        this._endSeek = 0;
        //ソケットのイベント
        this.connectEvent = (socket) => {
            socket.on("initVideoId", () => {
                socket.emit("videoIdSend", this._videoId);
            });
            socket.on("videoIdSend", (videoId) => {
                this._videoId = escape(videoId);
                namespace.emit("videoIdSend", this._videoId);
            });
        };
    }
};
