# 🎨 Mayur Paints — E-Commerce Platform

A full-stack e-commerce web application for **Mayur Paints**, a paint and hardware retail business. Built with **React**, **Tailwind CSS**, **Node.js/Express**, and **MongoDB**.

---

## ✨ Features

### Customer-Facing
- **Product Catalog** — Browse paints and hardware with search, category filters, and price range filters.
- **Shopping Cart** — Add products, update quantities, and checkout with shipping & payment options.
- **User Authentication** — Register and log in with role-based access (user / admin).
- **User Dashboard** — View order history and account details.
- **Colour Cosmos (3D Visualizer)** — Interactive colour visualization tool for selecting paint shades.

### Admin Panel
- **Order Management** — View and update order statuses.
- **Inventory Management** — Track stock levels, view low-stock alerts, and update quantities.
- **Analytics Dashboard** — Revenue charts, top products, customer stats, and order breakdowns.
- **Product CRUD** — Create, update, and delete paint and hardware products.
- **Customer Management** — View all registered customers with order summaries.

---

## 🛠️ Tech Stack

| Layer      | Technology                                  |
| ---------- | ------------------------------------------- |
| Frontend   | React 19, React Router 7, Tailwind CSS 3    |
| Build Tool | Vite 8                                      |
| Backend    | Node.js, Express 4                          |
| Database   | MongoDB (Mongoose 9)                        |
| Linting    | ESLint 9                                    |

---

## 📁 Project Structure

```
FS/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── Navbar.jsx       # Navigation bar
│   │   └── Footer.jsx       # Footer component
│   ├── pages/
│   │   ├── Landing.jsx      # Home page
│   │   ├── Login.jsx        # Login page
│   │   ├── SignUp.jsx        # Registration page
│   │   ├── PaintsShop.jsx   # Paints catalog
│   │   ├── HardwareShop.jsx # Hardware catalog
│   │   ├── Cart.jsx         # Shopping cart & checkout
│   │   ├── ColourCosmos.jsx # 3D colour visualizer
│   │   ├── Products.jsx     # General products view
│   │   ├── UserDashboard.jsx# User account dashboard
│   │   └── AdminDashboard.jsx # Admin control panel
│   ├── api.js               # API service layer
│   ├── App.jsx              # Root component & routing
│   ├── main.jsx             # App entry point
│   └── index.css            # Global styles
├── server/
│   ├── models/
│   │   ├── User.js          # User schema
│   │   ├── Paint.js         # Paint product schema
│   │   ├── Hardware.js      # Hardware product schema
│   │   └── Order.js         # Order schema
│   ├── index.js             # Express server & API routes
│   ├── seed.js              # Database seeder script
│   └── db.json              # Sample/seed data
├── index.html               # HTML entry point
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── package.json             # Frontend dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or later)
- **MongoDB** (running locally on `mongodb://127.0.0.1:27017` or provide a connection string)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd FS
```

### 2. Install Dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd server
npm install
cd ..
```

### 3. Seed the Database

Populate MongoDB with sample paint and hardware products:

```bash
cd server
npm run seed
cd ..
```

### 4. Start the Backend Server

```bash
cd server
npm start
```

The API server runs at **http://localhost:3001**.

### 5. Start the Frontend Dev Server

In a new terminal:

```bash
npm run dev
```

The app opens at **http://localhost:5173** (default Vite port).

---

## 🔌 API Endpoints

| Method   | Endpoint                          | Description               |
| -------- | --------------------------------- | ------------------------- |
| `POST`   | `/api/auth/login`                 | User login                |
| `POST`   | `/api/auth/register`              | User registration         |
| `GET`    | `/api/paints`                     | List paints (with filters)|
| `GET`    | `/api/paints/:id`                 | Get paint by ID           |
| `POST`   | `/api/paints`                     | Create a paint product    |
| `PUT`    | `/api/paints/:id`                 | Update a paint product    |
| `DELETE` | `/api/paints/:id`                 | Delete a paint product    |
| `GET`    | `/api/hardware`                   | List hardware (with filters)|
| `GET`    | `/api/hardware/:id`               | Get hardware item by ID   |
| `POST`   | `/api/hardware`                   | Create a hardware product |
| `PUT`    | `/api/hardware/:id`               | Update a hardware product |
| `DELETE` | `/api/hardware/:id`               | Delete a hardware product |
| `GET`    | `/api/orders`                     | List orders               |
| `GET`    | `/api/orders/:id`                 | Get order by ID           |
| `POST`   | `/api/orders`                     | Place a new order         |
| `PUT`    | `/api/orders/:id/status`          | Update order status       |
| `GET`    | `/api/inventory`                  | Inventory summary (Admin) |
| `PUT`    | `/api/inventory/:type/:id/stock`  | Update stock (Admin)      |
| `GET`    | `/api/analytics`                  | Analytics data (Admin)    |
| `GET`    | `/api/users`                      | List all users (Admin)    |

---

## 🌐 Environment Variables

| Variable    | Default                                    | Description              |
| ----------- | ------------------------------------------ | ------------------------ |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/mayurpaints`    | MongoDB connection string|

---

## 📜 Available Scripts

### Frontend (`/`)

| Script          | Command              | Description                  |
| --------------- | -------------------- | ---------------------------- |
| `npm run dev`   | `vite`               | Start dev server             |
| `npm run build` | `vite build`         | Build for production         |
| `npm run preview`| `vite preview`      | Preview production build     |
| `npm run lint`  | `eslint .`           | Run ESLint                   |

### Backend (`/server`)

| Script          | Command              | Description                  |
| --------------- | -------------------- | ---------------------------- |
| `npm start`     | `node index.js`      | Start the API server         |
| `npm run seed`  | `node seed.js`       | Seed the database            |

---

## 📄 License

This project is for educational / personal use.
