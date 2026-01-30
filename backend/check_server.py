"""Quick script to check if the backend server is running."""
import requests
import sys

def check_server():
    try:
        response = requests.get("http://localhost:8000/api/health", timeout=2)
        if response.status_code == 200:
            data = response.json()
            print("✅ Backend server is running!")
            print(f"   Status: {data.get('status', 'unknown')}")
            print(f"   Version: {data.get('version', 'unknown')}")
            return True
        else:
            print(f"❌ Backend server responded with status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Backend server is NOT running")
        print("   Please start it with: python start.py")
        return False
    except Exception as e:
        print(f"❌ Error checking server: {e}")
        return False

if __name__ == "__main__":
    print("Checking backend server status...")
    print("-" * 50)
    if check_server():
        sys.exit(0)
    else:
        sys.exit(1)
