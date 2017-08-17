class GridTest {

	constructor(container) {
		this.container = container;
	}

	initialize() {
		const grid = new Grid(this.container, `Grid test`, `http://localhost:3000/view-card-types`,
			[{
				fieldName: "Id",
				displayName: "ID",
				render: (rawData) => `<div>${rawData.Id}</div>`
			}, {
				fieldName: "Name",
				displayName: "Name",
				render: (rawData) => `<div>${rawData.Name}</div>`
			}]);
		grid.initialize();
	}

	destroy() {
	}

}
