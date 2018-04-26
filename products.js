(function () {
    function Products(api) {
        this._api = api;
        this._productArr = [];
        this._currProductArr = [];
        this._cachedDOMElements = {
            productGrid: document.getElementById('productGrid'),
            resultCount: document.getElementById('resultCount'),
            sortBy: document.getElementById('sortBy'),
            sortByRelevance: document.getElementById('sortByRelevance'),
            sortByPriceLtoH: document.getElementById('sortByPriceLtoH'),
            sortByPriceHtoL: document.getElementById('sortByPriceHtoL')
        };
    }

    Products.prototype.initializePage = function () {
        this._cachedDOMElements.sortBy.addEventListener("click", sortHandler);
        function sortHandler(event) {
            let sortProperty;
            switch (event.target) {
                case products._cachedDOMElements.sortByRelevance: sortProperty = event.target.value;
                    break;
                case products._cachedDOMElements.sortByPriceLtoH: sortProperty = event.target.value;
                    break;
                case products._cachedDOMElements.sortByPriceHtoL: sortProperty = event.target.value;
            }
            if (sortProperty) {
                products.sortProducts(sortProperty);
            }
        }
    }

    Products.prototype.getAllProducts = function () {
        fetch(this._api).then(response => response.json()).then(resp => this.extractProducts(resp));
    }

    Products.prototype.extractProducts = function (resp) {
        if (resp.products) {
            this._productArr = resp.products;
            this.renderProducts(this._productArr);
        }
    }

    Products.prototype.renderProducts = function (products) {
        this._cachedDOMElements.productGrid.innerHTML = '';
        this._cachedDOMElements.resultCount.innerHTML = `Showing ${products.length} results for "shoes"`;
        for (let product of products) {
            let productContainer = document.createElement('div');
            productContainer.className = "productContainer";
            let productImgContainer = document.createElement('div');
            productImgContainer.className = "productImgContainer";
            let productImg = document.createElement('img');
            productImg.className = "productImg";
            productImg.src = product.image;
            productImgContainer.append(productImg);
            let title = product.title || '';
            let rating = product.rating || '';
            let final_price = product.price.final_price || '';
            let mrp = product.price.mrp || '';
            let discount = product.discount > 0 ? product.discount + '% off' : '';
            let productDescription = document.createElement('div');
            let html = `<div class = "productTitle"> ${title} </div>
            <div class = "productRating"> ${rating} </div>
            <div class = "price">
                <span class = "finalPrice"> ${final_price} </span>
                <span class = "mrp"> ${mrp} </span>
                <span class = "discount"> ${discount} </span>
            </div>`;
            productDescription.innerHTML = html;
            productDescription.className = "productDescription";
            productContainer.append(productImgContainer);
            productContainer.append(productDescription);
            this._cachedDOMElements.productGrid.append(productContainer);
        }
    }

    Products.prototype.sortProducts = function (sortProperty) {
        let products = this._currProductArr;
        if (sortProperty !== "sortByrelevance") {
            products.sort((p1, p2) => p1.price.final_price - p2.price.final_price);
            if (sortProperty === "sortByPriceHtoL") {
                products.reverse();
            }
        }
        this.renderProducts(products);
    }


    Products.prototype.filterProducts = function (filters) {
        console.log(filters);
        this._currProductArr = Object.assign([], products._productArr);
        if (filters.price.minPrice.key !== "Min") {
            this._currProductArr = this._currProductArr.filter(item => parseInt(item.price.final_price) >= parseInt(filters.price.minPrice.key));
        }
        if (filters.price.maxPrice.key !== "Max") {
            this._currProductArr = this._currProductArr.filter(item => parseInt(item.price.final_price) <= parseInt(filters.price.maxPrice.key))
        }
        if (filters.brands.length > 0) {
            this._currProductArr = this._currProductArr.filter(item => filters.brands.includes(item.brand));
        }
        if (filters.colors.length > 0) {
            this._currProductArr = this._currProductArr.filter(item => filters.colors.includes(item.colour.title))
        }
        this.renderProducts(this._currProductArr);

    }

    products = new Products("http://demo1853299.mockable.io/products");
    products.initializePage();
    products.getAllProducts();

    window.Products = Products;
})();