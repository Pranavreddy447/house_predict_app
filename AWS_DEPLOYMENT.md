# Deploying to AWS EC2

This guide outlines the steps to deploy the application to an AWS EC2 instance using Docker and Docker Compose.

## Prerequisites

1.  **AWS Account**: You need an active AWS account.
2.  **Key Pair**: Create an EC2 Key Pair (`.pem` file) to SSH into your instance.

## Step 1: Launch an EC2 Instance

1.  Log in to the AWS Management Console.
2.  Navigate to **EC2** and click **Launch Instance**.
3.  **Name**: Give your instance a name (e.g., "AI-ML-App").
4.  **AMI**: Select **Ubuntu Server 22.04 LTS** (or latest LTS).
5.  **Instance Type**: `t2.micro` (Free Tier eligible) is sufficient for testing, but `t2.small` or larger is recommended for production.
6.  **Key Pair**: Select your created key pair.
7.  **Network Settings**:
    - Allow SSH traffic from anywhere (0.0.0.0/0) or your IP.
    - Allow HTTP traffic from the internet.
    - Allow HTTPS traffic from the internet.
8.  **Storage**: Default (8GB) is usually fine, but 20GB is safer.
9.  Click **Launch Instance**.

## Step 2: Configure Security Group

1.  Go to your instance details and click on the **Security** tab.
2.  Click the **Security Group** ID.
3.  Edit **Inbound rules** and add the following:
    - **SSH** (Port 22): Source `My IP` (recommended) or `Anywhere`.
    - **HTTP** (Port 80): Source `Anywhere`.
    - **Custom TCP** (Port 3000): Source `Anywhere` (for React frontend).
    - **Custom TCP** (Port 8000): Source `Anywhere` (for Django backend).
    *Note: In a production environment, you would typically use a reverse proxy (like Nginx) to serve everything on port 80/443.*

## Step 3: Connect to the Instance

Open your terminal and run:

```bash
chmod 400 your-key-pair.pem
ssh -i "your-key-pair.pem" ubuntu@<your-ec2-public-ip>
```

## Step 4: Install Docker & Docker Compose

Run the following commands on your EC2 instance:

```bash
# Update package list
sudo apt-get update

# Install Docker
sudo apt-get install -y docker.io

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add current user to docker group (to run without sudo)
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt-get install -y docker-compose

# Apply group changes (or log out and log back in)
newgrp docker
```

## Step 5: Deploy the Application

1.  **Clone the Repository**:
    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```
    *(You may need to set up an SSH key for GitHub or use HTTPS with a Personal Access Token)*

2.  **Configure Environment Variables**:
    Create a `.env` file in the root directory:
    ```bash
    nano .env
    ```
    Paste your environment variables (ensure `DEBUG=False` for production).

3.  **Start the Application**:
    ```bash
    docker-compose up -d --build
    ```

4.  **Verify Deployment**:
    - Check running containers: `docker ps`
    - View logs: `docker-compose logs -f`

## Step 6: Access the Application

Open your browser and navigate to:
- Frontend: `http://<your-ec2-public-ip>:3000`
- Backend API: `http://<your-ec2-public-ip>:8000`

## Troubleshooting

- **Permission Denied**: Ensure you ran `newgrp docker` or logged out/in after adding the user to the docker group.
- **Connection Refused**: Check your Security Group rules in AWS to ensure ports 3000 and 8000 are open.
- **Container Exits**: Check logs with `docker-compose logs <service_name>` to see why a container failed to start.
