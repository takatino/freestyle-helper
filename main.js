const canvas = document.getElementById("wordcanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// get current size of the canvas
rect = canvas.getBoundingClientRect();

// increase the actual size of our canvas
canvas.width = rect.width * devicePixelRatio;
canvas.height = rect.height * devicePixelRatio;

// ensure all drawing operations are scaled
ctx.scale(devicePixelRatio, devicePixelRatio);

// scale everything down using CSS
canvas.style.width = rect.width + 'px';
canvas.style.height = rect.height + 'px';

const loopspeed = 10;

const maxwords_onscreen = 64;
const fontsize = Math.floor(0.02 * rect.width + 16);

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
    while (queue.length < maxwords_onscreen + 1) {
        getrhymes();
    }
}

function draw() {
    ctx.font = fontsize + "px serif";
    for (item of onScreen) {
        ctx.globalAlpha = 0.6;
        ctx.fillText(item[0], item[1], item[2]);
    }
    ctx.globalAlpha = 1.0;
}

function update() {
    while (queue.length < maxwords_onscreen + 1) {
        getrhymes();
    }

    while (onScreen.length < maxwords_onscreen) {
        onScreen.push(queue.pop());
        //[wordstring, x, y, speed]
    }

    tempOSL = onScreen.length;
    for (i = tempOSL - 1; i >= 0; i--) {
        onScreen[i][2] += onScreen[i][3];
        if (onScreen[i][2] > rect.height + fontsize*devicePixelRatio) {
            onScreen.splice(i, 1);
        }
    }
}


function getrhymes() { //stores random rhyming words into queue
    randkeyint = Math.floor(Math.random() * (Object.keys(rhymeDict).length)); // random number between 0 ~ num of keys in rhymeDict
    randkey = Object.keys(rhymeDict)[randkeyint]; // finds key of that index
    tempRhymes = rhymeDict[randkey];
    randselector = [];
    
    while (randselector.length < 8 && randselector.length < tempRhymes.length) { // randomly selects 4 (or all if there are less than 4 total words) words
        x = Math.floor(Math.random() * tempRhymes.length);
        if (randselector.includes(x)) {
            continue;
        }
        randselector.push(x);
    }
    
    zone = [Math.floor(Math.random() * (rect.width -  fontsize *devicePixelRatio * 5)), Math.floor(Math.random() * rect.height / 3)];
    radius = rect.width / 5;
    for (i of randselector) {
        do {
            newx = zone[0] + Math.floor(Math.random() * radius - 0.5 * radius);
        } while (newx < 0 || newx > rect.width - tempRhymes[i].length*fontsize*devicePixelRatio);
        newy = (-rect.height + zone[1] + Math.floor(Math.random() * 2 * radius - radius)) - radius;
        newspeed = 0.1*(Math.random() + Math.random()) +0.3;
        queue.push([tempRhymes[i], newx, newy, newspeed]);
    }
}



setup();

let main = setInterval(() => {
    update();
    ctx.clearRect(0, 0, rect.width, rect.height);
    draw();

}, loopspeed);  

