import { IUserData, TPayment } from "../types";
import { FormView } from "./base/FormView";
import { IEvents } from "./base/events";

export class OrderForm extends FormView<IUserData> {
    protected _address: HTMLInputElement;
    protected _cashButton: HTMLButtonElement;
    protected _cardButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events)

        this._address = this.container.querySelector('input[name="address"]');
        this._cashButton = this.container.querySelector('button[name="cash"]');
        this._cardButton = this.container.querySelector('button[name="card"]');

        this._cashButton.addEventListener('click', () => {
            this.events.emit(`${this.formName}:change`, {field: 'payment', value: 'cash'});
        });

        this._cardButton.addEventListener('click', () => {
            this.events.emit(`${this.formName}:change`, {field: 'payment', value: 'card'});
        });
    }

    set payment (value: string) {
        this._cardButton.classList.toggle('button_alt-active', value === 'card');
        this._cashButton.classList.toggle('button_alt-active', value === 'cash');
    }

    set address(value: string) {
        this._address.value = value;
    };
}
