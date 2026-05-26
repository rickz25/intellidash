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

<img width="1892" height="914" alt="image" src="https://github.com/user-attachments/assets/209729f1-e85c-4f04-b1c6-be3b21ce84d8" />
<img width="1898" height="903" alt="image" src="https://github.com/user-attachments/assets/1e4ebbba-5180-4d62-a6e9-b8d6a5fda302" />
<img width="1899" height="912" alt="image" src="https://github.com/user-attachments/assets/74513be3-8b01-4a55-9ab7-5508483704f6" />

---

# Installation

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/intellidash-ai-erp.git
```

## 2. Navigate to the Project

```bash
cd intellidash-ai-erp
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
