import React, { useEffect, useId, useRef, useState } from "react";
import { Stage, Layer } from "react-konva";
import { ChromePicker } from "react-color"; // 🎨 Color Picker
import { utilObjectToElement } from "./Stroke";
import socket from "../socket";


const Canvas = () => {
  const [lines, setLines] = useState([]); // Stores drawn lines
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("pen"); // "pen" or "eraser"
  const [color, setColor] = useState("#000000")
  const [pallete, setPallete] = useState(false)
  const [size, setSize] = useState(5)
  const stageRef = useRef(null);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    socket.emit("join_canvas", "canvas:"+1)
    // open socket for recieving emits for this canvas
    socket.on("draw", (line) => {
      setLines(curr => [...curr, {...line, mine:false}])
    })
    socket.on("delete", (id) => {
      setLines(curr => curr.filter(currLine => currLine.id !== id))
    })
    socket.on("trash", () => {
      setLines([])
    })

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      socket.emit("leave_canvas", "canvas:"+1)
      socket.off("draw")
      socket.off("delete")
      socket.off("trash")
    };
  }, []);

  const handleMouseDown = (e) => {
    if (tool === "pointer") {
      setIsDrawing(true);
      return
    } else {
      const stage = stageRef.current;
      const point = stage.getPointerPosition();
      setLines([...lines, { points: [point.x, point.y, point.x, point.y], tool, size, color, id: "id" + Math.random().toString(16).slice(2), mine: true }]);
      setIsDrawing(true);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const stage = stageRef.current;
    const point = stage.getPointerPosition();
    if (tool === "arrow") {
      let lastLine = lines[lines.length - 1]
      lastLine.points = [lastLine.points[0], lastLine.points[1], point.x, point.y]
      setLines([...lines.slice(0, -1), lastLine])
      return
    }
    if (tool === "pointer") {
      return
    }
    let lastLine = lines[lines.length - 1];
    lastLine.points = [...lastLine.points, point.x, point.y];
    setLines([...lines.slice(0, -1), lastLine]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    // is dragging
    if (tool === "pointer") {
      // then pass in id with new x,y position
    }
    // Send the new line
    socket.emit("new_brush", lines[lines.length-1])
  };

  const handleClear = () => {
    setLines([]); // Clears all drawings
    // clear
    socket.emit("trash")
  };

  const handleUndo = () => {
    setLines(currLines => {
      console.log("UNDO: ", currLines)
      for (let i = currLines.length-1; i >= 0; i--) {
        // if the line not from the outside
        if (currLines[i].mine) {
          socket.emit("delete", currLines[i].id)
          return currLines.filter(line => line.id !== currLines[i].id)
        }
      }
      return currLines
    })
  }

  const handleKeyDown = (e) => {
    if (e.key === "p" || e.key === "P") setTool("pen");
    if (e.key === "e" || e.key === "E") setTool("eraser");
    if (e.key === "c" || e.key === "C") handleClear();
    if (e.ctrlKey && e.key === "z") handleUndo(); // Ctrl + Z for Undo
  };


  return (
    <div onKeyDown={handleKeyDown} style={{ textAlign: "center" }}>
      {/* Toolbar */}
      <div style={{ marginBottom: 10 }} className="flex gap-10 justify-center mt-5">
        <button onClick={() => setTool("pointer")}>🖱️ Pointer</button>
        <button onClick={() => setTool("pen")}>🖊️ Pen</button>
        <button onClick={() => setTool("arrow")}>➜ Arrow</button>
        <button onClick={() => setTool("eraser")}>🧽 Eraser</button>
        <button onClick={handleClear}>🗑️ Trash</button>
        <div className="flex gap-2">
          Size:
          <button onClick={() => setSize(5)} className="border-[1px] px-2 font-mono font-extrabold">.</button>
          <button onClick={() => setSize(10)} className="border-[1px] px-2 font-mono">o</button>
          <button onClick={() => setSize(15)} className="border-[1px] px-2 font-mono">🔾</button>
        </div>
        <div className="relative border-[1px] px-2">
          <button onClick={() => setPallete(pal => !pal)} >
            Colour Picker
          </button>
          {/* 🎨 Color Picker */}
          {pallete && 
            <div className="absolute mt-1 z-10">
              <ChromePicker 
                color={color} 
                onChange={(updatedColor) => setColor(updatedColor.hex)}
              />
            </div>
          }
        </div>
      </div>

      {/* Drawing Canvas */}
      <Stage
        width={window.innerWidth-5}
        height={500}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        ref={stageRef}
        style={{ border: "2px solid black", backgroundColor: "white" }}
      >
        <Layer>
          {lines.map((line) => (
            utilObjectToElement(line, tool == "pointer")
          ))}
        </Layer>
      </Stage>
      <p>Press <b>P</b> for Pen, <b>E</b> for Eraser, <b>C</b> to Clear, <b>Ctrl + Z</b> to Undo</p>
    </div>
  );
};


export default Canvas;
