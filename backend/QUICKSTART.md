# Quick Start Guide

## Prerequisites
- Python 3.8 or higher
- OpenAI API key (or Anthropic API key)

## Step 1: Navigate to Backend Directory
```bash
cd backend
```

## Step 2: Start the Server

### Windows:
Double-click `start.bat` or run:
```bash
start.bat
```

### Linux/Mac:
```bash
chmod +x start.sh
./start.sh
```

### Manual (All Platforms):
```bash
# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Create .env file (first time only)
cp .env.example .env
# Then edit .env and add your OPENAI_API_KEY

# Start server
python start.py
```

## Step 3: Verify Server is Running

Open your browser and visit:
- API Root: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/api/health

You should see a JSON response indicating the server is running.

## Step 4: Start the Frontend

In a new terminal:
```bash
cd Pedagrow
npm run dev
```

The frontend will be available at http://localhost:8080

## Troubleshooting

### "Failed to fetch" Error
- Make sure the backend server is running on port 8000
- Check that you see "Application startup complete" in the backend terminal
- Verify the backend is accessible at http://localhost:8000/api/health

### "OPENAI_API_KEY is required" Error
- Create a `.env` file in the `backend/` directory
- Add your API key: `OPENAI_API_KEY=your_key_here`
- Restart the server

### Port Already in Use
- Change the port in `.env`: `API_PORT=8001`
- Or stop the process using port 8000

### Import Errors
- Make sure you're in the `backend/` directory
- Activate the virtual environment
- Reinstall dependencies: `pip install -r requirements.txt`
