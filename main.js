const canvas = document.getElementById("wordcanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const loopspeed = 0;

rhymeDict = {};
$.get({
    url:'./rhymedict.json',
    async: false}, 
    function(response) {
        rhymeDict = response;
    })


queue = [];
onScreen = [];

function setup() {
    getrhymes();
}

function draw() {
    ctx.font = "48px serif";
    for (item of onScreen) {
        ctx.fillText(item[0], item[1], item[2]);
    }
}

function update() {

    if (queue.length < 12) {
        getrhymes();
    }

    if (onScreen.length < 4) {
        onScreen.push([queue.pop(), Math.floor(Math.random() * canvas.width), 0]);
    }

    for (item of onScreen) {
        item[2] += 1;
        if (item[2] > canvas.height + 100) {
            onScreen.pop(item);
        }
    }
}


function getrhymes() { //stores random rhyming words into queue
    randkeyint = Math.floor(Math.random() * (Object.keys(rhymeDict).length)); // random number between 0 ~ num of keys in rhymeDict
    randkey = Object.keys(rhymeDict)[randkeyint]; // finds key of that index
    tempRhymes = rhymeDict[randkey];
    randselector = [];
    
    while (randselector.length < 4) { // randomly selects 4 (or all if there are less than 4 total words) words
        x = Math.floor(Math.random() * tempRhymes.length);
        if (randselector.includes(x)) {
            continue;
        }
        randselector.push(x);
    }
    
    for (i of randselector) {
        queue.push(tempRhymes[i]);
    }
}



setup();

let main = setInterval(() => {
    update();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();

}, loopspeed);  

