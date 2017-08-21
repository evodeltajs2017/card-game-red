class Router {
	constructor(container) {
		this.routes = [];
		this.container = container;
		this.currentComponent = undefined;
	}

	addRoute(url, component) {
		const route = {
			url: url,
			component: component
		};

		this.routes.push(route);
	}

	initialize() {
		window.addEventListener('popstate', function(event) {
			router.go(event.state, true);
		});

		if (this.routes.find( (x) => x.url === window.location.pathname) === undefined) {
		    router.go("/");
		} else {
		    router.go(window.location.pathname);
		}		
	}

	go(url, suppressPushStates) {

		const route = this.routes.find(x => x.url === url);
		if (route !== undefined) {
			if (this.currentComponent !== undefined) {
				this.currentComponent.destroy();
			}

			this.container.innerHTML = "";

			this.currentComponent = new route.component(this.container, this);
			this.currentComponent.initialize();
		}

		if (!suppressPushStates) {
			history.pushState(url, "", url);
		}
	}
}