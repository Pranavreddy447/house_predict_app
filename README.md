# House Predict App

## Overview

The **House Predict App** is a full-stack web application designed to predict house prices based on various features like location, square footage, number of bedrooms (BHK), and bathrooms. It leverages a Machine Learning model trained on housing data to provide accurate price estimates.

The application features a modern, responsive frontend built with **React** and a robust backend API using **Django**. It includes secure user authentication via **Google OAuth** and is containerized using **Docker** for easy deployment.

## Features

-   **House Price Prediction**: Users can input property details to get an estimated price.
-   **User Authentication**: Secure Signup and Login using Google OAuth.
-   **Interactive UI**: Clean and responsive interface built with Tailwind CSS.
-   **RESTful API**: Backend API for handling predictions and user management.
-   **Containerized**: Fully Dockerized for consistent development and production environments.

## Tech Stack

### Frontend
-   **React**: UI library.
-   **Vite**: Build tool for fast development.
-   **Tailwind CSS**: Utility-first CSS framework for styling.
-   **Axios**: For making HTTP requests.
-   **React Router**: For client-side routing.

### Backend
-   **Django**: High-level Python web framework.
-   **Django REST Framework (DRF)**: For building Web APIs.
-   **Scikit-learn**: For the Machine Learning model (Linear Regression).
-   **Pandas & NumPy**: For data manipulation.
-   **MySQL**: Relational database (Production).
-   **SQLite**: Relational database (Development/Testing).

### DevOps
-   **Docker & Docker Compose**: Containerization and orchestration.
-   **Nginx**: Web server and reverse proxy (Production).
-   **AWS EC2**: Deployment infrastructure.

## Prerequisites

Ensure you have the following installed on your system:

-   [Docker](https://docs.docker.com/get-docker/)
-   [Docker Compose](https://docs.docker.com/compose/install/)
-   [Node.js](https://nodejs.org/) (for local frontend development)
-   [Python 3.10+](https://www.python.org/) (for local backend development)

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd house_predict_app
```

### 2. Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_NAME=house_prices
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=db
DB_PORT=3306

# Django Settings
DEBUG=True
ALLOWED_HOSTS=backend,localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. Run with Docker (Recommended)

The easiest way to run the application is using Docker Compose.

```bash
# Build and start the containers
docker-compose up --build
```

-   **Frontend**: Accessible at `http://localhost:80` (or configured port).
-   **Backend**: Accessible at `http://localhost:8000`.

To stop the containers:

```bash
docker-compose down
```

### 4. Local Development

If you prefer to run services locally without Docker:

**Backend:**

```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Frontend:**

```bash
cd client
npm install
npm run dev
```

## Running Tests

### Backend (Django)

Run tests inside the Docker container:

```bash
docker-compose exec backend python manage.py test
```

Or locally:

```bash
cd server
pytest
```

### Frontend (React)

Run tests inside the Docker container:

```bash
docker-compose exec frontend npm test -- --run
```

Or locally:

```bash
cd client
npm test
```

## Deployment

For detailed instructions on deploying this application to AWS EC2, please refer to the [AWS Deployment Guide](AWS_DEPLOYMENT.md).

## Project Structure

```
house_predict_app/
├── client/                 # React Frontend
│   ├── src/                # Source code
│   ├── public/             # Static assets
│   ├── Dockerfile          # Frontend Dockerfile
│   └── package.json        # Node dependencies
├── server/                 # Django Backend
│   ├── server/             # Project settings
│   ├── prediction/         # Prediction app logic
│   ├── accounts/           # User authentication
│   ├── Dockerfile          # Backend Dockerfile
│   └── requirements.txt    # Python dependencies
├── docker-compose.yml      # Docker Compose configuration
├── AWS_DEPLOYMENT.md       # Deployment guide
├── DOCKER_README.md        # Docker commands guide
└── README.md               # Project documentation
```
