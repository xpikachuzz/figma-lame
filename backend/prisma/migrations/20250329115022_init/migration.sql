-- CreateTable
CREATE TABLE "Arrow" (
    "id" INTEGER NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "points" INTEGER[],
    "color" TEXT NOT NULL,
    "strokeWidth" INTEGER NOT NULL,
    "canvasStageId" INTEGER NOT NULL,

    CONSTRAINT "Arrow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brush" (
    "id" INTEGER NOT NULL,
    "points" INTEGER[],
    "color" TEXT NOT NULL,
    "strokeWidth" INTEGER NOT NULL,
    "canvasStageId" INTEGER NOT NULL,

    CONSTRAINT "Brush_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Eraser" (
    "id" INTEGER NOT NULL,
    "points" INTEGER[],
    "color" TEXT NOT NULL,
    "strokeWidth" INTEGER NOT NULL,
    "canvasStageId" INTEGER NOT NULL,

    CONSTRAINT "Eraser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CanvasStage" (
    "id" SERIAL NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,

    CONSTRAINT "CanvasStage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Arrow" ADD CONSTRAINT "Arrow_canvasStageId_fkey" FOREIGN KEY ("canvasStageId") REFERENCES "CanvasStage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brush" ADD CONSTRAINT "Brush_canvasStageId_fkey" FOREIGN KEY ("canvasStageId") REFERENCES "CanvasStage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eraser" ADD CONSTRAINT "Eraser_canvasStageId_fkey" FOREIGN KEY ("canvasStageId") REFERENCES "CanvasStage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
