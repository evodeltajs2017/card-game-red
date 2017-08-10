class Card{
    constructor(container, cardData) {
        this.container = container;
        this.cardData = cardData;
    }

    initialize() {
        const div = document.createElement("div");
        div.className = " centered-card-pack card";
        div.innerHTML = `<p>Name: ${this.cardData.Name}</p>
                            <p>Cost: ${this.cardData.Cost}</p>
                            <p>Damage: ${this.cardData.Damage}</p>
                            <p>Health: ${this.cardData.Health}</p>
                            <p>ImageId: ${this.cardData.ImageIdentifier}</p>`;

        this.container.appendChild(div);
        this.domElement = div;
    }
}