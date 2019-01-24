// Requires request for HTTP requests
const request = require('request');
// Requires fs to write synthesized speech to a file
const fs = require('fs');
// Requires readline-sync to read command line inputs
//const readline = require('readline-sync');

/*
 * These lines will attempt to read your subscription key from an environment
 * variable. If you prefer to hardcode the subscription key for ease of use,
 * replace process.env.SUBSCRIPTION_KEY with your subscription key as a string.
 */
const subscriptionKey = "586252c420c649ff8ef5bf5cf7b8eab8";
if (!subscriptionKey) {
  throw new Error('Environment variable for your subscription key is not set.')
};

// Prompts the user to input text.
//let text = readline.question('What would you like to convert to speech? ');


function textToSpeech(subscriptionKey, saveAudio, text, callback) {
    let options = {
        method: 'POST',
        uri: 'https://eastasia.api.cognitive.microsoft.com/sts/v1.0/issuetoken',
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    };
    // This function retrieve the access token and is passed as callback
    // to request below.
    function getToken(error, response, body) {
        console.log("Getting your token...\n")
        if (!error && response.statusCode == 200) {
            //This is the callback to our saveAudio function.
            // It takes a single argument, which is the returned accessToken.
            saveAudio(body, text, callback);
        }
        else {
          throw new Error(error);
        }
    }
    request(options, getToken)
}


// Make sure to update User-Agent with the name of your resource.
// You can also change the voice and output formats. See:
// https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support#text-to-speech
function saveAudio(accessToken, text, callback) {
    let options = {
        method: 'POST',
        baseUrl: 'https://eastasia.tts.speech.microsoft.com',
        url: 'cognitiveservices/v1',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'cache-control': 'no-cache',
            'User-Agent': 'gs-night',
            'X-Microsoft-OutputFormat': 'riff-24khz-16bit-mono-pcm',
            'Content-Type': 'application/ssml+xml'
        },
        body: '<speak version=\'1.0\' xmlns="http://www.w3.org/2001/10/synthesis" xml:lang=\'ja-JP\'>\n<voice  name=\'Microsoft Server Speech Text to Speech Voice (ja-JP, Ichiro, Apollo)\'>' + text + '</voice> </speak>'
    };
    // This function makes the request to convert speech to text.
    // The speech is returned as the response.
    function convertText(error, response, body){
      if (!error && response.statusCode == 200) {
        console.log("Converting text-to-speech. Please hold...\n")
      }
      else {
        throw new Error(error);
      }
      console.log("Your file is ready.\n");
    }
    // Pipe the response to file.
    // request(options, convertText).pipe(fs.createWriteStream('sample.wav'));
    callback(options, convertText);
}

exports.tts = function(text, callback) {
  // Start the sample app.
  textToSpeech(subscriptionKey, saveAudio, text, callback);
}
