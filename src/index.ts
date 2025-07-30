import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ApiModel } from './components/ModelApi';
import { CartItem } from './components/ViewCartItem';
import { FormModel } from './components/ModelForm';
import { Order } from './components/ViewFormOrder';
import { IGoodsItem } from './types';
import { Modal } from './components/ViewModal';
import { ensureElement } from './utils/utils';
import { DataModel } from './components/ModelData';
import { Card } from './components/ViewCard';
import { CardPreview } from './components/ViewCardPreview';
import { CartModel } from './components/ModelCart';
import { Cart } from './components/ViewCart';
import { Contacts } from './components/ViewFormContacts';
import { Success } from './components/ViewSuccess';
import { MainPage } from './components/ViewMainPage';

class App {
  private events = new EventEmitter();
  private apiModel = new ApiModel(CDN_URL, API_URL);
  private dataModel = new DataModel(this.events);
  private cartModel = new CartModel();
  private formModel = new FormModel(this.events);
  private modal: Modal;

  private templates: Record<string, HTMLTemplateElement>;

  private cart: Cart;
  private order: Order;
  private contacts: Contacts;
  private mainPage: MainPage;

  constructor() {
    this.templates = this.loadTemplates({
      cardCatalogTemplate: '#card-catalog',
      cardPreviewTemplate: '#card-preview',
      cartTemplate: '#basket',
      cardCartTemplate: '#card-basket',
      orderTemplate: '#order',
      contactsTemplate: '#contacts',
      successTemplate: '#success',
    });

    this.modal = new Modal(ensureElement('#modal_active'), this.events);

    this.cart = new Cart(this.templates.cartTemplate, this.events);
    this.order = new Order(this.templates.orderTemplate, this.events);
    this.contacts = new Contacts(this.templates.contactsTemplate, this.events);
    this.mainPage = new MainPage('.page', this.events);

    this.subscribeEvents();
    this.fetchData();
  }

  private loadTemplates(selectors: Record<string, string>) {
    return Object.fromEntries(
      Object.entries(selectors).map(([key, sel]) => [
        key,
        document.querySelector(sel) as HTMLTemplateElement,
      ]),
    );
  }

  private subscribeEvents() {
    this.on('productCards:receive', () => {
      const cards = this.dataModel.itemCards.map(item => 
        new Card(this.templates.cardCatalogTemplate, this.events, {
          onClick: () => this.events.emit('card:select', item),
        }).render(item)
      );
      this.mainPage.renderCards(cards);
    });

    this.on('card:select', (item: IGoodsItem) => this.dataModel.setPreview(item));

    this.on('modalCard:open', (item) => {
      const preview = new CardPreview(this.templates.cardPreviewTemplate, this.events);
      this.modal.content = preview.render(item);
      this.modal.render();
    });

    this.on('card:addBasket', () => {
      this.cartModel.addItem(this.dataModel.selectedCard);
      this.mainPage.renderHeaderCartCounter(this.cartModel.getItemsCount());
      this.modal.close();
    });

    this.on('basket:basketItemRemove', (item) => {
      this.cartModel.removeItem(item);
      this.mainPage.renderHeaderCartCounter(this.cartModel.getItemsCount());
      this.cart.renderTotalAllGoods(this.cartModel.getTotalPrice());
      this.renderCartItems();
    });

    this.on('basket:open', () => {
      this.cart.renderTotalAllGoods(this.cartModel.getTotalPrice());
      this.renderCartItems();
      this.modal.content = this.cart.render();
      this.modal.render();
    });

    this.on('order:open', () => {
      this.modal.content = this.order.render();
      this.modal.render();
    });

    this.on('order:paymentSelection', (button) => {
      this.formModel.payment = button.name;
    });

    this.on('order:changeAddress', ({ field, value }) => {
      this.formModel.setOrderAddress(field, value);
    });

    this.on('formErrors:address', (errors) => {
      const { address, payment } = errors;
      this.order.valid = !address && !payment;
      this.order.formErrors.textContent = [address, payment].filter(Boolean).join('; ');
    });

    this.on('contacts:open', () => {
      this.modal.content = this.contacts.render();
      this.modal.render();
    });

    this.on('contacts:changeInput', ({ field, value }) => {
      this.formModel.setOrderData(field, value);
    });

    this.on('formErrors:change', (errors) => {
      const { email, phone } = errors;
      this.contacts.valid = !email && !phone;
      this.contacts.formErrors.textContent = [phone, email].filter(Boolean).join('; ');
    });

    this.on('success:open', () => {
      const itemIds = this.cartModel.items.map(item => item.id);
      const totalPrice = this.cartModel.getTotalPrice();

      this.apiModel.postOrder(this.formModel.getOrderedItem(itemIds, totalPrice))
        .then(() => {
          const successInstance = new Success(this.templates.successTemplate, this.events);
          this.modal.content = successInstance.render(totalPrice);
          this.cartModel.clear();
          this.mainPage.renderHeaderCartCounter(this.cartModel.getItemsCount());
          this.modal.render();
        })
        .catch(console.log);
    });

    this.on('success:close', () => this.modal.close());

    this.on('modal:open', () => this.modal.locked = true);
    this.on('modal:close', () => this.modal.locked = false);
  }

  private renderCartItems() {
    this.cart.items = this.cartModel.items.map((item, i) => 
      new CartItem(this.templates.cardCartTemplate, this.events, {
        onClick: () => this.events.emit('basket:basketItemRemove', item),
      }).render(item, i + 1)
    );
  }

  private on(event: string, handler: (...args: any[]) => void) {
    this.events.on(event, handler);
  }

  private fetchData() {
    this.apiModel.fetchItems()
      .then(data => this.dataModel.itemCards = data)
      .catch(console.log);
  }
}

new App();
