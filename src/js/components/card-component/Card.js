class Card{
    constructor(container, cardData) {
        this.container = container;
        this.cardData = cardData;
    }

    initialize() {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `<div class="card-cost card-num">${this.cardData.Cost}</div>
                            <div class="card-image"><i class="fa"></i></div>
                            <div class="card-name">${this.cardData.Name}</div>
                            <div class="card-damage card-num">${this.cardData.Damage}</div>
                            <div class="card-health card-num">${this.cardData.Health}</div>`;

        this.container.appendChild(div);
        this.domElement = div;

        this.domElement.querySelector(".fa").className += ` ${this.cardData.ImageIdentifier} fa-2x`;
    }

    addClickEventListener(callback){
        this.domElement.addEventListener("click",(e) => {
            callback();
        }, false);
    }

    addHoverEventListener(callbackMouseOver, callbackMouseOut){
        this.domElement.addEventListener("mouseover",() => { callbackMouseOver(); }, false);
        this.domElement.addEventListener("mouseout",() => { callbackMouseOut(); }, false);
    }
}