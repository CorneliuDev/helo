import { LitElement, html, css } from "https://esm.sh/lit";

class CartItem extends LitElement {
  static properties = {
    link: { type: String },
    image: { type: String },
    title: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    isChecked: { type: Boolean }
  };

  static styles = css`
  * {
    margin: 0;

}
    .cart-item {
      display: flex;
      flex-direction: column;
      width: 100%;
      background-color: white;
      border-radius: 12px;
      padding: 10px 20px;
      box-sizing: border-box;
    }

    .item-name-and-check {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-bottom: 12px;
    }

    .item-name-and-check input {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: #ff4363;
    }

    .item-name {
      font-weight: 600;
      font-size: 1rem;
      color: #333;
      margin: 0;
      line-height: 1.4;
    }

    .item-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }

    .item-info-and-quantity {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }

    .item-info-and-quantity img {
      width: 90px;
      height: 90px;
      object-fit: cover;
      border-radius: 10px;
    }

    .name-and-quantity {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .delivery {
      color: #787878;
      font-size: 0.9rem;
      margin: 0;
      line-height: 1.4;
    }

    .quantity-control {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: white;
      border-radius: 10px;
      border: 1px solid #f2f2f2;
      width: 110px;
      height: 36px;
      overflow: hidden;
    }

    .quantity-control button {
      width: 30px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      border: none;
      background: transparent;
      padding: 0;
    }

    .quantity-control button:active img {
      transform: scale(0.9);
    }

    .quantity-control button img {
      width: 16px;
      height: 16px;
      object-fit: contain;
    }

    .quantity {
      min-width: 50px;
      text-align: center;
      font-weight: 600;
      border-left: 1px solid #f2f2f2;
      border-right: 1px solid #f2f2f2;
      font-size: 1rem;
      margin: 0;
      line-height: 36px;
    }

    .item-price {
      font-size: 1.8rem;
      font-weight: 600;
      text-align: right;
      margin: 0;
    }

    @media (max-width: 768px) {
      .item-info {
        flex-direction: column;
        align-items: start;
        gap: 10px;
      }

      .item-info-and-quantity {
        flex-direction: row;
        justify-content: start;
        width: 100%;
      }

      .quantity-control {
        width: 100px;
      }

      .item-price {
        text-align: left;
      }
    }
  `;

  constructor() {
    super();
    this.link = "";
    this.image = "../media/images/3.jpeg";
    this.title = "Licensed Concrete Chips";
    this.price = "132.23";
    this.quantity = 1;
    this.isChecked = false;
  }

  checkItem() {
  let checkbox = this.shadowRoot.querySelector('#item-selected');
  if (checkbox.checked) {
    this.isChecked = true;
  } 
  if (!checkbox.checked) {
    this.isChecked = false;
  }
}

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  render() {
    return html`
      <div class="cart-item">
        <div class="item-name-and-check">
          <input type="checkbox" name="item-selected" id="item-selected">
          <p class="item-name">${this.title}</p>
        </div>

        <div class="item-info">
          <div class="item-info-and-quantity">
            <img src="${this.image}" alt="Product Image" />
            <div class="name-and-quantity">
              <p class="delivery">Livrare: 2-3 zile</p>
              <div class="quantity-control">
                <button @click="${this.decreaseQuantity}">
                  <img src="../media/icons/minus.svg" alt="Minus" />
                </button>
                <p class="quantity">${this.quantity}</p>
                <button @click="${this.increaseQuantity}">
                  <img src="../media/icons/plus.svg" alt="Plus" />
                </button>
              </div>
            </div>
          </div>
          <div class="item-price">
            <p class="price">${this.price} MDL</p>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("cart-item", CartItem);

export default CartItem;
