const canvasTag = document.querySelector("canvas")
const context = canvasTag.getContext("2d")
const clientId = process.env.RR_KEY;
const currentSearch = document.getElementById("currentSearch")
const creatorTag = document.querySelector("#creator")
const searchInput = document.getElementById('searchTerm');
const credit = document.querySelector("#credit")
const altDescription = document.querySelector("#alt-description")
const flash = document.querySelector('#flash')

let aimX = null
let aimY = null
let aimZ = null
let currentX = null
let currentY = null
let i = 0
let searchWord = 'happiness';
let images = []
let slug = []

canvasTag.width = window.innerWidth * 2
canvasTag.height = window.innerHeight * 2

canvasTag.style.width = window.innerWidth + "px"
canvasTag.style.height = window.innerHeight + "px"

context.globalCompositeOperation = 'xor';

context.scale(2, 2)

searchInput.addEventListener('focus', function () {
    this.removeAttribute('placeholder');
});

searchInput.addEventListener('blur', function () {
    if (this.value === '') {
        this.setAttribute('placeholder', 'Search...');
    }
});

searchInput.addEventListener('click', function () {
    this.value = ""
});

const flashFunction = () => {

    flash.style.opacity = 1;

    setTimeout(() => {
        flash.style.opacity = 0;
    }, 100);
}

document.getElementById("searchForm").addEventListener("submit", function (event) {
    event.preventDefault();

    clearCanvas()

    searchWord = document.getElementById("searchTerm").value;
    //currentSearch.innerHTML = searchWord;
    searchTerm.value = 'Search...';
    credit.style.display = 'block'

    fetchRandomImage().then
    fetchRandomImage().then(function () {
        i = i + 2;
    }).then(flashFunction())

})

function fetchRandomImage() {
    const endpoint = `https://api.unsplash.com/photos/random?query=${searchWord}&client_id=${clientId}`;

    return fetch(endpoint)
        .then(response => response.json())
        .then(jsonData => {


            const imageUrl = jsonData.urls.small;
            const creator = jsonData.user.name;
            const username = jsonData.user.username;
            const slug = jsonData.alt_description;

            creatorTag.innerHTML = creator;
            creatorTag.setAttribute("href", `https://unsplash.com/@${username}?utm_source=pixel_mitosis&utm_medium=referral`);

            altDescription.innerHTML = slug;

            const image = document.createElement("img");
            image.src = imageUrl;
            images.push(image);
        });
}

canvasTag.addEventListener("click", function () {

    fetchRandomImage().then(function () {
        i = i + 1;
        context.clearRect(0, 0, canvasTag.width, canvasTag.height);
        credit.style.display = 'block'
    })
})

if (window.innerWidth > 768) {

    document.addEventListener("mousemove", function (event) {
        aimX = event.pageX;
        aimY = event.pageY;
        if (currentX === null) {
            currentX = event.pageX;
            currentY = event.pageY;
        }
    });
} else {

    aimX = window.innerWidth / 2
    aimY = window.innerWidth / 2
    currentX = 0
    currentY = 0

    window.addEventListener('deviceorientation', handleOrientation, true);

    function handleOrientation(event) {
        const y = event.beta;
        const x = event.gamma;
        const z = event.alpha;

        const screenWidth = window.innerWidth
        const screenHeight = window.innerHeight

        aimX = (x / 90) * (screenWidth / 2) + (screenWidth / 2);
        aimY = (y / 90) * (screenHeight / 2) + (screenHeight / 2);
    }

}

function clearCanvas() {
    context.clearRect(0, 0, canvasTag.width, canvasTag.height);
}

const draw = function () {
    if (currentX !== null && images[i]) {
        const maxRelativeHeight = 0.35 * window.innerHeight;
        const aspectRatio = images[i].width / images[i].height;
        const newWidth = maxRelativeHeight * aspectRatio;

        const imageX = currentX - (newWidth / 2);
        const imageY = currentY - (maxRelativeHeight / 2);

        context.drawImage(images[i], imageX, imageY, newWidth, maxRelativeHeight);

        currentX += (aimX - currentX) * 0.2;
        currentY += (aimY - currentY) * 0.2;

        setTimeout(() => {
            const loading = document.querySelector(".loading");
            loading.classList.add('loader-hidden');
        }, 1000)

    }
    requestAnimationFrame(draw);
};


fetchRandomImage().then(draw)


