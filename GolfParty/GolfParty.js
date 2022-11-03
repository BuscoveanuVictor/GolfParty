function _(elmnt){return document.getElementById(elmnt)}
function drawLine(xFrom,yFrom,xTo,yTo,width,color){
    ctx.globalAlpha = 1;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(xFrom, yFrom);
    ctx.lineTo(xTo,yTo)
    ctx.stroke();
}
function drawBall(coordX=ball.coord.x,coordY=ball.coord.y,dim=ball.raza){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.beginPath();
    ctx.arc(coordX, coordY , dim , 0 , 2 * Math.PI);
    ctx.fill();
}
function canvas_arrow(fromX, fromY, toX, toY) {
    var headlen = 10; // length of head in pixels
    ctx.lineWidth = 1;
    var dx = toX - fromX;
    var dy = toY - fromY;
    var angle = Math.atan2(dy, dx);
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
}

const canvas =  _('canvas');
const ctx =  canvas.getContext('2d');

const ball ={

    code : 1,
    raza : 5,
    diam : 10,
    frecare: 2,
    speed : 2, 
    cadran: null,
    alpha : null, 
    mousedown : false,
    coord : {
        x : 300,
        y : 300,
    }

}

class GolfParty{

    #M=[];

    constructor(){


    }

    InitializareaMatricei(){

        const nrColumns = canvas.width/(ball.raza*2);
        const nrRows = canvas.height/(ball.raza*2);
       
        for(let y=0; y<nrRows; y++){
            M[y] = [];
        }

        for(let y=0; y<nrRows; y++){
            for(let x=0; x<nrColumns; x++){
                M[x][y]=0;
            }
        }

        M[30][30]=ball.code;

    }

}

window.onload = () =>{
    drawBall();
}

window.onmouseup= (e)=>{

    console.log("x : ",e.x, " y : ",e.y)

    if(ball.clicked){
       
        ball.clicked = false;

        if(ball.cadran!=null && ball.alpha!=null){

            let signX, signY;

            console.log('cadran : ', ball.cadran)
            //console.log('alfa : ',ball.alpha)

            let unghiRad =  (Math.PI * ball.alpha)/180;
        
            switch(ball.cadran){
                case 1: signX=1; signY=1;
                break;
                case 2: signX=-1; signY=1;
                break;
                case 3: signX=-1; signY=-1;
                break;
                case 4: signX=1; signY=-1;
                break;  
            }

            var speed10milsec = ball.speed/80;
            var myInterval=setInterval(()=>{
                let x = speed10milsec*Math.cos(unghiRad);
                let y = speed10milsec*Math.sin(unghiRad);

                speed10milsec -= (ball.frecare)/80;
                if(Math.ceil(speed10milsec)==0)clearInterval(myInterval);

                ball.coord.x += signX * x;
                ball.coord.y += signY * y;

                let leftCornerBallCoordX = ball.coord.x - ball.raza;
                let leftCornerBallCoordY = ball.coord.y - ball.raza;

                if(Math.ceil(leftCornerBallCoordX)<=0 || Math.floor(leftCornerBallCoordX+ball.diam)>=canvas.width)signX= -signX;
                if(Math.ceil(leftCornerBallCoordY)<=0 || Math.floor(leftCornerBallCoordY+ball.diam)>=canvas.height)signY = -signY;
                drawBall();

            },10)
            

        }else{
            
            drawBall();
        }
    }
}

canvas.onmousedown = (e) =>{

    ball.alpha = null;
    ball.cadran = null;

    let coordCanvasX = e.offsetX;
    let coordCanvasY = e.offsetY;

    let leftCornerBallCoordX = ball.coord.x - ball.raza;
    let leftCornerBallCoordY = ball.coord.y - ball.raza;

    if((coordCanvasX>=leftCornerBallCoordX && coordCanvasX<=leftCornerBallCoordX+ball.diam) 
        &&(coordCanvasY>=leftCornerBallCoordY  && coordCanvasY<=leftCornerBallCoordY+ball.diam)){
            ball.clicked = true;
    }

    //console.log("xCanvas : ",coordCanvasX," yCanvas : ",coordCanvasY)
    //console.log("x : ",ball.coord.x," y : ",ball.coord.y);
}

window.onmousemove = (e) =>{
    if(ball.clicked){

        let difX = ball.coord.x - e.offsetX;
        let difY = ball.coord.y - e.offsetY; 
        var x, y;
       
        var lungime = Math.round(Math.sqrt(difX*difX+difY*difY));
     
        if(lungime>=150){
            // THALES
            difY = Math.round((difY * 150)/lungime);
            difX = Math.round((difX * 150)/lungime);

            lungime = Math.round(Math.sqrt(difX*difX+difY*difY));
        }

        //Coord pe care pointeaza sageata
        x = ball.coord.x + difX;
        y = ball.coord.y + difY;
        
        drawBall();            

        //Desenez sageata doar daca lungimea >=10
        if(lungime>=10){
            canvas_arrow(ball.coord.x,ball.coord.y,x,y);   
            ball.speed = Math.round((lungime*30)/12);

            if(difX>0 && difY>0)ball.cadran = 1;
            else if(difX<0 && difY>0)ball.cadran = 2;
            else if(difX<0 && difY<0)ball.cadran = 3;
            else if(difX>0 && difY<0)ball.cadran = 4;
            
            ball.alpha = Math.acos( difX/lungime);
            ball.alpha = (180*ball.alpha)/Math.PI;
            if(ball.alpha>=90)ball.alpha=180-ball.alpha; 
        }
    }
}