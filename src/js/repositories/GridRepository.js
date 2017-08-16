class GridRepository {

	constructor() {

	}

	getGridForUrl(url, pageIndex, searchName) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			let query = `${url}?`;
			if (searchName !== undefined) {
				query += `searchName=${searchName}&`;
			}
			query += `pageIndex=${(pageIndex - 1) * 10}`;
			xhr.open("GET", query, true);
			xhr.onload = () => { resolve(JSON.parse(xhr.responseText)); };
			xhr.onerror = () => { reject(xhr.statusText); };
			xhr.send();
		});
	}

}