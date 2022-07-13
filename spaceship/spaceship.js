const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");

const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let spaceship = document.getElementById("spaceship");
let gameZone = document.getElementById("gameZone");

let endGame = document.getElementById("gameOver");

let gameZoneWidth = gameZone.clientWidth;
let gameZoneHeight = gameZone.clientHeight;
let gameZoneRect = gameZone.getBoundingClientRect();

let asteroid = document.createElement("img");
let asteroidTop = 100;
let asteroidArray = [];
let asteroidCoords = [];

let gameOver = false;
// let updateNote = document.getElementById("updatenote");

let isVideo = false;
let model = null;
let start = null;

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

function startGame() {
    createAsteroids();
    moveAsteroid();
}

function createAsteroids() {
    for (let i = 0; i < 2; i++) {
        let x = Math.floor(Math.random() * gameZoneWidth) + gameZoneRect.left;
        let asteroid = document.createElement("img");

        asteroid.setAttribute("src", "./assets/asteroid.png");
        asteroid.setAttribute("class", "asteroid");
        asteroid.style.left = `${x}px`;
        asteroidArray.push(asteroid);
        gameZone.appendChild(asteroid);
    }
}

px = 0;
py = 0;

let bulletInterval;

function runDetection() {
    model.detect(video).then((predictions) => {
        predictions.forEach((el) => {
            if (el.label === "open") {
                if (
                    el.bbox[0] * 2 > gameZoneRect.left &&
                    el.bbox[0] * 2 < gameZoneWidth + 30
                )
                    spaceship.style.left = `${el.bbox[0] * 2}px`;
            }
            // else if (el.label === "closed") {
            //     let bullet = document.createElement("div");
            //     bullet.setAttribute("class", "bullet");
            //     bullet.style.position = "absolute";

            //     bullet.style.left = `${spaceship.style.left}px`;
            //     bullet.style.bottom = `${spaceship.style.bottom}px`;
            //     gameZone.appendChild(bullet);

            //     console.log(bullet.style.left);

            //     bulletInterval = setInterval(() => {
            //         bullet.style.bottom = `${
            //             parseInt(bullet.style.bottom.split("p")[0]) - 7
            //         }px`;
            //     }, 100);
            // }
        });

        model.renderPredictions(predictions, canvas, context, video);
        if (isVideo) {
            requestAnimationFrame(runDetection);
        }
    });
}

function moveAsteroid() {
    setInterval(() => {
        if (asteroidTop < 700) {
            asteroidTop += 3;
            for (let i = 0; i < 2; i++) {
                asteroidArray[i].style.top = `${asteroidTop}px`;
                if (checkCollide(asteroidArray[i], spaceship)) {
                    for (let i = 0; i < asteroidArray.length; i++) {
                        gameZone.removeChild(asteroidArray[i]);
                        gameOver = true;
                        finishGame();
                    }
                }
            }
        } else if (!gameOver) {
            for (let i = 0; i < 2; i++) {
                gameZone.removeChild(asteroidArray[i]);
                asteroidTop = 0;
            }
            asteroidArray = [];
            createAsteroids();
            moveAsteroid();
        }
    }, 5);
}

function finishGame() {
    endGame.style.display = `block`;
    handTrack.stopVideo(video);
    isVideo = false;
}

function checkCollide(asteroid, spaceship) {
    let asteroidRect = asteroid.getBoundingClientRect();
    let spaceshipRect = spaceship.getBoundingClientRect();
    return !(
        asteroidRect.y + asteroidRect.height < spaceshipRect.y ||
        asteroidRect.x + asteroidRect.width < spaceshipRect.x ||
        asteroidRect.x > spaceshipRect.x + spaceship.width
    );
}

// Load the model.
handTrack.load(modelParams).then((lmodel) => {
    // detect objects in the image.

    model = lmodel;
    trackButton.disabled = false;
});
