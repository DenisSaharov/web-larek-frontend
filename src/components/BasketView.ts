import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IBasketView {
    cards: HTMLElement[],
    totalPrice: number,
}

export class BasketView extends Component<IBasketView> {
    protected cardsContainer: HTMLElement;
    protected _totalPrice: HTMLElement;
    protected orderButton: HTMLButtonElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.cardsContainer = this.container.querySelector('.basket__list');
        this._totalPrice = this.container.querySelector('.basket__price');
        this.orderButton = this.container.querySelector('.basket__button');

        this.orderButton.addEventListener('click', () => {
            this.events.emit('basket:to_Order');
        });
    }

    set totalPrice(price: number) {
        this._totalPrice.textContent = `${price} синапсов`;
        this.isDisabled(this.orderButton, price === 0);
    };

    set cards(cards: HTMLElement[]) {
        this.cardsContainer.replaceChildren(...cards);
    };
}