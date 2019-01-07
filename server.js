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
    var data = require('./stt.js');
    function callback(d) {
      if(d.privText != undefined){
        console.log(d.privText);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(d.privText);
      }else if(d == false){
        console.log("error");
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write("error");
      }else{
        console.log("失敗したよ");
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write("失敗したよ");
      }
      res.end();
    }
    data.stt(req, callback);

    
  } else if('/img/icon.jpeg' == url) {
    fs.readFile('./'+url, {encoding: null},function (err, data) {
        res.writeHead(200, {'Content-Type': 'image/jpeg'});
        res.write(data);
        res.end();
    });
  } else if('/img/setting.png' == url) {
    fs.readFile('./'+url, {encoding: null},function (err, data) {
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.write(data);
        res.end();
    });
  } else if('/img/microphone-on.png' == url) {
    fs.readFile('./'+url, {encoding: null},function (err, data) {
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.write(data);
        res.end();
    });
  } else if('/img/present.png' == url) {
    fs.readFile('./'+url, {encoding: null},function (err, data) {
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.write(data);
        res.end();
    });
  } else if('/img/camera.png' == url) {
    fs.readFile('./'+url, {encoding: null},function (err, data) {
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.write(data);
        res.end();
    });
  } else if('/img/microphone.png' == url) {
    fs.readFile('./'+url, {encoding: null},function (err, data) {
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.write(data);
        res.end();
    });
  } else if('/img/ng.png' == url) {
    fs.readFile('./'+url, {encoding: null},function (err, data) {
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.write(data);
        res.end();
    });
  } else if('/bot' == url) {
  } else if('/tts' == url) {
    var data = require('./tts.js');
    function callback(wav) {
      //console.log(wav);
      res.writeHead(200, {'Content-Type': 'binary'});
      res.write(wav, 'binary');
      res.end();
    }
    var body = '';
    req.on('data', function (d) {
      body += d;
      if (body.length > 1e6) {
        request.connection.destroy();
      }
    }).on('end', function () {
      var post = JSON.parse(body);
      console.log(post['data']);
      data.tts(post['data'], callback);
    });
  } else if('/js/test.js' == url) {
    fs.readFile('./'+url, 'UTF-8',function (err, data) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write(data);
      res.end();
    });
  } else {
    fs.readFile('./'+url, 'UTF-8', function (err, data) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end();
    });
  }
}

server.listen(port);
// server.listen(3000, "127.0.0.1");

