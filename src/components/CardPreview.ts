import { TCategory, categoryType } from "../types";
import { CDN_URL } from "../utils/constants";
import { CardView } from "./CardView";
import { IEvents } from "./base/events";

export class CardPreview extends CardView {
    protected _category: HTMLElement;
    protected _cardImage: HTMLImageElement;
    protected _description: HTMLElement;
    protected _addButton: HTMLButtonElement;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container, events);

        this._category = this.container.querySelector('.card__category');
        this._cardImage = this.container.querySelector('.card__image');
        this._addButton = this.container.querySelector('.card__button');
        this._description = this.container.querySelector('.card__text');

        this._addButton.addEventListener('click', () => {
            this.events.emit(`card:add`, {cardId: this._id});
        });
    }

    set category(value: TCategory) {
        if(this._category) {
            this._category.textContent = value;
            this._category.className = `card__category`;
            this._category.classList.add(`card__category_${categoryType[value]}`);
        }
    };

    set image(value: string) {
        if (this._cardImage) {
            this._cardImage.src = CDN_URL + value;
        }
    };

    set description(value: string) {
        if(this._description) {
            this._description.textContent = value;
        }
    };

    set checkBasket(value: boolean) {
        this.isDisabled(this._addButton, value);
        if(value) {
            this._addButton.textContent = 'Товар в корзине';
        } else {
            this._addButton.textContent = 'Купить';
        }

        if(this._price.textContent === 'Бесценно') {
            this.isDisabled(this._addButton, true);
        }
    };
}