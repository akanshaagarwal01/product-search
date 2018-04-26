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
        if (priceObj) {
            let min, max;
            for (let value of priceObj.values) {
                min = document.createElement('option');
                min.value = value.key;
                min.text = value.displayValue;
                this._cachedDOMElements.fromPriceFilter.append(min);
                max = document.createElement('option');
                max.value = value.key;
                max.text = value.displayValue;
                this._cachedDOMElements.toPriceFilter.append(max);
            }
            this._cachedDOMElements.fromPriceFilter.selectedIndex = 0;
            this._cachedDOMElements.toPriceFilter.selectedIndex = priceObj.values.length - 1;
            this._cachedDOMElements.fromPriceFilter.addEventListener("change", minHandler);
            this._cachedDOMElements.toPriceFilter.addEventListener("change", maxHandler);
            function minHandler() {
                filters._cachedDOMElements.toPriceFilter.options.length = 0;
                let maxValues = priceObj.values.filter((item, index) => index > this.selectedIndex)
                if (maxValues.length === 0) {
                    max = document.createElement('option');
                    max.value = priceObj.values[priceObj.values.length - 1].key;
                    max.text = priceObj.values[priceObj.values.length - 1].displayValue;
                    filters._cachedDOMElements.toPriceFilter.append(max);
                }
                else {
                    for (let value of maxValues) {
                        max = document.createElement('option');
                        max.value = value.key;
                        max.text = value.displayValue;
                        filters._cachedDOMElements.toPriceFilter.append(max);
                    }
                }
            }
            function maxHandler() {
                filters._cachedDOMElements.fromPriceFilter.options.length = 0;
                let minValues = priceObj.values.filter((item, index) => index < this.selectedIndex)
                if (minValues.length === 0) {
                    min = document.createElement('option');
                    min.value = priceObj.values[0].key;
                    min.text = priceObj.values[0].displayValue;
                    filters._cachedDOMElements.fromPriceFilter.append(min);
                }
                else {
                    for (let value of minValues) {
                        min = document.createElement('option');
                        min.value = value.key;
                        min.text = value.displayValue;
                        filters._cachedDOMElements.fromPriceFilter.append(min);
                    }
                }
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
            let brandMatch = (brandObj.values || []).filter(item => (item.title === this.value || item.value === this.value))[0];
            selectedBrands = [...selectedBrands, brandMatch];
            let html = "";
            for (let brand of selectedBrands) {
                html += `${brand.title} , `;
            }
            selBrands.innerHTML = html;
            filters._cachedDOMElements.brandContainer.append(selBrands);
            console.log(selectedBrands);
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
                selectedColors = [...selectedColors, colorValue];
            }
            else {
                let index = selectedColors.indexOf(colorValue);
                if (index >= 0) {
                    selectedColors.splice(index, 1);
                }
            }
            console.log(selectedColors);
        }
    }

    filters = new Filters("http://demo1853299.mockable.io/filters");
    filters.getAllFilters();
})();   