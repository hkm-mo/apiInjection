// From ChatGPT, 
// fixed some problems but still have some problems :(

interface Vector {
    x: number;
    y: number;
}

class Point {
    constructor(readonly x: number, readonly y: number) { }

    distance(other: Point): number {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    movement(other: Point): Vector {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        return { x: dx, y: dy };
    }

    static from(event: MouseEvent | TouchEvent): Point {
        if (event instanceof MouseEvent) {
            return new Point(event.clientX, event.clientY);
        } else if (event instanceof TouchEvent) {
            const touch = event.touches[0];
            return new Point(touch.clientX, touch.clientY);
        } else {
            throw new Error('Invalid event type');
        }
    }



}

class Rectangle {
    constructor(readonly x: number, readonly y: number, readonly width: number, readonly height: number) { }

    static from(element: HTMLElement): Rectangle {
        const domRect = element.getBoundingClientRect();
        const x = domRect.x;
        const y = domRect.y;
        const width = domRect.width;
        const height = domRect.height;
        return new Rectangle(x, y, width, height);
    }

    distance(pointOrRect: Point | Rectangle): number {
        const rectX = this.x - this.width / 2;
        const rectY = this.y - this.height / 2;
        const rectRight = rectX + this.width;
        const rectBottom = rectY + this.height;

        if (pointOrRect instanceof Point) {
            const { x, y } = pointOrRect;
            if (x < rectX) {
                if (y < rectY) {
                    return this.distanceToPoint(x, y, rectX, rectY);
                } else if (y > rectBottom) {
                    return this.distanceToPoint(x, y, rectX, rectBottom);
                } else {
                    return rectX - x;
                }
            } else if (x > rectRight) {
                if (y < rectY) {
                    return this.distanceToPoint(x, y, rectRight, rectY);
                } else if (y > rectBottom) {
                    return this.distanceToPoint(x, y, rectRight, rectBottom);
                } else {
                    return x - rectRight;
                }
            } else {
                if (y < rectY) {
                    return rectY - y;
                } else if (y > rectBottom) {
                    return y - rectBottom;
                } else {
                    return 0;
                }
            }
        } else if (pointOrRect instanceof Rectangle) {
            const otherRectX = pointOrRect.x - pointOrRect.width / 2;
            const otherRectY = pointOrRect.y - pointOrRect.height / 2;
            const otherRectRight = otherRectX + pointOrRect.width;
            const otherRectBottom = otherRectY + pointOrRect.height;

            if (otherRectRight < rectX) {
                if (otherRectBottom < rectY) {
                    return this.distanceToPoint(otherRectRight, otherRectBottom, rectX, rectY);
                } else if (otherRectY > rectBottom) {
                    return this.distanceToPoint(otherRectRight, otherRectY, rectX, rectBottom);
                } else {
                    return rectX - otherRectRight;
                }
            } else if (otherRectX > rectRight) {
                if (otherRectBottom < rectY) {
                    return this.distanceToPoint(otherRectX, otherRectBottom, rectRight, rectY);
                } else if (otherRectY > rectBottom) {
                    return this.distanceToPoint(otherRectX, otherRectY, rectRight, rectBottom);
                } else {
                    return otherRectX - rectRight;
                }
            } else {
                return 0;
            }
        } else {
            throw new Error('Invalid argument type');
        }
    }

    private distanceToPoint(x1: number, y1: number, x2: number, y2: number): number {
        const dx = x1 - x2;
        const dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    distanceFromCenter(pointOrRect: Point | Rectangle): number {
        const center = this.center();
        if (pointOrRect instanceof Point) {
            return center.distance(pointOrRect);
        } else if (pointOrRect instanceof Rectangle) {
            const otherCenter = pointOrRect.center();
            return center.distance(otherCenter);
        } else {
            throw new Error('Invalid argument type');
        }
    }

    center(): Point {
        const x = this.x + this.width / 2;
        const y = this.y + this.height / 2;
        return new Point(x, y);
    }
}

function findClosestBall(touchEvent: TouchEvent): HTMLElement | null {
    const parentElement = touchEvent.target as HTMLElement;
    const ballA = parentElement.querySelector('#ballA') as HTMLElement;
    const ballB = parentElement.querySelector('#ballB') as HTMLElement;
    const touchPoint = Point.from(touchEvent);

    const distanceToA = Rectangle.from(ballA).distanceFromCenter(touchPoint);
    const distanceToB = Rectangle.from(ballB).distanceFromCenter(touchPoint);

    if (distanceToA < distanceToB) {
        return ballA;
    } else {
        return ballB;
    }
}