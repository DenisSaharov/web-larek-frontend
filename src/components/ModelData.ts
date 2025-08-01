import { IGoodsItem } from '../types';
import { IEvents } from './base/events';

export interface IDataModel {
  selectedCard: IGoodsItem;
  itemCards: IGoodsItem[];
  setPreview(goodsItem: IGoodsItem): void;
}

export class DataModel implements IDataModel {
  selectedCard: IGoodsItem;
  protected _itemCard: IGoodsItem[] = [];

  constructor(protected events: IEvents) {}

  get itemCards() {
    return this._itemCard;
  }

  set itemCards(data: IGoodsItem[]) {
    this._itemCard = data;
    this.events.emit('productCards:receive');
  }

  setPreview(goodsItem: IGoodsItem) {
    this.selectedCard = goodsItem;
    this.events.emit('modalCard:open', goodsItem);
  }
}
