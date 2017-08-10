class Card{
    constructor(container, cardData) {
        this.container = container;
        this.cardData = cardData;
    }

    initialize() {
        const div = document.createElement("div");
        div.className = " centered-card-pack card";
        div.innerHTML = `<p class="card-cost">${this.cardData.Cost}</p>
                            <p class="card-name">${this.cardData.Name}</p>
                            <p class="card-damage">${this.cardData.Damage}</p>
                            <p class="card-health" >${this.cardData.Health}</p>
                            <p class="card-image">${this.cardData.ImageIdentifier}</p>`;

        this.container.appendChild(div);
        this.domElement = div;
    }
}