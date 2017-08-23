class CardCollection {
	constructor(container) {
		this.container = container;
		this.searchValue = undefined;
		this.pageIndex = undefined;
	}

	initialize() {
		const domElement = new HtmlElements();
		this.domElement = domElement.createCardCollection();
		this.onSearch();
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

	generateCollectionOnScroll() {
		let lastScrollTop = 0;

		this.scrollHandler = () => {
			let bodyHeight = document.documentElement.scrollHeight - window.innerHeight;
			let scrollPercentage = (window.pageYOffset / (bodyHeight));
			let pos = window.pageYOffset || document.documentElement.scrollTop;

			if (pos > lastScrollTop && scrollPercentage >= 0.95) {
				console.log(this.pageIndex + "--pageIndex");
				console.log(this.totalPages);
				if (this.pageIndex <= this.totalPages) {
					setTimeout(this.getNextCards.bind(this, (cards, page) => { this.displayCollection(cards, page) }, this.pageIndex), this.pageIndex * 100);
					this.pageIndex++;
				} else {
					return;
				}					    	
			}
			lastScrollTop = pos;
		}
		window.addEventListener("scroll", this.scrollHandler, false);
	}

	getNextCards(callback, pageIndex) {
		const card = new CardCollectionRepository();
		card.getCards(pageIndex, this.searchValue).then( (response) => { this.totalPages = response.Pages; callback(response.Cards, response.Pages); });
	}

	eventsForSearch() {
		this.domElement.querySelector(".search-input").addEventListener("input", () => {
			this.onSearch();
		})
	}

	getSearchInput() {
		return this.domElement.querySelector(`.search-input`).value;
	}

	onSearch() {
		this.searchValue = this.getSearchInput();
		this.getNextCards((cards) => { this.displayCollection(cards, 0) }, 0);
		setTimeout(this.getNextCards.bind(this, (cards) => { this.displayCollection(cards, 1) }, 1), 100);
		this.pageIndex = 2;
	}

	destroy() {
		window.removeEventListener("scroll", this.scrollHandler, false);
	}
}