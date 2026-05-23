"""
FarmPriceNepal – Prices Router
"""

from fastapi import APIRouter, Depends, UploadFile, File
from typing import List, Optional
from app.models import PriceResponse, PriceBulkUpload
from app.database import get_db
from etl.ingest_prices import ingest_prices_from_csv
import os
import shutil

router = APIRouter()

@router.get("/", response_model=List[PriceResponse])
async def get_prices(
    market_id: Optional[str] = None,
    commodity_id: Optional[str] = None,
    start: Optional[str] = None,
    end: Optional[str] = None,
    db=Depends(get_db)
):
    query = {}
    if market_id: query["market_id"] = market_id
    if commodity_id: query["commodity_id"] = commodity_id
    if start or end:
        query["date"] = {}
        if start: query["date"]["$gte"] = start
        if end: query["date"]["$lte"] = end
    
    prices = await db.prices.find(query).sort("date", -1).limit(500).to_list(500)
    return prices

@router.post("/upload", response_model=PriceBulkUpload)
async def upload_prices(file: UploadFile = File(...), db=Depends(get_db)):
    # Save temporary file
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        result = await ingest_prices_from_csv(temp_path, db)
        return result
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
