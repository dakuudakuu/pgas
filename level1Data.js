import { generatePlatforms } from "./worldGen.js"

const basePlatform = {
    x: -5000,
    fromBottom: -800,
    width: 100000,
    height: 800,
    color: "sienna",
    moving: false,
    id: "basePlatform"
};

export default {
    spawnPointX: -100,
    spawnPointY: 100,
    backgroundColor: "#000000",
    speed: 300,
    gravity: 700,
    platforms: [
       basePlatform,
       ...generatePlatforms(
            6767,
            10000000,
       )
    ]
}