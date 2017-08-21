class ArenaRepository {
    constructor() {
    }

    getCards() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "http://localhost:3000/arena-deck", true);

            xhr.onload = () => { resolve(JSON.parse(xhr.responseText)); };
            xhr.onerror = () => { reject(xhr.statusText); }; 

            xhr.send();
        });
    }
}