const canvas = document.getElementById("wordcanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const loopspeed = 10;

const maxwords_onscreen = 36;
const fontsize = Math.floor(0.02 * canvas.width + 16);

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
    for (i = 0; i < 10; i++) {
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
    while (queue.length < 12) {
        getrhymes();
    }

    while (onScreen.length < maxwords_onscreen) {
        newword = queue.pop()
        onScreen.push([newword, Math.floor(Math.random() * (canvas.width - 48*newword.length)), Math.floor(Math.random() * -canvas.height), 0.5*Math.random()+0.5]);
        //[wordstring, x, y, speed]
    }

    tempOSL = onScreen.length;
    for (i = tempOSL - 1; i >= 0; i--) {
        onScreen[i][2] += onScreen[i][3];
        if (onScreen[i][2] > canvas.height + 100) {
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

