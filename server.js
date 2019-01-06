const http = require('http');
const port = 80;

var server = http.createServer();
server.on('request', doRequest);

// ファイルモジュールを読み込む
var fs = require('fs');

// リクエストの処理
function doRequest(req, res) {
  var url = req.url;
  console.log(url);
  if ('/' == url) {
    fs.readFile('./test.html', 'UTF-8', function (err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
  } else if('/stt' == url) {
    req.on('data', function (filename) {
      var data = require('./stt.js');
      function callback(d) {
        console.log(d.privText);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(d.privText);
        res.end();
      }
      data.stt(filename, callback);
    });
  } else if('/bot' == url) {
  } else if('/tts' == url) {
  } else {
    fs.readFile('./'+url, 'UTF-8', function (err, data) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(data);
        res.end();
    });
  }
}

server.listen(port);
