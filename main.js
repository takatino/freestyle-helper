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


const maxwords_onscreen = 36;
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
offScreen = [];

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

    while (offScreen.length < maxwords_onscreen) {
        offScreen.push(queue.pop());
        //[wordstring, x, y, speed]
    }

    tempOnSL = onScreen.length;
    for (i = tempOnSL - 1; i >= 0; i--) {
        onScreen[i][2] += onScreen[i][3];
        if (onScreen[i][2] > rect.height + fontsize*devicePixelRatio) {
            onScreen.splice(i, 1);
        }
    }

    tempOffSL = offScreen.length;
    for (i = tempOffSL - 1; i >= 0; i--) {
        offScreen[i][2] += offScreen[i][3];
        if (offScreen[i][2] > -10 - fontsize * devicePixelRatio) {
            onScreen.push(offScreen[i]);
            offScreen.splice(i, 1);
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
    
    zone = [Math.floor(Math.random() * (rect.width - fontsize * 4)), Math.floor(Math.random() * rect.height - 2 * fontsize * 1.5)];
    radius = rect.width / 4;
    for (x = 0; x < randselector.length; x++) {
        i = randselector[x];
        newx = zone[0] + Math.floor(Math.random() * 2 * radius - radius)/2 ;
        if (newx < 0) {
            newx = 0;
        }
        else if (newx > rect.width - 1.1 * fontsize * tempRhymes[i].length) {
            newx = rect.width - 1.1 * fontsize * tempRhymes[i].length;
        }
        newy = -rect.height + zone[1] + Math.floor(Math.random() * 2 * radius - radius)/4;
        newspeed = 0.2*(Math.random()) + 0.3;
        queue.push([tempRhymes[i], newx, newy, newspeed]);
    }
}


function main() {
    update();
    ctx.clearRect(0, 0, rect.width, rect.height);
    draw();
    window.requestAnimationFrame(main);
}

setup();

window.requestAnimationFrame(main);

