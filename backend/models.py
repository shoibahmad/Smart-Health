from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# --- Existing Models ---
class SymptomInput(BaseModel):
    symptoms: str

class AnalysisResult(BaseModel):
    department: str
    estimated_duration_minutes: int
    triage_priority: str
    recommended_doctor: str

class Slot(BaseModel):
    id: str
    time: str
    doctor_name: str
    department: str
    is_available: bool

class BookingRequest(BaseModel):
    slot_id: str
    patient_name: str
    symptoms_summary: str
    department: str
    time: str

# --- Auth Models ---
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserData(BaseModel):
    id: int
    email: str
    full_name: str
    xp: int
    level: int

class VitalsBase(BaseModel):
    weight: float
    bp_systolic: int
    bp_diastolic: int
    glucose: int

class VitalsCreate(VitalsBase):
    patient_id: int

class Vitals(VitalsBase):
    id: int
    patient_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class Medication(BaseModel):
    name: str
    dosage: str
    frequency: str
    duration: str

class PrescriptionCreate(BaseModel):
    appointment_id: str
    patient_id: str
    patient_name: str
    patient_email: str
    doctor_name: str
    diagnosis: str
    notes: Optional[str] = None
    template_used: Optional[str] = None
    medications: List[Medication]

class Prescription(PrescriptionCreate):
    id: str
    issued_at: datetime

    class Config:
        from_attributes = True
