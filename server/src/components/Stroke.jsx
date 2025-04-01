import { Arrow, Layer, Line } from "react-konva";

const utilObjectToElement = (line, draggable) => {
  return (
    <>
      {
        (line.tool === "arrow") ? (
          <Arrow 
            key={line.id}
            x={line.points[0]}
            y={line.points[1]}
            points={[0, 0, line.points[2]-line.points[0], line.points[3]-line.points[1]]}
            pointerLength={20}
            pointerWidth={20}
            fill={line.color}
            stroke={line.color}
            strokeWidth={line.size}
            draggable={draggable}
          />
        ) : (
          <Line
            key={line.id}
            points={line.points}
            stroke={line.tool === "eraser" ? "white" : line.color} // Eraser is white
            strokeWidth={line.size} // Eraser is thicker
            tension={0.5}
            lineCap="round"
            lineJoin="round"
            fill={line.color}
            draggable={draggable}
          />
        )
      }
    </>
  )
}

export {utilObjectToElement};