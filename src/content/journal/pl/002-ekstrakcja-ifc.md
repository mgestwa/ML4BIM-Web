---
title: "Ekstrakcja danych z plików IFC"
description: "Jak wyciągnąć użyteczne cechy (features) z modelu BIM do dalszej analizy ML."
date: 2025-06-15
tags: ["dataset", "ifc", "python"]
draft: false
---

## Problem

Model IFC to złożona struktura obiektowa — hierarchia `IfcProject > IfcSite > IfcBuilding > IfcStorey > elementy`.
Aby użyć tych danych w ML, musimy je spłaszczyć do formy tabelarycznej.

## Pipeline ekstrakcji

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

## Wyniki

Z jednego modelu IFC (~500 elementów) uzyskaliśmy **12 cech numerycznych** i **6 kategorycznych**.
Dane zapisujemy jako `dataset.parquet` do dalszego przetwarzania.

| Cecha | Typ | Pokrycie |
|-------|-----|----------|
| height | float | 98% |
| area | float | 95% |
| material | str | 87% |
| thermal_resistance | float | 62% |

## Wnioski

- Property sety IFC są **niestandardowe** — każde biuro projektowe nazywa je inaczej.
- Potrzebujemy warstwy normalizacji przed podaniem danych do modelu ML.
- Brakujące wartości (`NaN`) to ponad 30% danych w kolumnach termicznych.
