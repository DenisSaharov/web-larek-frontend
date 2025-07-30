import { createElement } from '../utils/utils';
import { IEvents } from './base/events';

export interface ICart {
	cart: HTMLElement;
	cartList: HTMLElement;
	button: HTMLButtonElement;
	cartPrice: HTMLElement;
	title: HTMLElement;
	renderTotalAllGoods(total: number): void;
	render(): HTMLElement;
}

export class Cart implements ICart {
	cart: HTMLElement;
	cartList: HTMLElement;
	button: HTMLButtonElement;
	cartPrice: HTMLElement;
	title: HTMLElement;

	private _items: HTMLElement[] = [];

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		this.cart = template.content
			.querySelector('.basket')
			?.cloneNode(true) as HTMLElement;

		this.cartList = this.cart.querySelector('.basket__list') as HTMLElement;
		this.button = this.cart.querySelector('.basket__button') as HTMLButtonElement;
		this.cartPrice = this.cart.querySelector('.basket__price') as HTMLElement;
		this.title = this.cart.querySelector('.modal__title') as HTMLElement;

		this.button.addEventListener('click', () => {
			this.events.emit('order:open');
		});
	}

	set items(elements: HTMLElement[]) {
		this._items = elements;

		if (elements.length) {
			this.cartList.replaceChildren(...elements);
			this.button.removeAttribute('disabled');
		} else {
			this.button.setAttribute('disabled', 'disabled');
			this.cartList.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
					className: 'basket__empty-message',
				})
			);
		}
	}

	get items(): HTMLElement[] {
		return this._items;
	}

	renderTotalAllGoods(total: number): void {
		this.cartPrice.textContent = `${total} синапсов`;
	}

	render(): HTMLElement {
		this.title.textContent = 'Корзина';
		return this.cart;
	}
}
