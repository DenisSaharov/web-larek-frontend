export abstract class Component<T> {
    constructor(protected container: HTMLElement) {
    }

    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    };

    isDisabled(element: HTMLElement, isDisabled: boolean) {
        if(isDisabled) {
            element.setAttribute('disabled', 'true');
        } else {
            element.removeAttribute('disabled');
        }
    };
}