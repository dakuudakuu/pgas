function createRng(seed) {
    let s = seed;
    return function () {
        s = Math.imul(48271, s) | 0;
        s %= 2147483647;
        return (s & 2147483647) / 2147483647;
    }
}

function randomBetween(rng, min, max) {
    return rng() * (max - min) + min;
}

function randomColor(rng) {
    const r = Math.floor(rng() * 255);
    const g = Math.floor(rng() * 255);
    const b = Math.floor(rng() * 255);
    return `rgb(${r}, ${g}, ${b})`;
}

export function generatePlatforms(seed, targetY) {
    const rng = createRng(seed);
    const platforms = [];

    const maxFromBottom = Math.abs(targetY);
    const height = 50;

    let x = 0;
    let fromBottom = 150;

    while (fromBottom < maxFromBottom) {
        const width = Math.floor(randomBetween(rng, 80, 400));
        const moving = Math.round(randomBetween(rng, 0, 4)) === 1;
        const amplitude = randomBetween(rng, 80, 120);
        const speed = moving ? randomBetween(rng, 0.4, 5) : 0;

        const clampedX = Math.max(-10000, Math.min(10000, Math.floor(x)));

        platforms.push({
            baseX: clampedX,
            x: clampedX,
            fromBottom: Math.floor(fromBottom),
            width,
            height,
            color: randomColor(rng),
            moving,
            amplitude,
            speed,
            id: "normalPlatform",
            dx: 0
        });

        if (!moving && rng() < 0.2) {
    const trapWidth = Math.floor(randomBetween(rng, 80, 150));
    const trapAmplitude = 300;
    // baseX must be far enough that even at closest swing point (baseX - amplitude),
    // it's still 500px from the static platform's edge
    const minGap = 500 + trapAmplitude; // 620px from platform edge to trap's nearest swing

    const rightBase = clampedX + width + minGap;
    const leftBase  = clampedX - minGap - trapWidth;

    let trapBaseX = null;
    const preferRight = rng() > 0.5;

    if (preferRight && rightBase + trapWidth <= 10000) {
        trapBaseX = rightBase;
    } else if (leftBase >= -10000) {
        trapBaseX = leftBase;
    } else if (rightBase + trapWidth <= 10000) {
        trapBaseX = rightBase;
    }

    if (trapBaseX !== null) {
        platforms.push({
            baseX: trapBaseX,
            x: trapBaseX,
            fromBottom: Math.floor(fromBottom),
            width: trapWidth,
            height,
            color: randomColor(rng),
            moving: true,
            amplitude: trapAmplitude,
            speed: 2.5,
            id: "normalPlatform",
            dx: 0
        });
    }
}

        x += randomBetween(rng, 200, 600) * (rng() > 0.5 ? 1 : -1);
        fromBottom += randomBetween(rng, 150, 200);

        if (x > 10000) x -= randomBetween(rng, 5000, 15000);
        if (x < -10000) x += randomBetween(rng, 5000, 15000);
    }  // ← closes while

    return platforms;
}  // ← closes function