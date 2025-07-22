import './scss/styles.scss';
import { AppApi } from './components/AppApi';
import { AppView } from './components/AppView';
import { Api } from './components/base/api';
import { EventEmitter, IEvents } from './components/base/events';
import { BasketData } from './components/BasketData';
import { BasketView } from './components/BasketView';
import { CardBasket } from './components/CardBasket';
import { CardCatalog } from './components/CardCatalog';
import { CardPreview } from './components/CardPreview';
import { CardsData } from './components/CardsData';
import { Modal } from './components/Modal';
import { API_URL, settings } from './utils/constants';
import { cloneTemplate } from './utils/utils';
import { OrderForm } from './components/OrderForm';
import { UserData } from './components/UserData';
import { IFormView, IUserData } from './types';
import { ContactsForm } from './components/ContactsForm';
import { SuccessOrderView } from './components/SuccessOrderView';

const events: IEvents = new EventEmitter();
const appView = new AppView(document.querySelector('.page'), events);
const modal = new Modal(document.querySelector('#modal-container'), events);
const baseApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);

const basketTemp: HTMLTemplateElement = document.querySelector('#basket');
const cardPreviewTemp: HTMLTemplateElement = document.querySelector('#card-preview');
const cardCatalogTemp: HTMLTemplateElement = document.querySelector('#card-catalog');
const cardBasketTemp: HTMLTemplateElement = document.querySelector('#card-basket');
const orderTemp: HTMLTemplateElement = document.querySelector('#order');
const contactsTemp: HTMLTemplateElement = document.querySelector('#contacts');
const successTemp: HTMLTemplateElement = document.querySelector('#success');

const basketView = new BasketView(cloneTemplate(basketTemp),events);
const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemp), events);
const orderForm = new OrderForm(cloneTemplate(orderTemp), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemp), events);
const successView = new SuccessOrderView(cloneTemplate(successTemp), events);


const cardsData = new CardsData(events);
const basketData = new BasketData(events);
const userData = new UserData(events);


//запрос на сервер
api.getCatalog()
    .then((cards) =>{
        cardsData.cards = cards;
    })
    .catch(err => {
        console.log('Ошибка получения товаров: ', err);
    });


//отрисовываем карточки, пришедшие с сервера
events.on('cards:loaded', () => {
    const cardsArray = cardsData.cards.map((card) => {
        const cardCatalog = new CardCatalog(cloneTemplate(cardCatalogTemp), events);
        return cardCatalog.render(card);
    });
    appView.render({catalog: cardsArray});
}) 


//открытие карточки в превью
events.on('card:select', ({cardId}: {cardId: string})=> {
    const card = cardsData.getCard(cardId);
    modal.content = cardPreview.render({...card, checkBasket: basketData.inBasket(card.id)});
    modal.open();
});


//открытие корзины с главной страницы
events.on('basket:open', () => {
    modal.content = basketView.render();
    modal.open();
});


//кнопка Купить в превью карточки
events.on('card:add', ({cardId}: {cardId: string}) => {
    const card = cardsData.getCard(cardId);
    basketData.addCard(card);
    modal.close();
});

//изменения в корзине
events.on('basket:changed', () => {
    const cards = basketData.cards.map((card, index) => {
        const cardBasket = new CardBasket(cloneTemplate(cardBasketTemp), events);
        return cardBasket.render({...card, cardIndex: index + 1});
    });
    appView.countInBasket = basketData.getCount();
    modal.content = basketView.render({cards: cards, totalPrice: basketData.getTotalPrice()});
})

//обработчик удаления карточки из корзины
events.on('card:delete', ({cardId}: {cardId: string}) => {
    basketData.deleteCard(cardId);
});


//поведение скролла при открытии и закрытии модального окна
events.on('modal:scrolled', ({isLocked}: {isLocked: boolean}) => {
    appView.scroll = isLocked;
});


//кнопка Оформить в корзине
events.on('basket:to_Order', () => {
    modal.content = orderForm.render();
    userData.orderValidation();
});


//изменение данных в ордер форме
events.on('order:change', (data: {field: keyof IUserData, value: string}) => {
    userData.setUserData(data.field, data.value);
    userData.orderValidation();
});


//рендер при изменении данных ордер формы 
events.on('order:data_changed', (data: IUserData & IFormView) => {
	orderForm.render(data);
});


//нажали Далее в ордер форме
events.on('order:submit', () => {
	modal.content = contactsForm.render();	
	userData.contactsValidation();
});


//изменение данных в форме контактов
events.on('contacts:change', (data: {field: keyof IUserData, value: string}) => {
    userData.setUserData(data.field, data.value);
    userData.contactsValidation();
});


//рендер при изменении данных формы контактов
events.on('contacts:data_changed', (data: IUserData & IFormView) => {
	contactsForm.render(data);
});


//нажали Оплатить в форме контактов
events.on('contacts:submit', () => {
	api.postUserData(basketData.cards, userData.getUserData(), basketData.getTotalPrice())
        .then(data => {
            userData.clearData();
            basketData.clearBasket();
            successView.totalPrice = data.total;
            modal.content = successView.render();
        })
        .catch((err) => {
            console.log('Сбой отправки заказа: ', err);
        }); 
});


//нажали кнопку За новыми покупками
events.on('success:submit', () => {
    modal.close();
});