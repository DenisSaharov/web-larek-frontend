import { IUserData } from "../types";
import { FormView } from "./base/FormView";
import { IEvents } from "./base/events";

export class ContactsForm extends FormView<IUserData> {
    protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;

    constructor(container: HTMLFormElement, events:IEvents) {
        super(container, events);

        this._email = this.container.querySelector('input[name="email"]');
        this._phone = this.container.querySelector('input[name="phone"]');
    }

    set email(value: string) {
        this._email.value = value;
    };

    set phone(value: string) {
        this._phone.value = value;
    };
}