'use strict';

// day1

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

let login = localStorage.getItem('authLogin');
let isAuthorized = false;

// асинхронная функция
// делает запрос на 'сервер'
const getData = async function (url) {
  const response = await fetch(url);
  // fetch: делает запрос по url и возвращает ответ
  // await: js переходит к следующей строке только по окончании запроса
  //.json(): - возвращает даные по адресу

  if (response.ok == false) {
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

function toggleModalAuth() {
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
  buttonOut.style.display = 'block';
  heartIcon.style.display = 'block';

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
      <div class="price">От ${price} Р</div>
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
              <div class="price">От ${restaurant.dataset.price} Р</div>
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
      <h3 class="card-title card-title-reg">
        ${name}
      </h3>
    </div>
    <div class="card-info">
      <div class="category-restaurant">
        ${description}
      </div>
    </div>
    <!-- /.card-info -->
    <div class="card-buttons">
      <button class="button button-primary">
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

function init() {
  getData('db/partners.json').then(function (data) {
    data.forEach(createCardsRestaurants);
  });
  // метод обработки промиса then(callback-функция, которая выполняется после выполнения getData)

  cardsRestaurants.addEventListener('click', openGoods);
  logo.addEventListener('click', closeGoods);

  checkAuth(login);
}

init();
