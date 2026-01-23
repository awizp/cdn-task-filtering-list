// container variables,
const productsContainer = document.getElementById('products-container');
const loadingMessage = document.getElementById('loading-message');
const countryEl = document.getElementById('country-items');
const searchItemEl = document.getElementById('search-item');
const fragmentEl = document.createDocumentFragment();

let foodItems;
let count = 0;

// changing the country,
const countryHandle = (countryValue = 'indian') => {
    let url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${countryValue}`;
    return url;
};

// fetching the foods,
const fetchingProducts = async (foodUrl) => {
    let res = await fetch(foodUrl);
    let data = await res.json();
    foodItems = await data.meals;
};

// creating and append the elements,
const appendFoods = (foods = foodItems) => {
    productsContainer.innerHTML = '';
    foods.forEach(meals => {
        // food item for each one and style class,
        let itemDivEl = document.createElement('div');
        let foodBodyEl = document.createElement('div');
        let foodTitle = document.createElement('h3');

        itemDivEl.classList.add('food-item');
        foodBodyEl.classList.add('food-body');
        foodTitle.className = 'text-white text-sm font-semibold';
        foodTitle.textContent = meals.strMeal;
        foodBodyEl.append(foodTitle);

        // food image
        let imageDivEl = document.createElement('div');
        imageDivEl.classList.add('food-image');
        imageDivEl.setAttribute('loading', "lazy");
        let imgEl = document.createElement('img');
        imgEl.setAttribute('src', meals?.strMealThumb);
        imgEl.setAttribute('alt', meals?.strMeal);
        imgEl.className = 'w-full h-full object-cover rounded-xl';
        imageDivEl.append(imgEl);

        itemDivEl.append(imageDivEl, foodBodyEl);

        fragmentEl.append(itemDivEl);
    });
    productsContainer.append(fragmentEl);
};

// while waiting for fetching the food products,
const loadingHandle = () => {
    // loading message,
    loadingMessage.style.display = 'block';
    productsContainer.style.display = 'none';
    loadingMessage.innerHTML = 'Loading food items...';

    setTimeout(() => {
        loadingMessage.style.display = 'none';
        productsContainer.style.display = 'grid';
        appendFoods();

        // food items error means,
        if (!foodItems) {
            loadingMessage.innerHTML = 'No food items found!';
            return;
        }
    }, 2000);
};

// while loading windows load the components,
window.addEventListener('load', () => {
    let foodUrl = countryHandle();
    fetchingProducts(foodUrl);
    loadingHandle();
});

// changing dom while change select element,
countryEl.addEventListener('input', (e) => {
    let url = countryHandle(e.target.value);
    fetchingProducts(url);
    loadingHandle();
});

// changing the dom while giving the input field,
searchItemEl.addEventListener('input', (e) => {
    let url = countryHandle(countryEl.value);
    let inputVal = e.target.value.toLocaleLowerCase();
    fetchingProducts(url);

    if (foodItems !== null) {
        let newFoodItems = foodItems.filter((item) => {
            if (item.strMeal.toLocaleLowerCase().includes(inputVal)) {
                return item;
            }
        });

        appendFoods(newFoodItems);

        // loading message,
        loadingMessage.style.display = 'block';
        productsContainer.style.display = 'none';
        loadingMessage.innerHTML = 'Loading food items...';

        setTimeout(() => {
            loadingMessage.style.display = 'none';
            productsContainer.style.display = 'grid';

            // food items error means,
            if (!foodItems) {
                loadingMessage.innerHTML = 'No food items found!';
                return;
            }
        }, 2000);
    }
});
