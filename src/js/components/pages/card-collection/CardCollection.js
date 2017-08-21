class CardCollection {
	constructor(container) {
		this.container = container;
	}

	initialize() {
		const domElement = new HtmlElements();
		this.domElement = domElement.createCardCollection();
		this.generateFirstCards();
		this.generateCollectionOnScroll();
		this.eventsForSearch();
	}

	displayCollection(cards, pageIndex) {

		if (pageIndex === 0) {
			this.domElement.querySelector(`.card-collection-content`).innerHTML = "";
		}

		for (let i = 0; i < cards.length; i++) {
			let card = new Card(this.domElement.querySelector(`.card-collection-content`), cards[i]);
			card.initialize();
			Array.from(this.domElement.getElementsByClassName("card")).forEach( x => {x.className = "card-view";} );
		}
	}

	generateFirstCards() {
		this.getNextCards( (cards) => { this.displayCollection(cards, 0) }, 0);
		this.getNextCards( (cards) => { this.displayCollection(cards, 1) }, 1);
	}

	generateCollectionOnScroll() {
		let pageIndex = 2;
		let lastScrollTop = 0;

		this.scrollHandler = () => {
			let bodyHeight = document.documentElement.scrollHeight - window.innerHeight;
			let scrollPercentage = (window.pageYOffset / (bodyHeight));
			let pos = window.pageYOffset || document.documentElement.scrollTop;
			let processing = false;

			if (processing) { return false; }

			if (pos > lastScrollTop && scrollPercentage > 0.95) {
				let searchName = this.getSearchInput();
				processing = true;

				if (pageIndex <= this.totalPages) {
					this.getNextCards( (cards) => { this.displayCollection(cards, pageIndex); processing = false; }, pageIndex, searchName);
					pageIndex++;
				}					    	
			}
			lastScrollTop = pos;
		}
		window.addEventListener("scroll", this.scrollHandler, false);
	}

	getNextCards(callback, pageIndex, searchName) {
		const card = new CardCollectionRepository();
		card.getCards(pageIndex, searchName).then( (response) => { this.totalPages = response.Pages; callback(response.Cards, response.Pages); });
	}

	eventsForSearch() {
		this.domElement.querySelector(".search-button").addEventListener("click", () => { 
			this.onSearch();
		}, false);
		this.domElement.querySelector(".search-input").addEventListener("keyup", (e) => {
		    if (e.keyCode == 13) {
		        this.onSearch();
		    }
		}, false);
	}

	getSearchInput() {
		return this.domElement.querySelector(`.search-input`).value;
	}

	onSearch() {
		let searchValue = this.getSearchInput();
		this.getNextCards((cards) => { this.displayCollection(cards, 0) }, 0, searchValue);
		this.getNextCards((cards) => { this.displayCollection(cards, 1) }, 1, searchValue);
		this.generateCollectionOnScroll();
	}

	destroy() {
		window.removeEventListener("scroll", this.scrollHandler, false);
	}
}