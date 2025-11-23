# Docker & Docker Compose Guide

This guide provides an overview of essential Docker and Docker Compose commands to help you manage your containerized application.

## Prerequisites

Ensure you have Docker and Docker Compose installed on your system.
- [Get Docker](https://docs.docker.com/get-docker/)
- [Get Docker Compose](https://docs.docker.com/compose/install/)

---

## Docker Commands

These commands are used to manage individual containers and images.

### Images

- **List all images:**
  ```bash
  docker images
  ```

- **Remove an image:**
  ```bash
  docker rmi <image_id_or_name>
  ```

- **Build an image from a Dockerfile:**
  ```bash
  docker build -t <tag_name> .
  ```
  *Example:* `docker build -t my-app-server ./server`

### Containers

- **List running containers:**
  ```bash
  docker ps
  ```

- **List all containers (including stopped ones):**
  ```bash
  docker ps -a
  ```

- **Run a container:**
  ```bash
  docker run -p <host_port>:<container_port> <image_name>
  ```
  *Example:* `docker run -p 8000:8000 my-app-server`

- **Stop a running container:**
  ```bash
  docker stop <container_id_or_name>
  ```

- **Remove a container:**
  ```bash
  docker rm <container_id_or_name>
  ```

- **View container logs:**
  ```bash
  docker logs <container_id_or_name>
  ```
  *Add `-f` to follow the logs in real-time.*

- **Execute a command inside a running container:**
  ```bash
  docker exec -it <container_id_or_name> bash
  ```
  *(Use `sh` if `bash` is not available)*

---

## Docker Compose Commands

Docker Compose is used to define and run multi-container Docker applications. It uses a YAML file to configure your application's services.

### Managing Services

- **Start all services:**
  ```bash
  docker-compose up
  ```
  *Add `-d` to run in detached mode (background).*

- **Stop and remove containers, networks, and volumes:**
  ```bash
  docker-compose down
  ```

- **Build or rebuild services:**
  ```bash
  docker-compose build
  ```

- **Start services and rebuild images if needed:**
  ```bash
  docker-compose up --build
  ```

### Logs & Status

- **View logs for all services:**
  ```bash
  docker-compose logs
  ```
  *Add `-f` to follow logs.*

- **View logs for a specific service:**
  ```bash
  docker-compose logs <service_name>
  ```
  *Example:* `docker-compose logs server`

- **List containers for the current project:**
  ```bash
  docker-compose ps
  ```

### Maintenance

- **Stop services (without removing containers):**
  ```bash
  docker-compose stop
  ```

- **Restart services:**
  ```bash
  docker-compose restart
  ```

---

## Project Specifics

Assuming your `docker-compose.yml` defines services like `server` (Django) and `client` (React):

1.  **Start the entire stack:**
    ```bash
    docker-compose up --build
    ```

2.  **Access the application:**
    - Frontend: `http://localhost:3000` (or configured port)
    - Backend API: `http://localhost:8000` (or configured port)

3.  **Run migrations (if using Django):**
    ```bash
    docker-compose exec server python manage.py migrate
    ```

4.  **Create a superuser (if using Django):**
    ```bash
    docker-compose exec server python manage.py createsuperuser
    ```
