const canvas = document.getElementById("wordcanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const loopspeed = 0;

rhymeDict = {}
$.get('./rhymedict.json', function(response){
    rhymeDict = response;
})

queue = []

function setup() {
    
}

function draw() {
    ctx.font = "48px serif";
    ctx.fillText("あ", 0, 48);
}

function update() {
    //
}


function getrhymes(queue) { //stores random rhyming words into queue
    randkeyint = Math.floor(Math.random() * Object.keys(rhymeDict).length); // random number between 0 ~ num of keys in rhymeDict
    randkey = Object.keys(rhymeDict)[randkeyint]; // finds key of that index
    tempRhymes = rhymeDict[randkey];

    randselector = []
    while (randselector.length < 4 && randselector.length < tempRhymes.length) { // randomly selects 4 (or all if there are less than 4 total words) words
        x = Math.floor(Math.random() * tempRhymes.length);
        if (randselector.includes(x)) {
            continue;
        }
        randselector.push(x);
        
    }
    for (i of randselector) {
        queue.push(tempRhymes[i]);
    }

    return;
}



setup();

let main = setInterval(() => {
    update();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();

}, loopspeed);  

