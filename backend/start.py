"""Simple startup script for the backend server."""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    import uvicorn
    from app.config import settings

    print("=" * 50)
    print("Starting PedaGrow AI Backend Server")
    print("=" * 50)
    print(f"Host: {settings.api_host}")
    print(f"Port: {settings.api_port}")
    print(f"API URL: http://{settings.api_host}:{settings.api_port}")
    print(f"Docs: http://{settings.api_host}:{settings.api_port}/docs")
    print("=" * 50)

    if not settings.github_token:
        print("\n❌ ERROR: GITHUB_TOKEN is missing!")
        print("Please set GITHUB_TOKEN in your .env file\n")
        sys.exit(1)

    try:
        uvicorn.run(
            "app.main:app",
            host=settings.api_host,
            port=settings.api_port,
            reload=True,
            log_level="info",
        )
    except KeyboardInterrupt:
        print("\n\nServer stopped by user")
    except Exception as e:
        print(f"\n\n❌ Error starting server: {e}")
        sys.exit(1)