"""
FarmPriceNepal – Nepali Festival Calendar & Events
Provides festival dates for feature engineering.
"""

from datetime import date

FESTIVALS = {
    2024: [
        {"name": "Holi", "start": date(2024, 3, 25), "end": date(2024, 3, 26), "bump": 0.08},
        {"name": "Teej", "start": date(2024, 9, 6), "end": date(2024, 9, 7), "bump": 0.10},
        {"name": "Dashain", "start": date(2024, 10, 3), "end": date(2024, 10, 15), "bump": 0.25},
        {"name": "Tihar", "start": date(2024, 11, 1), "end": date(2024, 11, 5), "bump": 0.20},
        {"name": "Chhath", "start": date(2024, 11, 7), "end": date(2024, 11, 8), "bump": 0.07},
    ],
    2025: [
        {"name": "Holi", "start": date(2025, 3, 14), "end": date(2025, 3, 15), "bump": 0.08},
        {"name": "Teej", "start": date(2025, 8, 26), "end": date(2025, 8, 27), "bump": 0.10},
        {"name": "Dashain", "start": date(2025, 9, 22), "end": date(2025, 10, 4), "bump": 0.25},
        {"name": "Tihar", "start": date(2025, 10, 20), "end": date(2025, 10, 24), "bump": 0.20},
        {"name": "Chhath", "start": date(2025, 10, 26), "end": date(2025, 10, 27), "bump": 0.07},
    ],
    2026: [
        {"name": "Holi", "start": date(2026, 3, 3), "end": date(2026, 3, 4), "bump": 0.08},
        {"name": "Teej", "start": date(2026, 8, 16), "end": date(2026, 8, 17), "bump": 0.10},
        {"name": "Dashain", "start": date(2026, 10, 12), "end": date(2026, 10, 24), "bump": 0.25},
        {"name": "Tihar", "start": date(2026, 11, 9), "end": date(2026, 11, 13), "bump": 0.20},
        {"name": "Chhath", "start": date(2026, 11, 15), "end": date(2026, 11, 16), "bump": 0.07},
    ],
}


def is_festival(d: date) -> bool:
    fests = FESTIVALS.get(d.year, [])
    return any(f["start"] <= d <= f["end"] for f in fests)


def get_festival_name(d: date) -> str:
    fests = FESTIVALS.get(d.year, [])
    for f in fests:
        if f["start"] <= d <= f["end"]:
            return f["name"]
    return ""


def is_monsoon(d: date) -> bool:
    return d.month in [6, 7, 8, 9]


def get_all_events():
    """Return all festival events as a flat list."""
    from datetime import timedelta
    events = []
    for year, fests in FESTIVALS.items():
        for f in fests:
            cur = f["start"]
            while cur <= f["end"]:
                events.append({
                    "date": cur.isoformat(),
                    "event_name": f["name"],
                    "price_impact_pct": f["bump"] * 100,
                })
                cur += timedelta(days=1)
    return events
