const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");

const resultCanvas = document.getElementById("result");
const ctx = resultCanvas.getContext("2d");

const openCursor = document.getElementById('open-cursor')
const closeCursor = document.getElementById('close-cursor')

const imanbek = document.getElementById('imanbek')
const roza = document.getElementById('roza')
const sailaubek = document.getElementById('sailaubek')

const imanbekSong = new Audio('./songs/imanbek.mp3');
const rozaSong = new Audio('./songs/roza.mp3');
const sailaubekSong = new Audio('./songs/sailaubek.mp3');

ctx.lineWidth = 7;
ctx.strokeStyle = `hsla(16, 88%, 54%, 1)`;

const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");
// let updateNote = document.getElementById("updatenote");

let isVideo = false;
let model = null;

const modelParams = {
    flipHorizontal: true, // flip e.g for video
    maxNumBoxes: 20, // maximum number of boxes to detect
    iouThreshold: 0.5, // ioU threshold for non-max suppression
    scoreThreshold: 0.6, // confidence threshold for predictions.
};

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            // updateNote.innerText = "Video started. Now tracking";
            isVideo = true;
            runDetection();
        } else {
            // updateNote.innerText = "Please enable video";
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        // updateNote.innerText = "Starting video";
        startVideo();
    } else {
        // updateNote.innerText = "Stopping video";
        handTrack.stopVideo(video);
        isVideo = false;
        // updateNote.innerText = "Video stopped";
    }
}

px = 0;
py = 0;

function runDetection() {
    model.detect(video).then((predictions) => {
        // console.log("Predictions: ", predictions);

        predictions.forEach((el) => {
            // console.log(el);
            let canvasRect = canvas.getBoundingClientRect()

            let imanbekRect = imanbek.getBoundingClientRect()
            let rozaRect = roza.getBoundingClientRect()
            let sailaubekRect = sailaubek.getBoundingClientRect()

            if (el.label === "open") {
                openCursor.className = 'enabled'
                closeCursor.className = 'disabled'
                let top = el.bbox[1] + canvasRect.bottom
                let left = el.bbox[0] + canvasRect.left - 100
                openCursor.style.top = `${top}px`
                openCursor.style.left = `${left}px`
                openCursor.style.top = `${el.bbox[1] + canvasRect.bottom}px`
                openCursor.style.left = `${el.bbox[0] + canvasRect.left - 100}px`
                if (top <= imanbekRect.bottom && top >= imanbekRect.top && left >= imanbekRect.left && left <= imanbekRect.right) {
                    imanbekSong.play()
                }

                else if (top <= rozaRect.bottom && top >= rozaRect.top && left >= rozaRect.left && left <= rozaRect.right) {
                    rozaSong.play()
                }

                else if (top <= sailaubekRect.bottom && top >= sailaubekRect.top && left >= sailaubekRect.left && left <= sailaubekRect.right) {
                    sailaubekSong.play()
                }
            }
            else if (el.label === "closed") {
                closeCursor.className = 'enabled'
                openCursor.className = 'disabled'
                let top = el.bbox[1] + canvasRect.bottom
                let left = el.bbox[0] + canvasRect.left - 100
                closeCursor.style.top = `${top}px`
                closeCursor.style.left = `${left}px`
                if (top <= imanbekRect.bottom && top >= imanbekRect.top && left >= imanbekRect.left && left <= imanbekRect.right) {
                    imanbekSong.pause()
                }

                else if (top <= rozaRect.bottom && top >= rozaRect.top && left >= rozaRect.left && left <= rozaRect.right) {
                    rozaSong.pause()
                }

                else if (top <= sailaubekRect.bottom && top >= sailaubekRect.top && left >= sailaubekRect.left && left <= sailaubekRect.right) {
                    sailaubekSong.pause()
                }
            }
        });

        model.renderPredictions(predictions, canvas, context, video);
        if (isVideo) {
            requestAnimationFrame(runDetection);
        }
    });
}

// Load the model.
handTrack.load(modelParams).then((lmodel) => {
    // detect objects in the image.

    model = lmodel;
    trackButton.disabled = false;
});