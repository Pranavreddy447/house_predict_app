# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIP_ROOT_USER_ACTION=ignore

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    default-libmysqlclient-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy project
COPY . /app/

# Collect static files
# We'll run this during the build or entrypoint, but for now let's just copy the code.
# The actual collectstatic command usually needs the DB or settings to be ready, 
# but with Whitenoise and no DB-dependent static files, it might work. 
# However, it's safer to run it at runtime or ensure settings are compatible.
# For this setup, we will rely on the entrypoint or manual command, 
# but let's add a dummy environment variable to allow collectstatic to run without a real DB if needed.
# ENV DATABASE_URL=sqlite:///db.sqlite3 

# Expose port
EXPOSE 8000

# Run gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "server.wsgi:application"]
