const trashes = [
    {
        img: "./sort-img/trash-icon/bottle.png",
        type: "glass",
    },
    {
        img: "./sort-img/trash-icon/glass-of-water.png",
        type: "glass",
    },
    {
        img: "./sort-img/trash-icon/wine-glass.png",
        type: "glass",
    },
    {
        img: "./sort-img/trash-icon/paper.png",
        type: "paper",
    },
    {
        img: "./sort-img/trash-icon/paper (1).png",
        type: "paper",
    },
    {
        img: "./sort-img/trash-icon/paper-airplane.png",
        type: "paper",
    },
    {
        img: "./sort-img/trash-icon/plastic-bag.png",
        type: "plastic",
    },
    {
        img: "./sort-img/trash-icon/plastic-glass.png",
        type: "plastic",
    },
    {
        img: "./sort-img/trash-icon/water.png",
        type: "plastic",
    },
];

const trashFirst = document.getElementById("trash-1");
const trashSecond = document.getElementById("trash-2");
const trashThird = document.getElementById("trash-3");

const trashContainerFirst = document.getElementById("trash-container-1");
const trashContainerSecond = document.getElementById("trash-container-2");
const trashContainerThird = document.getElementById("trash-container-3");

const trashImg = [
    { img: trashFirst, id: -1 },
    { img: trashSecond, id: -1 },
    { img: trashThird, id: -1 },
];

const randomNumbers = [
    Math.floor(Math.random() * trashes.length),
    Math.floor(Math.random() * trashes.length),
    Math.floor(Math.random() * trashes.length),
];

randomNumbers.forEach((el, index) => {
    trashImg[index].img.setAttribute("src", trashes[el].img);
    trashImg[index].id = el;
});

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
                cursor.setAttribute("src", "./sort-img/open.png");
                cursor.style.left = `${3.5 * el.bbox[0]}px`;
                cursor.style.top = `${3.5 * el.bbox[1]}px`;
            } else if (el.label === "closed") {
                cursor.setAttribute("src", "./sort-img/closed.png");
                cursor.style.left = `${3.5 * el.bbox[0]}px`;
                cursor.style.top = `${3.5 * el.bbox[1]}px`;

                if (
                    isCollide(
                        trashImg[0].img.getBoundingClientRect(),
                        cursor.getBoundingClientRect()
                    )
                ) {
                    trashImg[0].img.style.left = `${
                        parseInt(cursor.style.left.split("p")[0]) - 150
                    }px`;
                    trashImg[0].img.style.top = `${parseInt(
                        cursor.style.top.split("p")[0]
                    )}px`;
                } else if (
                    isCollide(
                        trashImg[1].img.getBoundingClientRect(),
                        cursor.getBoundingClientRect()
                    )
                ) {
                    trashImg[1].img.style.left = `${
                        parseInt(cursor.style.left.split("p")[0]) - 150
                    }px`;
                    trashImg[1].img.style.top = `${parseInt(
                        cursor.style.top.split("p")[0]
                    )}px`;
                } else if (
                    isCollide(
                        trashImg[2].img.getBoundingClientRect(),
                        cursor.getBoundingClientRect()
                    )
                ) {
                    trashImg[2].img.style.left = `${
                        parseInt(cursor.style.left.split("p")[0]) - 150
                    }px`;
                    trashImg[2].img.style.top = `${parseInt(
                        cursor.style.top.split("p")[0]
                    )}px`;
                }

                trashImg.forEach((el) => {
                    if (trashes[el.id].type === "plastic") {
                        if (
                            isCollide(
                                el.img.getBoundingClientRect(),
                                trashContainerFirst.getBoundingClientRect()
                            )
                        ) {
                            el.img.style.display = "none";
                        }
                    }
                    if (trashes[el.id].type === "glass") {
                        if (
                            isCollide(
                                el.img.getBoundingClientRect(),
                                trashContainerSecond.getBoundingClientRect()
                            )
                        ) {
                            el.img.style.display = "none";
                        }
                    }
                    if (trashes[el.id].type === "paper") {
                        if (
                            isCollide(
                                el.img.getBoundingClientRect(),
                                trashContainerThird.getBoundingClientRect()
                            )
                        ) {
                            el.img.style.display = "none";
                        }
                    }
                });
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
