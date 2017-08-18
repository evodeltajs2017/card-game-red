class Game{
    constructor(container, playerName){
        this.container = container;
        this.attackingCard = null;
        this.playerName = playerName;
    }

    initialize() {
        const div = document.createElement("div");
        div.className = "game-container";
        this.container.appendChild(div);
        this.domElement = div;

        this.initializePlayers();
        this.render();
        this.initializeGame();
    }

    render(){
        this.domElement.innerHTML=`<div class="board-border">
                                    <div class="game-board">
                                        <div class="enemy-hero"></div>
                                        <button class="turn-button player">End Turn</button>
                                        <div class="player-name">${this.player.name}</div>
                                        <div class="enemy-health">30</div>
                                        <div class="player-health">30</div>
                                        <div class="enemy-mana">${this.AI.turnMana}\\${this.AI.maximalMana}</div>
                                        <div class="player-mana">${this.player.turnMana}\\${this.player.maximalMana}</div>
                                        <div class="mana-points"></div>
                                        <div class="player-deck deck-cards-number"></div>
                                        <div class="enemy-deck deck-cards-number"></div>
                                        <div class="player-hand"></div>
                                        <div class="enemy-hand"></div>
                                        <div class="player-board"></div>
                                        <div class="enemy-board"></div>
                                        <div class="zoomed-card"></div>
                                    </div>
                                   </div>`;
    }

    initializeGame(){
        this.initializeGameEventListeners();
        this.displayManaPoints();
        this.generateDecksAndStartTurn();
    }

    initializePlayers(){
        this.player = new Player(this.playerName, 0);
        this.AI = new Player("AI", 1);
        this.AI.isAI = true;
        this.currentPlayer = this.player;
    }

    initializeGameEventListeners(){
        this.domElement.querySelector(".turn-button").addEventListener("click", () => {this.endTurn();}, false);
        this.domElement.querySelector(".enemy-hero").addEventListener("click", () => {this.attackAIHero(this.attackingCard);}, false);

        this.addHoverDeckEventListener(this.AI, ".enemy-deck");
        this.addHoverDeckEventListener(this.player, ".player-deck");
    }

    addHoverDeckEventListener(player, deckClass){
        this.domElement.querySelector(deckClass).addEventListener("mouseover", (e) => {
            e.target.innerHTML = player.deck.length.toString();
        });

        this.domElement.querySelector(deckClass).addEventListener("mouseout", (e) => {
            e.target.innerHTML = "";
        });
    }

    displayManaPoints(){
        this.domElement.querySelector(".mana-points").innerHTML = "";
        for(let i=0; i < this.player.turnMana; i++){
            this.domElement.querySelector(".mana-points").innerHTML += `<div class="mana-point"></div>`;
        }
        for(let i=0; i < this.player.maximalMana - this.player.turnMana; i++){
            this.domElement.querySelector(".mana-points").innerHTML += `<div class="used-mana-point"></div>`;
        }
    }

    generateDecksAndStartTurn(){
        Promise.all([
            new CardRepository().generateDeck(),
            new CardRepository().generateDeck(),

        ]).then( data => {
                this.player.setDeck(data[0]);
                this.AI.setDeck(data[1]);
                this.initializeHand(this.player);
                this.initializeHand(this.AI);
                this.playTurn();
        });
    }

    initializeHand(player){
        for (let i=0; i<3; i++){
            let card = player.getNextCardFromDeck();
            player.addCardToHand(card);
        }
        this.renderHand(player);
    }

    isAIPlayer(player){
        return player.isAI === true;
    }

    renderHand(player){
        let handDivClassName = "";
        let handCardClassName = "";

        if(this.isAIPlayer(player)){
            handDivClassName = "enemy-hand";
            handCardClassName = "enemy-card";
        }else{
            handDivClassName = "player-hand";
            handCardClassName = " hand-card player-card";
        }

        const handDiv = this.domElement.querySelector(`.${handDivClassName}`);
        handDiv.innerHTML = "";

        this.renderCardsInHand(handDiv, handCardClassName, player);

        if(this.isAIPlayer(player)){
            handDiv.style.transform = "rotateX(180deg)";
        }
    }

    renderCardsInHand(handDiv, handCardClassName, player){
        let delay = 100;

        for(let i=0; i<player.hand.length ;i++){
            let card = new Card(handDiv, player.hand[i]);
            card.initialize();

            Array.from(handDiv.getElementsByClassName("card")).forEach( x => {
                x.className += ` ${handCardClassName}`;

                if(this.isAIPlayer(player)){
                    x.innerHTML = "";
                }
            });

            let handDivWidth = 1080;
            let cardsPosition = 353;
            if(this.isAIPlayer(player)){
                cardsPosition = 300;
            }

            this.setCardStyle(card, player.hand.length, i, handDivWidth, cardsPosition, delay);

            delay += 100;

            if(!this.isAIPlayer(player)){
                this.addEventListenersOnPlayerCardInHand(card);
            }
        }
    }

    addEventListenersOnPlayerCardInHand(card){
        card.addClickEventListener(() => {this.playCard(card);});
        card.addHoverEventListener(() => {this.zoomCard(card);}, () => {this.hideZoomedCard();});
        this.hideZoomedCard();
    }

    setInitialCardStyle(card){
        card.domElement.style.position = "absolute";
        card.domElement.style.left = "1000px";
        card.domElement.style.top = "0px";
        card.domElement.style.transition = "all 1.5s ease-in-out";
        card.domElement.style.transform = `scale(0,0) rotate(0deg)`;
    }

    setCardStyle(card, cardsNumber, index, divWidth, cardsPosition, delay){

        const cardWidth = 80;
        let x = (divWidth - cardsNumber*cardWidth/2)/2 + index * 30;
        let rotationDeg = -10*cardsNumber/2 + (index*10);
        let animationDelay = delay;

        if(card.cardData.isAnimatable !== undefined && card.cardData.isAnimatable === true){
            card.cardData.isAnimatable = false;
            this.setInitialCardStyle(card);

        }else{
            card.domElement.style.transition = "none";
            animationDelay = -1;
        }

        setTimeout(() => {
            card.domElement.style.position = "absolute";
            card.domElement.style.left = x + "px";
            card.domElement.style.top = cardsPosition + "px";
            card.domElement.style.transform = `scale(1,1) rotate(${rotationDeg}deg)`;
        }, animationDelay);
    }

    playCard(card){
        if(!this.isAIPlayer(this.currentPlayer)){
            card = card.cardData;
        }

        if(!this.isCardPlayable(card)){
            alert("Not enough mana!");
            return;
        }

        if(this.isBoardFull()){
            alert("Board full! It already contains 7 cards!");
            return;
        }

        this.currentPlayer.addInactiveCard(card);

        this.currentPlayer.addCardToBoard(card);
        this.removeCardFromHand(card);

        this.currentPlayer.decrementTurnMana(card.Cost);
        this.updateManaOnScreen();

        let boardDiv = null;
        if(this.isAIPlayer(this.currentPlayer)){
            boardDiv = this.domElement.querySelector(".enemy-board");
        }else{
            boardDiv = this.domElement.querySelector(".player-board");
        }

        this.renderCardsOnBoard(boardDiv, this.currentPlayer);
        this.highlightPossibleMoves();
    }

    isCardPlayable(card){
        return this.currentPlayer.turnMana >= card.Cost;
    }

    removeCardFromHand(card){
        this.currentPlayer.removeCardFromHand(card);
        this.renderHand(this.currentPlayer);
    }

    updateManaOnScreen(){
        if(this.isAIPlayer(this.currentPlayer)){
            this.domElement.querySelector('.enemy-mana').innerHTML = `${this.AI.turnMana}\\${this.AI.maximalMana}`;
        }else{
            this.domElement.querySelector('.player-mana').innerHTML = `${this.player.turnMana}\\${this.player.maximalMana}`;
            this.displayManaPoints();
        }
    }

    renderCardsOnBoard(boardDiv, player){
        boardDiv.innerHTML = "";

        player.cardsOnBoard.forEach(x => {
            let card = new Card(boardDiv, x);
            card.initialize();

            this.addEventListenerForPlayedCardOnBoard(player, card);

            Array.from(boardDiv.getElementsByClassName("card")).forEach( x => {
                x.className += " hand-card player-card card-on-board";
            });
        });
    }

    addEventListenerForPlayedCardOnBoard(player, card){
        if(this.isAIPlayer(player)){
            card.addClickEventListener(() => { this.attackAICard(card);});
        }else {
            card.addClickEventListener(() => { this.setAttackingCard(card);});
        }
    }

    setAttackingCard(card){
        this.attackingCard = card;
        console.log("attack with", card);
    }

    endTurn(){
        if(this.isAIPlayer(this.currentPlayer)){
            this.currentPlayer = this.player;
            this.resetTurnButton("player", "End Turn");
        }else{
            this.currentPlayer = this.AI;
            this.resetTurnButton("enemy", "Enemy Turn");
        }

        debugger;
        this.playTurn();
    }

    playTurn(){
        setTimeout(() => {
            this.resetPossibleMoves();

            this.currentPlayer.resetInactiveCards();

            this.currentPlayer.initializeManaForNewTurn();
            this.updateManaOnScreen();

            if(this.isDeckEmpty()){
                this.damagePlayerForEmptyDeck(this.currentPlayer);
            }

            let card = this.currentPlayer.getNextCardFromDeck();

            if(this.currentPlayer.hand.length < 10){
                this.currentPlayer.addCardToHand(card);
            }else{
                this.burnCard(card);
            }

            this.renderHand(this.currentPlayer);

            if(this.currentPlayer.name === "AI"){
                this.playAIRole();
            }else{
                this.highlightPossibleMoves();
            }
        }, 1500);
    }

    isDeckEmpty(){
        return this.currentPlayer.deck.length === 0;
    }

    damagePlayerForEmptyDeck(player){
        player.emptyDeckDamage++;
        player.decrementHealth(player.emptyDeckDamage);
        this.renderHealth(player);
        alert(`Deck is empty! -${player.emptyDeckDamage} Fatigue!`);
    }

    burnCard(card){
        alert("My hand is full!");
        console.log(card, "burned");
    }

    resetTurnButton(buttonCssClass, innerHTML) {
        this.domElement.querySelector(".turn-button").className = `turn-button ${buttonCssClass}`;
        this.domElement.querySelector(".turn-button").innerHTML = innerHTML;
    }

    playAIRole(){
        setTimeout(() => {
            this.currentPlayer.cardsOnBoard.forEach( x => this.damageOpponent(x));

            setTimeout(() => {
                let playableCards = [];
                do{
                    playableCards = this.getPlayableCards();

                    if (playableCards.length !== 0){
                        let cardToBePlayed = this.getCardWithMaximumDamage(playableCards);
                        this.playCard(cardToBePlayed);
                    }

                }while(playableCards.length !== 0 && !this.isBoardFull());

                this.endTurn();

            }, 1000);
        }, 1600);
    }

    damageOpponent(card){
        let opponent = (this.isAIPlayer(this.currentPlayer)) ? this.player : this.AI;

        opponent.decrementHealth(card.Damage);
        this.renderHealth(opponent);
        console.log('damaged ', opponent.name, " with card", card);

        if(opponent.health <= 0){
            this.endGame();
        }
    }

    getPlayableCards(){
        return this.currentPlayer.hand.filter(x => x.Cost <= this.currentPlayer.turnMana);
    }

    getCardWithMaximumDamage(playableCards){
        let maximumDamage = 0;
        playableCards.forEach(x => {
            if(x.Damage > maximumDamage){
                maximumDamage = x.Damage;
            }
        });

        return playableCards.find( x => x.Damage === maximumDamage);
    }

    highlightPossibleMoves(){
        this.resetPossibleMoves();

        let playableCards = this.player.hand.find(x => x.Cost <= this.player.turnMana);
        if(this.player.turnMana === 0 || playableCards === undefined){
            this.domElement.querySelector(".turn-button").className += " possible-move";
        }

        Array.from(this.domElement.querySelector(".player-hand").getElementsByClassName(" hand-card card")).forEach(x => {
            let cost = parseInt(x.querySelector(".card-cost").innerHTML);
           if(cost <= this.player.turnMana){
               x.className += " possible-move";
           }
        });
    }

    resetPossibleMoves(){
        Array.from(this.domElement.getElementsByClassName("possible-move")).forEach( x => {
           x.className = x.className.replace("possible-move", "");
        });
    }

    attackAIHero(card){
        card = card.cardData;
        if(this.isCardInactive(card)){
           return;
        }

        if(this.attackingCard === null){
            return;
        }

        this.damageOpponent(card);
        this.attackingCard = null;
        this.player.addInactiveCard(card);
    }

    attackAICard(targetCard){

        let card = targetCard.cardData;

        if(this.attackingCard === null){
            return;
        }
        if(this.isCardInactive(this.attackingCard.cardData)){
            return;
        }

        let cardDamage = card.Damage;
        this.AI.damageCard(card, this.attackingCard.cardData.Damage);
        this.player.damageCard(this.attackingCard.cardData, cardDamage);

        this.player.addInactiveCard(this.attackingCard.cardData);

        setTimeout(() => {
            this.renderCardsOnBoard(this.domElement.querySelector(".player-board"), this.player);
            this.renderCardsOnBoard(this.domElement.querySelector(".enemy-board"), this.AI);
        }, 10);

        this.attackingCard = null;
    }

    isCardInactive(card){
        return this.player.inactiveCards.indexOf(card) !== -1;
    }

    endGame(){
        this.displayWinner();
        this.removeEventListenersFromPage();
    }

    displayWinner(){
        if(this.player.health <= 0){
            alert("AI won!");
        }else{
            alert(`${this.player.name} won!`);
        }
    }

    removeEventListenersFromPage(){
        let clone = this.domElement.cloneNode(true);
        this.domElement.parentNode.replaceChild(clone, this.domElement);
    }

    zoomCard(card){
        let zoomDiv = this.domElement.querySelector(".zoomed-card");
        zoomDiv.style.display = "inline-block";
        let zoomedCard = new Card(zoomDiv, card.cardData);
        zoomedCard.initialize();
    }

    hideZoomedCard(){
        this.domElement.querySelector(".zoomed-card").innerHTML = "";
        this.domElement.querySelector(".zoomed-card").style.display = "none";
    }

    renderHealth(player){
        let divClass = (this.isAIPlayer(player)) ? ".enemy-health" : ".player-health";
        this.domElement.querySelector(divClass).innerHTML = player.health;
    }

    isBoardFull(){
        return this.currentPlayer.cardsOnBoard.length === 7;
    }
}