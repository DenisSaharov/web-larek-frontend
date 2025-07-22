import { ICard } from "../types";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface ICardView extends ICard {
    cardIndex: number;
    checkBasket: boolean;
}

export class CardView extends Component<ICardView> {
    protected _id: string;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected events: IEvents;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this._title = this.container.querySelector('.card__title');
        this._price = this.container.querySelector('.card__price');
    }

    set id(value: string) {
        this._id = value;
    };

    set title(value: string) {
        this._title.textContent = value;
    };

    set price(value: number | null) {
        if(value) {
            this._price.textContent = `${value} синапсов`;
        } else {
            this._price.textContent = `Бесценно`;
        }
    };
}
