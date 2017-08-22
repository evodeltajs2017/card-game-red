class Router {
	constructor(container) {
		this.routes = [];
		this.container = container;
		this.currentComponent = undefined;
		this.options = undefined;
	}

	addRoute(url, component) {
		const route = {
			url: url,
			component: component
		};

		this.routes.push(route);
	}

	initialize() {
	}

	go(url, options) {
		console.log("go", url);
		const route = this.routes.find(x => x.url === url);
		this.options = options;

		if (route !== undefined) {
			if (this.currentComponent !== undefined) {
				this.currentComponent.destroy();
			}

			this.container.innerHTML = "";

			this.currentComponent = new route.component(this.container, this);
			this.currentComponent.initialize();
		}
	}

	getOptions() {
		return this.options;
	}
}


