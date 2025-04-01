const express = require("express");
const app = express();    // initiate express.
const cors = require('cors');

// redis
// const redisClient = require("./redis")
const { Server } = require("socket.io");
const { PrismaClient } = require("@prisma/client");

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const server = require("http").createServer(app);

const io = new Server(server, {
    cors: { origin:"*", methods: ['GET', 'POST'] },
});

// redisClient.connect().catch(console.error)

app.use(express.json());
app.use(cors({
  origin: '*' // or use a wildcard '*' to allow all origins
}));

app.get("/", (req, res) => {
  res.json("BOKEY")
})


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
    // Save it to the psql
    if (line.tool == "pen") {
      prisma.brush.create({
        data: {
          id: line.id,
          points: line.points,
          color: line.color,
          strokeWidth: line.size,
          canvasStageId: 1
        }
      })
    } if (line.tool == "arrow") {
      prisma.brush.create({
        data: {
          id: line.id,
          x: line.points[0],
          y: line.points[1],
          points: line.points,
          color: line.color,
          strokeWidth: line.size,
          canvasStageId: 1
        }
      })
    } if (line.tool == "eraser") {
      prisma.eraser.create({
        data: {
          id: line.id,
          points: line.points,
          color: line.color,
          strokeWidth: line.size,
          canvasStageId: 1
        }
      })
    }
  })
  socket.on("delete", (id) => {
    socket.to("canvas:"+1).emit("delete", id)
    // Delete it from canvas
    prisma.eraser.del
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