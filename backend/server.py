'''
    Backend Setup
    - Install all necessary packages: `pip install -r requirements.txt`
    - Run the backend server: `uvicorn server:app --reload`
    - The server should run on http://127.0.0.1:8000/
'''


from fastapi import FastAPI, Query
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import gcs

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

@app.get("/")
def health_check():
    return {"status": "healthy"}

# This is the endpoint to generate the STL file
# Example URL:
# http://127.0.0.1:8000/generate-stl/?c4BaseFace=0.85&c4TopFace=0.6&c8BaseFace=0&c8TopFace=0&linearTwist=3.1415&oscillatingTwistAmplitude=0&oscillatingTwistCycles=0&topToBasePerimeterRatio=2&height=20&mass=3&wallThickness=0.7
@app.get("/generate-stl/")
def generate_stl(
    c4BaseFace: float = Query(...),
    c4TopFace: float = Query(...),
    c8BaseFace: float = Query(...),
    c8TopFace: float = Query(...),
    linearTwist: float = Query(...),
    oscillatingTwistAmplitude: float = Query(...),
    oscillatingTwistCycles: int = Query(...),
    topToBasePerimeterRatio: float = Query(...),
    height: float = Query(...),
    mass: float = Query(...),
    wallThickness: float = Query(...),
):
    try:
        # Create the shape
        shape = gcs.GCS(
            c4_base=c4BaseFace, c8_base=c8BaseFace,
            c4_top=c4TopFace, c8_top=c8TopFace,
            twist_linear=linearTwist,
            twist_amplitude=oscillatingTwistAmplitude,
            twist_cycles=oscillatingTwistCycles,
            perimeter_ratio=topToBasePerimeterRatio,
            height=height,
            mass=mass,
            thickness=wallThickness
        )

        # Check if the shape is valid
        if not shape.valid:
            return JSONResponse(content={"error": "Invalid shape parameters"}, status_code=400)

        # Save the STL file
        file_path = "shape.stl"
        gcs.io.save_mesh(file=file_path, shape=shape)

        return FileResponse(file_path, media_type="application/octet-stream", filename="shape.stl")

    except Exception as e:
        return JSONResponse(content={"error": f"An error occurred: {str(e)}"}, status_code=500)