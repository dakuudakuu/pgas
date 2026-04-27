export default class InputHandler {
    constructor() {
        this.keys = {};
        this.justPressed = {};

        window.addEventListener("keydown", (e) => {
            const key = e.key.toLowerCase();
            if (!this.keys[key]) this.justPressed[key] = true;
            this.keys[key] = true;
        });

        window.addEventListener("keyup", (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    isDown(key) {
        return !!this.keys[key];
    }

    wasPressed(key) {
        return !!this.justPressed[key];
    }

    flush() {
        this.justPressed = {};
    }
}