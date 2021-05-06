const canvas = document.getElementById("wordcanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const loopspeed = 0;


function setup() {
    // setup function
}

function draw() {
    ctx.font = "48px serif";
    ctx.fillText("あ", 0, 48);
}

function update() {
    //
}


function getrhyme(word) {
    
}



setup();

let main = setInterval(() => {
    update();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();

}, loopspeed);  

$.get( "http://www.google.com/", function( data ) {
    console.log(data);     
});