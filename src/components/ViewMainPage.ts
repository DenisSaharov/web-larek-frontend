import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';

export class MainPage {
	protected container: HTMLElement;
	protected gallery: HTMLElement;
	headerCartButton: HTMLButtonElement;
	headerCartCounter: HTMLElement;

	constructor(containerSelector = '.page', protected events: IEvents) {
		this.container = ensureElement<HTMLElement>(containerSelector);
		this.gallery = ensureElement<HTMLElement>('.gallery', this.container);
		this.headerCartButton = ensureElement<HTMLButtonElement>('.header__basket');
		this.headerCartCounter = ensureElement<HTMLElement>('.header__basket-counter');

		this.headerCartButton.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	renderHeaderCartCounter(value: number): void {
		this.headerCartCounter.textContent = `${value}`;
	}

	renderCards(cards: HTMLElement[]): void {
		this.gallery.replaceChildren(...cards);
	}
}
