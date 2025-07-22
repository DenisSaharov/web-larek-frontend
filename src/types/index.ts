export interface ICard {
    id: string,
    description: string,
    image: string,
    title: string,
    category: string,
    price: number | null,
}

export interface IUserData {
    payment: TPayment,
    address: string,
    email: string,
    phone: string,
}

export interface ICardsData {
    cards: ICard[],
    getCard(cardId: string): ICard,
}

export interface IBasket {
    cards: ICard[],
    addCard(card: ICard): void,
    deleteCard(cardId: string): void,
    getCount(): number,
    getTotalPrice(): number | null,
    inBasket(cardId: string): boolean,
    clearBasket(): void,
}

export interface IFormView {
    formName: string,
    errors: string,
}

export interface IApi {
    baseUrl: string,
    get<T>(uri:string): Promise<T>,
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>,
}

export interface IUserResponse {
    id: string,
    total: number,
    error: string,
}

export const categoryType = {
    'софт-скил': 'soft',
    'хард-скил': 'hard',
    'дополнительное': 'additional',
    'другое': 'other',
    'кнопка': 'button',
}

export type TPayment = 'cash' | 'card'

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export type TCategory = 'софт-скил' | 'хард-скил' | 'другое' | 'кнопка' | 'дополнительное';