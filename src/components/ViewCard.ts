import { IActions, IGoodsItem } from '../types';
import { IEvents } from './base/events';
import { getPrice } from '../utils/constants';


export class Card implements ICard {
  protected _cardElement: HTMLElement;
  protected _cardTitle: HTMLElement;
  protected _cardImage: HTMLImageElement;
  protected _cardPrice: HTMLElement;
  protected _cardCategory: HTMLElement;

  protected _colors: Record<string, string> = {
    'дополнительное': 'additional',
    'кнопка': 'button',
    'хард-скил': 'hard',
    'софт-скил': 'soft',
    'другое': 'other',
  };

  constructor(
    template: HTMLTemplateElement,
    protected events: IEvents,
    actions?: IActions
  ) {
    this._cardElement = template.content
      .querySelector('.card')!
      .cloneNode(true) as HTMLElement;

    this._cardTitle = this._cardElement.querySelector('.card__title')!;
    this._cardImage = this._cardElement.querySelector('.card__image') as HTMLImageElement;
    this._cardPrice = this._cardElement.querySelector('.card__price')!;
    this._cardCategory = this._cardElement.querySelector('.card__category')!;

    if (actions?.onClick) {
      this._cardElement.addEventListener('click', actions.onClick);
    }
  }

  protected setText(element: HTMLElement, value: unknown): string {
    if (element) {
      const text = `${value}`;
      element.textContent = text;
      return text;
    }
    return '';
  }

  set cardCategory(value: string) {
    this.setText(this._cardCategory, value);
    const classSuffix = this._colors[value] || '';
    this._cardCategory.className = `card__category card__category_${classSuffix}`;
  }

  render(itemData: IGoodsItem): HTMLElement {
    this._cardCategory.textContent = itemData.category;
    this.cardCategory = itemData.category;
    this.setText(this._cardTitle, itemData.title);
    this._cardImage.src = itemData.image;
    this._cardImage.alt = itemData.title;
    this.setText(this._cardPrice, getPrice(itemData.price));
    return this._cardElement;
  }
}

export interface ICard {
  render(itemData: IGoodsItem): HTMLElement;
}