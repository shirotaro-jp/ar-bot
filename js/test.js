// 時間取得
var nowtime = new Date();
var hour = nowtime.getHours();
// console.log(hour+'時');
// $(function() {
//     $('#dev_info').append('<p>今'+hour+'時</p>');
// });

// ネットワーク種類　うまくいかない(localダメ)（httpsダメ）
// var network = navigator.connection.type;
// console.log('ネット接続 '+network);

var visible_flag = true;

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var AudioContext = window.AudioContext || window.webkitAudioContext || false;

var audioContext;
audioContext = new AudioContext();
audioContext.close();

// 位置情報取得
var compassHeading=1;

window.addEventListener('deviceorientation', function(event) {
  var degtorad = Math.PI / 180; // Degree-to-Radian conversion

  var _x = event.beta ? event.beta * degtorad : 0; // beta value
  var _y = event.gamma ? event.gamma * degtorad : 0; // gamma value
  var _z = event.alpha ? event.alpha * degtorad : 0; // alpha value

  //var cX = Math.cos(_x);
  var cY = Math.cos(_y);
  var cZ = Math.cos(_z);
  var sX = Math.sin(_x);
  var sY = Math.sin(_y);
  var sZ = Math.sin(_z);

  // Calculate Vx and Vy components
  var Vx = -cZ * sY - sZ * sX * cY;
  var Vy = -sZ * sY + cZ * sX * cY;

  // Calculate compass heading
  compassHeading = Math.atan(Vx / Vy);
  // Convert compass heading to use whole unit circle

  if (Vy < 0) {
      compassHeading += Math.PI;
  } else if (Vx < 0) {
      compassHeading += 2 * Math.PI;
  }

  compassHeading = compassHeading * ( 180 / Math.PI ); // Compass Heading (in degrees)

  // AR表示切り替え
  var hourtoheading = hour * 30;
  if(hourtoheading >= 360){
      hourtoheading -= 360;
  }
  var headingdifference = compassHeading - hourtoheading;
  if(headingdifference < 0){
      headingdifference = headingdifference + 360;
  }

  var el = document.querySelector('#object');

  if(headingdifference < 60){
    if(!visible_flag) {
      $('#ng').hide();
      el.setAttribute('visible', true);
      visible_flag = true;
    }
  }else{
    if(visible_flag) {
      $('#ng').show();
      el.setAttribute('visible', false);
      visible_flag = false;
    }
  }
});

var exportWAV = function(audioData) {
  var encodeWAV = function(samples, sampleRate) {
    var buffer = new ArrayBuffer(44 + samples.length * 2);
    var view = new DataView(buffer);

    var writeString = function(view, offset, string) {
      for (var i = 0; i < string.length; i++){
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    var floatTo16BitPCM = function(output, offset, input) {
      for (var i = 0; i < input.length; i++, offset += 2){
        var s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      }
    };

    writeString(view, 0, 'RIFF');  // RIFFヘッダ
    view.setUint32(4, 32 + samples.length * 2, true); // これ以降のファイルサイズ
    writeString(view, 8, 'WAVE'); // WAVEヘッダ
    writeString(view, 12, 'fmt '); // fmtチャンク
    view.setUint32(16, 16, true); // fmtチャンクのバイト数
    view.setUint16(20, 1, true); // フォーマットID
    view.setUint16(22, 1, true); // チャンネル数
    view.setUint32(24, sampleRate, true); // サンプリングレート
    view.setUint32(28, sampleRate * 2, true); // データ速度
    view.setUint16(32, 2, true); // ブロックサイズ
    view.setUint16(34, 16, true); // サンプルあたりのビット数
    writeString(view, 36, 'data'); // dataチャンク
    view.setUint32(40, samples.length * 2, true); // 波形データのバイト数
    floatTo16BitPCM(view, 44, samples); // 波形データ

    return view;
  };

  var mergeBuffers = function(audioData) {
    var sampleLength = 0;
    for (var i = 0; i < audioData.length; i++) {
      sampleLength += audioData[i].length;
    }
    var samples = new Float32Array(sampleLength);
    var sampleIdx = 0;
    for (i = 0; i < audioData.length; i++) {
      for (var j = 0; j < audioData[i].length; j++) {
        samples[sampleIdx] = audioData[i][j];
        sampleIdx++;
      }
    }
    return samples;
  };

  var dataview = encodeWAV(mergeBuffers(audioData), audioContext.sampleRate);
  var audioBlob = new Blob([dataview], { type: 'audio/wav' });

  return audioBlob;
  /*
  var myURL = window.URL || window.webkitURL;
  var url = myURL.createObjectURL(audioBlob);

  return url;
  */
};

var localMediaStream = null;
var localScriptProcessor = null;
var audioData = []; // 録音データ

var bufferSize = 2048;
var recordingFlg = false;

var onAudioProcess = function(e) {
  if (!recordingFlg) return;

  var input = e.inputBuffer.getChannelData(0);
  var bufferData = new Float32Array(bufferSize);
  for (var i = 0; i < bufferSize; i++) {
    bufferData[i] = input[i];
  }

  audioData.push(bufferData);
};

var handleSuccess = function(stream) {
  localMediaStream = stream;
  var scriptProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1);
  localScriptProcessor = scriptProcessor;
  var mediastreamsource = audioContext.createMediaStreamSource(stream);
  mediastreamsource.connect(scriptProcessor);
  scriptProcessor.onaudioprocess = onAudioProcess;
  scriptProcessor.connect(audioContext.destination);
};

/* -ここからbot-> */

var convId = '';
var watermark = '';

// conversationIdを発行する
function getBotId() {
  $.ajax({
      method: "POST",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer RJKvjbWnqEk.cwA.fqk.DO-WBUUfjWO-MGdM5FHIXbohcrqjbKhNdMVDw3hjE1w"
      },
      url: "https://directline.botframework.com/v3/directline/conversations",
      success: function(data){
        console.log(data);
        convId = data.conversationId; //globalに？
        console.log("ID: "+convId);
      }
    });
}

// Botにメッセージを送信する
function sendMessage(cId, msg, callback) {
  var user = "user_" + cId; // from用のユーザー名を作成します

  $.ajax({
    method: "POST",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer RJKvjbWnqEk.cwA.fqk.DO-WBUUfjWO-MGdM5FHIXbohcrqjbKhNdMVDw3hjE1w"
    },
    url: 'https://directline.botframework.com/v3/directline/conversations/' + cId + '/activities',
    data: JSON.stringify({
      "type": "message",
      "from": {
          "id": user
      },
      "text": msg
      }),
    success: function (obj) {
    　//console.log("メッセージを送りました！");
      getMessage(cId, watermark, callback);
    }
  });
}

// Botのメッセージを受信する
function getMessage(cId, wmark, callback) {
  var url;

  // ウォーターマークの有無により、URLの分岐
  if (wmark != '') {
    url = "https://directline.botframework.com/v3/directline/conversations/" + cId + "/activities?watermark=" + wmark;
  } else {
    url = "https://directline.botframework.com/v3/directline/conversations/" + cId + "/activities";
  }

  var messageText = '';
  var set_interval_id = setInterval(function(){
    if(messageText == ''){
      $.ajax({
        method: "GET",
        contentType: "application/json",
        headers: {
          Authorization: "Bearer RJKvjbWnqEk.cwA.fqk.DO-WBUUfjWO-MGdM5FHIXbohcrqjbKhNdMVDw3hjE1w"
        },
        url: url,
        success: function (data) {
          //console.log(JSON.stringify(data));
          watermark = data.watermark;
          data.activities.forEach(function(val){
            if(val.from.id == 'gs-night'){
              messageText = val.text;
              callback(val.text);
            }
          });
        }
      });
    } else {
      clearInterval(set_interval_id);
    }
  }, 1000);
}

// サウンドを再生
var playSound = function(buffer) {
  // source を作成
  var source = audioContext.createBufferSource();
  // buffer をセット
  source.buffer = buffer;
  // context に connect
  source.connect(audioContext.destination);
  // 再生
  source.start(0);
};

function string_to_buffer(src) {
  return (new Uint16Array([].map.call(src, function(c) {
    return c.charCodeAt(0)
  }))).buffer;
}

/* <-ここまでbot- */

$(document).ready(function(){
  $( "#ng" ).click(function() {
    alert( "周りを見渡して、おじさんを探してみてね！" );
  });


  // ** Start #1 **
  $('#start').click(function(){
    if(convId == '') {
      getBotId();
    }

    console.log('#1');

    audioData = []; // 録音データ
    console.log('state: '+audioContext.state);

//    audioContext.resume().then(() => {
      recordingFlg = true;
      $('#start').hide();
      $('#stop').show();
//    });

  });

  // ** Stop #2 **
  $('#stop').click(function() {
    $('#stop').hide();

  //  audioContext.suspend().then(() => {
      recordingFlg = false;

      var wav = exportWAV(audioData);
      console.log("#2", wav);

      var oReq = new XMLHttpRequest();
      oReq.open("POST", 'stt', true);
      oReq.onload = function (oEvent) {
        var message = oEvent.target.response;
        console.log("#3", message);
        sendMessage(convId, message, function(retMessage){
          console.log("#4", retMessage);
          $('#botText').append('<p>'+retMessage+'</p>');

          var req = new XMLHttpRequest();
          req.open("POST", '/tts', true);
          req.responseType = "arraybuffer";
          req.setRequestHeader("Content-Type", "application/json");
          req.onreadystatechange = function (oEvent) { // 状態が変化すると関数が呼び出されます。
            if (req.readyState === 4) {
              if (req.status === 0 || req.status === 200) {
                var resWav = req.response;
                console.log('#5', resWav);
                // サウンドを読み込む

                audioContext.decodeAudioData(resWav, function(buffer) {
                  console.log('play');
                  // コールバックを実行
                  playSound(buffer);
                });

                $('#start').show();
              }
            }
          }
          req.send(JSON.stringify({"data": retMessage}));
        });
      };

      oReq.send(wav);
//    });
  });

  audioContext = new AudioContext();
  navigator.mediaDevices.getUserMedia({ audio: true }).then(handleSuccess);
});
