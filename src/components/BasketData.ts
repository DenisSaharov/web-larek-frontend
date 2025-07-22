import { IBasket, ICard } from "../types";
import { IEvents } from "./base/events";

export class BasketData implements IBasket {
    protected _cards: ICard[];
    protected events: IEvents;
    
    constructor(events: IEvents) {
        this._cards = [];
        this.events = events;
    }
    
    addCard(card: ICard) {
        this._cards.push(card);
        this.events.emit('basket:changed', card);
    };

    deleteCard(cardId: string) {
        this._cards = this._cards.filter((card) => card.id !== cardId);
        this.events.emit('basket:changed');
    };

    getCount() {
        return this._cards.length; 
    };

    getTotalPrice() {
        return this._cards.reduce((sum, card) => sum + card.price, 0);
    };

    inBasket(cardId: string) {
        return this._cards.some((card) => card.id === cardId);
    };

    clearBasket() {
        this._cards = [];
        this.events.emit('basket:changed');
    };

    get cards() {
        return this._cards;
    };
}