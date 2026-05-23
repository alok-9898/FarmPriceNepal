# FarmPriceNepal – AI Fresh Market Price Forecaster

**FarmPriceNepal** is an AI-powered forecasting platform designed for Nepal's fresh produce markets. It empowers smallholder farmers, traders, and agri-fintech partners by providing price transparency and predicting short-term supply shocks.

---

## 🚀 Hackathon Demo Quick Start

### 1. Backend Setup
1. Open a terminal in `backend/`.
2. Activate the virtual environment:
   ```powershell
   .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Generate synthetic market data (2 years of historical prices):
   ```bash
   python etl/generate_synthetic.py
   ```
5. Seed MongoDB:
   *Ensure MongoDB is running (locally or via Docker).*
   ```bash
   # Run the server which initializes indexes, or use a script to seed
   uvicorn app.main:app --reload
   ```

### 2. ML Model Training
1. Open `backend/app/ml/train_model.ipynb` in VS Code or Jupyter.
2. Run all cells to train the **XGBoost Regressor** on the generated data.
3. This will save `primary_price_model.pkl` to `backend/app/ml/models/`.

### 3. Frontend Setup
1. Open a terminal in `frontend/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173).

---

## 🛠 Tech Stack
- **Backend**: FastAPI (Async), Motor (MongoDB driver), Pydantic v2.
- **ML Pipeline**: XGBoost, Scikit-learn, Pandas, Recharts (frontend visualization).
- **Database**: MongoDB.
- **Frontend**: React 18, Vite, Recharts, CSS Modules.
- **DevOps**: Docker & Docker Compose.

---

## ✨ Key Features
1. **AI Price Forecasting**: 7-30 day horizons with confidence intervals.
2. **Supply Shock Alerts**: Automated detection of price spikes/drops (monsoon, festivals).
3. **Fintech Integration**: Loan recommendations and insurance trigger signals.
4. **Market Arbitrage**: District-wise price comparison.
5. **Interactive Analytics**: Heatmaps and volatility indices.

---

## 📊 Data Insights (Nepal Context)
- **Monsoon Logic**: Veggie prices increase by 15-25% during Jun-Sep due to supply chain disruptions.
- **Festival Spikes**: Dashain and Tihar see 20% price bumps for staples and fruits.
- **Regional Multipliers**: Prices are indexed against Kalimati with district-wise adjustments.

---

## 🧪 Testing
Run backend tests using:
```bash
pytest backend/tests/
```
