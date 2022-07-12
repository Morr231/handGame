const startGame = document.getElementById("start-game");
const platform = document.getElementById("platform");
const ball = document.getElementById("ball");
const endGame = document.getElementById("end-game");

const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");

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

let px = 0;
let py = 0;

const timer = document.getElementById("timer");
let timerCount = 0;

function runDetection() {
    model.detect(video).then((predictions) => {
        predictions.forEach((el) => {
            if (el.label === "open") {
                platform.style.top = `${2 * el.bbox[1]}px`;
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

ball.style.right = "60px";
ball.style.top = `${window.innerHeight / 2}px`;

let rightInterval;
let randomSide = Math.floor(Math.random() * 2);

let side = "left";

startGame.addEventListener("click", () => {
    startGame.style.display = "none";

    let minute = `${Math.floor(timerCount / 60 / 10)}${Math.floor(
        (timerCount / 60) % 10
    )}`;
    let sec = `${Math.floor((timerCount % 60) / 10)}${Math.floor(
        (timerCount % 60) % 10
    )}`;
    setInterval(() => {
        timer.innerHTML = minute + ":" + sec;
        timerCount++;
    }, 1000);

    console.log(ball.style.right);

    rightInterval = setInterval(() => {
        let ballCoords = ball.getBoundingClientRect();
        let platformCoords = platform.getBoundingClientRect();

        function isCollide(a, b) {
            return !(
                a.y + a.height < b.y ||
                a.y > b.y + b.height ||
                a.x + a.width < b.x ||
                a.x > b.x + b.width
            );
        }

        if (isCollide(ballCoords, platformCoords)) {
            side = "left";
        }

        if (side === "left") {
            ball.style.right = `${
                parseInt(ball.style.right.split("p")[0]) + 7
            }px`;
        } else {
            ball.style.right = `${
                parseInt(ball.style.right.split("p")[0]) - 7
            }px`;
        }

        if (randomSide == 0) {
            ball.style.top = `${parseInt(ball.style.top.split("p")[0]) + 7}px`;
        } else {
            ball.style.top = `${parseInt(ball.style.top.split("p")[0]) - 7}px`;
        }

        if (ballCoords.left <= 10) {
            if (side === "left") {
                side = "right";
            }
        }

        if (ballCoords.top <= 10) {
            if (randomSide == 1) {
                randomSide = 0;
            }
        }

        if (ballCoords.bottom + 10 >= window.innerHeight) {
            if (randomSide == 0) {
                randomSide = 1;
            }
        }

        if (ballCoords.right >= window.innerWidth - 10) {
            endGame.innerHTML = `You survived ${minute + ":" + sec}`;
            clearInterval(rightInterval);
            startGame.style.display = "block";
        }
    }, 1);
});
