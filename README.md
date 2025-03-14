# Shopping Cart / Food Store Calculator Application

Welcome to the **Shopping Cart / Food Store Calculator Application**. This project is a homework test for a software engineering position, showcasing a simple **Node.js/Express** server (the “Server”) and a **Next.js/React** client (the “Client”) that together implement a small food store with discount logic and a member card system.

![Screenshot 2025-03-14 at 12.10.47.png](Screenshot%202025-03-14%20at%2012.10.47.png)
[Screen Recording 2025-03-14 at 12.06.55.mov](Screen%20Recording%202025-03-14%20at%2012.06.55.mov)
---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Requirements](#requirements)
4. [Folder Structure](#folder-structure)
5. [Installation & Setup](#installation--setup)
6. [Running the Application](#running-the-application)
7. [Usage](#usage)
8. [API Endpoints](#api-endpoints)
9. [Discount Logic](#discount-logic)
10. [Testing](#testing)
11. [Notes on Extensibility and Maintainability](#notes-on-extensibility-and-maintainability)
12. [License](#license)

---

## 1. Overview

This project implements a **Food Store Calculator** with the following key requirements:

- **Seven Menu Items**: Red, Green, Blue, Yellow, Pink, Purple, Orange.
- **Discount Logic**:
    - 5% discount on every **pair** of Orange, Pink, or Green sets.
    - 10% discount on the **final total** if the user has a valid member card number.
    - **Red set** restriction: only one customer can order a Red set in a given hour (i.e., if a Red set has already been purchased within the current hour, no other customer can purchase it until the hour passes).
- **API**:
    - Must return product list from an endpoint.
    - Must return calculation from an endpoint.
    - Must allow placing an order.
- **UI**:
    - Shows products with add/remove quantity.
    - Allows member card input.
    - Shows total before discount, discount from items, discount from member card, and final total.
- **Unit Tests**:
    - Required to check the discount calculation logic.

The front-end is built with **Next.js (React)**, and the back-end is built with **Node.js/Express**.

---

## 2. Features

- **Product Listing**: Dynamically fetches and displays all products from the server.
- **Shopping Cart**: Allows users to add and remove items from the cart, adjusting quantities in real-time.
- **Discount Calculation**:
    - 5% discount for pairs of certain items (Orange, Pink, Green).
    - 10% additional discount if a valid member card number is provided.
    - Real-time feedback on the total price and discounts applied.
- **Red Set Restriction**: Prevent multiple Red set orders within the same hour.
- **Order Placement**: Users can finalize their order, which triggers a back-end endpoint to store or validate the purchase.
- **Responsive UI**: Built using React and MUI (Material UI) components.

---

## 3. Requirements

Before running this application, ensure you have the following installed:

- **Node.js** (v14 or higher recommended)
- **npm** (comes with Node.js) or **Yarn** (v1 or v3)
- **Git** (optional, for cloning/pulling the repository)

---

## 4. Folder Structure

Below is a simplified view of the main folders and files you might see in the repository:
```yaml
.
├── Server
│   ├── controllers
│   │   └── productController.js
│   ├── models
│   │   └── productModel.js
│   ├── routes
│   │   └── productRoutes.js
│   ├── tests
│   │   └── productController.test.js
│   └── app.js
└── client
    ├── src
    │   ├── components
    │   │   └── ProductItem.js
    │   ├── utils
    │   │   └── CartReducer.js
    │   ├── App.js
    │   └── index.js
    └── public
        └── index.html
```

## 5. Installation & Setup

1. **Clone the Repository** (or download the zipped file):
   ```bash
   git clone https://github.com/Prince9ish/ShoppingCart
   ```
2. **Install Server Dependencies:**
  ```bash
  cd server
  npm install
  ```
3. **Install Client Dependencies**
  ```bash
  cd client
  yarn install
  ```
## 6. Running the Application

**Start the Server**

By default, this will start the server on http://localhost:5050 (or another port, depending on your configuration).
```bash
cd server
npm run dev
```

**Start the Client**

By default, this will start the Next.js development server on http://localhost:3000.
```bash
cd client
yarn start
```
Note: Ensure your server is running before the client attempts to fetch data.

## 7. Usage

Once both the server and client are running:

Open your browser and navigate to http://localhost:3000.
You will see the Shopping Cart page with a list of available products (Red, Green, Blue, Yellow, Pink, Purple, Orange).
Adjust the quantity of each product using the + and - buttons.
Optionally, enter a Member Number if you have one (this simulates the 10% discount).
Click Calculate to see:
Total (before discount)
Discount breakdown (for items and member discount)
Final total (after all discounts)
If satisfied, click Place Order to finalize the purchase. A confirmation dialog will appear with an Order ID.
