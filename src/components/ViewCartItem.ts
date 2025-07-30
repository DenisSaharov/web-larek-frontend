import { IActions, IGoodsItem } from '../types';
import { IEvents } from './base/events';
import { getPrice } from '../utils/constants';

export interface ICartItem {
	cartItem: HTMLElement;
	title: HTMLElement;
	price: HTMLElement;
	index: HTMLElement;
	buttonDelete: HTMLButtonElement;
	render(data: IGoodsItem, itemIndex: number): HTMLElement;
}

export class CartItem implements ICartItem {
	cartItem: HTMLElement;
	title: HTMLElement;
	price: HTMLElement;
	index: HTMLElement;
	buttonDelete: HTMLButtonElement;

	constructor(
		template: HTMLTemplateElement,
		protected events: IEvents,
		actions?: IActions
	) {
		this.cartItem = template.content
			.querySelector('.basket__item')
			?.cloneNode(true) as HTMLElement;

		this.title = this.cartItem.querySelector('.card__title') as HTMLElement;
		this.price = this.cartItem.querySelector('.card__price') as HTMLElement;
		this.index = this.cartItem.querySelector('.basket__item-index') as HTMLElement;
		this.buttonDelete = this.cartItem.querySelector('.basket__item-delete') as HTMLButtonElement;

		if (actions?.onClick) {
			this.buttonDelete.addEventListener('click', actions.onClick);
		}
	}

	render(data: IGoodsItem, itemIndex: number): HTMLElement {
		this.index.textContent = String(itemIndex);
		this.title.textContent = data.title;
		this.price.textContent = getPrice(data.price);

		return this.cartItem;
	}
}

