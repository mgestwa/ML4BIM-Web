---
title: "Extracting Data from IFC Files"
description: "How to pull useful features from a BIM model for further ML analysis."
date: 2025-06-15
tags: ["dataset", "ifc", "python"]
draft: false
---

## Problem

An IFC model is a complex object structure — a hierarchy of `IfcProject > IfcSite > IfcBuilding > IfcStorey > elements`.
To use this data in ML, we need to flatten it into a tabular form.

## Extraction pipeline

```python
import ifcopenshell
import pandas as pd

def extract_walls(ifc_path: str) -> pd.DataFrame:
    """Extract wall features from an IFC model."""
    model = ifcopenshell.open(ifc_path)
    walls = model.by_type("IfcWall")

    records = []
    for wall in walls:
        psets = ifcopenshell.util.element.get_psets(wall)
        records.append({
            "global_id": wall.GlobalId,
            "name": wall.Name,
            "type": wall.is_a(),
            "height": psets.get("Dimensions", {}).get("Height"),
            "area": psets.get("Dimensions", {}).get("Area"),
            "material": _get_material(wall),
        })

    return pd.DataFrame(records)
```

## Results

From a single IFC model (~500 elements) we obtained **12 numerical features** and **6 categorical ones**.
Data is saved as `dataset.parquet` for further processing.

| Feature | Type | Coverage |
|---------|------|----------|
| height | float | 98% |
| area | float | 95% |
| material | str | 87% |
| thermal_resistance | float | 62% |

## Conclusions

- IFC property sets are **non-standard** — every design office names them differently.
- We need a normalisation layer before feeding data to an ML model.
- Missing values (`NaN`) account for over 30% of data in thermal columns.
