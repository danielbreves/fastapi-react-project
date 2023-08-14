import uvicorn
import sys
import debugpy

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--debug":
        # Enable debugging and wait for the debugger to attach
        debugpy.listen(("0.0.0.0", 5678))
        print("Waiting for debugger to attach...")
        debugpy.wait_for_client()
        print("Debugger attached.")

    # Run the Uvicorn server without debugging
    uvicorn.run("fastapi_app:app", host="0.0.0.0", reload=True, port=8888)
