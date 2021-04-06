// new WOW().init();

// const cartButton = document.querySelector('#cart-button');
// const modalDialog = document.querySelector('.modal');
// const closeButton = document.querySelector('.close');

// cartButton.addEventListener('click', toggleModal);

// closeButton.addEventListener('click', toggleModal);

// function toggleModal() {
//   modalDialog.classList.toggle('modal-set-active');
// }

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

let login = localStorage.getItem('authLogin');

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

  // toggleModalAuth();
}

function authorized() {
  console.log('authorized');

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

  buttonAuth.addEventListener('click', toggleModalAuth);
  buttonCloseAuth.addEventListener('click', toggleModalAuth);

  loginForm.addEventListener('submit', logIn);
  loginForm.addEventListener('submit', toggleModalAuth);
}

function checkAuth(login) {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

checkAuth(login);
