/*
* 作者：李健
* 邮箱：lj2690@163.com
* */
class DrawBoard {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    opts: DrawBoardOpt;

    isDrawing: boolean = false;
    lastX: number = -1;
    lastY: number = -1;
    cacheImgData: ImageData | null = null;


    constructor(canvas: HTMLCanvasElement, opts: DrawBoardOpt) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d", {willReadFrequently: true})!;
        this.opts = opts;
        this.init();
        //确保canvas初始化完成以保证setOpt生效
        setTimeout(() => this.setOpt(opts));
    }

    startDraw(pos: Position): void {
        this.isDrawing = true;
        this.lastX = pos.x;
        this.lastY = pos.y;
        if (this.opts.shape !== Shape.LINE) {
            //绘制线条外的图形因为需要实时绘制所以每次开始绘制前都缓存画板
            this.cacheBoard();
        }
    }

    moveDraw(pos: Position) {
        if (!this.isDrawing) {
            return;
        }
        switch (this.opts.shape) {
            case Shape.LINE:
                this.drawLine(pos);
                break;
            case Shape.RECT:
                this.drawRect(pos);
                break;
            case Shape.CIRCLE:
            case Shape.ELLIPSE:
                this.drawCircle(pos, this.opts.shape);
                this.drawAuxiliaryLines(pos);
                break;
        }
    }

    endDraw(pos: Position) {
        if (this.isDrawing) {
            if (this.opts.shape === Shape.CIRCLE || this.opts.shape === Shape.ELLIPSE) {
                this.drawCircle(pos, this.opts.shape);
            }
        }
        this.isDrawing = false;
    }

    drawCircle(pos: Position, shape: Shape) {
        this.drawDynamic(() => {
            //先考虑为矩形
            let startX = this.lastX;
            let startY = this.lastY;
            let w = pos.x - this.lastX;
            let h = pos.y - this.lastY;
            //获取矩形的中心点坐标
            let centerX = w / 2 + startX;
            let centerY = h / 2 + startY;

            if (shape === Shape.CIRCLE) {
                let radius = Math.min(Math.abs(w / 2), Math.abs(h / 2));
                this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            } else {
                let radiusX = Math.abs(w / 2);
                let radiusY = Math.abs(h / 2);
                this.ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
            }
        });
    }


    drawRect(pos: Position) {
        this.drawDynamic(() => {
            this.ctx.rect(this.lastX, this.lastY, pos.x - this.lastX, pos.y - this.lastY);
        });
    }

    drawLine(pos: Position) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();
        this.lastX = pos.x;
        this.lastY = pos.y;
    }

    drawAuxiliaryLines(pos: Position) {
        this.ctx.beginPath();
        this.ctx.setLineDash([3, 5]);
        this.ctx.rect(this.lastX, this.lastY, pos.x - this.lastX, pos.y - this.lastY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    drawDynamic(drawFun: () => void) {
        //先清除上次绘制的图形
        this.clearBoard();
        //还原最开始绘制矩形时的画板
        this.restoreBoard();
        this.ctx.beginPath();
        drawFun();
        this.ctx.stroke();
    }

    cacheBoard() {
        this.cacheImgData = this.ctx.getImageData(0, 0, this.getWidth(), this.getHeight());
    }

    restoreBoard() {
        if (this.cacheImgData) {
            this.ctx.putImageData(this.cacheImgData, 0, 0);
        }
    }

    clearBoard() {
        this.ctx.clearRect(0, 0, this.getWidth(), this.getHeight());
    }

    setOpt(opts: DrawBoardOpt) {
        this.opts = opts;
        this.ctx.strokeStyle = this.opts.lineColor;
        this.ctx.lineWidth = this.opts.lineWidth;
        this.ctx.lineJoin = 'round'; // 线条连接方式
        this.ctx.lineCap = 'round';  // 线条端点样式
    }

    getToucheOffset(touch: Touch | MouseEvent): Position {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
        }
    }

    getWidth() {
        return this.canvas.width;
    }

    getHeight() {
        return this.canvas.height;
    }

    private handleStartDraw = (e: MouseEvent) => {
        this.startDraw(this.getToucheOffset(e));
    }

    private handleMoveDraw = (e: MouseEvent) => {
        this.moveDraw(this.getToucheOffset(e));
    }

    private handleEndDraw = (e: MouseEvent) => {
        this.endDraw(this.getToucheOffset(e));
    }

    private handleTouchStartDraw = (e: TouchEvent) => {
        e.preventDefault();
        let event = e.touches[0]!;
        if (!event) return;
        this.startDraw(this.getToucheOffset(event));
    }

    private handleTouchMoveDraw = (e: TouchEvent) => {
        e.preventDefault();
        let event = e.touches[0]!;
        if (!event) return;
        this.moveDraw(this.getToucheOffset(event));
    }

    private handleTouchEndDraw = (e: TouchEvent) => {
        e.preventDefault();
        let event = e.changedTouches[0]!;
        if (!event) return;
        this.endDraw(this.getToucheOffset(event));
    }

    init() {
        this.canvas.addEventListener("mousedown", this.handleStartDraw);
        this.canvas.addEventListener("mousemove", this.handleMoveDraw);
        this.canvas.addEventListener("mouseup", this.handleEndDraw);
        this.canvas.addEventListener("mouseout", this.handleEndDraw);

        this.canvas.addEventListener("touchstart", this.handleTouchStartDraw)
        this.canvas.addEventListener("touchmove", this.handleTouchMoveDraw)
        this.canvas.addEventListener("touchend", this.handleTouchEndDraw)
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.handleStartDraw);
        this.canvas.removeEventListener("mousemove", this.handleMoveDraw);
        this.canvas.removeEventListener("mouseup", this.handleEndDraw);
        this.canvas.removeEventListener("mouseout", this.handleEndDraw);

        this.canvas.removeEventListener("touchstart", this.handleTouchStartDraw)
        this.canvas.removeEventListener("touchmove", this.handleTouchMoveDraw)
        this.canvas.removeEventListener("touchend", this.handleTouchEndDraw)
    }
}

interface Position {
    x: number,
    y: number;
}

interface DrawBoardOpt {
    lineWidth: number;
    lineColor: string;
    shape: Shape;
}

enum Shape {
    LINE,
    RECT,
    CIRCLE,
    ELLIPSE,
}

export {
    DrawBoard,
    Shape
}

export type {
    DrawBoardOpt
}