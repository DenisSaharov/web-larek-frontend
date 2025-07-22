import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected _content: HTMLElement;
    protected closeButton: HTMLButtonElement;
    protected events: IEvents;
    

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.closeButton = this.container.querySelector('.modal__close');
        this._content = this.container.querySelector('.modal__content');

        this.closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('mousedown', (evt) => {
            if (evt.target === evt.currentTarget) {
                this.close();
            }
        })
        this.handleEscUp = this.handleEscUp.bind(this);
    }

    open() {
        this.container.classList.add('modal_active');
        document.addEventListener('keyup', this.handleEscUp);
        this.events.emit('modal:scrolled', {isLocked: true});
    };

    close() {
        this.container.classList.remove('modal_active');
        document.removeEventListener('keyup', this.handleEscUp);
        this.events.emit('modal:scrolled', {isLocked: false});
    };

    handleEscUp(evt: KeyboardEvent) {
        if(evt.key === 'Escape') {
            this.close();
        }
    };

    set content(content: HTMLElement) {
        this._content.replaceChildren(content);
    };
}