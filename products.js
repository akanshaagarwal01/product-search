(function () {
    function Products(api) {
        this._api = api;
        this._productArr = [];
        this._cachedDOMElements = {
            productGrid: document.getElementById('products')
        };
    }

    Products.prototype.getAllProducts = function () {
        fetch(this._api).then(response => response.json()).then(resp => this.extractProducts(resp));
    }

    Products.prototype.extractProducts = function (resp) {
        if (resp.products) {
            this._productArr = resp.products;
            this.renderProducts();
            console.log(this._productArr);
        }
    }

    Products.prototype.renderProducts = function () {
        for (let product of this._productArr) {
            let productContainer = document.createElement('div');
            productContainer.className = "productContainer";
            let productImgContainer = document.createElement('div');
            productImgContainer.className = "productImgContainer";
            let productImg = document.createElement('img');
            productImg.className = "productImg";
            productImg.src = product.image;
            productImgContainer.append(productImg);
            let productDescription = document.createElement('div');
            productDescription.className = "productDescription";
            productContainer.append(productImgContainer);
            productContainer.append(productDescription);
            this._cachedDOMElements.productGrid.append(productContainer);
        }
    }

    products = new Products("http://demo1853299.mockable.io/products");
    products.getAllProducts();
})();