# 🍔 Food App Backend

A RESTful backend API for a food delivery application built with **Node.js, Express.js, MongoDB, and Mongoose**.

## 🚀 Features

* User registration and login
* JWT authentication
* Password hashing with bcryptjs
* User profile management
* Restaurant management
* Food management
* Multiple-food ordering
* Automatic order total calculation
* Protected API routes
* MongoDB database integration

## 🛠️ Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **JWT**
* **bcryptjs**
* **Postman**

## 📁 Project Structure

```text
Food_App/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── restaurantController.js
│   └── foodController.js
├── middlewares/
│   └── authMiddleware.js
├── models/
│   ├── userModel.js
│   ├── restaurantModel.js
│   ├── foodModel.js
│   ├── categoryModel.js
│   └── orderModel.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── restaurantRoutes.js
│   └── foodRoutes.js
├── .env
├── server.js
└── package.json
```

## ⚙️ Installation

```bash
git clone YOUR_REPOSITORY_URL
cd Food_App
npm install
```

Create a `.env` file:

```env
PORT=8080
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Run the server:

```bash
npm run server
```

Server:

```text
http://localhost:8080
```

## 📡 Main API Endpoints

| Method | Endpoint                              | Description       |
| ------ | ------------------------------------- | ----------------- |
| POST   | `/api/v1/auth/register`               | Register user     |
| POST   | `/api/v1/auth/login`                  | Login user        |
| GET    | `/api/v1/user/getUser`                | Get user          |
| PUT    | `/api/v1/user/updateUser`             | Update user       |
| DELETE | `/api/v1/user/deleteUser`             | Delete user       |
| POST   | `/api/v1/restaurant/createRestaurant` | Create restaurant |
| POST   | `/api/v1/food/createfood`             | Create food       |
| GET    | `/api/v1/food/getfoods`               | Get foods         |
| PUT    | `/api/v1/food/updatefood/:id`         | Update food       |
| DELETE | `/api/v1/food/deletefood/:id`         | Delete food       |
| POST   | `/api/v1/food/orderfood`              | Place order       |

## 🔐 Authentication

Protected routes require a JWT token:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

The authentication middleware verifies the token and provides the logged-in user's ID through:

```javascript
req.user.id
```

## 🛒 Order Example

```json
{
    "restaurant": "RESTAURANT_ID",
    "foodItems": [
        {
            "foodId": "FOOD_ID_1",
            "quantity": 2
        },
        {
            "foodId": "FOOD_ID_2",
            "quantity": 1
        }
    ]
}
```

The backend calculates the total amount automatically.

## 🎯 Purpose

This project was developed to practice **Node.js backend development, REST APIs, authentication, middleware, MongoDB, MVC architecture, and API testing with Postman**.

## 👨‍💻 Author

**Rohan**
