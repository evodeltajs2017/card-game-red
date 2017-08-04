class CardRepository {
    constructor() {
    }

    openCardpack(callback) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "http://localhost:3000/openPack", true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                callback(this.status, JSON.parse(this.responseText));
            }
        };

        xhr.send();
    }
}