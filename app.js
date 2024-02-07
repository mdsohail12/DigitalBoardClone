const express=require("express");//access
const socket=require("socket.io");

const app=express();//initialized and server ready

app.use(express.static("public"));
 
let port=2000;
let server=app.listen(port,()=>{
    console.log("listening to port"+port);
})

let io=socket(server);

io.on("connection", (socket)=>{
    console.log("Made socket connection");

    //Received data
    socket.on("beginPath",(data)=>{
        //data-->data from fronted
        //now transfer data to all connected computer
        io.sockets.emit("begimPath",data);
    })
    socket.on("drawStroke",(data)=>{
        io.sockets.emit("drawStroke",data);
    })

    socket.on("redoUndo",(data)=>{
        io.sockets.emit("redoUndo",data);
    })
})