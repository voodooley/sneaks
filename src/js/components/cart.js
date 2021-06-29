const cartBtn = document.querySelector('.cart__btn')
const miniCart = document.querySelector('.mini-cart')

cartBtn.addEventListener('click', () => {
  miniCart.classList.toggle('mini-cart--visible')
})

document.addEventListener('click', (el) => {
  if (
    !el.target.classList.contains('mini-cart') &&
    !el.target.closest('.mini-cart') &&
    !el.target.classList.contains('cart__btn')
  ) {
    miniCart.classList.remove('mini-cart--visible')
  }
})
