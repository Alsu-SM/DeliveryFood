new WOW().init();

const cartButton = document.querySelector('#cart-button');
const modalDialog = document.querySelector('.modal');
const closeButton = document.querySelector('.close');

cartButton.addEventListener('click', toggleModal);

closeButton.addEventListener('click', toggleModal);

function toggleModal() {
  modalDialog.classList.toggle('modal-set-active');
}
