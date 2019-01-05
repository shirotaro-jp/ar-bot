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

var audioContext = new AudioContext();

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

    // $('#voice').empty();
    // $('#voice').append('<p>'+compassHeading+'差</p>');

    // AR表示切り替え
    var hourtoheading = hour * 30;
    if(hourtoheading >= 360){
        hourtoheading -= 360;
    }
    var headingdifference = compassHeading - hourtoheading;
    if(headingdifference < 0){
        headingdifference = headingdifference + 360;
    }
    // console.log(headingdifference);
    // $('#dev_info').append('<p>'+compassHeading+'差'+headingdifference+'</p>');

    var el = document.querySelector('#object');

    if(headingdifference < 90){
      //$('#test').html('<span>OK: '+visible_flag+'</span>');
      if(!visible_flag) {
        //$('#dev_arswitch').html('<span>ARだすよ！</span>');

        el.setAttribute('visible', true);
        visible_flag = true;
      }
    }else{
      //$('#test').html('<span>NG: '+visible_flag+'</span>');
      if(visible_flag) {
        //$('#dev_arswitch').html('<span>ARださないよ！</span>');

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

          var myURL = window.URL || window.webkitURL;
          var url = myURL.createObjectURL(audioBlob);
          return url;
        };

var localMediaStream = null;
var localScriptProcessor = null;
var audioData = []; // 録音データ

var bufferSize = 2048;

var onAudioProcess = function(e) {
  var input = e.inputBuffer.getChannelData(0);
  var bufferData = new Float32Array(bufferSize);
  for (var i = 0; i < bufferSize; i++) {
    bufferData[i] = input[i];
  }

  audioData.push(bufferData);
};

window.onload = function(){
  //let shouldStop = false;
  //let stopped = false;
  var downloadLink = document.getElementById('download');
  var stopButton = document.getElementById('stop');

  stopButton.addEventListener('click', function() {
    //shouldStop = true;
    downloadLink.href = exportWAV(audioData);
    downloadLink.download = 'wavtest.wav';
  });

  var handleSuccess = function(stream) {
    localMediaStream = stream;
    var scriptProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1);
    localScriptProcessor = scriptProcessor;
    var mediastreamsource = audioContext.createMediaStreamSource(stream);
    mediastreamsource.connect(scriptProcessor);
    scriptProcessor.onaudioprocess = onAudioProcess;
    scriptProcessor.connect(audioContext.destination);
  };

  navigator.mediaDevices.getUserMedia({ audio: true }).then(handleSuccess);
};
