const logos = [
    {
        company: "Qazaq Republic",
        img: "./logos/qr.png",
    },
    {
        company: "Kaspi",
        img: "./logos/kaspi.png",
    },
    {
        company: "Apple",
        img: "./logos/apple.png",
    },
    {
        company: "Audi",
        img: "./logos/audi.png",
    },
    {
        company: "Kaz Munai Gaz",
        img: "./logos/kmg.png",
    },
];

const generatorImg = document.getElementById("generator-img");
const generatorButton = document.getElementById("generator-button");
const generatorCompany = document.getElementById("company");

const nextButton = document.getElementById("next-button");

let index = 0;
generatorCompany.innerHTML = logos[index].company;

generatorButton.addEventListener("click", () => {
    generatorImg.style.display = "block";

    generatorImg.setAttribute("src", logos[index].img);

    generatorButton.style.display = "none";
    nextButton.style.display = "block";
});

nextButton.addEventListener("click", () => {
    console.log("Clicked");

    generatorImg.style.display = "none";
    index++;
    generatorCompany.innerHTML = logos[index].company;
    generatorButton.style.display = "block";
    nextButton.style.display = "none";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log(index);
});
