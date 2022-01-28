

let startButton = document.getElementById("startButton");


// let title = document.getElementById("recorderTitle").innerText

// title.addEventListener("click", () => {

// alert("works")

// })
  
// let value = Number(document.getElementById("value").value)*1000

//not sure why doesnt work
//let recordingTimeMS = Number(value)*5000;

// let clear = document.getElementById("clearButton")

// clear.addEventListener("click", function() {
// document.getElementById("valueNumber").innerHTML = 0
// })

function clears(){
  
  document.getElementById("valueNumber").value = ""

  console.log('clear')  
  
  document.getElementById('volumeRange').value = 70
  
  document.getElementById('rangevalue').value = 70
  
  document.getElementById("log").innerHTML = ""
}

function log(msg) {

  let logElement = document.getElementById("log");

  logElement.innerHTML = msg + "\n";

}

function wait(delayInMS) {

  return new Promise(resolve => setTimeout(resolve, delayInMS));

}

function startRecording(stream) {
  //
  let recorder = new MediaRecorder(stream);
  
  let data = [];

recorder.ondataavailable = event => data.push(event.data);
  
  recorder.start();

  //log(recorder.state + " for " + (lengthInMS/1000) + " Seconds...");

  let stopped = new Promise((resolve, reject) => {
    
    recorder.onstop = resolve;

    recorder.onerror = event => reject(event.name);

  });

 let record = recorder.state == "recording"
  
  // let recorded = wait(10000).then(
  //   () => recorder.state == "recording" && recorder.stop()
  // );
  
console.log(recorder.state);
  
  return Promise.all([

    stopped,
    
    record
  
  ])
    
    .then(() => data);
  
}

function stop() {
  
  let streams = document.getElementById("preview").srcObject
  
  console.log(streams)
  
  streams.getTracks().forEach(track => track.stop());

}

function start(){

  console.log("Recording for " + Number(document.getElementById("valueNumber").value) * 1 + " minutes"),
  
    navigator.mediaDevices.getUserMedia({
    
    video: false,
    
    audio: true
      
    }).then(stream => {
    let recording = document.getElementById("recording");
    let downloadButton = document.getElementById("downloadButton");
    let preview = document.getElementById("preview");
    preview.srcObject = stream;
    downloadButton.href = stream;
    preview.captureStream = preview.captureStream || preview.mozCaptureStream;
    return new Promise(resolve => preview.onplaying = resolve);
    }).then(() => startRecording(preview.captureStream(),
      0
    ))
  
    .then(recordedChunks => {
    let recordedBlob = new Blob(recordedChunks, { type: "audio/mp3" });
    recording.src = URL.createObjectURL(recordedBlob);
    downloadButton.href = recording.src;
    downloadButton.download = "RecordedVideo.mp3";

    log("Successfully recorded " + recordedBlob.size + " bytes of " +
      recordedBlob.type + " media." , document.getElementById("downloadButton").style.display = "flex");
  })
  
  .catch(log);
}

function stopButton() {
  
  let preview = document.getElementById("preview").srcObject;
  
  stop(preview.srcObject);

  console.log(preview.srcObject)

  log("Recording Loading")
  
  console.log("stopped")

}

var pre = document.querySelector('pre');

var video = document.querySelector('video');

var myScript = document.querySelector('script');

var range = document.getElementById('rangeInput');

// getUserMedia block - grab stream
// put it into a MediaStreamAudioSourceNode
// also output the visuals into a video element

if (navigator.mediaDevices) {
    
  console.log('getUserMedia supported.');
  
  navigator.mediaDevices.getUserMedia({ audio: true, video: false })
  
    .then(function (stream) {
      
      video.srcObject = stream;
        
      video.onloadedmetadata = function (e) {
          
          video.play();
          
            video.muted = true;
        };
      
        // Create a MediaStreamAudioSourceNode
        // Feed the HTMLMediaElement into it
        var audioCtx = new AudioContext();
        var source = audioCtx.createMediaStreamSource(stream);

        // Create a biquadfilter
        var biquadFilter = audioCtx.createBiquadFilter();
        biquadFilter.type = "lowshelf";
        biquadFilter.frequency.value = 1000;
        biquadFilter.gain.value = range.value;

        // connect the AudioBufferSourceNode to the gainNode
        // and the gainNode to the destination, so we can play the
        // music and adjust the volume using the mouse cursor
        source.connect(biquadFilter);
        biquadFilter.connect(audioCtx.destination);

        // Get new mouse pointer coordinates when mouse is moved
        // then set new gain value

      range.oninput = function () {
          
      biquadFilter.gain.value = range.value;
      
      }
      
      source.connect(analyser);
      analyser.connect(distortion);
      distortion.connect(audioCtx.destination);

      

    })
      
    .catch(function(err) {
      
      console.log('The following gUM error occurred: ' + err);
      
    });
  
} else {
  
  console.log('getUserMedia not supported on your browser!');

}

// dump script to pre element

pre.innerHTML = myScript.innerHTML;

const rangeInputs = document.querySelectorAll('input[type="range"]')

const numberInput = document.querySelector('input[type="number"]')

function handleInputChange(e) {
  let target = e.target
  if (e.target.type !== 'range') {
    target = document.getElementById('volumeRange')
  } 
  
  const min = target.min
  const max = target.max
  const val = target.value
  
  target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%'
}

rangeInputs.forEach(input => {
  input.addEventListener('input', handleInputChange)
})

numberInput.addEventListener('input', handleInputChange)


