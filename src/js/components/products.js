const catalogList = document.querySelector('.catalog-list')
const catalogMore = document.querySelector('.catalog__more')
const prodModal = document.querySelector(
  '[data-graph-target="prod-modal"] .modal-content'
)
const prodModalSlider = prodModal.querySelector('.modal-slider .swiper-wrapper')
const prodModalPreview = prodModal.querySelector('.modal-slider .modal-preview')
const prodModalInfo = prodModal.querySelector('.modal-info__wrapper')
const prodModalDescr = prodModal.querySelector('.modal-prod-descr')
const prodModalChars = prodModal.querySelector('.prod-chars')
const prodModalVideo = prodModal.querySelector('.prod-modal__video')
let prodQuantity = 9
let dataLength = null
let modal = null

const normalPrice = (str) => {
  return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
}

const prodSlider = new Swiper('.modal-slider__container', {
  slidesPerView: 1,
  spaceBetween: 20,
})

if (catalogList) {
  const loadProducts = (quantity = 5) => {
    fetch('../data/sorted50.json')
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        dataLength = data.length

        catalogList.innerHTML = ''

        for (let i = 0; i < dataLength; i++) {
          if (i < quantity) {
            let item = data[i]
            // console.log(item)

            catalogList.innerHTML += `
            <li class="catalog-list__item">
            <article class="product">
              <div class="product__image">
                <img src="./data/images/${item.gallery[0]}" alt="${
              item.product_name
            }" />
                <div class="product__btns">
                  <button
                    class="btn-reset product__btn"
                    aria-label="Показать информацию о товаре"
                    data-id="${item.id}"
                    data-graph-path="prod-modal"
                  >
                    <svg>
                      <use xlink:href="img/sprite.svg#eye"></use>
                    </svg>
                  </button>
                  <button
                    class="btn-reset product__btn add-to-cart-btn"
                    aria-label="Добавить товар в корзину"
                    data-id="${item.id}"
                  >
                    <svg>
                      <use xlink:href="img/sprite.svg#cart"></use>
                    </svg>
                  </button>
                </div>
              </div>
              <h3 class="product__title">${item.product_name}</h3>
              <span class="product__price">${normalPrice(
                item.pricing_information['currentPrice']
              )} р</span>
            </article>
          </li>
            `
          }
        }
      })
      .then(() => {
        const productTitle = document.querySelectorAll('.product__title')
        productTitle.forEach((el) => {
          $clamp(el, { clamp: '22px' })
        })

        cartLogic()

        modal = new GraphModal({
          isOpen: (modal) => {
            if (modal.modalContainer.classList.contains('prod-modal')) {
              const openBtnId = modal.previousActiveElement.dataset.id

              loadModalData(openBtnId)

              prodSlider.update()
            }
          },
        })
      })
  }
  loadProducts(prodQuantity)

  const loadModalData = (id = null) => {
    if (id) {
      fetch('../data/sorted50.json')
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          // prodModal.innerHTML = ''
          prodModalSlider.innerHTML = ''
          prodModalPreview.innerHTML = ''
          prodModalInfo.innerHTML = ''
          prodModalInfo.innerHTML = ''
          prodModalDescr.textContent = ''
          prodModalChars.innerHTML = ''
          prodModalVideo.innerHTML = ''

          for (let dataItem of data) {
            if (dataItem.id == id) {
              const slides = dataItem.gallery.map((image, idx) => {
                return `
                  <div class="swiper-slide" data-index="${idx}">
                    <img src="./data/images/${image}" alt="">
                  </div>                  
                `
              })

              const preview = dataItem.gallery.map((image, idx) => {
                return `
                  <div class="modal-preview__item ${
                    idx === 0 ? 'modal-preview__item--active' : ''
                  }" tabindex="0" data-index="${idx}">
                    <img src="./data/images/${image}" alt="" />
                  </div>
                `
              })

              const sizes = dataItem.availability.map((sizes) => {
                return `
                  <li class="modal-sizes__item">
                    <button class="btn-reset modal-sizes__btn">${sizes['size']}</button>
                  </li>
                `
              })

              prodModalSlider.innerHTML = slides.join('')
              prodModalPreview.innerHTML = preview.join('')

              prodModalInfo.innerHTML = `
                <h3 class="modal-info__title">
                  ${dataItem.product_name}
                </h3>

                <div class="modal-info__rate">
                  <img src="./img/star.svg" alt="Рейтинг 5 из 5" />
                  <img src="./img/star.svg" alt="Рейтинг 5 из 5" />
                  <img src="./img/star.svg" alt="Рейтинг 5 из 5" />
                  <img src="./img/star.svg" alt="Рейтинг 5 из 5" />
                  <img src="./img/star.svg" alt="Рейтинг 5 из 5" />
                </div>

              <div class="modal-info__sizes">
                <span class="modal-info__subtitle">Выберите размер</span>
                <ul class="list-reset modal-info__sizes-list modal-sizes">
                  ${sizes.join('')}
                </ul>
              </div>

              <div class="modal-info__price">
                <span class="modal-info__current-price">
                ${
                  dataItem.pricing_information['sale_price']
                    ? normalPrice(dataItem.pricing_information['sale_price'])
                    : dataItem.pricing_information['currentPrice']
                } р</span>
                <span class="modal-info__old-price">${
                  dataItem.pricing_information['sale_price']
                    ? normalPrice(
                        dataItem.pricing_information['standard_price']
                      ) + ' p'
                    : ''
                }</span>
              </div>
              `

              prodModalDescr.textContent = dataItem.product_description

              let charsItems = ``

              Object.keys(dataItem.product_attribute).forEach(function eachkey(
                key
              ) {
                charsItems += `<p class="prod-bottom__description prod-chars__item">${key}: ${dataItem.product_attribute[key]}</p>`
              })
              prodModalChars.innerHTML =
                charsItems +
                `<p class="prod-bottom__description prod-chars__item">Страна: ${dataItem.product_country}</p>`

              if (dataItem.video) {
                prodModalVideo.style.display = 'block'
                prodModalVideo.innerHTML = `
                    <iframe src="${dataItem.video}"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen></iframe>
                  `
              } else {
                prodModalVideo.style.display = 'none'
              }
            }
          }
        })
        .then(() => {
          prodSlider.update()

          prodSlider.on('slideChangeTransitionEnd', function () {
            let idx = document.querySelector('.swiper-slide-active').dataset
              .index
            document.querySelectorAll('.modal-preview__item').forEach((el) => {
              el.classList.remove('modal-preview__item--active')
            })
            document
              .querySelector(`.modal-preview__item[data-index="${idx}"]`)
              .classList.add('modal-preview__item--active')
          })
          document.querySelectorAll('.modal-preview__item').forEach((el) => {
            el.addEventListener('click', (e) => {
              const idx = parseInt(e.currentTarget.dataset.index)
              document
                .querySelectorAll('.modal-preview__item')
                .forEach((el) => {
                  el.classList.remove('modal-preview__item--active')
                })
              e.currentTarget.classList.add('modal-preview__item--active')

              prodSlider.slideTo(idx)
            })
          })
        })
    }
  }

  catalogMore.addEventListener('click', (event) => {
    prodQuantity += 9

    loadProducts(prodQuantity)

    if (prodQuantity >= dataLength + 1) {
      catalogMore.style.display = 'none'
    } else {
      catalogMore.style.display = 'block'
    }
  })
}

//работа с корзиной
let price = 0
const miniCartList = document.querySelector('.mini-cart__list')
const fullPrice = document.querySelector('.mini-cart__total')
const cartCount = document.querySelector('.cart__count')

const priceWithoutSpaces = (str) => {
  return str.replace(/\s/g, '')
}

const plusFullPrice = (currentPrice) => {
  return (price += currentPrice)
}

const minusFullPrice = (currentPrice) => {
  return (price -= currentPrice)
}

const printFullPrice = () => {
  fullPrice.textContent = `${normalPrice(price)} р`
}

const printQuantity = (num) => {
  cartCount.textContent = num
}

const loadCartData = (id = null) => {
  if (id) {
    fetch('../data/sorted50.json')
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        for (let dataItem of data) {
          if (dataItem.id == id) {
            // console.log(dataItem)
            miniCartList.insertAdjacentHTML(
              'afterbegin',
              `
                  <li class="mini-cart__item" data-id="${dataItem.id}">
                      <article class="mini-cart__product mini-product">
                        <div class="mini-product__image">
                          <img src="./data/images/${
                            dataItem.gallery[0]
                          }" alt="${dataItem.product_name}" />
                        </div>

                        <div class="mini-product__content">
                          <div class="mini-product__info">
                            <h3 class="mini-product__title">
                            ${dataItem.product_name}
                            </h3>
                            <span class="mini-product__price">${normalPrice(
                              dataItem.pricing_information['currentPrice']
                            )} р</span>
                          </div>
                          <button
                            class="btn-reset mini-product__delete"
                            aria-label="Удалить товар"
                          >
                          Удалить
                            <svg>
                              <use xlink:href="img/sprite.svg#trash"></use>
                            </svg>
                          </button>
                        </div>
                      </article>
                    </li>
            `
            )

            return dataItem
          }
        }
      })
      .then((item) => {
        plusFullPrice(item.pricing_information['currentPrice'])
        printFullPrice()

        let num = document.querySelectorAll(
          '.mini-cart__list .mini-cart__item'
        ).length

        if (num > 0) {
          cartCount.classList.add('cart__count--visible')
        }

        printQuantity(num)
      })
  }
}

const cartLogic = () => {
  const productBtn = document.querySelectorAll('.add-to-cart-btn')

  productBtn.forEach((el) => {
    el.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id
      loadCartData(id)

      e.currentTarget.classList.add('product__btn--disabled')
    })
  })

  miniCartList.addEventListener('click', (e) => {
    if (e.target.classList.contains('mini-product__delete')) {
      const self = e.target
      const parent = self.closest('.mini-cart__item')
      const price = parseInt(
        priceWithoutSpaces(
          parent.querySelector('.mini-product__price').textContent
        )
      )
      const id = parent.dataset.id

      console.log(document.querySelector(`.product__btn[data-id="${id}"]`))

      document
        .querySelector(`.add-to-cart-btn[data-id="${id}"]`)
        .classList.remove('product__btn--disabled')

      parent.remove()

      minusFullPrice(price)
      printFullPrice()

      let num = document.querySelectorAll(
        '.cart-modal-order__list .mini-cart__item'
      ).length

      if (num == 0) {
        cartCount.classList.remove('cart__count--visible')
        miniCart.classList.remove('mini-cart--visible')
      }

      printQuantity(num)
    }
  })
}

const openOrderModal = document.querySelector('.mini-cart__btn')
const orderModalList = document.querySelector('.cart-modal-order__list')
const orderModalQuantity = document.querySelector(
  '.cart-modal-order__counts span'
)
const orderModalTotal = document.querySelector('.cart-modal-order__total span')
const orderModalShow = document.querySelector('.cart-modal-order__show')

openOrderModal.addEventListener('click', () => {
  const productsHtml = document.querySelector('.mini-cart__list').innerHTML
  orderModalList.innerHTML = productsHtml

  orderModalQuantity.textContent = `${
    document.querySelectorAll('.mini-cart__list .mini-cart__item').length
  } шт`

  orderModalTotal.textContent = fullPrice.textContent
})

orderModalShow.addEventListener('click', () => {
  if (orderModalList.classList.contains('cart-modal-order__list--visible')) {
    orderModalList.classList.remove('cart-modal-order__list--visible')
    orderModalShow.classList.remove('cart-modal-order__show--active')
  } else {
    orderModalList.classList.add('cart-modal-order__list--visible')
    orderModalShow.classList.add('cart-modal-order__show--active')
  }
})
