import { IEvents } from './base/events';

export interface IContacts {
	formContacts: HTMLFormElement;
	buttonSubmit: HTMLButtonElement;
	formErrors: HTMLElement;
	inputAll: HTMLInputElement[];

	render(): HTMLElement;
}

export class Contacts implements IContacts {
	formContacts: HTMLFormElement;
	buttonSubmit: HTMLButtonElement;
	formErrors: HTMLElement;
	inputAll: HTMLInputElement[];

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		this.formContacts = template.content
			.querySelector('.form')
			?.cloneNode(true) as HTMLFormElement;

		this.buttonSubmit = this.formContacts.querySelector('.button') as HTMLButtonElement;
		this.formErrors = this.formContacts.querySelector('.form__errors') as HTMLElement;

		this.inputAll = Array.from(
			this.formContacts.querySelectorAll('.form__input')
		) as HTMLInputElement[];

		this.inputAll.forEach((input) => {
			input.addEventListener('input', (event: Event) => {
				const target = event.target as HTMLInputElement;
				this.events.emit('contacts:changeInput', {
					field: target.name,
					value: target.value,
				});
			});
		});

		this.formContacts.addEventListener('submit', (event: Event) => {
			event.preventDefault();
			this.events.emit('success:open');
		});
	}

	set valid(isValid: boolean) {
		this.buttonSubmit.disabled = !isValid;
	}

	render(): HTMLElement {
		return this.formContacts;
	}
}

