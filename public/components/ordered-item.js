import { LitElement, html, css } from "https://esm.sh/lit";

class OrderedItem extends LitElement {
  static properties = {
    link: { type: String },
    image: { type: String },
    title: { type: String },
    price: { type: Number },
    quantity: { type: Number },
  };

  static styles = css`
    * {
      margin: 0;
      box-sizing: border-box;
    }

    .cart-item {
      display: flex;
      flex-direction: column;
      width: 100%;
      background-color: white;
      border-radius: 12px;
      padding: 10px 20px;
      box-shadow: 0 1px 5px rgba(31, 47, 84, 0.1);
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
      align-items: center;
      gap: 12px;
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

    .item-name {
  width: 100%;
  font-weight: 600;
  font-size: 1rem;
  color: #333;
  line-height: 1.4;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; 
  -webkit-box-orient: vertical;
}

    .quantity {
      color: #787878;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .price {
      font-size: 1.2rem;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .item-info {
        flex-direction: column;
        align-items: start;
        gap: 10px;
      }
    }
  `;

  constructor() {
    super();
    this.link = "";
    this.image = "../assets/images/3.jpeg";
    this.title = "Licensed Concrete Chips";
    this.price = 132.23;
    this.quantity = 1;
  }

  render() {
    return html`
      <div class="cart-item">
        <div class="item-info">
          <div class="item-info-and-quantity">
            <img src="${this.image}" alt="Product Image" />
            <div class="name-and-quantity">
              <p class="item-name">${this.title}</p>
              <div>
                <p class="quantity">Cantitate: ${this.quantity}</p>
                <p class="price">${this.price.toFixed(2)} MDL</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("ordered-item", OrderedItem);
export default OrderedItem;