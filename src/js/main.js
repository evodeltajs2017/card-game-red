const contentContainer = document.querySelector(".content-container");
const router = new Router(contentContainer);

router.addRoute("/", Dashboard);
router.addRoute("/add-card-type", AddCardType);
router.addRoute("/card-types", CardTypes);
router.addRoute("/open-packs", OpenPacks);
router.addRoute("/card-collection", CardCollection);
router.addRoute("/view-decks", ViewDecks);
router.addRoute("/create-arena-deck", CreateArenaDeck);

router.initialize();

const navbarContainer = document.querySelector(".navbar-container");
const navbar = new Navbar(navbarContainer, router);
navbar.initialize();