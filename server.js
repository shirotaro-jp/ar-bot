const http = require('http');
const port = 80;

var server = http.createServer();
server.on('request', doRequest);

// ファイルモジュールを読み込む
var fs = require('fs');
const request = require('request');

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
      if(d.privText != undefined) {
        console.log(d.privText);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(d.privText);
      } else if(d == false) {
        console.log('error');
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write('error');
      } else {
        console.log('失敗したよ');
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write('なんだって？');
      }
      res.end();
    }
    // req.pipe(fs.createWriteStream('test.wav'));;
    // data.stt(req, callback);
    var testwav = fs.createWriteStream('test.wav');
    testwav.on('pipe', function(){
      data.stt(req, callback);
    });
    req.pipe(testwav);
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
  } else if('/obj/Beer.obj' == url) {
    fs.readFile('./'+url, {encoding: null},function (err, data) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(data);
        res.end();
    });
  } else if('/obj/Beer.mtl' == url) {
    fs.readFile('./'+url, {encoding: null},function (err, data) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(data);
        res.end();
    });
  } else if('/obj/Beer_BaseColor.png' == url) {
    fs.readFile('./'+url, {encoding: null},function (err, data) {
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.write(data);
        res.end();
    });
  } else if('/bot' == url) {
  } else if('/tts' == url) {
    var data = require('./tts.js');
    function callback(options, convertText) {
      res.writeHead(200, {'Content-Type': 'audio/x-wav'});
      res.on('end', function(){
        res.end();
      });
      request(options, convertText).pipe(res)
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
  } else if('/test.wav' == url) {
    fs.readFile('./test.wav',function (err, data) {
      res.writeHead(200, {
        'Content-Type': 'audio/wav',
        'Cache-Control': "no-cache"
      });
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

