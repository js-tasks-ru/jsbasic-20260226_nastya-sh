import Carousel from '../../6-module/3-task/index.js';
import slides from '../../6-module/3-task/slides.js';

import RibbonMenu from '../../7-module/1-task/index.js';
import categories from '../../7-module/1-task/categories.js';

import StepSlider from '../../7-module/4-task/index.js';
import ProductsGrid from '../../8-module/2-task/index.js';

import CartIcon from '../../8-module/1-task/index.js';
import Cart from '../../8-module/4-task/index.js';

export default class Main {
  constructor() {}

  async render() {
    // 1. Создание базовых компонент
    this.carousel = new Carousel(slides);
    document.querySelector("[data-carousel-holder]").append(this.carousel.elem);

    this.ribbonMenu = new RibbonMenu(categories);
    document.querySelector("[data-ribbon-holder]").append(this.ribbonMenu.elem);

    this.stepSlider = new StepSlider({ steps: 5, value: 3 });
    document.querySelector("[data-slider-holder]").append(this.stepSlider.elem);

    this.cartIcon = new CartIcon();
    document
      .querySelector("[data-cart-icon-holder]")
      .append(this.cartIcon.elem);

    this.cart = new Cart(this.cartIcon);

    // 2. Получение товаров с сервера
    let response = await fetch("products.json");
    let products = await response.json();

    // 3. Показ списка товаров
    let productsGridHolder = document.querySelector(
      "[data-products-grid-holder]",
    );
    productsGridHolder.innerHTML = "";

    this.productsGrid = new ProductsGrid(products);
    productsGridHolder.append(this.productsGrid.elem);

    // 4. Фильтрация товаров после получения с сервера
    this.productsGrid.updateFilter({
      noNuts: document.getElementById("nuts-checkbox").checked,
      vegeterianOnly: document.getElementById("vegeterian-checkbox").checked,
      maxSpiciness: this.stepSlider.value,
      category: this.ribbonMenu.value,
    });

    // 5. Связь компонентов через события

    // Обработчик события 'product-add'
    document.body.addEventListener("product-add", (event) => {
      let productId = event.detail;
      let product = products.find((p) => p.id === productId);
      if (product) {
        this.cart.addProduct(product);
      }
    });

    // Обработчик события 'slider-change'
    document.body.addEventListener("slider-change", (event) => {
      this.productsGrid.updateFilter({
        maxSpiciness: event.detail,
      });
    });

    // Обработчик события 'ribbon-select'
    document.body.addEventListener("ribbon-select", (event) => {
      this.productsGrid.updateFilter({
        category: event.detail,
      });
    });

    // Обработчики изменения чекбоксов
    document
      .getElementById("nuts-checkbox")
      .addEventListener("change", (event) => {
        this.productsGrid.updateFilter({
          noNuts: event.target.checked,
        });
      });

    document
      .getElementById("vegeterian-checkbox")
      .addEventListener("change", (event) => {
        this.productsGrid.updateFilter({
          vegeterianOnly: event.target.checked,
        });
      });
  }
}
