const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");

const resultCanvas = document.getElementById("result");
const ctx = resultCanvas.getContext("2d");
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

            if (
                el.label === "open"
            ) {
                ctx.beginPath();

                if (px == 0 && py == 0) {
                    ctx.moveTo(el.bbox[0] - 1, el.bbox[1] - 1);
                } else {
                    ctx.moveTo(px, py);
                }
                ctx.lineTo(el.bbox[0], el.bbox[1]);

                ctx.stroke();
                ctx.closePath();

                // console.log(el.bbox);
                px = el.bbox[0];
                py = el.bbox[1];
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
    updateNote.innerText = "Loaded Model!";
    trackButton.disabled = false;
});