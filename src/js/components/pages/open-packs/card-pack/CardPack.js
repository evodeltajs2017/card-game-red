class CardPack{
    constructor(container, openFunction) {
        this.container = container;
        this.openFunction = openFunction;
    }

    initialize() {
        const div = document.createElement("div");
        div.className = "card-pack";
        this.container.appendChild(div);
        this.domElement = div;

        this.domElement.addEventListener("click", () => { this.openFunction(); }, false);
    }
}