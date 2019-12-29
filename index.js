var player;

function startGame(){
    
    myGame.start();
    
}

var myGame = {
    wrapper : document.getElementById("wrapper"),
    canvas : document.getElementById("reflex-io"),
    start: function() {
        this.context = this.canvas.getContext("2d");
        window.addEventListener("resize", resizeCanvas, false);
        resizeCanvas();
        this.interval = setInterval(updateGame, 16.66667);
    },
    clear : function(){
        
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
        
    }
}

function setCanvasScaling(){
    return window.devicePixelRatio || 1;
}

function resizeCanvas() {
    var pixelRatio = setCanvasScaling();
    
    //The viewport is in portrait mode, so var width should be based off viewport WIDTH
    if (window.innerHeight > window.innerWidth) {
        //Makes the canvas 100% of the viewport width
        var width = Math.round(1.0 * window.innerWidth);
    }
    //The viewport is in landscape mode, so var width should be based off viewport HEIGHT
    else {
        //Makes the canvas 100% of the viewport height
        var width = Math.round(1.0 * window.innerHeight);
    }

    var height = width;

    myGame.wrapper.style.width = width-20 + "px";
    myGame.wrapper.style.height = height-20 + "px";

    myGame.canvas.width = width * pixelRatio;
    myGame.canvas.height = height * pixelRatio;


    player = new circlePlayer(25, 'red');
}


function circlePlayer(radius, color){   
    this.x = Math.round(myGame.canvas.width / 2);
    this.y = Math.round(myGame.canvas.height / 2);
    this.update = function() {
        myGame.context.beginPath();
        myGame.context.arc(this.x, this.y, radius, 0, 2* Math.PI)
        myGame.context.fillStyle = color;
        myGame.context.fill();
        myGame.context.lineWidth = 5;
        myGame.context.stroke();
    }
}




var mouseX = 500;
var mouseY = 500;

$(document).mousedown(function(event) {
    switch (event.which) {        
        case 3:
            mouseX = event.clientX;
            mouseY = event.clientY;
            //alert('Right Mouse button pressed.');
            break;
    }
    
});


function updateGame(){
    myGame.clear();
    
    //player.x +=1;

    player.update();
}