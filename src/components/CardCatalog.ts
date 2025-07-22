import { TCategory, categoryType } from "../types";
import { CDN_URL } from "../utils/constants";
import { CardView } from "./CardView";
import { IEvents } from "./base/events";

export class CardCatalog extends CardView {
    protected _category: HTMLElement;
    protected _cardImage: HTMLImageElement;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container, events);

        this._category = this.container.querySelector('.card__category');
        this._cardImage = this.container.querySelector('.card__image');

        this.container.addEventListener('click', () => {
            this.events.emit(`card:select`, {cardId: this._id})
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
}