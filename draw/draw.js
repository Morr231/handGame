const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");

const resultCanvas = document.getElementById("result");
const ctx = resultCanvas.getContext("2d");
ctx.lineWidth = 4;

const context = canvas.getContext("2d");
const trackButton = document.getElementById("trackbutton");

const clearButton = document.getElementById("clear-button");

let isVideo = false;
let model = null;

const modelParams = {
    flipHorizontal: true,
    maxNumBoxes: 20,
    iouThreshold: 0.5,
    scoreThreshold: 0.6,
};

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            isVideo = true;
            runDetection();
        } else {
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        startVideo();
    } else {
        handTrack.stopVideo(video);
        isVideo = false;
    }
}

let px = 0;
let py = 0;

function runDetection() {
    model.detect(video).then((predictions) => {
        predictions.forEach((el) => {
            console.log(el);

            if (el.label === "open") {
                ctx.beginPath();

                if (px == 0 && py == 0) {
                    ctx.moveTo(el.bbox[0] - 1, el.bbox[1] - 1);
                } else {
                    ctx.moveTo(px, py);
                }
                ctx.lineTo(el.bbox[0], el.bbox[1]);

                ctx.stroke();
                ctx.closePath();

                console.log(el.bbox);
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

handTrack.load(modelParams).then((lmodel) => {
    model = lmodel;
    trackButton.disabled = false;
});

clearButton.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});
