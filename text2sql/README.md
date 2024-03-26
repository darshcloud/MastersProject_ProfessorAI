# Flask SQL Generator API

This  provides a backend API that uses Flask to interface with a MySQL database and Google's generative AI to translate natural language questions into SQL queries. It's designed to work with a frontend application for executing database queries through simple English prompts.

## Prerequisites

Before you begin, make sure you have the following installed:
- Python 3.8 or higher
- MySQL Server
- An API key for Google's Generative AI services

## Setup Instructions

### 1. Clone the Repository

Start by cloning this repository to your local machine

### 2. Install Dependencies

``` pip install -r requirements.txt ```

### 3.Configure Environment Variables

#### Flask and JWT Configuration


``` JWT_SECRET_KEY= " " ( Authentication for admin from the frontend) ```

``` REACT_APP_ADMIN_EMAIL="" ```

#### MySQL Database Configuration

``` DB_USERNAME =
    DB_HOST=your_database_host
    DB_USERNAME=your_database_username
    DB_PASSWORD=your_database_password
```

#### Google API Configuration
``` GOOGLE_API_KEY="" ```

### 4. Start the Flask Application
``` flask run --port=7000 ```

The application will now be running and accessible at http://localhost:7000 The API will be accessible for admin user's at http://localhost:7000/adminquery
