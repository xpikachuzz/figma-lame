const express = require("express");
const app = express();    // initiate express.
const cors = require('cors');

// redis
// const redisClient = require("./redis")
const { Server } = require("socket.io");

const server = require("http").createServer(app);

const io = new Server(server, {
    cors: { origin:"http://localhost:5173", methods: ['GET', 'POST'] },
});

// redisClient.connect().catch(console.error)

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173' // or use a wildcard '*' to allow all origins
}));


io.on("connect", (socket) => {
  console.log("connect")
  socket.on("join_canvas", (room) => {
    socket.join(room)
  })
  socket.on("leave_canvas", (room) => {
    socket.leave(room)
  })
  socket.on("new_brush", (line) => {
    socket.to("canvas:"+1).emit("draw", line)
    // Save it to the canvas
  })
  socket.on("delete", (id) => {
    socket.to("canvas:"+1).emit("delete", id)
    // Delete it from canvas
  })
  socket.on("trash", () => {
    socket.to("canvas:"+1).emit("trash")
  })
})



const PORT = process.env.PORT || 3000;

// Server will listen for incoming requests
server.listen(PORT, () => {
  console.log(`My first Express app - listening on port http://localhost:${PORT}/ !`);
});