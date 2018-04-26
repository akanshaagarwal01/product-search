(function () {
    function Filters(api) {
        this._api = api;
        this._filterArr = [];
        this._cachedDOMElements = {
            fromPriceFilter: document.getElementById("fromPrice"),
            toPriceFilter: document.getElementById("toPrice"),
            brandContainer: document.getElementById("Brand"),
            brandFilter: document.getElementById("brandName"),
            colorFilter: document.getElementById("Color")
        };
        this._filters = {
            price: {
                minPrice: '',
                maxPrice: '',
            },
            brands: [],
            colors: []
        };
        this._products = new Products();
    }
    Filters.prototype.getAllFilters = function () {
        fetch(this._api)
            .then(response => response.json()).then(resp => this.extractFilters(resp));
    }

    Filters.prototype.extractFilters = function (resp) {
        if (resp.filters) {
            this._filterArr = resp.filters;
            this.populatePriceFilter();
            this.populateBrandFilter();
            this.populateColorFilter();
        }
    }

    Filters.prototype.populatePriceFilter = function () {
        let priceObj = this._filterArr.find(item => item.type === "PRICE");
        this._filters.price.minPrice = priceObj.values.find(item => item.key === "Min");
        this._filters.price.maxPrice = priceObj.values.find(item => item.key === "Max");
        if (priceObj) {
            let min, max;
            for (let value of priceObj.values) {
                if (value.key !== "Max") {
                    min = document.createElement('option');
                    min.value = value.key;
                    min.text = value.displayValue;
                    this._cachedDOMElements.fromPriceFilter.append(min);
                }
                if (value.key !== "Min") {
                    max = document.createElement('option');
                    max.value = value.key;
                    max.text = value.displayValue;
                    this._cachedDOMElements.toPriceFilter.append(max);
                }
            }
            this._cachedDOMElements.fromPriceFilter.selectedIndex = 0;
            this._cachedDOMElements.toPriceFilter.selectedIndex = priceObj.values.length - 2;
            this._cachedDOMElements.fromPriceFilter.addEventListener("change", minHandler);
            this._cachedDOMElements.toPriceFilter.addEventListener("change", maxHandler);
            function minHandler() {
                let maxValues;
                let selected = filters._cachedDOMElements.toPriceFilter.value;
                filters._cachedDOMElements.toPriceFilter.options.length = 0;
                if (this.value === "Min") {
                    maxValues = priceObj.values;
                } else {
                    maxValues = priceObj.values.filter((item, index, arr) => parseInt(item.key) >= parseInt(this.value) || index === arr.length - 1);
                }
                for (let value of maxValues) {
                    if (value.key === "Min") {
                        continue;
                    }
                    max = document.createElement('option');
                    max.value = value.key;
                    max.text = value.displayValue;
                    filters._cachedDOMElements.toPriceFilter.append(max);
                }
                filters._cachedDOMElements.toPriceFilter.value = selected;
                filters._filters = {
                    ...filters._filters,
                    price: {
                        ...filters._filters.price,
                        minPrice: priceObj.values.find(item => item.key === this.value)
                    }
                };
                filters._products.filterProducts(filters._filters);
            }
            function maxHandler() {
                let minValues;
                let selected = filters._cachedDOMElements.fromPriceFilter.value;
                filters._cachedDOMElements.fromPriceFilter.options.length = 0;
                if (this.value === "Max") {
                    minValues = priceObj.values;
                } else {
                    minValues = priceObj.values.filter((item, index, arr) => parseInt(item.key) <= parseInt(this.value) || index === 0);
                }
                for (let value of minValues) {
                    if (value.key === "Max") {
                        continue;
                    }
                    min = document.createElement('option');
                    min.value = value.key;
                    min.text = value.displayValue;
                    filters._cachedDOMElements.fromPriceFilter.append(min);
                }
                filters._cachedDOMElements.fromPriceFilter.value = selected;
                filters._filters = {
                    ...filters._filters,
                    price: {
                        ...filters._filters.price,
                        maxPrice: priceObj.values.find(item => item.key === this.value)
                    }
                };
                filters._products.filterProducts(filters._filters);
            }
        }
    }

    Filters.prototype.populateBrandFilter = function () {
        let selectedBrands = [];
        let brandObj = this._filterArr.find(item => item.type === "BRAND");
        let selBrands = document.createElement('div');
        selBrands.id = "brandList";
        this._cachedDOMElements.brandFilter.addEventListener("change", brandHandler);
        function brandHandler() {
            let brandMatch = (brandObj.values || []).find(item => (item.title === this.value || item.value === this.value));
            if (brandMatch) {
                selectedBrands = [...selectedBrands, brandMatch.value];
                let html = "";
                for (let brand of selectedBrands) {
                    html += `${brand} , `;
                }
                selBrands.innerHTML = html;
                filters._cachedDOMElements.brandContainer.append(selBrands);
                this.value = "";
                this.textContent = "";
                filters._filters = { ...filters._filters, brands: selectedBrands };
                filters._products.filterProducts(filters._filters);
            }
            this.value = "";
            this.textContent = "";
        }

    }

    Filters.prototype.populateColorFilter = function () {
        let selectedColors = [];
        let colorObj = this._filterArr.find(item => item.type === "COLOUR");
        if (colorObj.values) {
            for (let value of colorObj.values) {
                let colorContainer = document.createElement('div');
                colorContainer.className = "colorCheckbox";
                let color = document.createElement('input');
                color.type = "checkbox";
                color.className = "colorInput"
                color.name = 'color';
                color.value = value.color;
                let colorLabel = document.createElement('label');
                colorLabel.textContent = value.title;
                let dispColor = document.createElement('div');
                dispColor.className = "dispColor";
                dispColor.style.backgroundColor = value.color;
                colorLabel.prepend(dispColor);
                colorContainer.append(color);
                colorContainer.append(colorLabel);
                this._cachedDOMElements.colorFilter.append(colorContainer);
            }
            this._cachedDOMElements.colorFilter.addEventListener("click", colorHandler);
        }
        function colorHandler(event) {
            let colorContainer = event.target.closest('.colorCheckbox');
            let colorInput = colorContainer.querySelector('.colorInput');
            let colorValue = (colorObj.values || []).find(item => item.color === colorInput.value);
            if (event.target.type !== "checkbox") {
                colorInput.checked = !colorInput.checked;
            }
            if (colorInput.checked) {
                selectedColors = [...selectedColors, colorValue.title];
            }
            else {
                let index = selectedColors.indexOf(colorValue.title);
                if (index >= 0) {
                    selectedColors.splice(index, 1);
                }
            }
            filters._filters = { ...filters._filters, colors: selectedColors };
            filters._products.filterProducts(filters._filters);
        }
    }

    filters = new Filters("http://demo1853299.mockable.io/filters");
    filters.getAllFilters();
})();   