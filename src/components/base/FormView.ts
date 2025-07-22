import { IFormView } from "../../types";
import { Component } from "./Component";
import { IEvents } from "./events";

export class FormView<T> extends Component<IFormView> {
    protected formName: string;
    protected submitButton: HTMLButtonElement;
    protected error: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container);
        this.events = events;

        this.formName = this.container.getAttribute('name');
        this.submitButton = this.container.querySelector('button[type="submit"]');
        this.error = this.container.querySelector('.form__errors');

        this.container.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.events.emit(`${this.formName}:submit`);
        });

        this.container.addEventListener('input', (evt) => {
            const input = evt.target as HTMLInputElement;
            this.events.emit(`${this.formName}:change`, {field: input.name as keyof T, value: input.value});
        });
    }

    set errors(value: string) {
        this.error.textContent = value;
        this.isDisabled(this.submitButton, this.error.textContent !== '');
    };
    
}