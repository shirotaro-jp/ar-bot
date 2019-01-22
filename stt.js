"use strict";

// pull in the required packages.
var sdk = require("microsoft-cognitiveservices-speech-sdk");
var fs = require("fs");

// replace with your own subscription key,
// service region (e.g., "westus"), and
// the name of the file you want to run
// through the speech recognizer.
var subscriptionKey = "586252c420c649ff8ef5bf5cf7b8eab8";
var serviceRegion = "eastasia"; // e.g., "westus"
// var filename = "test.wav"; // 16000 Hz, Mono

exports.stt = function(file, callback) {
  // create the push stream we need for the speech sdk.
  var pushStream = sdk.AudioInputStream.createPushStream();


  // open the file and push it to the push stream.
  file.on('data', function(arrayBuffer) {
    pushStream.write(arrayBuffer.buffer);
  }).on('end', function() {
    pushStream.close();
  });


// ここでもう一度ファイルの読み込み直しができれば良さそう
// delete require.cache[require.resolve('./test.wav')] //追加1/9


var file = fs.createReadStream(filename);
file.on('data', function(arrayBuffer) {
  pushStream.write(arrayBuffer.buffer);
}).on('end', function() {
  pushStream.close();
});

  /*
  pushStream.write(file);
  pushStream.close();
  */

  // we are done with the setup
  //console.log("Now recognizing from: " + filename);
  console.log("ここまでok");

  // now create the audio-config pointing to our stream and
  // the speech config specifying the language.
  var audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
  var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);

  // setting the recognition language to English.
  // speechConfig.speechRecognitionLanguage = "en-US";
  speechConfig.speechRecognitionLanguage = "ja-JP";

  // create the speech recognizer.
  var recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  // start the recognizer and wait for a result.
  recognizer.recognizeOnceAsync(
    function (result) {
      console.log(result);

      recognizer.close();
      recognizer = undefined;
      callback(result);
    },
    function (err) {
      console.log("err - ");

      recognizer.close();
      recognizer = undefined;
      callback(false);
    });
}
