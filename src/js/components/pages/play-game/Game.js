class Game{
    constructor(container, playerName){
        this.container = container;
        this.attackingCard = null;
        this.playerName = playerName;
        this.AICardsOnBoard = [];
        this.isAnimationInProgress = false;
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
                                        <div class="player-hero"></div>
                                        <button class="turn-button player">End Turn</button>
                                        <div class="player-name">${this.player.name}</div>
                                        <div class="enemy-health">${this.AI.health}</div>
                                        <div class="player-health">${this.player.health}</div>
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
        this.domElement.querySelector(".turn-button").addEventListener("click", () => {
            if(this.currentPlayer === this.player && !this.isAnimationInProgress){
                this.endTurn();
            }}, false);
        this.domElement.querySelector(".enemy-hero").addEventListener("click", () => {
            if(this.attackingCard !== null && !this.isAnimationInProgress) {
                this.attackAIHero(this.attackingCard);
            }}, false);

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
        card.addClickEventListener(() => {
            if(this.isAnimationInProgress){return;}
            this.playCard(card);
        });
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


        this.isAnimationInProgress = true;

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

            setTimeout(() => {this.isAnimationInProgress = false;}, 1500);
        }, animationDelay);
    }

    playCard(card){
        let cardElement = card;

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

        if(!this.isAIPlayer(this.currentPlayer)){
            this.isAnimationInProgress = true;
            cardElement.domElement.style.top = "0";
            cardElement.domElement.style.opacity = "0";
            cardElement.domElement.style.transform = "none";
            cardElement.domElement.style.transition = "all 0.6s ease-in";
            setTimeout(() => {this.playSelectedCard(card)}, 1000);
            setTimeout(() => {this.isAnimationInProgress = false;}, 1100);

        }else{
            this.playSelectedCard(card);
        }
    }

    playSelectedCard(card){
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

        if(this.isAIPlayer(player)){
            this.AICardsOnBoard = [];
        }

        player.cardsOnBoard.forEach( (x, index) => {
            let card = new Card(boardDiv, x);
            card.initialize();

            if(this.isAIPlayer(player)){
                this.AICardsOnBoard.push(card);
            }

            card.domElement.style.position = "absolute";
            card.domElement.style.top = "0";
            card.domElement.style.left = `${(952 - 100 * player.cardsOnBoard.length)/2 + 100*index}px`;

            this.addEventListenerForPlayedCardOnBoard(player, card);

            Array.from(boardDiv.getElementsByClassName("card")).forEach( x => {
                x.className += " hand-card player-card card-on-board";
                x.style.opacity = "0";

                setTimeout(() => {
                    x.style.opacity = "1";
                    x.style.transition = "opacity 0.4s ease-in-out";
                }, 100);
            });
        });
    }

    addEventListenerForPlayedCardOnBoard(player, card){
        if(this.isAIPlayer(player)){
            card.addClickEventListener(() => {
                if(this.isAnimationInProgress){return;}
                this.attackAICard(card);
            });
        }else {
            card.addClickEventListener(() => {
                debugger;
                if(this.isAnimationInProgress){return;}
                this.setAttackingCard(card);
            });
        }
    }

    setAttackingCard(card){
        debugger;

        if(this.attackingCard !== null && this.attackingCard === card){
            this.attackingCard.domElement.style.filter = "none";
            this.attackingCard = null;
            return;
        }

        if(this.attackingCard !== null) {
            this.attackingCard.domElement.style.filter = "none";
        }

        this.attackingCard = card;

        if(this.player.inactiveCards.indexOf(card.cardData) === -1) {
            if(this.player.attackedThisTurn.indexOf(card.cardData) === -1) {
                this.attackingCard.domElement.style.filter = "brightness(150%)";
            }else{
                alert("This minion already attacked this turn!");
                this.attackingCard = null;
            }
        }else{
            alert("This minion can attack only next turn!");
            this.attackingCard = null;
        }
    }

    endTurn(){
        if(this.isAIPlayer(this.currentPlayer)){
            this.currentPlayer = this.player;
            this.domElement.querySelector(".turn-button").removeAttribute("disabled");
            this.resetTurnButton("player", "End Turn");
        }else{
            this.currentPlayer = this.AI;
            this.domElement.querySelector(".turn-button").disabled = true;
            this.resetTurnButton("enemy", "Enemy Turn");
        }

        this.playTurn();
    }

    playTurn(){
        this.isAnimationInProgress = true;
        setTimeout(() => {
            this.resetPossibleMoves();

            this.currentPlayer.resetInactiveCards();

            if(!this.isAIPlayer(this.currentPlayer)){
                this.notPlayableCardsOnBoard = [];
            }

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
        setTimeout(() => {this.isAnimationInProgress = false;}, 1500);
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

    attackPlayerHero(cardData){

        this.isAnimationInProgress = true;

        let card = this.AICardsOnBoard.find( x => x.cardData === cardData);
        let index = this.findIndexInArray(this.AI.cardsOnBoard, cardData);

        card.domElement.style.position = "absolute";
        card.domElement.style.top = "300px";
        card.domElement.style.left = `${(952-100)/2}px`;
        card.domElement.style.zIndex = "1";
        card.domElement.style.transition = "all 0.7s ease";

        setTimeout(() => {
            this.domElement.querySelector(".player-hero").style.boxShadow = "inset 0px 0px 160px -5px #E30303";
        }, 350);

        setTimeout(() => {
            this.domElement.querySelector(".player-hero").style.boxShadow = "none";

            card.domElement.style.top = "0px";
            card.domElement.style.left = `${(952 - 100 * this.AI.cardsOnBoard.length) / 2 + 100 * index}px`;
            card.domElement.style.opacity = "1";

            setTimeout(() => {
                this.damageOpponent(cardData, this.AI);
            }, 700);
        }, 700);

        setTimeout(() => {this.isAnimationInProgress = false;}, 1500);
    }

    playAIRole(){
        this.isAnimationInProgress = true;
        setTimeout(() => {
            let delay = this.AI.cardsOnBoard.length * 2000 + 100;
            this.AI.cardsOnBoard.forEach( (x, index) => setTimeout( () => {
                this.attackPlayerHero(x);
            }, 1400 * index));

            setTimeout(() => {
                let playableCards = [];
                do{
                    playableCards = this.getPlayableCards();

                    if (playableCards.length !== 0){
                        let cardToBePlayed = this.getCardWithMaximumDamage(playableCards);
                        this.playCard(cardToBePlayed);
                    }

                }while(playableCards.length !== 0 && !this.isBoardFull());

                setTimeout(() => {
                    this.endTurn();
                    this.isAnimationInProgress = false;
                }, 1000);

            },delay);
        }, 1700);
    }

    damageOpponent(card, player){
        let opponent = (this.isAIPlayer(player)) ? this.player : this.AI;

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
        if(this.player.turnMana === 0 || ( playableCards === undefined && this.player.cardsOnBoard.length - this.player.inactiveCards.length === 0 )){
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

    findIndexInArray(array, element){
        return array.indexOf(element);
    }

    attackAIHero(card){
        this.isAnimationInProgress = true;

        let index = this.findIndexInArray(this.player.cardsOnBoard, card.cardData);

        card.domElement.style.position = "absolute";
        card.domElement.style.top = "-300px";
        card.domElement.style.left = `${(952-100)/2}px`;
        card.domElement.style.zIndex = "1";
        card.domElement.style.transition = "all 0.7s ease";

        setTimeout(() => {
            this.domElement.querySelector(".enemy-hero").style.boxShadow = "inset 0px 0px 160px -5px #E30303";
        }, 350);

        setTimeout(() => {

            this.domElement.querySelector(".enemy-hero").style.boxShadow = "none";

            card.domElement.style.top = "0px";
            card.domElement.style.left = `${(952 - 100 * this.player.cardsOnBoard.length)/2 + 100*index}px`;
            card.domElement.style.opacity = "1";

            setTimeout(() => {
                card.domElement.style.zIndex = "1";
                card = card.cardData;
                if(this.isCardInactive(card)){
                    return;
                }

                if(this.attackingCard === null){
                    return;
                }

                this.damageOpponent(card, this.player);
                this.attackingCard.domElement.style.filter = "none";
                this.attackingCard = null;
                this.player.addAlreadyAttackedThisTurnCard(card);


                setTimeout(() => {this.isAnimationInProgress = false;}, 100);

                this.highlightPossibleMoves();
            }, 700);
        }, 600);
    }

    getAttackDirection(targetIndex, attackIndex){
        if(targetIndex-attackIndex === 0){
            return "middle";
        }
        return (targetIndex-attackIndex < 0) ? "right" : "left";
    }

    attackAICard(targetCard){
        this.isAnimationInProgress = true;

        let targetCardIndex = this.findIndexInArray(this.AI.cardsOnBoard, targetCard.cardData);
        let attackingCardIndex = this.findIndexInArray(this.player.cardsOnBoard, this.attackingCard.cardData);

        this.attackingCard.domElement.style.position = "absolute";
        this.attackingCard.domElement.style.top = "-130px";
        this.attackingCard.domElement.style.left = `${(952 - 100 * this.AI.cardsOnBoard.length)/2 + 100* targetCardIndex}px`;
        this.attackingCard.domElement.style.zIndex = "2";
        this.attackingCard.domElement.style.transition = "all 0.7s ease";

        targetCard.domElement.style.zIndex = "1";

        setTimeout(() => {
            targetCard.domElement.style.top = "-15px";
            let targetMovementTrajectory = 0;
            switch(this.getAttackDirection(targetCardIndex, attackingCardIndex)) {
                case "left" :
                    targetMovementTrajectory = 15;
                    break;
                case "right" :
                    targetMovementTrajectory = -15;
                    break;
                default :
                    break;
            }
            targetCard.domElement.style.left = `${(952 - 100 * this.AI.cardsOnBoard.length)/2 + 100 * targetCardIndex + targetMovementTrajectory}px`;
            targetCard.domElement.style.boxShadow = "inset 0px 0px 65px 8px #E30303";
            targetCard.domElement.style.transition = "all 0.4s ease-in-out";
        }, 350);


        setTimeout(() => {

            this.attackingCard.domElement.style.top = "0px";
            this.attackingCard.domElement.style.left = `${(952 - 100 * this.player.cardsOnBoard.length)/2 + 100*attackingCardIndex}px`;
            this.attackingCard.domElement.style.opacity = "1";

            targetCard.domElement.style.top = "0px";
            targetCard.domElement.style.left = `${(952 - 100 * this.AI.cardsOnBoard.length)/2 + 100 * targetCardIndex}px`;
            targetCard.domElement.style.boxShadow = "none";

            setTimeout(() => {
                targetCard.domElement.style.filter = "brightness(150%)";

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

                debugger;

                if(card.Health <= 0){
                    this.dieCardAnimation(targetCard);
                }
                if(this.attackingCard.cardData.Health <= 0){
                    this.dieCardAnimation(this.attackingCard);
                }

                setTimeout(() => {
                    targetCard.domElement.style.filter = "none";
                    this.attackingCard.domElement.style.filter = "none";

                    this.player.addAlreadyAttackedThisTurnCard(this.attackingCard.cardData);

                    setTimeout(() => {
                        this.renderCardsOnBoard(this.domElement.querySelector(".player-board"), this.player);
                        this.renderCardsOnBoard(this.domElement.querySelector(".enemy-board"), this.AI);
                    }, 10);

                    this.attackingCard.domElement.style.zIndex = "1";
                    this.attackingCard = null;

                    setTimeout(() => {this.isAnimationInProgress = false;}, 100);
                    this.highlightPossibleMoves();
                }, 700);
            }, 700);
        }, 600);
    }

    dieCardAnimation(card){
        card.domElement.style.opacity = "0";
        card.domElement.style.scale = "(1.1, 1.1)";
        card.domElement.style.transition = "all 1s ease-in-out";
    }

    isCardInactive(card){
        return this.player.inactiveCards.indexOf(card) !== -1 || this.player.attackedThisTurn.indexOf(card) !== -1;
    }

    endGame(){
        this.displayWinner();
    }

    displayWinner(){
        let winnerName = (this.AI.health <= 0) ? this.player.name : "Computer AI";

        const div = document.createElement("div");
        div.className = "winner-div";
        div.innerHTML = `<div style="text-align: center; width: 100%">
                            <div class="winner-name">${winnerName} won!</div>
                            <button class="play-again">Play again!</button>
                          </div>`;
        this.domElement.appendChild(div);

        div.querySelector(".play-again").addEventListener("click", () => {
            document.querySelector(".winner-div").style.display = "none";
            document.querySelector(".winner-div").style.innerHTML = "";
            this.domElement.innerHTML = "";
            this.initialize();
        }, false);
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