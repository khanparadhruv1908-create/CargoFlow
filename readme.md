# 🚢 CargoFloe: Modern Logistics & Supply Chain Management 📦

![CargoFloe Banner](https://raw.githubusercontent.com/khanparadhruv1908-create/CargoFlow/main/assets/banner.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Stack: MERN](https://img.shields.io/badge/Stack-MERN-green.svg)]()
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![Platform: Web](https://img.shields.io/badge/Platform-Web-orange.svg)]()

> **"Streamlining global logistics with real-time tracking, secure payments, and seamless cargo management."**

---

## 🚀 1. Project Overview

**CargoFloe** is a comprehensive, production-grade logistics management platform designed to solve the complexities of modern supply chains. Whether it's air freight, ocean shipping, or overland trucking, CargoFloe provides a unified interface for businesses to manage their shipments from origin to destination.

### The Problem it Solves:
In traditional logistics, tracking is fragmented, invoicing is manual, and communication between freight forwarders and clients is slow. **CargoFloe** centralizes these processes, offering **real-time visibility**, automated billing, and secure digital payments, reducing operational overhead and increasing customer trust.

---

## ⚙️ 2. How It Works

CargoFloe follows a streamlined system flow to ensure efficiency at every stage of the shipment lifecycle:

1.  **Booking**: Users select a service (Air, Ocean, or Land) and provide shipment details to get a quote.
2.  **Processing**: The system generates a tracking ID and creates an entry in the MongoDB database.
3.  **Admin Approval**: Admins review the shipment, assign warehouses, and update the status (e.g., "Dispatched").
4.  **Real-time Tracking**: Using **Socket.io** and **Leaflet.js**, users can see their cargo's physical location on a live map.
5.  **Billing & Customs**: Invoices are generated automatically, and customs documentation is managed through the platform.
6.  **Secure Payment**: Clients pay for their services via the integrated **Stripe** gateway.
7.  **Delivery**: Once reached, the status is updated to "Delivered," and a final delivery report is generated.

---

## ✨ 3. Features

- 🛰️ **Real-time GPS Tracking**: Live location updates using Socket.io and Leaflet.
- ✈️ **Multi-Modal Support**: Integrated modules for Air, Ocean, and Trucking services.
- 💳 **Seamless Payments**: Secure transaction processing via Stripe Integration.
- 🔐 **Advanced Authentication**: Secure user and admin login powered by Clerk/JWT.
- 📊 **Interactive Dashboard**: Comprehensive analytics for admins to monitor global operations.
- 📑 **Automated Invoicing**: Instant PDF generation and billing management.
- 🏢 **Warehouse Management**: Track cargo storage and inventory across multiple hubs.
- 🗺️ **Dynamic Maps**: Visual shipment history and upcoming route projections.

---

## 🧩 4. Components Used

### Core Modules
| Module | Role |
| :--- | :--- |
| **Backend (Express/Node)** | Handles API requests, business logic, and database operations. |
| **Frontend (React)** | Provides a responsive and interactive user experience. |
| **Admin Panel** | Dedicated interface for logistics managers to oversee all shipments. |
| **MongoDB Database** | Scalable storage for shipments, users, and service logs. |

### Third-Party Integrations
- **Socket.io**: Powers the bidirectional real-time communication for tracking.
- **Leaflet.js**: The mapping engine for visualizing cargo movement.
- **Stripe API**: Handles secure credit card payments and refunds.
- **Clerk / JWT**: Manages identity and access control for users and admins.

---

## 💻 5. Technologies Used

- **Frontend**: React.js, Vite, Tailwind CSS, Material UI, Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **Communication**: Socket.io (WebSockets).
- **Payment Gateway**: Stripe.
- **Auth**: JWT / Clerk Authentication.
- **Logging**: Morgan & Winston.

---

## 🛠️ 6. Installation / Setup

Follow these steps to get a local development environment running:

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Stripe API Keys

### Step 1: Clone the Repository
```bash
git clone https://github.com/khanparadhruv1908-create/CargoFlow.git
cd CargoFlow
```

### Step 2: Install Dependencies
```bash
# Install root dependencies
npm install

# Install all sub-package dependencies
npm run install:all
```

### Step 3: Configure Environment Variables
Create a `.env` file in the `backend`, `frontend`, and `admin` directories (refer to `.env.example` in each folder).

### Step 4: Seed the Database (Optional)
```bash
npm run seed:services
npm run seed:admin
```

### Step 5: Start the Application
```bash
# Run everything concurrently
npm run dev
```

---

## ▶️ 7. Usage

1.  **Register/Login**: Access the dashboard as a customer or administrator.
2.  **Book Shipment**: Go to the "Services" page and select a shipping method.
3.  **Track Cargo**: Enter your tracking number on the "Track" page to see real-time updates.
4.  **Admin Operations**: Log in to the admin panel (`/admin`) to manage shipments, update status, and view analytics.
5.  **Payment**: Navigate to the "Billing" section to view and pay pending invoices.

---

## 📁 8. Project Structure

```bash
├── 📁 admin           # Dedicated Admin Dashboard (Vite + React)
├── 📁 backend         # Node.js/Express API & Models
├── 📁 frontend        # Customer-facing Web Application
├── 📁 node_modules    # Project dependencies
├── 📄 package.json    # Project metadata & workspace scripts
└── 📄 readme.md       # Root documentation
```

---

## 🔮 9. Future Improvements

- [ ] **Mobile App**: Native iOS and Android apps for on-the-go tracking.
- [ ] **AI Routing**: Machine learning algorithms to predict the fastest delivery routes.
- [ ] **Blockchain Ledger**: Immutable logs for customs and high-value cargo.
- [ ] **Multi-Language Support**: Expanding to global markets with i18n localization.

---

## ⚠️ 10. Challenges Faced

- **Real-time Latency**: Optimizing Socket.io rooms to handle thousands of concurrent tracking updates without performance lag.
- **Payment Webhooks**: Ensuring Stripe webhooks correctly update database records even during network failures.
- **Complex UI**: Balancing a high-density "Admin Dashboard" with a clean, user-friendly customer experience.

---

## 🌍 11. Applications

1.  **Freight Forwarding**: Small to medium freight companies looking for a digital transformation.
2.  **E-commerce Logistics**: Direct integration for online stores to manage their own shipping.
3.  **Supply Chain Startups**: Flexible foundation for building niche logistics solutions.
4.  **In-House Logistics**: Large corporations managing internal fleet movements.

---

## 🧾 12. Conclusion

**CargoFloe** represents a significant step forward in making logistics accessible, transparent, and secure. By combining modern web technologies with robust engineering practices, it provides a scalable solution for the modern global economy.

---

## 👤 13. Author Info

- **Created by**: [Your Name Here]
- **GitHub**: [@your-username](https://github.com/your-username)
- **LinkedIn**: [Your LinkedIn Profile]
- **Email**: `your.email@example.com`

---

*Built with passion for the logistics industry.*
