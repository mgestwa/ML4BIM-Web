---
title: "Regresja w BIM 5D: jak dopasować funkcję do danych i przewidywać koszty budowy"
description: "Przystępne wprowadzenie do regresji i matematyki stojącej za machine learningiem dla branży BIM, AEC i MEP, na przykładzie Residential Building Dataset."
date: 2026-10-06
tags: ["bim", "ai", "regression", "mep", "5d"]
thumbnail: "/journal/004-regresja/miniaturka.png"
translationSlug: "004-regression"
draft: false
author: "Mateusz"
project: "ML4BIM"
language: "pl"
---

## Przystępne wprowadzenie do AI i machine learningu dla branży BIM, AEC i MEP

Wyobraźmy sobie, że rozpoczynamy nowy projekt budynku mieszkalnego.

Na wczesnym etapie znamy już kilka podstawowych informacji:

- przybliżoną powierzchnię budynku,
- powierzchnię działki,
- lokalizację inwestycji,
- przewidywany czas realizacji,
- wstępny koszt jednostkowy,
- szacowany budżet.

Nie znamy natomiast końcowego kosztu budowy. Ten pojawi się dopiero po zakończeniu inwestycji.

Jeżeli jednak posiadamy dane z wielu zrealizowanych projektów, możemy zadać pytanie:

> Czy na podstawie informacji dostępnych na początku projektu można przewidzieć jego rzeczywisty koszt?

To typowy problem **regresji**, czyli przewidywania wartości liczbowej.

W tym artykule wykorzystamy problem kosztów budowy jako przykład edukacyjny. Celem nie jest stworzenie gotowego systemu kosztorysowego, lecz zrozumienie matematycznego mechanizmu stojącego za jednym z podstawowych zadań machine learningu.

**problem → dane → funkcja szkoleniowa → funkcja straty → optymalizacja → ocena na nowych danych**

Przykład BIM 5D, Residential Building Dataset, kod Pythona i interpretacja dla AEC są natomiast naszą praktyczną adaptacją.



## 1. Regresja - przewidywanie wartości liczbowej

Regresja jest zadaniem uczenia maszynowego, w którym wynikiem modelu jest liczba.

W branży AEC może to być na przykład:

- koszt budowy,
- koszt instalacji HVAC,
- czas realizacji,
- liczba roboczogodzin,
- zużycie energii,
- zapotrzebowanie na moc grzewczą,
- masa instalacji,
- długość przewodów,
- przewidywana liczba kolizji.

Dane wejściowe oznaczamy zwykle jako $x$, a wartość, którą chcemy przewidzieć, jako $y$.

Model tworzy przewidywanie:

$$
\hat{y} = f(x)
$$

gdzie:

- $x$ - dane wejściowe,
- $y$ - wartość rzeczywista,
- $\hat{y}$ - wartość przewidywana,
- $f$ - funkcja opisująca zależność między wejściem a wynikiem.

W naszym przykładzie:

- $x$ może oznaczać parametry projektu,
- $y$ - rzeczywisty koszt budowy,
- $\hat{y}$ - koszt przewidziany przez model.



## 2. Machine learning jako dopasowywanie funkcji do danych

W klasycznym programowaniu człowiek zapisuje regułę.

Na przykład:

$$
\text{Koszt}
=
\text{powierzchnia}
\cdot
\text{koszt jednostkowy}
$$

To człowiek określa wzór oraz wszystkie jego parametry.

W machine learningu sytuacja wygląda inaczej.

Najpierw wybieramy pewną **rodzinę funkcji**, a następnie wykorzystujemy dane, aby znaleźć parametry funkcji najlepiej pasujące do obserwacji.

Dla prostej regresji liniowej:

$$
\hat{y} = b_0 + b_1x
$$

gdzie:

- $b_0$ - wyraz wolny,
- $b_1$ - współczynnik kierunkowy,
- $x$ - cecha wejściowa,
- $\hat{y}$ - przewidywana wartość.

Algorytm nie otrzymuje gotowych wartości $b_0$ i $b_1$.

Musi je wyznaczyć na podstawie danych.

To prowadzi do trzech kluczowych elementów:

1. **funkcja szkoleniowa** - jak model oblicza przewidywanie,
2. **funkcja straty** - jak mierzymy jakość przewidywania,
3. **optymalizacja** - jak znajdujemy parametry minimalizujące stratę.

Ta struktura jest znacznie ważniejsza niż sam wybór biblioteki czy pojedynczego algorytmu.


## 3. Funkcja szkoleniowa

Używamy pojęcia **training function**, czyli funkcji szkoleniowej. W literaturze spotkamy również określenia takie jak funkcja hipotezy, funkcja predykcyjna albo po prostu model.

W regresji liniowej funkcją szkoleniową może być:

$$
f(x) = b_0 + b_1x
$$

Dla każdej wartości wejściowej $x$ model oblicza:

$$
\hat{y} = b_0 + b_1x
$$

Załóżmy, że próbujemy przewidzieć koszt budowy wyłącznie na podstawie powierzchni.

Model może mieć postać:

$$
\widehat{\text{koszt}}
=
20 + 0{,}35 \cdot \text{powierzchnia}
$$

Jeżeli powierzchnia wynosi 500 jednostek, model zwróci:

$$
\widehat{\text{koszt}}
=
20 + 0{,}35 \cdot 500
=
195
$$

Wartość 195 jest **predykcją**.

Nie oznacza jeszcze, że model jest dobry.

Musimy porównać przewidywanie z wartością rzeczywistą.


## 4. Residential Building Dataset

Do eksperymentu wykorzystamy **Residential Building Dataset** z UCI Machine Learning Repository.

Zbiór dotyczy projektów mieszkaniowych w Teheranie i zawiera 372 obserwacje. UCI opisuje go jako zbiór przeznaczony między innymi do zadań regresyjnych.

W danych znajdują się:

- 8 fizycznych i finansowych zmiennych projektu,
- 19 wskaźników ekonomicznych zapisanych dla 5 przesunięć czasowych, czyli łącznie 95 wartości,
- 2 zmienne wyjściowe: rzeczywista cena sprzedaży oraz rzeczywisty koszt budowy.

W naszym przykładzie interesuje nas przede wszystkim **V-10 - actual construction cost**, czyli rzeczywisty koszt budowy.

Pierwsze zmienne projektowe można interpretować następująco:

| Zmienna | Znaczenie | Potencjalne źródło w procesie BIM |
|---|---|---|
| V-1 | lokalizacja projektu | dane projektu / GIS |
| V-2 | całkowita powierzchnia budynku | Revit / IFC |
| V-3 | powierzchnia działki | model terenu / GIS |
| V-4 | całkowity wstępny koszt budowy | BIM 5D / kosztorys |
| V-5 | wstępnie oszacowany koszt jednostkowy | baza kosztowa |
| V-6 | koszt odniesiony do roku bazowego | baza kosztowa / indeksacja |
| V-7 | czas realizacji | harmonogram / BIM 4D |
| V-8 | cena jednostkowa na początku projektu | dane rynkowe |
| V-10 | rzeczywisty koszt budowy | ERP / dane powykonawcze |

Nie wszystkie dane pochodzą bezpośrednio z geometrii BIM.

W rzeczywistym procesie można je łączyć:

**Revit / IFC → geometria i ilości**

**BIM 4D → harmonogram**

**BIM 5D → kosztorys**

**ERP / baza projektów → koszty rzeczywiste**

Dopiero wspólnie tworzą one dataset odpowiedni do uczenia modelu.

## 5. Wartość przewidywana a wartość rzeczywista

Dla każdej obserwacji mamy dwie wartości:

- $y_i$ - wartość rzeczywistą,
- $\hat{y}_i$ - wartość przewidzianą przez model.

Różnicę pomiędzy nimi możemy zapisać jako:

$$
e_i = y_i - \hat{y}_i
$$

Wartość $e_i$ nazywamy **resztą** albo błędem predykcji.

Przykład:

- koszt rzeczywisty: 300,
- koszt przewidziany: 270.

Wtedy:

$$
e = 300 - 270 = 30
$$

Dla innego projektu:

- koszt rzeczywisty: 300,
- koszt przewidziany: 340.

Otrzymujemy:

$$
e = 300 - 340 = -40
$$

Sam znak informuje nas, czy model zaniżył, czy zawyżył wynik.

Do oceny jakości całego modelu potrzebujemy jednak jednej wartości opisującej błędy wszystkich obserwacji.

Tu pojawia się **funkcja straty**.


## 6. Funkcja straty

Funkcja straty odpowiada na pytanie:

> Jak źle nasza aktualna funkcja szkoleniowa pasuje do danych?

Możemy zapisać ją symbolicznie:

$$
L = L(y, \hat{y})
$$

Im mniejsza wartość funkcji straty, tym lepiej model dopasowuje się do danych według przyjętego kryterium.

Nie istnieje jedna uniwersalna funkcja straty dla każdego problemu.

Wybór funkcji straty wpływa na to, jakie błędy model uznaje za szczególnie istotne.


## 7. Odległość bezwzględna a odległość podniesiona do kwadratu

Najprostszym pomysłem jest zmierzenie bezwzględnej różnicy:

$$
|y_i - \hat{y}_i|
$$

Dla błędu $-40$ otrzymamy:

$$
|-40| = 40
$$

Wartość bezwzględna usuwa problem wzajemnego znoszenia się błędów dodatnich i ujemnych.

Na tej podstawie możemy zbudować **MAE - Mean Absolute Error**:

$$
MAE
=
\frac{1}{n}
\sum_{i=1}^{n}
|y_i - \hat{y}_i|
$$

Innym rozwiązaniem jest podniesienie błędu do kwadratu:

$$
(y_i - \hat{y}_i)^2
$$

Na tej podstawie otrzymujemy **MSE - Mean Squared Error**:

$$
MSE
=
\frac{1}{n}
\sum_{i=1}^{n}
(y_i - \hat{y}_i)^2
$$

Różnica jest istotna.

Dla błędów równych 2 i 10:

- wartość bezwzględna daje odpowiednio 2 i 10,
- kwadrat daje 4 i 100.

Duży błąd otrzymuje więc znacznie większą karę.

### Co z matematycznego punktu widzenia daje kwadrat?

Funkcja:

$$
e^2
$$

jest gładka i różniczkowalna.

Natomiast funkcja:

$$
|e|
$$

ma w punkcie $e=0$ ostre załamanie i nie posiada tam klasycznej pochodnej.

Ma to znaczenie przy optymalizacji, ponieważ pochodne są jednym z podstawowych narzędzi służących do lokalizowania minimów funkcji.

Nie oznacza to, że MAE jest „złą” funkcją straty. Oznacza jedynie, że z matematycznego punktu widzenia zachowuje się inaczej niż MSE.


## 8. W regresji liniowej naturalną funkcją straty jest MSE

Dla regresji liniowej:

$$
\hat{y}_i = b_0 + b_1x_i
$$

możemy wstawić przewidywanie bezpośrednio do funkcji straty:

$$
L(b_0,b_1)
=
\frac{1}{n}
\sum_{i=1}^{n}
\left[
y_i-(b_0+b_1x_i)
\right]^2
$$

Teraz funkcja straty nie zależy już tylko od przewidywań.

Jest funkcją parametrów modelu:

$$
L = L(b_0,b_1)
$$

Dla jednego zestawu współczynników otrzymamy większą stratę, dla innego mniejszą.

Uczenie modelu oznacza znalezienie takich parametrów, dla których strata jest możliwie najmniejsza.

To jest właśnie problem optymalizacyjny.


## 9. Optymalizacja - minimalizacja funkcji straty

Cel możemy zapisać jako:

$$
(b_0^*,b_1^*)
=
\underset{b_0,b_1}{\operatorname{argmin}}
\;
L(b_0,b_1)
$$

Symbol `argmin` oznacza:

> znajdź argumenty funkcji, dla których jej wartość jest najmniejsza.

Czyli nie szukamy samej wartości minimalnej.

Szukamy takich parametrów modelu, które tę wartość powodują.

W naszym przypadku:

- zmieniamy $b_0$,
- zmieniamy $b_1$,
- obserwujemy wartość MSE,
- szukamy kombinacji dającej najmniejszy błąd.

Możemy więc myśleć o uczeniu regresji jako o następującym procesie:

**parametry → predykcja → strata → poszukiwanie lepszych parametrów**


## 10. Rozwiązanie analityczne a rozwiązanie numeryczne

### Rozwiązanie analityczne

Dla klasycznej regresji liniowej problem najmniejszych kwadratów posiada rozwiązanie, które można wyznaczyć za pomocą algebry liniowej.

Nie musimy więc koniecznie wykonywać tysięcy małych iteracji.

Możemy rozwiązać problem matematycznie.

W praktyce biblioteki numeryczne stosują stabilne algorytmy algebry liniowej do rozwiązania problemu najmniejszych kwadratów.

### Rozwiązanie numeryczne

Dla bardziej złożonych modeli znalezienie rozwiązania analitycznego może być trudne albo niemożliwe.

Wtedy stosujemy metody iteracyjne:

1. zaczynamy od pewnych parametrów,
2. obliczamy stratę,
3. sprawdzamy kierunek, w którym strata maleje,
4. aktualizujemy parametry,
5. powtarzamy proces.

Przykładem jest **gradient descent**, czyli spadek gradientowy.

Warto więc rozróżnić dwie rzeczy:

> Optymalizacja jest problemem: znajdź minimum funkcji straty.

> Gradient descent jest jednym z możliwych sposobów rozwiązania tego problemu.

W naszym przykładzie `LinearRegression` ze scikit-learn rozwiązuje klasyczny problem najmniejszych kwadratów. Nie musimy implementować gradient descent, aby dopasować prostą.


## 11. Wypukłość i minimalizator

Wyobraźmy sobie, że wykres funkcji straty przypomina miskę.

W najniższym punkcie znajduje się minimum.

Dla klasycznej regresji liniowej z MSE funkcja straty względem parametrów modelu jest **wypukła**.

To bardzo wygodna własność.

Oznacza ona w uproszczeniu, że nie mamy wielu przypadkowych „dolinek”, z których każda wygląda jak dobre rozwiązanie lokalne.

Jeżeli poruszamy się w kierunku minimum, możemy dojść do najlepszego rozwiązania globalnego.

W bardziej złożonych modelach, na przykład głębokich sieciach neuronowych, krajobraz funkcji straty może być znacznie bardziej skomplikowany.

Regresja liniowa jest więc bardzo dobrym miejscem do zrozumienia podstaw optymalizacji.


## 12. Pochodna jako wskazówka, gdzie znajduje się minimum

Dla prostej funkcji jednej zmiennej minimum często znajduje się tam, gdzie:

$$
\frac{dL}{dw} = 0
$$

Pochodna mówi nam, jak szybko i w jakim kierunku zmienia się funkcja.

Jeżeli:

$$
\frac{dL}{dw} > 0
$$

funkcja rośnie wraz ze wzrostem $w$.

Jeżeli:

$$
\frac{dL}{dw} < 0
$$

funkcja maleje.

W punkcie minimum nachylenie może wynosić zero:

$$
\frac{dL}{dw}=0
$$

W regresji wielowymiarowej mamy kilka parametrów jednocześnie, dlatego zamiast jednej pochodnej wykorzystujemy pochodne cząstkowe i gradient.

Nie musimy jednak wykonywać całego rachunku różniczkowego ręcznie, aby zrozumieć ideę:

> minimum funkcji straty odpowiada takim parametrom modelu, przy których dalsza niewielka zmiana nie poprawia już dopasowania.



## 13. Regresja wielowymiarowa i notacja wektorowa

Rzeczywisty projekt nie jest opisany przez jedną cechę.

Możemy mieć:

$$
x_1 = \text{powierzchnia}
$$

$$
x_2 = \text{czas realizacji}
$$

$$
x_3 = \text{koszt wstępny}
$$

i kolejne zmienne.

Wtedy regresja przyjmuje postać:

$$
\hat{y}
=
b
+
w_1x_1
+
w_2x_2
+
\ldots
+
w_px_p
$$

Możemy zapisać cechy jako wektor kolumnowy:

$$
\mathbf{x}
=
\begin{bmatrix}
x_1 \\
x_2 \\
\vdots \\
x_p
\end{bmatrix}
$$

oraz współczynniki:

$$
\mathbf{w}
=
\begin{bmatrix}
w_1 \\
w_2 \\
\vdots \\
w_p
\end{bmatrix}
$$

Wtedy równanie staje się znacznie krótsze:

$$
\hat{y}
=
\mathbf{w}^T\mathbf{x}
+
b
$$

To ten sam model.

Zmienia się jedynie zapis matematyczny.

Notacja wektorowa stanie się szczególnie ważna później, przy sieciach neuronowych, ponieważ tam operacje na wielu wejściach i wagach wykonujemy praktycznie cały czas.



## 14. Zbiory szkoleniowy, walidacyjny i testowy

Dobre dopasowanie do danych użytych podczas treningu nie wystarcza.

Model ma działać dla nowych projektów.

Dlatego dane dzielimy na osobne części.

### Zbiór szkoleniowy - train set

Służy do wyznaczania parametrów modelu:

$$
b_0,\;b_1,\;\mathbf{w}
$$

To na tych danych minimalizujemy funkcję straty.

### Zbiór walidacyjny - validation set

Służy do podejmowania decyzji dotyczących modelu.

Możemy na nim porównywać:

- różne algorytmy,
- zestawy cech,
- sposoby preprocessingu,
- hiperparametry.

Zbiór walidacyjny nie powinien być używany do końcowej oceny modelu.

### Zbiór testowy - test set

Powinien pozostać niewidziany aż do końca.

Służy do odpowiedzi na pytanie:

> Jak model radzi sobie z nowymi danymi, których nie używaliśmy do jego budowy ani wyboru?

W naszym prostym przykładzie kodowym zastosujemy podział **train/test**, ponieważ nie wykonujemy rozbudowanego strojenia hiperparametrów.

W realnym projekcie ML, szczególnie gdy porównujemy wiele wariantów, powinniśmy zastosować:

**train → validation → test**

albo odpowiednią metodę cross-validation.



## 15. Silnie skorelowane cechy

W danych projektowych bardzo często kilka parametrów opisuje prawie tę samą informację.

Przykład:

- powierzchnia,
- koszt jednostkowy,
- koszt całkowity.

Jeżeli:

$$
\text{koszt całkowity}
=
\text{powierzchnia}
\cdot
\text{koszt jednostkowy}
$$

to te trzy zmienne nie są niezależne.

Podobny problem pojawia się w Residential Building Dataset.

Przykładowo V-4 jest wyliczane na podstawie innych parametrów kosztowych i powierzchniowych.

Jeżeli do regresji wprowadzimy wiele silnie skorelowanych cech, model może nadal dobrze przewidywać wynik, ale interpretacja poszczególnych współczynników stanie się trudniejsza.

Wagi mogą być niestabilne.

Nie powinniśmy więc automatycznie interpretować dużej wartości współczynnika jako dowodu, że dana cecha „powoduje” zmianę kosztu.

To prowadzi do ważnej zasady:

> Predykcja i interpretacja przyczynowa to dwa różne problemy.



## Część praktyczna - regresja na danych BIM 5D

## 16. Pierwszy eksperyment: czy powierzchnia wystarczy?

Zacznijmy od najprostszego pytania:

> Czy całkowita powierzchnia budynku wystarczy do przewidzenia rzeczywistego kosztu?

Model:

$$
\widehat{V10}
=
b_0
+
b_1V2
$$

Dzielimy dane:

- 80% - zbiór szkoleniowy,
- 20% - zbiór testowy.

Dla powtarzalności wykorzystujemy:

```python
random_state=42
```

W naszym eksperymencie uzyskaliśmy wyniki zbliżone do:

| Model | MAE | RMSE | R² |
|---|---:|---:|---:|
| Tylko powierzchnia V-2 | 137,74 | 163,79 | 0,045 |

Wynik jest słaby.

Sama powierzchnia wyjaśnia tylko niewielką część zróżnicowania kosztów.

Z punktu widzenia AEC jest to logiczne.

Dwa budynki o podobnej powierzchni mogą różnić się:

- lokalizacją,
- standardem,
- konstrukcją,
- czasem realizacji,
- cenami materiałów,
- sytuacją gospodarczą,
- warunkami kontraktowymi.

Machine learning pozwala więc nie tylko przewidywać.
Pozwala również sprawdzać, czy nasze intuicyjne założenia znajdują potwierdzenie w danych.



## 17. Drugi eksperyment: koszt wstępny a koszt rzeczywisty

W kolejnym modelu wykorzystujemy V-5, czyli wstępne oszacowanie kosztu.

Model nadal jest liniowy:

$$
\widehat{V10}
=
b_0
+
b_1V5
$$

Dla naszego podziału danych otrzymaliśmy zależność zbliżoną do:

$$
\widehat{V10}
=
7{,}15
+
1{,}376 \cdot V5
$$

oraz wyniki:

| Model | MAE | RMSE | R² |
|---|---:|---:|---:|
| Tylko powierzchnia V-2 | 137,74 | 163,79 | 0,045 |
| Wstępny koszt V-5 | 33,56 | 48,93 | 0,915 |

Wstępny koszt jest znacznie lepszym predyktorem końcowego kosztu niż sama powierzchnia.

Nie oznacza to jednak, że współczynnik 1,376 jest uniwersalną zależnością kosztową.
Jest parametrem dopasowanym do konkretnego zbioru danych.


## 18. Regresja wielowymiarowa

W kolejnym kroku wykorzystujemy więcej cech projektu:

- V-1 - lokalizacja,
- V-2 - powierzchnia budynku,
- V-3 - powierzchnia działki,
- V-5 - koszt wstępny,
- V-6 - koszt odniesiony do roku bazowego,
- V-7 - czas realizacji,
- V-8 - cena jednostkowa.

Pomijamy V-4, ponieważ jest bezpośrednio związane z innymi cechami kosztowymi.

Model ma postać:

$$
\hat{y}
=
b
+
w_1x_1
+
w_2x_2
+
\ldots
+
w_px_p
$$

W naszym eksperymencie:

| Model | MAE | RMSE | R² |
|---|---:|---:|---:|
| Tylko powierzchnia V-2 | 137,74 | 163,79 | 0,045 |
| Wstępny koszt V-5 | 33,56 | 48,93 | 0,915 |
| Zestaw parametrów projektu | 24,22 | 32,68 | 0,962 |

Dodanie informacji o projekcie znacząco poprawiło wynik.

Nie należy jednak interpretować:

$$
R^2 = 0{,}962
$$

jako informacji, że model „przewiduje koszty z dokładnością 96,2%”.

R² nie jest procentową dokładnością predykcji.

Informuje, jak dużą część zmienności wartości docelowej model wyjaśnia względem prostego punktu odniesienia.



## 19. Funkcja straty podczas treningu a metryki oceny

Warto rozdzielić dwa pojęcia.

### Funkcja straty

Jest używana do dopasowania parametrów modelu.

Dla klasycznej regresji liniowej:

$$
MSE
=
\frac{1}{n}
\sum_{i=1}^{n}
(y_i-\hat{y}_i)^2
$$

### Metryki oceny

Po treningu możemy wykorzystać kilka różnych miar.

#### MAE

$$
MAE
=
\frac{1}{n}
\sum_{i=1}^{n}
|y_i-\hat{y}_i|
$$

Jest łatwe do interpretacji, ponieważ pozostaje w tej samej jednostce co przewidywana wartość.

#### RMSE

$$
RMSE
=
\sqrt{
\frac{1}{n}
\sum_{i=1}^{n}
(y_i-\hat{y}_i)^2
}
$$

Silniej reaguje na duże błędy.

#### R²

Porównuje model z prostym punktem odniesienia opartym na średniej wartości celu.

Najlepsza możliwa wartość wynosi 1.

Wartość około 0 oznacza, że model nie daje istotnej poprawy względem przewidywania średniej.

R² może być również ujemne.



## 20. Implementacja w Pythonie

Poniższy kod realizuje eksperyment wielowymiarowy.

```python
import numpy as np
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LinearRegression
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


# Pierwszy wiersz zawiera nagłówki grup,
# a kolejny identyfikatory zmiennych.
df = pd.read_excel(
    "Residential-Building-Data-Set.xlsx",
    sheet_name="Data",
    header=1,
)

features = [
    "V-1",  # lokalizacja
    "V-2",  # powierzchnia budynku
    "V-3",  # powierzchnia działki
    "V-5",  # wstępny koszt
    "V-6",  # koszt odniesiony do roku bazowego
    "V-7",  # czas realizacji
    "V-8",  # cena jednostkowa
]

target = "V-10"

X = df[features]
y = df[target]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
)

categorical_features = ["V-1"]

numeric_features = [
    "V-2",
    "V-3",
    "V-5",
    "V-6",
    "V-7",
    "V-8",
]

preprocessor = ColumnTransformer(
    transformers=[
        (
            "locality",
            OneHotEncoder(
                drop="first",
                handle_unknown="ignore",
            ),
            categorical_features,
        ),
        (
            "numeric",
            "passthrough",
            numeric_features,
        ),
    ]
)

model = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("regression", LinearRegression()),
    ]
)

model.fit(X_train, y_train)

predictions = model.predict(X_test)

mae = mean_absolute_error(y_test, predictions)
rmse = np.sqrt(
    mean_squared_error(y_test, predictions)
)
r2 = r2_score(y_test, predictions)

print(f"MAE:  {mae:.2f}")
print(f"RMSE: {rmse:.2f}")
print(f"R²:   {r2:.3f}")
```

Wyniki dla tego podziału powinny być zbliżone do:

```text
MAE:  24.22
RMSE: 32.68
R²:   0.962
```



## 21. Co właściwie zrobiła funkcja `fit()`?

Jedna linia:

```python
model.fit(X_train, y_train)
```

ukrywa cały proces matematyczny.

W uproszczeniu dzieje się następująca rzecz:

### 1. Funkcja szkoleniowa

Model zakłada zależność liniową:

$$
\hat{y}
=
\mathbf{w}^T\mathbf{x}
+
b
$$

### 2. Predykcja

Dla danych treningowych obliczane są przewidywane wartości:

$$
\hat{y}_1,\hat{y}_2,\ldots,\hat{y}_n
$$

### 3. Funkcja straty

Porównujemy je z wartościami rzeczywistymi:

$$
MSE
=
\frac{1}{n}
\sum_{i=1}^{n}
(y_i-\hat{y}_i)^2
$$

### 4. Optymalizacja

Algorytm znajduje parametry:

$$
\mathbf{w},b
$$

minimalizujące błąd najmniejszych kwadratów.

### 5. Predykcja nowych danych

Po treningu możemy wykonać:

```python
predictions = model.predict(X_test)
```

Model korzysta wtedy z już wyznaczonych parametrów.

Nie uczy się ponownie.



## 22. Czy potrzebujemy zbioru walidacyjnego w tym przykładzie?

W pokazanym kodzie stosujemy:

**train → test**

Jest to celowe uproszczenie.

Nie stroimy parametrów takich jak:

- głębokość drzewa,
- liczba drzew,
- współczynnik uczenia,
- stopień wielomianu,
- siła regularyzacji.

Jeżeli zaczęlibyśmy porównywać wiele modeli i wybierać najlepszy na podstawie wyników, zbiór testowy nie powinien być wykorzystywany do kolejnych decyzji.

Wtedy poprawny workflow wyglądałby następująco:

**train → validation → test**

albo:

**train + cross-validation → final test**

Test powinien pozostać końcowym egzaminem.



## 23. Problem danych zmieniających się w czasie

Koszty budowy nie są stacjonarne.

Zmieniają się:

- ceny materiałów,
- stawki robocizny,
- inflacja,
- dostępność wykonawców,
- warunki gospodarcze.

Losowy podział danych może więc dawać zbyt optymistyczny obraz.

Jeżeli projekt z 2007 roku znajduje się w zbiorze treningowym, a bardzo podobny projekt z tego samego okresu w zbiorze testowym, zadanie jest łatwiejsze niż realne przewidywanie przyszłości.

W rzeczywistym rozwiązaniu kosztowym warto rozważyć podział chronologiczny:

**starsze projekty → trening**

**nowsze projekty → walidacja / test**

To lepiej odpowiada pytaniu:

> Czy na podstawie historii potrafimy przewidzieć wynik przyszłego projektu?



## 24. Czy model rzeczywiście nauczył się kosztów budowy?

Wysokie R² może wyglądać imponująco.

Musimy jednak spojrzeć na cechy wejściowe.

Model otrzymuje między innymi:

- wstępny koszt,
- koszt odniesiony do roku bazowego,
- cenę jednostkową.

Nie przewiduje więc kosztu wyłącznie na podstawie geometrii budynku.

W dużej mierze uczy się relacji pomiędzy wcześniejszym oszacowaniem a kosztem rzeczywistym.

Takie zastosowanie nadal może być bardzo wartościowe.

Model może odpowiadać na pytanie:

> Jak dużego odchylenia od wstępnego kosztorysu możemy się spodziewać na podstawie historii podobnych projektów?

To inne zadanie niż:

> Ile będzie kosztował budynek na podstawie samego modelu 3D?

Rozróżnienie problemu jest kluczowe.



## 25. Korelacja nie oznacza przyczynowości

Model regresyjny znajduje wzorce obecne w danych.

Jeżeli projekty z dłuższym czasem realizacji mają wyższe koszty, współczynnik regresji może wskazywać dodatnią zależność.

Nie oznacza to automatycznie:

> wydłużenie budowy o miesiąc powoduje wzrost kosztu dokładnie o X.

Na czas i koszt mogą jednocześnie wpływać:

- wielkość inwestycji,
- standard,
- stopień skomplikowania,
- sytuacja gospodarcza,
- liczba zmian projektowych.

Model predykcyjny może działać bardzo dobrze, a jednocześnie nie opisywać zależności przyczynowych.

To szczególnie ważne w branży inżynierskiej, gdzie łatwo pomylić korelację znalezioną w danych z prawem fizycznym lub zależnością projektową.



## 26. Gdzie znajduje się BIM?

Sam model Revit lub IFC nie jest jeszcze datasetem do machine learningu.

Potrzebujemy powtarzalnego procesu:

**Model BIM → ekstrakcja cech → tabela projektów → wyniki rzeczywiste → trening → walidacja → predykcja**

Dla każdego projektu moglibyśmy gromadzić:

- powierzchnie,
- kubatury,
- liczbę kondygnacji,
- liczbę pomieszczeń,
- ilości materiałów,
- długości instalacji,
- liczbę urządzeń,
- typ konstrukcji,
- typ systemu HVAC,
- harmonogram,
- koszt wstępny,
- koszt rzeczywisty.

Największym wyzwaniem często nie będzie sam algorytm.

Trudniejsze może być:

- ujednolicenie parametrów,
- zachowanie tych samych jednostek,
- identyfikacja wersji modelu,
- połączenie danych BIM z ERP,
- zbieranie wyników końcowych,
- utrzymanie jakości danych przez wiele lat.

W tym sensie BIM może stać się czymś więcej niż modelem 3D.

Może być **źródłem cech dla modeli uczenia maszynowego**.



## 27. Jak przełożyć ten przykład na MEP?

Ten sam schemat możemy wykorzystać w instalacjach HVAC, sanitarnych i elektrycznych.

Przykładowe dane wejściowe:

- powierzchnia budynku,
- kubatura,
- liczba kondygnacji,
- liczba pomieszczeń,
- projektowany strumień powietrza,
- długość kanałów,
- długość rur,
- liczba urządzeń,
- liczba pionów,
- liczba przyborów,
- typ systemu,
- standard projektu.

Przewidywana wartość może oznaczać:

- koszt instalacji HVAC,
- liczbę roboczogodzin projektowych,
- czas modelowania,
- liczbę kolizji,
- masę kanałów,
- masę rur,
- ilość zmian,
- zużycie energii.

Przykładowo:

$$
\text{Koszt HVAC}
=
f(
\text{powierzchnia},
\text{strumień powietrza},
\text{długość kanałów},
\text{liczba urządzeń},
\text{typ systemu}
)
$$

Model może być później wykorzystywany jako:

- szybki estimator,
- model zastępczy,
- system kontroli wyników,
- narzędzie do wykrywania anomalii,
- wsparcie decyzji koncepcyjnych.

Nie oznacza to automatycznego zastępowania obliczeń fizycznych.
Jeżeli potrafimy dokładnie policzyć spadek ciśnienia z praw mechaniki płynów, nie potrzebujemy ML tylko po to, aby odtworzyć znany wzór.
Machine learning staje się szczególnie ciekawy wtedy, gdy zależność jest trudna do opisania jednym równaniem, ale posiadamy dużo wartościowych danych historycznych.



## 28. Ograniczenia eksperymentu

Residential Building Dataset jest dobrym materiałem edukacyjnym, ale nie jest gotowym zbiorem do wdrożenia produkcyjnego w polskiej branży budowlanej.

Najważniejsze ograniczenia:

1. Zawiera tylko 372 obserwacje.
2. Dane dotyczą konkretnego historycznego rynku w Teheranie.
3. Warunki ekonomiczne są inne niż obecnie.
4. Część cech jest bezpośrednio związana z wcześniejszymi oszacowaniami kosztów.
5. Niektóre cechy są ze sobą silnie skorelowane.
6. Losowy podział danych może nie oddawać realnego przewidywania przyszłości.
7. Dobry wynik predykcji nie oznacza istnienia zależności przyczynowej.

Dlatego model należy traktować jako demonstrację matematyki regresji, a nie gotowy system kosztorysowy.



## 29. Najważniejsza lekcja matematyczna

Najważniejszy schemat z tego artykułu można zapisać następująco:

### Funkcja szkoleniowa

$$
\hat{y}=f(x;\theta)
$$

gdzie $\theta$ oznacza parametry modelu.

### Funkcja straty

$$
L(\theta)
=
\frac{1}{n}
\sum_{i=1}^{n}
(y_i-\hat{y}_i)^2
$$

### Optymalizacja

$$
\theta^*
=
\underset{\theta}{\operatorname{argmin}}
\;
L(\theta)
$$

### Ocena

Po znalezieniu $\theta^*$ sprawdzamy model na danych, których nie wykorzystywał do uczenia.

To jest sedno dużej części klasycznego machine learningu.

Algorytmy mogą się zmieniać.

Funkcje mogą być liniowe, wielomianowe albo niezwykle złożone.

Funkcje straty mogą mieć różne postacie.

Metody optymalizacji również mogą być różne.

Ale podstawowy sposób myślenia pozostaje podobny:

**zdefiniuj funkcję → zmierz błąd → znajdź parametry minimalizujące błąd → sprawdź model na nowych danych**



## 30. Najważniejszy wniosek dla BIM i AEC

Regresja nie jest magicznym sposobem przewidywania przyszłości.

Jest matematycznym procesem dopasowywania funkcji do danych.

W kontekście BIM oznacza to, że możemy wykorzystać parametry projektów jako cechy wejściowe i uczyć modele przewidujące wartości istotne dla projektanta, wykonawcy lub inwestora.

Potrzebujemy jednak czegoś więcej niż samego algorytmu:

- dobrze zdefiniowanego problemu,
- odpowiednich danych,
- właściwej funkcji szkoleniowej,
- sensownej funkcji straty,
- poprawnej optymalizacji,
- odpowiedniego podziału danych,
- walidacji na nowych przypadkach,
- wiedzy inżynierskiej potrzebnej do interpretacji wyników.

W naszym eksperymencie sama powierzchnia budynku nie wystarczyła do dobrego przewidywania kosztu.

Znacznie lepsze wyniki uzyskaliśmy po dodaniu danych finansowych i projektowych.

Nie stworzyliśmy automatycznego kosztorysanta.

Pokazaliśmy jednak mechanizm, który można rozwinąć w prawdziwy system ML4BIM:

**dane BIM + historia projektów → funkcja szkoleniowa → funkcja straty → optymalizacja → predykcja nowego projektu**

Model BIM nie jest jeszcze sztuczną inteligencją.

Może jednak stać się uporządkowanym źródłem danych, na podstawie których algorytmy uczą się zależności występujących w rzeczywistych projektach.

I właśnie w tym miejscu matematyka, machine learning i BIM zaczynają tworzyć jeden wspólny proces.



## Źródła

- Hala Nelson, *Matematyka i sztuczna inteligencja*, rozdział 3: „Dopasowywanie funkcji do danych”, Helion.
- Hala Nelson, *Essential Math for AI: Next-Level Mathematics for Efficient and Successful AI Systems*, O’Reilly Media.
- UCI Machine Learning Repository - Residential Building Dataset: https://archive.ics.uci.edu/dataset/437/residential+building+data+set
- Dataset DOI: https://doi.org/10.24432/C5S896
- scikit-learn - LinearRegression: https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html
- scikit-learn - train_test_split: https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html
- scikit-learn - regression metrics: https://scikit-learn.org/stable/modules/model_evaluation.html#regression-metrics



## Co dalej?

Naturalnym kolejnym krokiem jest porównanie regresji liniowej z modelem nieliniowym.

Możemy sprawdzić na tym samym zbiorze:

- Random Forest,
- Gradient Boosting,
- XGBoost.

Wtedy pojawia się kolejne ważne pytanie:

> Czy bardziej złożona funkcja rzeczywiście generalizuje lepiej, czy jedynie lepiej dopasowuje się do danych szkoleniowych?

To prowadzi bezpośrednio do kolejnych tematów: overfittingu, regularizacji, cross-validation i interpretacji modeli.
