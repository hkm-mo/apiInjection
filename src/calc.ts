
const containerHeight = 600;
const elmHeight = 600;
const halfWay: number | number[] = [300, 400];

function valid() {
    if (Array.isArray(halfWay)) {
        for (let i = 1; i < halfWay.length; i++) {
            if (typeof halfWay[i - 1] !== "number" || typeof halfWay[i] !== "number" || halfWay[i - 1] > halfWay[i])
                return false
        }
    }
    return true;
}

function getLandMarks() {
    const full = Math.min(containerHeight, elmHeight);
    const halfWays = typeof halfWay === "number" ? [halfWay] : halfWay;
    const landMarks: number[] = [0];

    for (const h of halfWays) {
        landMarks.push(Math.min(h, full));
    }
    landMarks.push(full);

    return landMarks;
}

function getThresholds(landMarks: number[]) {
    const thresholds: number[] = [];
    for (let i = 1; i < landMarks.length; i++) {
        thresholds.push((landMarks[i - 1] - landMarks[i]) / 2 + landMarks[i]);
    }
    return thresholds;
}

function stickToLandMark(landMarks: number[], thresholds: number[], dy: number, point: number, speed: number) {
    let selectedLandMark = 0;
    for (let i = 0; i < thresholds.length; i++) {
        if (thresholds[i] < point) {
            selectedLandMark = i + 1;
        }
    }

    if (speed > 1.2) {
        if (dy > 50) {
            selectedLandMark--;
        } else if (dy < -50) {
            selectedLandMark++;
        }
    }


    return Math.max(Math.min(selectedLandMark, landMarks.length - 1), 0);
}

const landMarks = getLandMarks();
const thresholds = getThresholds(landMarks);
console.log("valid", valid())
console.log("LandMarks", landMarks)
console.log("Thresholds", thresholds)
console.log("stickToLandMark", 10, 140, 0.1, stickToLandMark(landMarks, thresholds, 10, 140, 0.1))
console.log("stickToLandMark", 10, 200, 0.1, stickToLandMark(landMarks, thresholds, 10, 200, 0.1))
console.log("stickToLandMark", 10, 450, 0.1, stickToLandMark(landMarks, thresholds, 10, 450, 0.1))
console.log("stickToLandMark", 10, 510, 0.1, stickToLandMark(landMarks, thresholds, 10, 510, 0.1))

console.log("stickToLandMark", -10, 140, 0.1, stickToLandMark(landMarks, thresholds, -10, 140, 0.1))
console.log("stickToLandMark", -10, 200, 0.1, stickToLandMark(landMarks, thresholds, -10, 200, 0.1))
console.log("stickToLandMark", -10, 450, 0.1, stickToLandMark(landMarks, thresholds, -10, 450, 0.1))
console.log("stickToLandMark", -10, 510, 0.1, stickToLandMark(landMarks, thresholds, -10, 510, 0.1))

console.log("stickToLandMark", 60, 140, 2.1, stickToLandMark(landMarks, thresholds, 60, 140, 2.1))
console.log("stickToLandMark", 60, 200, 2.1, stickToLandMark(landMarks, thresholds, 60, 200, 2.1))
console.log("stickToLandMark", 60, 450, 2.1, stickToLandMark(landMarks, thresholds, 60, 450, 2.1))


console.log("stickToLandMark", -60, 140, 2.1, stickToLandMark(landMarks, thresholds, -60, 140, 2.1))
console.log("stickToLandMark", -60, 200, 2.1, stickToLandMark(landMarks, thresholds, -60, 200, 2.1))