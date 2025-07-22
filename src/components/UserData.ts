import { IUserData, TPayment} from "../types";
import { IEvents } from "./base/events";

export class UserData implements IUserData{
    protected _payment: TPayment;
    protected _address: string;
    protected _email: string;
    protected _phone: string;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
        this.clearData();
    }

    orderValidation() {
        let message = '';

        if(!this._payment) {
            message = 'Выберите способ оплаты.';
        }

        if(!this._address) {
            message = 'Введите свой адресс.';
        }

        this.events.emit('order:data_changed', {
            address: this._address,
            payment: this._payment,
            errors: message,
        });
    };

    contactsValidation() {
        let message ='';

        if(!this.email || !this.phone) {
            message = 'Введите почту и телефон';
        }

        this.events.emit('contacts:data_changed', {
            email: this._email,
            phone: this._phone,
            errors: message,
        });
    };

    setUserData<T extends keyof IUserData>(field: T, value: IUserData[T]) {
        switch (field) {
            case 'payment':
                this.payment = value as TPayment;
                break;
            case 'address':
                this.address = String(value);
                break;
            case 'email':
                this.email = String(value);
                break;
            case 'phone':
                this.phone = String(value);
                break;
            default:
                console.log('oshibka');
        }
    };

    getUserData() {
        return { payment: this._payment, address: this._address, email: this._email, phone: this._phone};
    };

    clearData() {
        this._payment = null;
        this._address = '';
        this._email = '';
        this._phone = '';
    }

    set address(value: string) {
        this._address = value;
    };

    set payment(value: TPayment) {
        this._payment = value;
    };

    set email(value: string) {
        this._email = value;
    };

    set phone(value: string) {
        this._phone = value;
    };

    get address() {
        return this._address;
    };

    get payment() {
        return this._payment;
    };

    get email() {
       return this._email;
    };

    get phone() {
        return this._phone;
    };
}