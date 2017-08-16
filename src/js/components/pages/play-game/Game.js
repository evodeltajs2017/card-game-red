class Game{
    constructor(container){
        this.container = container;
    }

    initialize(playerName) {
        this.player = new Player(playerName);
        this.AI = new Player("AI");
        this.currentPlayer = this.player;

        const div = document.createElement("div");
        div.className = "game-container";
        this.container.appendChild(div);
        this.domElement = div;

        this.render();
        this.initializeGame();

        setTimeout(() => { this.playTurn();}, 1000);
    }

    render(){
        this.domElement.innerHTML=`<div class="board-border">
                                    <div class="game-board">
                                        <button class="turn-button player">End Turn</button>
                                        <div class="player-name">${this.player.name}</div>
                                        <div class="enemy-health">30</div>
                                        <div class="player-health">30</div>
                                        <div class="enemy-mana">${this.AI.turnMana}\\${this.AI.maximalMana}</div>
                                        <div class="player-mana">${this.player.turnMana}\\${this.player.maximalMana}</div>
                                        <div class="mana-points"></div>
                                        <div class="player-deck"></div>
                                        <div class="enemy-deck"></div>
                                        <div class="player-hand"></div>
                                        <div class="enemy-hand"></div>
                                        <div class="player-played-cards"></div>
                                        <div class="enemy-played-cards"></div>
                                    </div>
                                   </div>`;
    }

    initializeGame(){
        this.domElement.querySelector(".turn-button").addEventListener("click", () => {this.endTurn();}, false);
        this.displayManaPoints();
        this.getGeneratedDeckForPlayer(this.AI, () => {this.initializeHand(this.AI);});
        this.getGeneratedDeckForPlayer(this.player, () => {this.initializeHand(this.player);});
    }

    getGeneratedDeckForPlayer(player, callback){
        new CardRepository().generateDeck()
            .then(
                (data) => {
                    player.setDeck(data);
                    callback();
                }
            );
    }

    initializeHand(player){
        for (let i=0; i<3; i++){
            player.addCardToHand(player.getNextCard());
        }
        this.renderHand(player);
    }

    renderHand(player){
        let divClassName = "";
        let cardClassName = "";
        if(this.isAIPlayer(player)){
            divClassName = "enemy-hand";
            cardClassName = "enemy-card";
        }else{
            divClassName = "player-hand";
            cardClassName = " hand-card player-card";
        }

        const handDiv = this.domElement.querySelector(`.${divClassName}`);
        handDiv.innerHTML = "";

        for(let i=0; i<player.hand.length ;i++){
            let card = new Card(handDiv, player.hand[i]);
            card.initialize();

            Array.from(handDiv.getElementsByClassName("card")).forEach( x => {
                x.className += ` ${cardClassName}`;
                if(this.isAIPlayer(player)){
                    x.innerHTML = "";
                }
            });

            let divWidth = 500;
            if(this.isAIPlayer(player)){
                divWidth = 700;
            }
            this.setCardStyle(card, player.hand.length, i, divWidth);

            if(!this.isAIPlayer(player)){
                card.addClickEventListener(() => { this.playCard(card); });
            }
        }

        if(this.isAIPlayer(player)){
            handDiv.style.transform = "rotate(180deg)";
        }
    }

    setCardStyle(card, cardsNumber, index, divWidth){
        let x = (divWidth - cardsNumber*40)/2 + index * 30;
        let rotationDeg = -10*cardsNumber/2 + (index*10);

        card.domElement.style.position = "absolute";
        card.domElement.style.left = x + "px";
        card.domElement.style.transform = `rotate(${rotationDeg}deg)`;
    }

    endTurn(){
        if(this.isAIPlayer(this.currentPlayer)){
            this.currentPlayer = this.player;
            this.resetTurnButton("player", "End Turn");
        }else{
            this.currentPlayer = this.AI;
            this.resetTurnButton("enemy", "Enemy Turn");
        }

        this.playTurn();
    }

    resetTurnButton(buttonCssClass, innerHTML){
        this.domElement.querySelector(".turn-button").className = `turn-button ${buttonCssClass}`;
        this.domElement.querySelector(".turn-button").innerHTML = innerHTML;
    }

    updateManaOnScreen(){
        if(this.isAIPlayer(this.currentPlayer)){
            this.domElement.querySelector('.enemy-mana').innerHTML = `${this.AI.turnMana}\\${this.AI.maximalMana}`;
        }else{
            this.domElement.querySelector('.player-mana').innerHTML = `${this.player.turnMana}\\${this.player.maximalMana}`;
            this.displayManaPoints();
        }
    }

    burnCard(card){
        alert("My hand is full!");
    }

    isCardPlayable(card){
        return this.currentPlayer.turnMana >= card.Cost;
    }

    damageOpponent(card){
        if(this.isAIPlayer(this.currentPlayer)){
            this.player.decrementHealth(card.Damage);
        }
    }

    useCardEffect(card){
         if(this.isAIPlayer(this.currentPlayer)){
             this.currentPlayer.removePlayedCard(card);
             this.renderCardsOnBoard(this.domElement.querySelector(".enemy-played-cards"));
             this.damageOpponent(card);
             this.renderHealth(this.player);
         }else{

         }
    }

    playCard(card){
        if(!this.isAIPlayer(this.currentPlayer)){
            card = card.cardData;
        }

        if(!this.isCardPlayable(card)){
            alert("Not enough mana!");
            return;
        }

        this.currentPlayer.addCardToBoard(card);
        this.removeCardFromHand(card);

        this.currentPlayer.decrementTurnMana(card.Cost);
        this.updateManaOnScreen();

        let boardDiv = null;
        if(this.isAIPlayer(this.currentPlayer)){
            boardDiv = this.domElement.querySelector(".enemy-played-cards");
        }else{
            boardDiv = this.domElement.querySelector(".player-played-cards");
        }

        this.renderCardsOnBoard(boardDiv);
    }

    removeCardFromHand(card){
        console.log('handbefore', this.currentPlayer.hand);
        this.currentPlayer.removeCardFromHand(card);
        console.log('handafter', this.currentPlayer.hand);
        this.renderHand(this.currentPlayer);
    }

    renderCardsOnBoard(boardDiv){
        boardDiv.innerHTML = "";
            this.currentPlayer.cardsOnBoard.forEach(x => {
                let card = new Card(boardDiv, x);
                card.initialize();

                card.addClickEventListener(() => {this.chooseWhatToAttack(card);});

                Array.from(boardDiv.getElementsByClassName("card")).forEach( x => {
                    x.className += " hand-card player-card card-on-board";
                });
        });
    }

    chooseWhatToAttack(card){
        console.log("attack with", card);
    }

    isAIPlayer(player){
        return player.name === "AI";
    }

    isDeckEmpty(){
        return this.currentPlayer.deck.length === 0;
    }

    playAIRole(){
        this.currentPlayer.cardsOnBoard.forEach( x => this.useCardEffect(x));

        setTimeout(() => {
            let playableCards = [];
            do{
                playableCards = this.currentPlayer.hand.filter(x => x.Cost <= this.currentPlayer.turnMana);
                if (playableCards.length !== 0){
                    let maximumDamage = 0;
                    playableCards.forEach(x => {
                        if(x.Damage > maximumDamage){
                            maximumDamage = x.Damage;
                        }
                    });

                    console.log(maximumDamage);
                    let cardToBePlayed = playableCards.find( x => x.Damage === maximumDamage);

                    console.log(cardToBePlayed);

                    this.playCard(cardToBePlayed);
                }
            }while(playableCards.length !== 0);

            this.endTurn();
        }, 1000);

    }

    playPlayerRole(){
        this.highlightPossibleMoves(); //TODO: reset + check other cases
    }

    highlightPossibleMoves(){
        debugger;
        let playableCards = this.currentPlayer.hand.find(x => x.Cost <= this.currentPlayer.turnMana);
        if(this.currentPlayer.turnMana === 0 || playableCards === undefined){
            this.domElement.querySelector(".turn-button").style.boxShadow = " 0px 0px 152px 50px rgba(187,218,85,1)";
        }
    }

    playTurn(){
        this.currentPlayer.initializeManaForNewTurn();
        this.updateManaOnScreen();

        if(this.isDeckEmpty()){
            this.currentPlayer.emptyDeckDamage++;
            this.currentPlayer.decrementHealth(this.currentPlayer.emptyDeckDamage);
            this.renderHealth(this.currentPlayer);
            alert(`Deck is empty! -${this.currentPlayer.emptyDeckDamage} Fatigue!`);
        }

        let card = this.currentPlayer.getNextCard();
        if(this.currentPlayer.hand.length < 10){
            this.currentPlayer.addCardToHand(card);
        }else{
            this.burnCard(card);
        }
        this.renderHand(this.currentPlayer);

        if(this.currentPlayer.name === "AI"){
            this.playAIRole();
        }else{
            this.playPlayerRole();
        }
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

    renderHealth(player){
        let divClass = (this.isAIPlayer(player)) ? ".enemy-health" : ".player-health";
        this.domElement.querySelector(divClass).innerHTML = player.health;
    }
}