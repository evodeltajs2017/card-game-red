class CardRepository {
    constructor() {
    }

    openCardpack() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "http://localhost:3000/openPack", true);

            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    resolve(JSON.parse(this.responseText));
                }
            };

            xhr.send();
        });

    }

    generateDeck(){
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "http://localhost:3000/generateDeck", true);

            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    resolve(JSON.parse(this.responseText));
                }
            };

            xhr.send();
        });
    }
}