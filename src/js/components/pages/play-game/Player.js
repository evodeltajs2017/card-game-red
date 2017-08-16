class Player{
    constructor(name){
        this.name = name;
        this.deck = [];
        this.hand = [];
        this.maximalMana = 0;
        this.turnMana = 0;
        this.health = 30;
        this.cardsOnBoard = [];
        this.emptyDeckDamage = 0;
    }

    setDeck(deck){
        this.deck = deck;
    }

    getNextCard(){
        let card = this.deck[Math.floor(Math.random() * this.deck.length)];
        this.deck = this.removeCardFromArray(this.deck, card);
        return card;
    }

    removeCardFromArray(array, card){
        let index = -1;
        array.forEach( (x, i) => { if (x.Id === card.Id) {
            index = i;
        } } );

        array.splice(index, 1);
        return array;
    }

    damageCard(card, damage){
        let index = -1;
        this.cardsOnBoard.forEach( (x, i) => { if (x.Id === card.Id) {
            index = i;
            x.health -= damage;
            if(x.health <= 0) {
                this.removePlayedCard(x);
            }
        } } );
    }

    addCardToHand(card){
        this.hand.push(card);
    }

    addCardToBoard(card){
        this.cardsOnBoard.push(card);
    }

    removePlayedCard(card){
        this.cardsOnBoard = this.removeCardFromArray(this.cardsOnBoard, card);
    }

    removeCardFromHand(card){
        this.hand = this.removeCardFromArray(this.hand, card);
    }

    initializeManaForNewTurn(){
        this.maximalMana++;
        this.turnMana = this.maximalMana;
    }

    decrementTurnMana(amount){
        this.turnMana -= amount;
    }

    decrementHealth(amount){
        this.health -= amount;
    }

}