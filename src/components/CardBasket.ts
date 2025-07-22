import { CardView } from "./CardView";
import { IEvents } from "./base/events";

export class CardBasket extends CardView {
    protected _cardIndex: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this._cardIndex = this.container.querySelector('.basket__item-index');    
        this._deleteButton = this.container.querySelector('.basket__item-delete');

        this._deleteButton.addEventListener('click', () => {
            this.events.emit('card:delete', {cardId: this._id});
        });
    }

    set cardIndex(index: number) {
        this._cardIndex.textContent = String(index);
    };
}