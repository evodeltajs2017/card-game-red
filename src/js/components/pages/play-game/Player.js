class Player{
    constructor(name, initialMana) {
        this.isAI = false;
        this.name = name;
        this.deck = [];
        this.hand = [];
        this.maximalMana = initialMana;
        this.turnMana = initialMana;
        this.health = 30;
        this.cardsOnBoard = [];
        this.inactiveCards = [];
        this.emptyDeckDamage = 0;
        this.attackedThisTurn = [];
    }

    setDeck(deck){
        this.deck = deck;
    }

    getNextCardFromDeck(){
        let card = this.deck[Math.floor(Math.random() * this.deck.length)];
        this.deck = this.removeCardFromArray(this.deck, card);
        return card;
    }

    removeCardFromArray(array, card){
        array.splice(array.indexOf(card), 1);
        return array;
    }

    resetInactiveCards(){
        this.inactiveCards = [];
        this.attackedThisTurn = [];
    }

    addInactiveCard(card){
        this.inactiveCards.push(card);
    }

    addAlreadyAttackedThisTurnCard(card){
        this.attackedThisTurn.push(card);
    }

    damageCard(card, damage){
        this.cardsOnBoard.forEach( x => { if (x === card) {
            x.Health -= damage;
            if(x.Health <= 0) {
                this.removePlayedCardFromBoard(x);
            }
        } } );
    }

    addCardToHand(card){
        card.isAnimatable = true;
        this.hand.push(card);
    }

    addCardToBoard(card){
        this.cardsOnBoard.push(card);
    }

    removePlayedCardFromBoard(card){
        this.cardsOnBoard = this.removeCardFromArray(this.cardsOnBoard, card);
    }

    removeCardFromHand(card){
        this.hand = this.removeCardFromArray(this.hand, card);
    }

    initializeManaForNewTurn(){
        if(this.maximalMana < 10){
            this.maximalMana++;
        }
        this.turnMana = this.maximalMana;
    }

    decrementTurnMana(amount){
        this.turnMana -= amount;
    }

    decrementHealth(amount){
        this.health -= amount;
    }

}