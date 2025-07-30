import { IGoodsItem } from '../types';

export interface ICartModel {
  readonly items: IGoodsItem[];
  getTotalPrice(): number;
  getItemsCount(): number;
  addItem(item: IGoodsItem): void;
  removeItem(item: IGoodsItem): boolean;
  clear(): void;
}

export class CartModel implements ICartModel {
  private _items: IGoodsItem[];

  constructor(initialItems: IGoodsItem[] = []) {
    this._items = [...initialItems];
  }

  get items(): IGoodsItem[] {
    return [...this._items];
  }

  getTotalPrice(): number {
    return this._items.reduce((total, { price, id }) => {
      if (typeof price !== 'number' || price < 0) {
        console.warn(`Что-то не так с ценой ${id}`);
        return total;
      }
      return total + price;
    }, 0);
  }

  getItemsCount(): number {
    return this._items.length;
  }

  addItem(item: IGoodsItem): void {
    if (!item || typeof item.price !== 'number') {
      throw new Error('Неверные данные товара');
    }
    this._items.push({ ...item });
  }

  removeItem(item: IGoodsItem): boolean {
    const index = this._items.findIndex(i => i.id === item.id);
    if (index === -1) return false;

    this._items.splice(index, 1);
    return true;
  }


  clear(): void {
    this._items.length = 0;
  }
}