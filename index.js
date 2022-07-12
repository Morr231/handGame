const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");

const resultCanvas = document.getElementById("result");
const ctx = resultCanvas.getContext("2d");

ctx.strokeStyle = "BADA55";
ctx.lineJoin = "round";
ctx.lineCap = "round";
ctx.lineWidth = 100;

const draw = ({}) => {
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    [lastX, lastY] = [e.offsetX, e.offsetY];
    ctx.stroke();
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;

    hue++;
    if (hue >= 360) {
        hue = 0;
    }

    if (ctx.lineWidth >= 100 || ctx.lineWidth <= 1) {
        direction = !direction;
    }
    if (direction) {
        ctx.lineWidth++;
    } else {
        ctx.lineWidth--;
    }
};

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let hue = 0;
let direction = true;

const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");

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
            updateNote.innerText = "Video started. Now tracking";
            isVideo = true;
            runDetection();
        } else {
            updateNote.innerText = "Please enable video";
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Starting video";
        startVideo();
    } else {
        updateNote.innerText = "Stopping video";
        handTrack.stopVideo(video);
        isVideo = false;
        updateNote.innerText = "Video stopped";
    }
}

function runDetection() {
    model.detect(video).then((predictions) => {
        // console.log("Predictions: ", predictions);

        predictions.forEach((el) => {
            if (el.label === "open") {
                ctx.beginPath();
                // ctx.moveTo(el.bbox[0] - 1, el.bbox[1] - 1);
                ctx.lineTo(el.bbox[0], el.bbox[1]);

                ctx.stroke();
                ctx.closePath();

                // ctx.fillRect(el.bbox[0], el.bbox[1], 5, 5);
                console.log(el.bbox);
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
