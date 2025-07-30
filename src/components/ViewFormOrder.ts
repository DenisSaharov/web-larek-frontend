import { IEvents } from './base/events';

export interface IOrder {
	formOrder: HTMLFormElement;
	paymentSelection: string;
	formErrors: HTMLElement;
	buttonAll: HTMLButtonElement[];
	render(): HTMLElement;
}

export class Order implements IOrder {
	formOrder: HTMLFormElement;
	buttonSubmit: HTMLButtonElement;
	formErrors: HTMLElement;
	buttonAll: HTMLButtonElement[];
	private _paymentSelection = '';

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		this.formOrder = template.content
			.querySelector('.form')
			?.cloneNode(true) as HTMLFormElement;

		this.buttonSubmit = this.formOrder.querySelector('.order__button') as HTMLButtonElement;
		this.formErrors = this.formOrder.querySelector('.form__errors') as HTMLElement;
		this.buttonAll = Array.from(
			this.formOrder.querySelectorAll('.button_alt')
		) as HTMLButtonElement[];

		this.formOrder.addEventListener('input', (event: Event) => {
			const target = event.target as HTMLInputElement;
			this.events.emit('order:changeAddress', {
				field: target.name,
				value: target.value,
			});
		});

		this.buttonAll.forEach((button) => {
			button.addEventListener('click', () => {
				this.paymentSelection = button.name;
				this.events.emit('order:paymentSelection', button);
			});
		});

		this.formOrder.addEventListener('submit', (event: Event) => {
			event.preventDefault();
			this.events.emit('contacts:open');
		});
	}

	get paymentSelection(): string {
		return this._paymentSelection;
	}

	set paymentSelection(method: string) {
		this._paymentSelection = method;
		this.buttonAll.forEach((button) => {
			button.classList.toggle('button_alt-active', button.name === method);
		});
	}

	set valid(isValid: boolean) {
		this.buttonSubmit.disabled = !isValid;
	}

	render(): HTMLElement {
		return this.formOrder;
	}
}

