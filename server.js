const http = require('http');
// const hostname = '127.0.0.1';
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
    var data = require('./index.js');
    function callback(data) {
      console.log(data.privText);
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write(data.privText);
      res.end();
    }
    data.stt(callback);
  } else {
    fs.readFile('./'+url, 'UTF-8', function (err, data) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(data);
        res.end();
    });
  }
}

server.listen(port);
