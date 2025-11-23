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
    - **HTTPS** (Port 443): Source `Anywhere`.
    - **Custom TCP** (Port 3000): Source `Anywhere` (for React frontend) - *Optional, only if running dev server. For production Docker, Port 80 is used.*
    - **Custom TCP** (Port 8000): Source `Anywhere` (for Django backend).
    *Note: In a production environment, you would typically use a reverse proxy (like Nginx) to serve everything on port 80/443.*

## Step 3: Connect to the Instance

Open your terminal and run:

```bash
chmod 400 your-key-pair.pem
ssh -i "your-key-pair.pem" ubuntu@<your-ec2-public-ip>
```

> **Tip:** To find your **Public IPv4 address**:
> 1. Go to the **AWS Console** > **EC2** > **Instances**.
> 2. Select your instance.
> 3. Look for **Public IPv4 address** in the details pane at the bottom.

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
# $USER is a variable that automatically picks your current username (e.g., 'ubuntu')
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
    Paste your environment variables. Ensure you set the following for production:
    ```bash
    DEBUG=False
    ALLOWED_HOSTS=backend,localhost,127.0.0.1,<your-ec2-public-ip>
    CORS_ALLOWED_ORIGINS=http://localhost,http://127.0.0.1,http://<your-ec2-public-ip>
    ```

3.  **Start the Application**:
    ```bash
    docker-compose up -d --build
    ```

4.  **Verify Deployment**:
    - Check running containers: `docker ps`
    - View logs: `docker-compose logs -f`

## Step 6: Access the Application

Open your browser and navigate to:
- Frontend: `http://<your-ec2-public-ip>` (Port 80) or `https://<your-domain>`
- Backend API: `http://<your-ec2-public-ip>:8000` (Only accessible from localhost if configured strictly)

## Step 7: Configure HTTPS (SSL/TLS)

To serve your application securely over HTTPS, you need a domain name and an SSL certificate. We will use **Nginx** on the host EC2 instance as a reverse proxy and **Certbot** to generate a free Let's Encrypt certificate.

### 1. Prerequisites
- A valid domain name (e.g., `example.com`) pointing to your EC2 instance's Public IP.

### 2. Install Nginx and Certbot on EC2
Run these commands on your EC2 instance:
```bash
sudo apt-get update
sudo apt-get install -y nginx certbot python3-certbot-nginx
```

### 3. Configure Nginx Reverse Proxy
Create a new Nginx configuration file for your site:
```bash
sudo nano /etc/nginx/sites-available/house-predict
```

Paste the following configuration (replace `yourdomain.com` with your actual domain):
```nginx
server {
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8080; # Points to the Docker Frontend container
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the configuration and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/house-predict /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Obtain SSL Certificate
Run Certbot to automatically configure SSL:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
Follow the prompts. Certbot will automatically update your Nginx config to redirect HTTP to HTTPS.

### 5. Update Environment Variables
Update your `.env` file to allow the new domain:
```bash
CORS_ALLOWED_ORIGINS=http://localhost,https://yourdomain.com,https://www.yourdomain.com
ALLOWED_HOSTS=backend,localhost,127.0.0.1,yourdomain.com,www.yourdomain.com
```
Restart your Docker containers to apply changes:
```bash
docker-compose down
docker-compose up -d
```

## Troubleshooting

- **Permission Denied**: Ensure you ran `newgrp docker` or logged out/in after adding the user to the docker group.
- **Connection Refused**: Check your Security Group rules in AWS to ensure ports 80 and 8000 are open.
- **Container Exits**: Check logs with `docker-compose logs <service_name>` to see why a container failed to start.
- **"Externally Managed Environment" Error**: If you try to run `pip install` on the host, you will see this error. **You do not need to install app dependencies on the EC2 host**; Docker handles this inside the containers. If you absolutely must run a Python script on the host, create a virtual environment first:
    ```bash
    sudo apt install python3-venv
    python3 -m venv venv
    source venv/bin/activate
    pip install <package_name>
    ```
- **"mysqlclient" Installation Fails**: This package requires system-level C libraries. If you are installing it on the host (outside Docker), run this first:
    ```bash
    sudo apt-get install -y pkg-config python3-dev default-libmysqlclient-dev build-essential
    ```
