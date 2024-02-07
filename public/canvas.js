// let canvas=document.querySelector("canvas");
// canvas.width=window.innerWidth;
// canvas.height=window.innerHeight;
// Api as like 
// let tool=canvas.getContext("2d");
// tool.strokeStyle="red"   //ye jo color ko modyfi karta h 
// tool.lineWidth="3";
// tool.beginPath();//new graphic ya line start karna ok ya ye bole ki path 
// tool.moveTo(10,10);//ye jo h start point h ki x axis aur y axis me start karna h new line ok
// tool.lineTo(100,150);//end point h ki x axis aur y axis me start karna h end line ok
// tool.stroke();//fill the color




let canvas=document.querySelector("canvas");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let pencilColor=document.querySelectorAll(".pencil-color");
let pencilWidthElem=document.querySelector(".pencil-width");
let eraserWidthElem=document.querySelector(".eraser-width");
let download=document.querySelector(".download");
let undo=document.querySelector(".undo");
let redo=document.querySelector(".redo");

let penColor="red";
let eraserColor="white";
let penWidth=pencilWidthElem.value;
let eraserWidth=eraserWidthElem.value;


let undoRedoTracker=[];//data
let track=0;//represent which action from tracker array

let mousedown=false;

let tool=canvas.getContext("2d");
tool.strokeStyle=penColor;
tool.lineWidth=penWidth;

// mousedown-> start new path ,mousmove-> path fill (grapics)
canvas.addEventListener("mousedown",(e)=>{
    mousedown=true;
    let data={
        x:e.clientX,
        y:e.clientY
    }
    //send data to server
   socket.emit("beginPath",data);
   
})
canvas.addEventListener("mousemove",(e)=>{
    if(mousedown) {
        let data={
            x:e.clientX,
            y:e.clientY,
            color:eraserFlag?eraserColor:penColor,
            width:eraserFlag?eraserWidth:penWidth
        }
        socket.emit("drawStroke",data);
    }
})

canvas.addEventListener("mouseup",(e)=>{
    mousedown=false;

    let url=canvas.toDataURL();
    undoRedoTracker.push(url);
    track=undoRedoTracker.length-1;
})

undo.addEventListener("click",(e)=>{
    if(track > 0) track--;
    //track action
    let data={
        trackValue:track,
        undoRedoTracker
    }
    socket.emit("redoUndo",data);
})
redo.addEventListener("click",(e)=>{
    if(track < undoRedoTracker.length-1) track++;
    //track action
    let data={
        trackValue:track,
        undoRedoTracker
    }
    // undoRedoCanvas(trackObj);
    socket.emit("redoUndo",data);

})

function undoRedoCanvas(trackObj){
    track=trackObj.trackValue;
    undoRedoTracker=trackObj.undoRedoTracker;

    let url=undoRedoTracker[track];
    let img=new Image();//new image refrence element
    img.src=url;
    img.onload=(e)=>{
        tool.drawImage(img,0,0,canvas.width, canvas.height);
    }
}


function beginPath(strokeObj){
    tool.beginPath();
    tool.moveTo(strokeObj.x,strokeObj.y);
}
function drawStroke(strokeObj){
    tool.strokeStyle=strokeObj.color;
    tool.lineWidth=strokeObj.width;
    tool.lineTo(strokeObj.x,strokeObj.y);
    tool.stroke();
}

pencilColor.forEach(colorElem => {
    colorElem.addEventListener("click",(e)=>{
        let color=colorElem.classList[0];
        penColor=color;
        tool.strokeStyle=penColor;
    })
});


// yha pe color ka motapa badhay ja rha h hai
pencilWidthElem.addEventListener("change",(e)=>{
    penWidth=pencilWidthElem.value;
    tool.lineWidth=penWidth;
})
eraserWidthElem.addEventListener("change",(e)=>{
   eraserWidth=eraserWidthElem.value;
    tool.lineWidth=eraserWidth;
})

eraser.addEventListener("click",(e)=>{
    if(eraserFlag){
        tool.strokeStyle=eraserColor;
        tool.lineWidth=eraserWidth;
    }
    else{
        tool.strokeStyle=penColor;
        tool.lineWidth=penWidth;
    }
})


// download wala code
download.addEventListener("click",(e)=>{
    let url=canvas.toDataURL();

    let a=document.createElement("a");
    a.href=url;
    a.download="digitalBoard.jpg";
    a.click();
})


// yha se app.js ka code h aur kuchh uper change hua ok

socket.on("beginPath",(data)=>{
    //data-->data from server 
    beginPath(data);
})
socket.on("drawStroke",(data)=>{
    drawStroke(data);
})
socket.on("redoUndo",(data)=>{
  undoRedoCanvas(data);
})
