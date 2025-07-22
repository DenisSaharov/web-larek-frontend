import { IApi, ICard, IUserData, IUserResponse } from "../types";

export class AppApi {
    private _baseApi: IApi;

    constructor(baseApi: IApi) {
        this._baseApi = baseApi;
    }

    getCatalog(): Promise<ICard[]> {
        return this._baseApi.get<{total:number, items:ICard[]}>('/product')
            .then((cards) => cards.items)
    };

    postUserData(cards: ICard[], data: IUserData, orderPrice: number): Promise<IUserResponse> {
        const order = {
            ...data, 
            total: orderPrice,
            items: cards.map((card) => card.id), 
        };
        return this._baseApi.post<IUserResponse>('/order', order);
    };
}