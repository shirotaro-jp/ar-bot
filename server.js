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
    //var out = fs.createWriteStream('test.wav');
    //req.pipe(out);

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

    /*
    var file = '';
    //req.setEncoding('utf8');
    req.on('data', function(chunk) {
      file += chunk;
    });
    req.on('end', function() {
      var data = require('./stt.js');
      function callback(d) {
        console.log(d.privText);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(d.privText);
        res.end();
      }
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write(file);
      res.end();
      //console.log(file);
      //var f = qs.parse(file);
      //console.log(f);
      //data.stt(file, callback);
    });
    */
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
  } else if('/bot' == url) {
  } else if('/tts' == url) {
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

