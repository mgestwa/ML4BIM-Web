---
title: "Start Projektu ML4BIM"
description: "Pierwszy wpis w dzienniku — dlaczego łączymy BIM z Machine Learning i co planujemy osiągnąć."
date: 2025-06-01
tags: ["meta", "roadmap"]
draft: false
---

## Motywacja

Budownictwo generuje ogromne ilości danych — modele IFC, harmonogramy, specyfikacje materiałowe.
Większość z nich leży niewykorzystana. **ML4BIM** to projekt R&D, którego celem jest wyciągnięcie
wartości z tych danych za pomocą algorytmów uczenia maszynowego.

## Co planujemy?

1. **Ekstrakcja danych z IFC** — automatyczne wyciąganie cech (features) z modeli budynkowych.
2. **Klasyfikacja elementów** — czy ML potrafi rozpoznać typ elementu lepiej niż ręczne klasyfikacje?
3. **Optymalizacja energetyczna** — predykcja zużycia energii na podstawie geometrii i materiałów.

## Stack technologiczny

```python
import ifcopenshell
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

model = ifcopenshell.open("building.ifc")
elements = model.by_type("IfcWall")
```

Używamy Pythona jako głównego języka, z bibliotekami:
- `ifcopenshell` — parsowanie IFC
- `pandas` / `numpy` — obróbka danych
- `scikit-learn` — modele ML
- `Astro` — ten dziennik, który właśnie czytasz

## Następne kroki

W kolejnym wpisie zajmiemy się **ekstrakcją danych z plików IFC** — od surowego modelu do tabelarycznego datasetu.
