import { IEvents } from './base/events';

export interface IModal {
	open(): void;
	close(): void;
	render(): HTMLElement;
}

export class Modal implements IModal {
	protected modalContainer: HTMLElement;
	protected _content: HTMLElement | null;
	protected _pageWrapper: HTMLElement | null;
	protected closeButton: HTMLButtonElement | null;

	constructor(modalContainer: HTMLElement, protected events: IEvents) {
		this.modalContainer = modalContainer;
		this._content = modalContainer.querySelector('.modal__content');
		this._pageWrapper = document.querySelector('.page__wrapper');
		this.closeButton = modalContainer.querySelector('.modal__close');
		this.closeButton?.addEventListener('click', this.close.bind(this));
		this.modalContainer.addEventListener('click', this.close.bind(this));
		const innerContainer = modalContainer.querySelector('.modal__container');
		innerContainer?.addEventListener('click', event => event.stopPropagation());
		document.addEventListener('keydown', this.handleKeyDown);
	}

	protected handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && this.modalContainer.classList.contains('modal_active')) {
			this.close();
		}
	};

	set content(value: HTMLElement | null) {
		if (this._content) {
			this._content.replaceChildren(value ?? undefined);
		}
	}

	set locked(value: boolean) {
		if (!this._pageWrapper) return;

		if (value) {
			this._pageWrapper.classList.add('page__wrapper_locked');
		} else {
			this._pageWrapper.classList.remove('page__wrapper_locked');
		}
	}

	open(): void {
		this.modalContainer.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close(): void {
		this.modalContainer.classList.remove('modal_active');
		this.content = null;
		this.events.emit('modal:close');
	}

	render(): HTMLElement {
		this.open();
		return this.modalContainer;
	}

	destroy() {
		document.removeEventListener('keydown', this.handleKeyDown);
		this.closeButton?.removeEventListener('click', this.close.bind(this));
		this.modalContainer.removeEventListener('click', this.close.bind(this));
		const innerContainer = this.modalContainer.querySelector('.modal__container');
		innerContainer?.removeEventListener('click', (event) => event.stopPropagation());
	}
}
