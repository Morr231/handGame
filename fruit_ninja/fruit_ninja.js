const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const cursor = document.getElementById("cursor");

const context = canvas.getContext("2d");

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

function isCollide(a, b) {
    return !(
        a.y + a.height < b.y ||
        a.y > b.y + b.height ||
        a.x + a.width < b.x ||
        a.x > b.x + b.width
    );
}

function runDetection() {
    model.detect(video).then((predictions) => {
        predictions.forEach((el) => {
            if (el.label === "open") {
                cursor.setAttribute("src", "./fruit/open.png");
                cursor.style.left = `${3.5 * el.bbox[0]}px`;
                cursor.style.top = `${3.5 * el.bbox[1]}px`;
            } else if (el.label === "closed") {
                cursor.setAttribute("src", "./fruit/closed.png");
                cursor.style.left = `${3.5 * el.bbox[0]}px`;
                cursor.style.top = `${3.5 * el.bbox[1]}px`;
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
});
