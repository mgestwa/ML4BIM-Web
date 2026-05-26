---
title: "ML4BIM Project Kickoff"
description: "First journal entry — why we're combining BIM with Machine Learning and what we aim to achieve."
date: 2025-06-01
tags: ["meta", "roadmap"]
draft: false
---

## Motivation

The construction industry generates massive amounts of data — IFC models, schedules, material specifications.
Most of it sits unused. **ML4BIM** is an educational project whose goal is to extract
value from this data using machine learning algorithms.

## What are we planning?

1. **IFC data extraction** — automatically pulling features from building models.
2. **Element classification** — can ML recognise element types better than manual classifications?
3. **Practical applications** — prediction of parameters based on geometry and materials.

## Tech stack

```python
import ifcopenshell
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

model = ifcopenshell.open("building.ifc")
elements = model.by_type("IfcWall")
```

We use Python as the main language, with libraries:
- `ifcopenshell` — IFC parsing
- `pandas` / `numpy` — data wrangling
- `scikit-learn` — ML models
- `Astro` — this journal you're reading right now

## Next steps

In the next post we'll tackle **data extraction from IFC files** — from a raw model to a tabular dataset.
