class CardCollectionRepository {
    constructor() {
    }

    getCards(pageIndex, searchName) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            let query = `searchName=${searchName}&`;
            if (searchName === undefined) {
                query = "";
            }
            xhr.open("GET", `http://localhost:3000/card-collection?${query}pageIndex=${pageIndex}`, true);

            xhr.onload = () => { resolve(JSON.parse(xhr.responseText)); };
            xhr.onerror = () => { reject(xhr.statusText); }; 

            xhr.send();
        });
    }
}