# Use the official Python base image
FROM python:3.12.3

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file to the container
COPY requirements.txt .

# Install the app dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app source code to the container
COPY . .
# Start the app
CMD ["python", "API.py"]

