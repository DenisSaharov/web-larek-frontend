import { IEvents } from './base/events';

export interface ISuccess {
  description: HTMLElement;
  button: HTMLButtonElement;
  success: HTMLElement;
  render(total: number): HTMLElement;
}

export class Success implements ISuccess {
  description: HTMLElement;
  button: HTMLButtonElement;
  success: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.success = template.content.querySelector('.order-success')!.cloneNode(true) as HTMLElement;
    this.description = this.success.querySelector('.order-success__description')!;
    this.button = this.success.querySelector('.order-success__close')!;

    this.button.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  render(total: number): HTMLElement {
    this.description.textContent = `Списано ${total} синапсов`;
    return this.success;
  }
}
