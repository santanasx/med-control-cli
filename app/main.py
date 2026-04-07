from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from .models import Medication, MedicationCreate
from .storage import load_meds, save_meds

app = FastAPI(title="MedControl API", description="Backend para controle de medicamentos")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/medications", response_model=List[Medication])
def list_all():
    return load_meds()

@app.post("/medications", response_model=Medication, status_code=status.HTTP_201_CREATED)
def add(med: MedicationCreate):
    meds = load_meds()
    new_med = Medication(**med.model_dump())
    meds.append(new_med.model_dump())
    save_meds(meds)
    return new_med

@app.delete("/medications/{med_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove(med_id: str):
    meds = load_meds()
    filtered_meds = [m for m in meds if m.get("id") != med_id]
    
    if len(meds) == len(filtered_meds):
        raise HTTPException(status_code=404, detail="Medicamento não encontrado")
        
    save_meds(filtered_meds)
    return None
