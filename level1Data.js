import { generatePlatforms } from "./worldGen.js"

const basePlatform = {
    x: -5000,
    fromBottom: -800,
    width: 10000,
    height: 800,
    color: "green"
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
            3,
            100,
            100
       )
    ]
}