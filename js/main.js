'use strict';

// day1
const cartButton = document.querySelector('.cart-button');
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const buttonCloseAuth = document.querySelector('.close-auth');
const loginForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const loginPasword = document.querySelector('#password');
const checkIcon = document.querySelector('#check');
const buttonText = document.querySelector('#login-button-text');
const buttonIconImage = document.querySelector('#button-icon-img');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const heartIcon = document.querySelector('.heart');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const cardsGoods = document.querySelector('.cards-goods');
const containerPromo = document.querySelector('.container-promo');
const restaurantsBlock = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const RestaurantInfoHeading = document.querySelector(
  '.restaurant-info-heading'
);

const modalCart = document.querySelector('.modal-cart');
const modalCartClose = document.querySelector('.modal-cart-close');
const modalBody = document.querySelector('.modal-body-cart');

const modalPrice = document.querySelector('.modal-price-tag');

const buttonClearCart = document.querySelector('.button-clear-cart');

let login = localStorage.getItem('authLogin');
let isAuthorized = false;
let cart = [];

// асинхронная функция
// делает запрос на 'сервер'
const getData = async function (url) {
  const response = await fetch(url);
  // fetch: делает запрос по url и возвращает ответ
  // await: js переходит к следующей строке только по окончании запроса
  //.json(): - возвращает даные по адресу

  if (!response.ok) {
    throw new Error(
      `Ошибка по адресу ${url}. Статус ошибки: ${response.status}. `
    );
    // если запрос неудачный, генерируем ошибку, исключение
    // ${}  - интерполяция внутри обратных тиков ``, позволяет вставлять внутри кавычек исполняемый код
  }

  return await response.json();
  // дожидаемся выполнянеия метода .json()
  // затем вызывается return
};
function toggleModalCart() {
  modalCart.classList.toggle('modal-set-active');
}

function renderModalCart() {
  modalBody.textContent = '';
  console.log('renderCart');

  cart.forEach(function ({ id, title, cost, count }) {
    const itemCart = `
    <div class="food-row">
            <span class="food-name">${title}</span>
            <strong class="food-price">${cost}</strong>
            <div class="food-counter">
              <button class="counter-button counter-minus" data-id=${id}>-</button>
              <span class="counter">${count}</span>

              <button class="counter-button counter-plus" data-id=${id}>+</button>
            </div>
          </div>
          `;
    modalBody.insertAdjacentHTML('afterbegin', itemCart);
  });

  const totalPrice = cart.reduce(function (result, item) {
    return result + parseFloat(item.cost) * item.count;
  }, 0);

  modalPrice.textContent = totalPrice + ' ₽';
}
function toggleModalAuth() {
  loginInput.style.border = '';
  modalAuth.classList.toggle('modal-set-active');
}

function logOut() {
  login = null;
  checkAuth(login);

  // при передаче пустой строки, свойства возвращаются к норме, прописанной в css
  buttonAuth.style.display = '';

  userName.style.display = '';
  buttonOut.style.display = '';
  heartIcon.style.display = '';
  cartButton.style.display = '';

  localStorage.removeItem('authLogin');
}

function logIn(event) {
  event.preventDefault();
  login = loginInput.value;
  localStorage.setItem('authLogin', login);
  loginForm.reset();
  checkAuth(login);
  console.log(isAuthorized);
  if (isAuthorized) {
    loginInput.style.border = '';
    toggleModalAuth();
  } else {
    loginInput.style.border = '2px solid red';
  }

  // toggleModalAuth();
}

function authorized() {
  console.log('authorized');
  isAuthorized = true;

  // buttonText.style.display = 'none';
  // buttonIconImage.style.display = 'none';
  // checkIcon.style.display = 'flex';
  userName.textContent = login;

  buttonAuth.style.display = 'none';

  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  heartIcon.style.display = 'flex';
  cartButton.style.display = 'flex';

  buttonOut.addEventListener('click', logOut);
}

function notAuthorized() {
  console.log('not authorized');
  isAuthorized = false;

  buttonAuth.addEventListener('click', toggleModalAuth);
  buttonCloseAuth.addEventListener('click', toggleModalAuth);

  loginForm.addEventListener('submit', logIn);
  console.log(login);
}

function checkAuth(login) {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

// day 2

// функция для создания карточки ресторана
// переменная card содержит полную верстку карточки

function createCardsRestaurants(restaurant) {
  /* Деструктуризация - массивов и объектов
  Разбиение объекта на отдельны переменные
  Так же возможно переименование во время деструктиризации
   */
  const {
    image,
    kitchen,
    name,
    price,
    stars,
    products,
    time_of_delivery: timeOfDelivery,
  } = restaurant;

  const card = `
  <a
  class="card card-restaurant wow animate__animated animate__fadeInUp"
  data-wow-delay="0.4s"
  data-products= "${products}"
  data-name= "${name}"
  data-price= "${price}"
  data-stars= "${stars}"
  data-kitchen= "${kitchen}"


>
  <img
    src="${image}"
    alt="image"
    class="card-image"
  />
  <div class="card-text">
    <div class="card-heading">
      <h3 class="card-title">${name}</h3>
      <span class="card-tag tag">${timeOfDelivery} минут</span>
    </div>
    <div class="card-info">
      <div class="rating">
        <img
          src="css/img/rating.svg"
          alt="rating"
          class="rating-star"
        />${stars}
      </div>
      <div class="price">От ${price} ₽</div>
      <div class="category">${kitchen}</div>
    </div>
    <!-- /.card-info -->
  </div>
</a>
  `;

  cardsRestaurants.insertAdjacentHTML('afterbegin', card);
}

function openGoods(event) {
  if (isAuthorized) {
    const target = event.target;
    const restaurant = target.closest('.card-restaurant'); // поднимается по родителям, пока не найдет нужный селектор, если не найдет, то возвращает null

    if (restaurant) {
      console.log(restaurant.dataset);
      //dataset - содержит все дата-атрибуты

      cardsGoods.textContent = '';
      RestaurantInfoHeading.textContent = '';
      containerPromo.classList.add('hide');
      restaurantsBlock.classList.add('hide');
      menu.classList.remove('hide');
      const restaurantInfo = `
 
            <h2 class="section-title">${restaurant.dataset.name}</h2>
            <div class="card-info">
              <div class="rating">
                <img
                  src="css/img/rating.svg"
                  alt="rating"
                  class="rating-star"
                />${restaurant.dataset.stars}
              </div>
              <div class="price">От ${restaurant.dataset.price} ₽</div>
              <div class="category-restaurant">${restaurant.dataset.kitchen}</div>
            </div>
            <!-- /.card-info -->
 
  `;
      RestaurantInfoHeading.insertAdjacentHTML('afterbegin', restaurantInfo);

      getData(`db/${restaurant.dataset.products}`).then(function (data) {
        data.forEach(createCardGood);
      });
    }
  } else {
    toggleModalAuth();
  }
}

function closeGoods() {
  containerPromo.classList.remove('hide');
  restaurantsBlock.classList.remove('hide');
  menu.classList.add('hide');
}

function createCardGood(goods) {
  const { description, id, image, name, price } = goods;

  const card = document.createElement('div');
  card.className = 'card wow animate__animated animate__fadeInUp';
  card.insertAdjacentHTML(
    'beforeend',
    `
  <img
    src="${image}"
    alt="image"
    class="menu-image"
  />
  <div class="card-text">
    <div class="card-heading">
      <h3 class="card-title card-title-reg">${name}</h3>
    </div>
    <div class="card-info">
      <div class="category-restaurant">${description}</div>
    </div>
    <!-- /.card-info -->
    <div class="card-buttons">
      <button class="button button-primary button-add-to-cart" id = ${id}>
        <span class="button-card-text">В корзину</span>
        <img
          src="css/img/shopping-cart.svg"
          alt="shop"
          class="button-card-img"
        />
      </button>
      <strong class="card-price-bold">${price} ₽</strong>
    </div>
  </div>

`
  );

  cardsGoods.insertAdjacentElement('beforeend', card);
}

function addToCart(event) {
  const target = event.target;

  const buttonAddToCart = target.closest('.button-add-to-cart');

  if (buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price-bold').textContent;
    const id = buttonAddToCart.id;
    console.log(title, cost, id);
    //find() ищет в массиве элемент по совпадению

    const food = cart.find(function (item) {
      return item.id === id;
    });
    if (food) {
      food.count++;
    } else {
      // cart.push({
      //   id: id,
      //   title: title,
      //   cost: cost,
      //   count: 1,
      // });
      // js может сам создавать одноименное свойство и присваивать ему значение из указанных переменных
      cart.push({
        id,
        title,
        cost,
        count: 1,
      });
    }

    console.log(cart);
  }
}

function changeCount(event) {
  const target = event.target;
  if (target.classList.contains('counter-button')) {
    const food = cart.find(function (item) {
      return item.id === target.dataset.id;
    });

    if (target.classList.contains('counter-minus')) {
      food.count--;
      if (food.count === 0) {
        const index = cart.indexOf(food); // возвращает индекс элемента при совпадении
        cart.splice(index, 1); // удаляет элемент из массива, начиная с некоторого номера
      }
    }
    if (target.classList.contains('counter-plus')) {
      food.count++;
    }

    renderModalCart();
  }
}
function clearCart() {
  cart.length = 0;
  renderModalCart();
}
function init() {
  getData('db/partners.json').then(function (data) {
    data.forEach(createCardsRestaurants);
  });
  // метод обработки промиса then(callback-функция, которая выполняется после выполнения getData)
  cartButton.addEventListener('click', function () {
    renderModalCart();
    toggleModalCart();
  });

  modalBody.addEventListener('click', changeCount);
  modalCartClose.addEventListener('click', toggleModalCart);
  cardsRestaurants.addEventListener('click', openGoods);
  logo.addEventListener('click', closeGoods);

  menu.addEventListener('click', addToCart);
  buttonClearCart.addEventListener('click', clearCart);

  checkAuth(login);
}

init();
