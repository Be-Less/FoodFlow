const API = '/api/v1';

const state = {
  token: localStorage.getItem('foodToken') || '',
  user: JSON.parse(localStorage.getItem('foodUser') || 'null'),
  restaurants: [],
  foods: [],
  categories: [],
  selectedRestaurantId: '',
  cart: []
};

const authSection = document.getElementById('authSection');
const userSection = document.getElementById('userSection');
const adminSection = document.getElementById('adminSection');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const userName = document.getElementById('userName');
const restaurantList = document.getElementById('restaurantList');
const foodList = document.getElementById('foodList');
const cartItems = document.getElementById('cartItems');
const statusMessage = document.getElementById('statusMessage');
const selectedRestaurantLabel = document.getElementById('selectedRestaurantLabel');
const checkoutBtn = document.getElementById('checkoutBtn');
const contentPanel = document.querySelector('.content-panel');
const customerViewBtn = document.getElementById('customerViewBtn');
const adminViewBtn = document.getElementById('adminViewBtn');
const restaurantForm = document.getElementById('restaurantForm');
const foodForm = document.getElementById('foodForm');
const foodRestaurantSelect = document.getElementById('foodRestaurant');
const foodCategorySelect = document.getElementById('foodCategory');
const categoryForm = document.getElementById('categoryForm');

function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.style.background = isError ? '#fee2e2' : '#fef3c7';
  statusMessage.style.color = isError ? '#b91c1c' : '#92400e';
}

function renderAuth() {
  if (state.token && state.user) {
    authSection.classList.add('hidden');
    userSection.classList.remove('hidden');
    userName.textContent = `${state.user.username} (${state.user.email})`;
    currentView = 'customer';
    switchView('customer');
  } else {
    authSection.classList.remove('hidden');
    userSection.classList.add('hidden');
    adminSection.classList.add('hidden');
  }
}

function renderRestaurants() {
  if (!state.restaurants.length) {
    restaurantList.innerHTML = '<div class="card">No restaurants yet.</div>';
    return;
  }

  restaurantList.innerHTML = state.restaurants.map((restaurant) => `
    <div class="card">
      <h3>${restaurant.title}</h3>
      <p>${restaurant.address}</p>
      <p>Type: ${restaurant.foodType}</p>
      <p>Open: ${restaurant.isOpen ? 'Yes' : 'No'}</p>
      <button data-id="${restaurant._id}" class="restaurant-btn">View menu</button>
    </div>
  `).join('');
}

function renderFoods() {
  if (!state.selectedRestaurantId) {
    foodList.innerHTML = '<div class="card">Select a restaurant to view its menu.</div>';
    return;
  }

  const filteredFoods = state.foods.filter((food) => food.restaurant === state.selectedRestaurantId);
  if (!filteredFoods.length) {
    foodList.innerHTML = '<div class="card">No menu items available for this restaurant.</div>';
    return;
  }

  foodList.innerHTML = filteredFoods.map((food) => `
    <div class="card">
      <h3>${food.title}</h3>
      <p>${food.description}</p>
      <p>Price: $${food.price}</p>
      <p>Available: ${food.isAvailable ? 'Yes' : 'No'}</p>
      <button data-food-id="${food._id}" class="add-food-btn">Add to cart</button>
    </div>
  `).join('');
}

function renderCart() {
  if (!state.cart.length) {
    cartItems.innerHTML = '<div class="card">Your cart is empty.</div>';
    return;
  }

  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartItems.innerHTML = `
    <div class="card">
      <strong>Total: $${total.toFixed(2)}</strong>
    </div>
    ${state.cart.map((item) => `
      <div class="cart-item">
        <span>${item.title} x ${item.quantity}</span>
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `).join('')}
  `;
}

async function apiRequest(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;

  const response = await fetch(path, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

async function loadRestaurants() {
  try {
    const data = await apiRequest(`${API}/restaurant/getRestaurants`);
    state.restaurants = data.restaurants || [];
    renderRestaurants();
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function loadFoods() {
  try {
    const data = await apiRequest(`${API}/food/getfoods`);
    state.foods = data.foods || [];
    renderFoods();
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function loadCategories() {
  try {
    const data = await apiRequest(`${API}/category/getCategories`);
    state.categories = data.categories || [];
    populateCategoryDropdown();
  } catch (error) {
    setStatus(error.message, true);
  }
}

function setupTabs() {
  document.querySelectorAll('.tab').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((tab) => tab.classList.remove('active'));
      button.classList.add('active');
      const view = button.dataset.view;
      loginForm.classList.toggle('hidden', view !== 'login');
      registerForm.classList.toggle('hidden', view !== 'register');
    });
  });
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const data = await apiRequest(`${API}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    state.token = data.token;
    state.user = data.user;
    localStorage.setItem('foodToken', state.token);
    localStorage.setItem('foodUser', JSON.stringify(state.user));
    renderAuth();
    setStatus('Logged in successfully.');
    await loadRestaurants();
    await loadFoods();
    await loadCategories();
  } catch (error) {
    setStatus(error.message, true);
  }
});

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const phone = document.getElementById('registerPhone').value;

  try {
    const data = await apiRequest(`${API}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ username, email, password, phone })
    });

    setStatus(`Registered successfully. Please log in.`);
    document.getElementById('registerName').value = '';
    document.getElementById('registerEmail').value = '';
    document.getElementById('registerPassword').value = '';
    document.getElementById('registerPhone').value = '';
    document.querySelector('[data-view="login"]').click();
  } catch (error) {
    setStatus(error.message, true);
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  state.token = '';
  state.user = null;
  localStorage.removeItem('foodToken');
  localStorage.removeItem('foodUser');
  renderAuth();
  setStatus('Logged out.');
});

restaurantList.addEventListener('click', async (event) => {
  const button = event.target.closest('.restaurant-btn');
  if (!button) return;

  const restaurantId = button.dataset.id;
  state.selectedRestaurantId = restaurantId;
  const restaurant = state.restaurants.find((item) => item._id === restaurantId);
  selectedRestaurantLabel.textContent = restaurant ? restaurant.title : 'Selected restaurant';
  renderFoods();
});

foodList.addEventListener('click', (event) => {
  const button = event.target.closest('.add-food-btn');
  if (!button) return;

  const foodId = button.dataset.foodId;
  const food = state.foods.find((item) => item._id === foodId);
  if (!food) return;

  const existingItem = state.cart.find((item) => item._id === foodId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.cart.push({ ...food, quantity: 1 });
  }
  renderCart();
  setStatus(`${food.title} added to cart.`);
});

checkoutBtn.addEventListener('click', async () => {
  if (!state.token || !state.user) {
    setStatus('Please log in first.', true);
    return;
  }

  if (!state.selectedRestaurantId || !state.cart.length) {
    setStatus('Choose a restaurant and add items to your cart.', true);
    return;
  }

  try {
    const payload = {
      restaurant: state.selectedRestaurantId,
      foodItems: state.cart.map((item) => ({ foodId: item._id, quantity: item.quantity }))
    };

    const data = await apiRequest(`${API}/food/orderfood`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    setStatus(`Order placed successfully. Total: $${data.order.totalAmount}`);
    state.cart = [];
    renderCart();
  } catch (error) {
    setStatus(error.message, true);
  }
});

let currentView = 'customer'; // customer or admin

function switchView(view) {
  currentView = view;
  if (view === 'admin') {
    contentPanel.classList.add('hidden');
    adminSection.classList.remove('hidden');
    adminViewBtn.classList.add('active');
    customerViewBtn.classList.remove('active');
    // Populate restaurant dropdown
    populateRestaurantDropdown();
    // Populate category dropdown
    populateCategoryDropdown();
  } else {
    contentPanel.classList.remove('hidden');
    adminSection.classList.add('hidden');
    customerViewBtn.classList.add('active');
    adminViewBtn.classList.remove('active');
  }
}

function populateRestaurantDropdown() {
  foodRestaurantSelect.innerHTML = '<option value="">Select Restaurant</option>';
  state.restaurants.forEach((restaurant) => {
    const option = document.createElement('option');
    option.value = restaurant._id;
    option.textContent = restaurant.title;
    foodRestaurantSelect.appendChild(option);
  });
}

function populateCategoryDropdown() {
  foodCategorySelect.innerHTML = '<option value="">Select Category</option>';
  state.categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category._id;
    option.textContent = category.title;
    foodCategorySelect.appendChild(option);
  });
}

customerViewBtn.addEventListener('click', () => switchView('customer'));
adminViewBtn.addEventListener('click', () => switchView('admin'));

// Admin tabs for restaurant/food creation
document.querySelectorAll('[data-admin-view]').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelectorAll('[data-admin-view]').forEach((tab) => tab.classList.remove('active'));
    button.classList.add('active');
    const view = button.dataset.adminView;
    categoryForm.classList.toggle('hidden', view !== 'category');
    restaurantForm.classList.toggle('hidden', view !== 'restaurant');
    foodForm.classList.toggle('hidden', view !== 'food');
  });
});

categoryForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = document.getElementById('categoryTitle').value;
  const image = document.getElementById('categoryImage').value;

  try {
    const data = await apiRequest(`${API}/category/createCategory`, {
      method: 'POST',
      body: JSON.stringify({ title, image })
    });

    setStatus(`Category "${title}" created successfully!`);
    categoryForm.reset();
    await loadCategories();
  } catch (error) {
    setStatus(error.message, true);
  }
});

restaurantForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = document.getElementById('restTitle').value;
  const address = document.getElementById('restAddress').value;
  const image = document.getElementById('restImage').value;
  const foodType = document.getElementById('restFoodType').value;
  const time = document.getElementById('restTime').value;
  const deliveryTime = document.getElementById('restDeliveryTime').value;
  const deliveryCharge = parseFloat(document.getElementById('restDeliveryCharge').value);
  const rating = parseFloat(document.getElementById('restRating').value) || 4.5;
  const isOpen = document.getElementById('restIsOpen').checked;

  try {
    const data = await apiRequest(`${API}/restaurant/createRestaurant`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        address,
        image,
        foodType,
        time,
        deliveryTime,
        deliveryCharge,
        rating,
        isOpen
      })
    });

    setStatus(`Restaurant "${title}" created successfully!`);
    restaurantForm.reset();
    document.getElementById('restRating').value = '4.5';
    await loadRestaurants();
    populateRestaurantDropdown();
  } catch (error) {
    setStatus(error.message, true);
  }
});

foodForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = document.getElementById('foodTitle').value;
  const description = document.getElementById('foodDescription').value;
  const price = parseFloat(document.getElementById('foodPrice').value);
  const image = document.getElementById('foodImage').value;
  const restaurant = document.getElementById('foodRestaurant').value;
  const category = document.getElementById('foodCategory').value;
  const isAvailable = document.getElementById('foodIsAvailable').checked;

  if (!restaurant) {
    setStatus('Please select a restaurant', true);
    return;
  }

  if (!category) {
    setStatus('Please select a category', true);
    return;
  }

  try {
    const data = await apiRequest(`${API}/food/createfood`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        description,
        price,
        image,
        restaurant,
        category,
        isAvailable
      })
    });

    setStatus(`Food item "${title}" created successfully!`);
    foodForm.reset();
    document.getElementById('foodIsAvailable').checked = true;
    await loadFoods();
  } catch (error) {
    setStatus(error.message, true);
  }
});

setupTabs();
renderAuth();
if (state.token && state.user) {
  loadRestaurants();
  loadFoods();
  loadCategories();
  setStatus('Logged in. You can browse restaurants and place an order.');
} else {
  setStatus('Please log in to view restaurants and order food.');
}
