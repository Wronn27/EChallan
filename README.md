# E-Challan Management System

## Overview

The **E-Challan Management System** is a web-based application developed to digitize traffic violation handling and streamline challan generation, tracking, and payment processes. The system enables administrators to issue challans electronically and allows users to view and manage their violation records online.

This project is built using **Spring Boot** for the backend, **React** for the frontend, and **MySQL** as the database.

---

## Features

### User Module

* User registration and login using secure authentication
* View issued challans
* Track challan payment status
* View violation history

### Admin Module

* Secure admin login
* Generate new challans
* Update challan status
* Manage user and vehicle records
* View all challans

### Security

* JWT-based authentication
* Role-based authorization (Admin/User)
* Password encryption using BCrypt

---

## Tech Stack

### Frontend

* React.js
* HTML5
* CSS3
* JavaScript

### Backend

* Spring Boot
* Spring Security
* REST APIs
* JWT Authentication

### Database

* MySQL

---

## Project Structure

```
echallan-system
│
├── backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── model
│   ├── config
│   └── security
│
├── frontend
│   ├── components
│   ├── pages
│   ├── services
│   └── App.js
│
└── database
    └── schema.sql
```

---

## Installation and Setup

### Prerequisites

Make sure the following are installed:

* Java (JDK 8 or above)
* Node.js
* MySQL
* Maven

---

### Backend Setup (Spring Boot)

1. Clone the repository:

```
git clone <repository-url>
```

2. Navigate to backend folder:

```
cd backend
```

3. Configure MySQL database in `application.properties`:

```
spring.datasource.url=jdbc:mysql://localhost:3306/echallan
spring.datasource.username=your_username
spring.datasource.password=your_password
```

4. Run the Spring Boot application:

```
mvn spring-boot:run
```

Backend will start at:

```
http://localhost:8080
```

---

### Frontend Setup (React)

1. Navigate to frontend folder:

```
cd frontend
```

2. Install dependencies:

```
npm install
```

3. Start React app:

```
npm start
```

Frontend will start at:

```
http://localhost:3000
```

---

## API Endpoints (Sample)

### Authentication

* POST `/auth/register` → Register new user
* POST `/auth/login` → Login user

### Challan

* GET `/challan/all` → View all challans
* POST `/challan/create` → Create challan
* PUT `/challan/update/{id}` → Update challan status
* GET `/challan/user/{userId}` → View user challans

---

## Database Schema (Main Tables)

* Users
* Vehicles
* Challans
* Roles

---

## Future Enhancements

* Online payment gateway integration
* PDF challan generation
* SMS/email notification system
* Admin analytics dashboard
* Mobile application support

---

## Author

**Markandey Upadhyay
