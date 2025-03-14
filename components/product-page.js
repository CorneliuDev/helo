import { LitElement, html, css } from 'https://esm.sh/lit';

class ProductPage extends LitElement {
  static properties = {
    link: { type: String },
    images: { type: Array },
    title: { type: String },
    currentPrice: { type: String },
    oldPrice: { type: String },
    rating: { type: String },
    starIcon:{type: String},
    description: { type: String },

  };

  static styles = css`
    
  `;

  constructor() {
    super();
    this.link = '';
    this.image = '';
    this.title = '';
    this.currentPrice = '';
    this.oldPrice = '';
    this.rating = '';
    this.starIcon = new URL("../media/icons/star.svg", import.meta.url).href;

  }


  render() {
    return html`
      <section class="product-page"></section>
    `;
  }
}

customElements.define('product-page', ProductPage);

export default ProductPage;
