function createRng(seed) {
    let s = seed;
    return function () {
        s = Math.imul(48271, s) | (0 % 2147483647);;
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

export function generatePlatforms(seed, count, startX) {
    const rng = createRng(seed);
    const platforms = [];

    let x = startX;
    let fromBottom = 50;
    let direction = 1;
    let platformsUntilSwitch = Math.floor(randomBetween(rng, 3, 20));
    let transitioning = false;
    let transitionSteps = 0;

    for (let i = 0; i < count; i++) {

        if (platformsUntilSwitch <= 0) {
            direction *= -1;
            platformsUntilSwitch = Math.floor(randomBetween(rng, 3, 20));
            transitioning = true;
            transitionSteps = Math.floor(randomBetween(rng, 2, 4));
        }


        let gap, heightDelta;

        if (transitioning || platformsUntilSwitch <= 2) {
            heightDelta = randomBetween(rng, 80, 150);
            gap = randomBetween(rng, 100, 150);
            if (transitioning) {
                transitionSteps--;
                if (transitionSteps <= 0) transitioning = false;
            }
        } else {
            gap = randomBetween(rng, 250, 450);
            const t = (gap - 250) / 200;

            const bigJump = rng() < 0.25;
            const maxHeight = bigJump
                ? randomBetween(rng, 100, 150)
                : (150 - t * 100) * randomBetween(rng, 0.3, 1.5);

            heightDelta = randomBetween(rng, 80, Math.max(80, maxHeight));
        }

        heightDelta = Math.min(heightDelta, 200);
        fromBottom += heightDelta;

        const width = randomBetween(rng, 30, 200);
        const height = randomBetween(rng, 10, 80);

        platforms.push({
            x: Math.floor(x),
            fromBottom: Math.floor(fromBottom),
            width: Math.floor(width),
            height: Math.floor(height),
            color: randomColor(rng)
        });

        x += direction * (width + gap);
        platformsUntilSwitch--;
    }

    return platforms;
}