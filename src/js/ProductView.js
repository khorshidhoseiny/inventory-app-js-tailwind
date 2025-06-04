import Storage from "./Storage.js";

const addNewProductBtn = document.getElementById("add-new-product");
const searchInput = document.querySelector("#search-input");
const selectedSort = document.querySelector("#sort-products");

class ProductView {
  constructor() {
    addNewProductBtn.addEventListener("click", (e) => this.addNewProduct(e));
    searchInput.addEventListener("input", (e) => this.searchProducts(e));
    selectedSort.addEventListener("change", (e) => this.sortProducrs(e));
    this.products = [];
  }
  setApp() {
    this.products = Storage.getAllProducts();
  }
  addNewProduct(e) {
    e.preventDefault();
    const title = document.querySelector("#product-title").value;
    const quantity = document.querySelector("#product-quantity").value;
    const category = document.querySelector("#product-category").value;
    if (!title || !category || !quantity) return;
    Storage.saveProducts({ title, category, quantity });
    this.products = Storage.getAllProducts();
    this.createProductsList(this.products);
    console.log(this.products);
  }

  createProductsList(products) {
    // const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    let result = "";
    products.forEach((item) => {
      const selectedCategory = Storage.getAllCategories().find(
        (c) => c.id == item.category
      );

      result += `<div
              class="flex px-3 border-b border-slate-700 items-center  justify-between mb-2 w-full min-w-[400px]"
            >
              <div class="flex flex-col gap-y-3 ">
                <span class="text-slate-300 font-semibold text-lg"
                  >${item.title}</span
                >
                <span
                  class="block  py-0.5 text-slate-400 text-sm rounded-2xl"
                  >${selectedCategory?.title || "بدون دسته"} :دسته بندی </span
                >
              </div>

              <div class="flex items-center gap-x-4">
                <h3
                  class="flex text-sm items-center gap-x-2 justify-center rounded-full text-slate-400"
                >
                  <span
                    class="bg-emerald-700/50  w-auto h-7  truncate rounded-full flex justify-center items-center p-2"
                    > ${item.quantity}</span
                  >
                  : موجودی انبار
                </h3>

                <span class="text-slate-400/60">|</span>

                <span class="text-slate-400">${new Date().toLocaleDateString(
                  "fa-IR"
                )}</span>
                <span class="text-slate-400/60">|</span>

                <button
                  class="delete-product [&>svg]:pointer-events-none [&>svg>path]:pointer-events-none  bg-slate-600 px-2 py-0.5 cursor-pointer rounded-2xl text-red-500 delete-product"
                  data-product-id="${item.id}"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-7 h-7 "
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </div>
      
      `;
    });

    const productsDOM = document.getElementById("products-list");
    productsDOM.innerHTML = result;

    const deleteBtns = [...document.querySelectorAll(".delete-product")];
    deleteBtns.forEach((item) => {
      item.addEventListener("click", (e) => this.deleteProduct(e));
    });
  }
  searchProducts(e) {
    const value = e.target.value.trim().toLowerCase();
    const filteredProducts = this.products.filter((p) =>
      p.title.toLowerCase().includes(value)
    );
    this.products = filteredProducts;
    console.log(this.products);
    this.createProductsList();
  }
  sortProducrs(e) {
    const value = e.target.value;
    this.products = Storage.getAllProducts(value);
    this.createProductsList(this.products);
  }
  deleteProduct(e) {
    const button = e.target.closest(".delete-product");
    if (!button) return;
    const produdcId = button.dataset.productId;
    Storage.deleteProduct(produdcId);
    this.products = Storage.getAllProducts();
    this.createProductsList(this.products);
  }
}

export default new ProductView();
