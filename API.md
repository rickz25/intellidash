# IntelliDash REST API Quick Guide

Base URL:

```txt
http://localhost/IntelliDash/public/api
```

If you serve Laravel with `php artisan serve`, use:

```txt
http://127.0.0.1:8000/api
```

## Auth Flow

### Login

```http
POST /login
Content-Type: application/json
```

```json
{
  "email": "test@example.com",
  "password": "password",
  "device_name": "postman"
}
```

Copy the returned `token`, then add this header to protected requests:

```txt
Authorization: Bearer YOUR_TOKEN
Accept: application/json
Content-Type: application/json
```

### Current User

```http
GET /me
```

### Logout

```http
POST /logout
```

### Logout All Devices

```http
POST /logout-all
```

## Core REST Resources

All of these support standard REST actions unless noted:

```txt
GET    /branches
POST   /branches
GET    /branches/{id}
PUT    /branches/{id}
DELETE /branches/{id}

GET    /categories
POST   /categories
GET    /categories/{id}
PUT    /categories/{id}
DELETE /categories/{id}

GET    /products
POST   /products
GET    /products/{id}
PUT    /products/{id}
DELETE /products/{id}

GET    /sales
POST   /sales
GET    /sales/{id}
PUT    /sales/{id}
DELETE /sales/{id}

GET    /sale-items
POST   /sale-items
GET    /sale-items/{id}
PUT    /sale-items/{id}
DELETE /sale-items/{id}

GET    /roles
POST   /roles
GET    /roles/{id}
PUT    /roles/{id}
DELETE /roles/{id}

GET    /uploaded-reports
POST   /uploaded-reports
GET    /uploaded-reports/{id}
PUT    /uploaded-reports/{id}
DELETE /uploaded-reports/{id}

GET    /ai-logs
POST   /ai-logs
GET    /ai-logs/{id}
PUT    /ai-logs/{id}
DELETE /ai-logs/{id}

GET    /notifications
POST   /notifications
GET    /notifications/{id}
PUT    /notifications/{id}
DELETE /notifications/{id}

GET    /fraud-logs
POST   /fraud-logs
GET    /fraud-logs/{id}
PUT    /fraud-logs/{id}
DELETE /fraud-logs/{id}
```

## Useful Query Parameters

```txt
?search=value
?per_page=15
?page=2
```

Product helpers:

```txt
GET /products?lookup=1
GET /products?risk=high_risk
GET /products?product_name=Product%201
```

Sales lookup:

```txt
GET /sales?lookup=1
```

Notifications:

```txt
GET /notifications?is_read=0
```

## Dashboard / AI Endpoints

```txt
GET  /dashboard
GET  /dashboard/v2
GET  /dashboard/v3
GET  /dashboard/kpis
GET  /dashboard/ai
POST /dashboard/ai/actions/forecast
POST /dashboard/ai/actions/fraud
POST /dashboard/ai/actions/inventory
GET  /insights/sales-drop
GET  /insights/sales-forecast
```

## Example Payloads

### Create Category

```json
{
  "name": "Beverages",
  "description": "Drinks and bottled products",
  "status": true
}
```

### Create Branch

```json
{
  "branch_code": "BR-001",
  "name": "Main Branch",
  "address": "Main Street",
  "city": "Manila",
  "contact_number": "09170000000",
  "email": "main@example.com",
  "manager_name": "Branch Manager",
  "status": true
}
```

### Create Fraud Log

```json
{
  "risk_score": 75,
  "risk_level": "HIGH",
  "high_discount_alerts": 3,
  "sales_spikes_count": 2,
  "suspicious_cashiers_count": 1,
  "meta": {
    "source": "postman"
  }
}
```
