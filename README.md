# IntelliDash AI ERP

AI ERP dashboard built with Laravel, React, TypeScript, Inertia.js, and Tailwind CSS.

## Overview

IntelliDash AI ERP is a modern enterprise resource planning system designed to provide real-time operational insights, inventory monitoring, fraud detection, analytics dashboards, and intelligent business reporting.

The platform combines a scalable Laravel backend with a responsive React frontend to deliver a fast and efficient management experience.

---

# Features

## Core Modules

* Dashboard Analytics
* Inventory Management
* Product Monitoring
* Fraud Detection Logs
* Risk Alerts
* Sales & Performance Charts
* Real-Time Metrics
* Role-Based Access Control
* CRUD Management System
* AI-Driven Insights

## Dashboard Features

* Interactive charts and graphs
* Inventory risk monitoring
* Critical SKU alerts
* Fraud activity tracking
* KPI summary cards
* Dynamic filtering
* Responsive admin layout

## Technical Features

* Laravel API backend
* React + TypeScript frontend
* Inertia.js SPA architecture
* Tailwind CSS UI
* Reusable CRUD components
* Chart.js integration
* RESTful API structure
* Modular component architecture

---

# Tech Stack

## Backend

* PHP
* Laravel
* MySQL
* Laravel Sanctum

## Frontend

* React
* TypeScript
* Inertia.js
* Tailwind CSS
* Chart.js
* Vite

---

# Screenshots

> Add your application screenshots here.

Example:
<img width="1904" height="894" alt="image" src="https://github.com/user-attachments/assets/4d844218-cdd3-4942-8b0e-04e87c0ef590" />
<img width="1910" height="897" alt="image" src="https://github.com/user-attachments/assets/bfe89008-ef84-454b-9af3-c7383065b5e6" />
<img width="1900" height="898" alt="image" src="https://github.com/user-attachments/assets/c1226946-20ac-49c4-be52-ff2547269fa7" />
<img width="1895" height="905" alt="image" src="https://github.com/user-attachments/assets/b1145aa2-d4a6-4c72-b5b1-1fe0adf95cfe" />
<img width="1893" height="902" alt="image" src="https://github.com/user-attachments/assets/f9d096e9-7eed-4b0d-a2e1-8adcd3ec66b4" />
<img width="1897" height="904" alt="image" src="https://github.com/user-attachments/assets/4f7f7ea0-99f9-4bd8-b235-acbb193a65bd" />
<img width="1897" height="901" alt="image" src="https://github.com/user-attachments/assets/78c90954-ffd3-4b38-a56a-be79e5c52a83" />
<img width="1891" height="904" alt="image" src="https://github.com/user-attachments/assets/b4db7c00-1a69-46c0-a0e7-e2aa2c404933" />
<img width="1901" height="907" alt="image" src="https://github.com/user-attachments/assets/64acca05-78f5-4d9b-acdc-3e6b172a6fec" />
<img width="1893" height="913" alt="image" src="https://github.com/user-attachments/assets/65ca0ec4-45db-4dcc-8282-e86c5947821e" />
<img width="1901" height="907" alt="image" src="https://github.com/user-attachments/assets/e876106d-7829-435d-930d-94e2f3538972" />
<img width="1892" height="910" alt="image" src="https://github.com/user-attachments/assets/88f5375a-f65a-44f6-b074-e91d077cee5d" />
<img width="1914" height="909" alt="image" src="https://github.com/user-attachments/assets/baf1e650-3c2e-4b3b-b3d5-8147ebb40959" />
<img width="1913" height="904" alt="image" src="https://github.com/user-attachments/assets/40b44b02-8192-40c8-97a7-ab6b9363d631" />
<img width="1902" height="910" alt="image" src="https://github.com/user-attachments/assets/e28a57f1-855b-415c-af26-e3c941e0d735" />
<img width="1912" height="913" alt="image" src="https://github.com/user-attachments/assets/8df15e09-0d49-49f4-9334-4fbf37676a30" />

---

# Installation

## 1. Clone the Repository

```bash
git clone https://github.com/rickz25/IntelliDash.git
```

## 2. Navigate to the Project

```bash
cd IntelliDash
```

## 3. Install Backend Dependencies

```bash
composer install
```

## 4. Install Frontend Dependencies

```bash
npm install
```

## 5. Setup Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

---

# Database Setup

Update your `.env` database configuration:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=intellidash
DB_USERNAME=root
DB_PASSWORD=
```

Run migrations:

```bash
php artisan migrate
```

(Optional) Seed database:

```bash
php artisan db:seed
```

---

# Running the Application

## Start Laravel Server

```bash
php artisan serve
```

## Start Vite Development Server

```bash
npm run dev
```

Application URLs:

```txt
Backend: http://127.0.0.1:8000
Frontend: http://127.0.0.1:8000
```

---

# Project Structure

```txt
app/
resources/
 ├── js/
 │    ├── components/
 │    ├── pages/
 │    ├── layouts/
 │    └── hooks/
routes/
database/
public/
```

---

# Fraud Detection Module

The Fraud Detection system helps identify suspicious activity across the ERP platform.

Features include:

* Fraud logs viewer
* Real-time fraud alerts
* Severity filtering
* Product-specific risk monitoring
* Alert redirection from dashboard widgets

---

# Inventory Monitoring

Inventory monitoring provides:

* Critical stock alerts
* Low inventory tracking
* Product analytics
* Inventory risk summaries
* Real-time stock insights

---

# API Endpoints

Example endpoints:

```txt
/api/products
/api/fraud-logs
/api/dashboard/stats
/api/inventory
```

---

# Deployment

## Production Build

```bash
npm run build
```

## Optimize Laravel

```bash
php artisan optimize
```

---

# Future Improvements

* AI forecasting
* Predictive analytics
* Notification system
* Multi-branch support
* Advanced reporting exports
* Mobile optimization
* Real-time websocket updates

---

# Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a pull request

---

# Author

Developed by Ricky Morales.

---

# GitHub Repository

```txt
https://github.com/rickz25/IntelliDash
```
