const contentContainer = document.querySelector(".content-container");
const router = new Router(contentContainer);

router.addRoute("/", Dashboard);
router.addRoute("/add-card-type", AddCardType);
router.addRoute("/card-types", CardTypes);
router.addRoute("/open-packs", OpenPacks);
router.go("/");

const navbarContainer = document.querySelector(".navbar-container");
const navbar = new Navbar(navbarContainer, router);
navbar.initialize();