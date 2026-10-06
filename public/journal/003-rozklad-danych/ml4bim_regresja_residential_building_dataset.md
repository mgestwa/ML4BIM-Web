---
title: "Regresja w BIM 5D: jak dopasować funkcję do danych i przewidywać koszty budowy"
description: "Przystępne wprowadzenie do regresji i machine learningu dla branży BIM, AEC i MEP na przykładzie Residential Building Dataset."
author: "Mateusz"
project: "ML4BIM"
language: "pl"
---

# Regresja w BIM 5D: jak dopasować funkcję do danych i przewidywać koszty budowy

## Przystępne wprowadzenie do AI i machine learningu dla branży BIM, AEC i MEP

Wyobraźmy sobie, że rozpoczynamy nowy projekt budynku mieszkalnego.

Na wczesnym etapie znamy już kilka podstawowych informacji:

- przybliżoną powierzchnię budynku,
- powierzchnię działki,
- lokalizację inwestycji,
- przewidywany czas realizacji,
- wstępny koszt jednostkowy,
- szacowany całkowity budżet.

Nie znamy natomiast końcowego kosztu budowy. Ten pojawi się dopiero po zakończeniu inwestycji.

Jeżeli jednak posiadamy dane z kilkuset zrealizowanych projektów, możemy zadać pytanie:

> Czy na podstawie informacji dostępnych na początku projektu można przewidzieć jego rzeczywisty koszt?

Jest to typowy problem **regresji**, czyli przewidywania wartości liczbowej.

W tym artykule nie będziemy budować rzeczywistego systemu kosztorysowego. Wykorzystamy historyczny dataset jako przykład edukacyjny, aby zrozumieć jeden z najważniejszych mechanizmów machine learningu:

> Dopasowanie funkcji do danych i wykorzystanie jej do przewidywania wartości dla nowych obserwacji.

---

## 1. Czym jest regresja?

Regresja jest zadaniem uczenia maszynowego, w którym wynikiem modelu jest liczba.

Może to być:

- koszt budowy,
- cena nieruchomości,
- czas realizacji,
- liczba roboczogodzin,
- zużycie energii,
- zapotrzebowanie na moc grzewczą,
- masa instalacji,
- długość przewodów,
- przewidywana liczba kolizji.

Dane wejściowe oznaczamy zwykle jako $x$, a wartość, którą chcemy przewidzieć, jako $y$.

Model próbuje znaleźć funkcję:

$$
\hat{y} = f(x)
$$

gdzie:

- $x$ oznacza informacje wejściowe o projekcie,
- $y$ jest rzeczywistym wynikiem,
- $\hat{y}$ jest wartością przewidzianą przez model,
- $f$ jest funkcją dopasowaną do danych.

W przypadku BIM danymi wejściowymi mogą być parametry wyciągnięte z modelu Revit lub IFC, natomiast wynikiem może być koszt, czas, zużycie energii albo inna wartość znana z zakończonych projektów.

---

## 2. Uczenie maszynowe jako dopasowywanie funkcji

W tradycyjnym programowaniu człowiek określa reguły.

Przykładowo możemy zapisać:

$$
\text{Koszt}
=
\text{powierzchnia}
\cdot
\text{średni koszt za m}^2
$$

To my wybieramy wzór i wszystkie jego składniki.

W machine learningu również wybieramy pewną strukturę obliczeń, ale wartości jej parametrów są ustalane na podstawie danych.

Dla najprostszej regresji liniowej model ma postać:

$$
\hat{y} = b_0 + b_1x
$$

Współczynnik $b_0$ określa punkt przecięcia prostej z osią pionową, natomiast $b_1$ opisuje jej nachylenie.

Algorytm nie otrzymuje gotowych wartości tych współczynników. Musi znaleźć takie $b_0$ i $b_1$, dla których przewidywania znajdują się możliwie blisko rzeczywistych danych.

Możemy sprowadzić uczenie modelu do trzech elementów:

1. wybieramy rodzinę funkcji,
2. określamy sposób pomiaru błędu,
3. szukamy parametrów minimalizujących ten błąd.

Ten sam ogólny schemat pojawia się również w znacznie bardziej zaawansowanych modelach, w tym w sieciach neuronowych.

---

## 3. Problem BIM 5D

W naszym przykładzie chcemy przewidzieć rzeczywisty koszt budowy na podstawie informacji znanych na wcześniejszym etapie inwestycji.

Możemy zapisać ten problem jako:

$$
\text{Rzeczywisty koszt}
=
f(
\text{powierzchnia},
\text{lokalizacja},
\text{czas realizacji},
\text{koszt wstępny}
)
$$

Nie wszystkie dane muszą pochodzić bezpośrednio z geometrii BIM.

W rzeczywistym środowisku informacje mogłyby być pobierane z kilku systemów:

**Revit/IFC → geometria i ilości**

**Harmonogram → czas realizacji**

**BIM 5D / kosztorys → dane kosztowe**

**ERP / baza projektów → wartości rzeczywiste**

Wspólnie tworzą one dataset, który może zostać wykorzystany do wytrenowania modelu regresyjnego.

Dlatego analizowany przykład nie dotyczy wyłącznie modelu 3D. Pokazuje raczej możliwość łączenia danych BIM, harmonogramowych, kosztowych i rynkowych.

---

## 4. Residential Building Dataset

Do eksperymentu wykorzystamy **Residential Building Dataset**, którego źródłowa wersja znajduje się w [UCI Machine Learning Repository](https://archive.ics.uci.edu/dataset/437/residential+building+data+set).

Zbiór obejmuje 372 obserwacje dotyczące projektów mieszkaniowych w Teheranie. Zawiera:

- osiem fizycznych i finansowych zmiennych projektowych,
- 19 wskaźników ekonomicznych zapisanych dla pięciu wcześniejszych okresów, czyli łącznie 95 wartości ekonomicznych,
- dwa wyniki: rzeczywiste ceny sprzedaży i rzeczywiste koszty budowy.

Dataset nie zawiera brakujących wartości.

W artykule nie wykorzystamy wszystkich dostępnych zmiennych wejściowych. Celem nie jest znalezienie najbardziej zaawansowanego modelu, lecz zrozumienie działania regresji.

Skupimy się na parametrach projektowych V-1–V-8.

| Zmienna | Znaczenie | Potencjalne źródło w procesie BIM |
|---|---|---|
| V-1 | Lokalizacja projektu | dane projektu lub GIS |
| V-2 | Całkowita powierzchnia budynku | Revit, IFC, zestawienie powierzchni |
| V-3 | Powierzchnia działki | model terenu lub GIS |
| V-4 | Całkowity wstępny koszt budowy | kosztorys koncepcyjny, BIM 5D |
| V-5 | Wstępnie oszacowany koszt budowy | baza kosztowa |
| V-6 | Wstępny koszt przeliczony na rok bazowy | znormalizowana baza kosztów |
| V-7 | Czas realizacji | harmonogram, BIM 4D |
| V-8 | Cena jednostkowa na początku projektu | dane rynkowe |
| V-10 | Rzeczywisty koszt budowy | system ERP lub dane powykonawcze |

Warto zwrócić uwagę, że część parametrów jest ze sobą powiązana.

Przykładowo wartość V-4 jest wyliczana z powierzchni V-2 i kosztu V-5:

$$
V4 = \frac{V2 \cdot V5}{1000}
$$

Oznacza to, że V-4 nie dostarcza całkowicie niezależnej informacji. Jest przekształceniem dwóch pozostałych cech.

W środowisku BIM spotykamy się z podobną sytuacją bardzo często. Model może jednocześnie zawierać:

- długość elementu,
- koszt jednostkowy,
- koszt całkowity,
- masę jednostkową,
- masę całkowitą.

Większa liczba kolumn nie zawsze oznacza większą ilość informacji.

---

## 5. Pierwszy eksperyment: czy powierzchnia wystarczy?

Intuicyjnie moglibyśmy założyć, że większy budynek powinien być droższy.

Zbudujmy więc najprostszy model, wykorzystujący wyłącznie całkowitą powierzchnię budynku V-2:

$$
\widehat{V10} = b_0 + b_1V2
$$

Dane dzielimy na dwie części:

- 80% do wytrenowania modelu,
- 20% do jego sprawdzenia.

Dla powtarzalności eksperymentu wykorzystujemy `random_state=42`.

Przykładowe wyniki:

| Model | MAE | RMSE | R² |
|---|---:|---:|---:|
| Tylko powierzchnia V-2 | 137,74 | 163,79 | 0,045 |

Współczynnik $R^2$ wyniósł zaledwie około 0,045. Oznacza to, że sama powierzchnia wyjaśnia jedynie niewielką część zróżnicowania rzeczywistych kosztów zapisanych w zbiorze.

Jest to ważna lekcja:

> Cecha, która wydaje się logiczna z inżynierskiego punktu widzenia, nie musi wystarczyć do wykonania dobrej predykcji.

Projekty o podobnej powierzchni mogą różnić się:

- lokalizacją,
- standardem,
- czasem rozpoczęcia,
- długością realizacji,
- cenami materiałów,
- kosztami pracy,
- warunkami rynkowymi.

Regresja pozwala sprawdzić nasze założenie na danych zamiast opierać się wyłącznie na intuicji.

---

## 6. Drugi eksperyment: wstępny koszt a koszt rzeczywisty

W kolejnym modelu jako wejście wykorzystamy V-5, czyli wstępnie oszacowany koszt budowy.

Model nadal jest bardzo prosty:

$$
\widehat{V10} = b_0 + b_1V5
$$

Po dopasowaniu funkcji do zbioru treningowego możemy otrzymać równanie zbliżone do:

$$
\widehat{V10} = 7{,}15 + 1{,}376 \cdot V5
$$

Współczynnik 1,376 oznacza, że zwiększenie wartości wstępnego oszacowania o jedną jednostkę wiąże się w tym modelu ze wzrostem przewidywanego kosztu rzeczywistego o około 1,376 jednostki.

Nie jest to jednak uniwersalny współczynnik kosztowy.

Opisuje jedynie zależność znalezioną w konkretnym historycznym zbiorze danych.

Przykładowe wyniki:

| Model | MAE | RMSE | R² |
|---|---:|---:|---:|
| Tylko powierzchnia V-2 | 137,74 | 163,79 | 0,045 |
| Wstępny koszt V-5 | 33,56 | 48,93 | 0,915 |

Model wykorzystujący wstępny koszt osiągnął $R^2$ na poziomie około 0,915.

Nie powinno to szczególnie zaskakiwać. V-5 jest bezpośrednio związane z wartością, którą chcemy przewidzieć. Wstępny koszt jest znacznie silniejszym predyktorem kosztu końcowego niż sama powierzchnia.

Pokazuje to jedną z podstawowych zasad machine learningu:

> Jakość danych wejściowych jest często ważniejsza niż złożoność algorytmu.

---

## 7. Skąd model wie, że popełnia błąd?

Dla każdej obserwacji możemy porównać wynik rzeczywisty z przewidywaniem:

$$
e_i = y_i - \hat{y}_i
$$

Wartość $e_i$ nazywamy resztą albo błędem predykcji.

Załóżmy, że rzeczywisty koszt wynosi 300 jednostek, a model przewiduje 270:

$$
e = 300 - 270 = 30
$$

Dla innego projektu model może przewidzieć 340 przy rzeczywistym wyniku 300:

$$
e = 300 - 340 = -40
$$

Dodatnie i ujemne błędy mogłyby się wzajemnie znosić. Z tego powodu w klasycznej regresji liniowej często wykorzystujemy kwadraty błędów:

$$
L
=
\frac{1}{n}
\sum_{i=1}^{n}
(y_i - \hat{y}_i)^2
$$

Jest to **funkcja straty**.

Informuje model, jak źle aktualna funkcja pasuje do danych. Duże pomyłki są karane mocniej, ponieważ błąd zostaje podniesiony do kwadratu.

Klasyczna regresja liniowa metodą najmniejszych kwadratów dobiera współczynniki tak, aby minimalizować sumę kwadratów różnic pomiędzy wartościami rzeczywistymi i przewidywanymi.

---

## 8. Optymalizacja, czyli poszukiwanie najlepszych parametrów

Model nie „rozumie”, czym jest budynek, koszt ani powierzchnia.

Rozwiązuje problem matematyczny:

$$
\underset{b_0,b_1}{\operatorname{argmin}}
\sum_{i=1}^{n}
\left(
y_i - (b_0 + b_1x_i)
\right)^2
$$

Możemy przeczytać ten zapis następująco:

> Znajdź takie wartości $b_0$ i $b_1$, dla których całkowity błąd będzie możliwie mały.

Dla regresji liniowej problem może zostać rozwiązany przy użyciu metod algebry liniowej. W bardziej rozbudowanych modelach parametry są często znajdowane iteracyjnie.

Niezależnie od użytego algorytmu podstawowa idea pozostaje podobna:

1. model wykonuje predykcję,
2. funkcja straty mierzy błąd,
3. optymalizacja zmienia parametry,
4. proces prowadzi do lepszego dopasowania.

Trenowanie regresji polega więc nie tylko na dopasowaniu dowolnej prostej do punktów. Jest to formalny problem optymalizacyjny: definiujemy funkcję straty, a następnie szukamy takich parametrów modelu, dla których wartość tej funkcji jest najmniejsza.

---

## 9. Dlaczego nie oceniamy modelu na danych treningowych?

Model może bardzo dobrze dopasować się do projektów, które już widział, ale źle przewidywać koszty nowych inwestycji.

Dlatego zbiór dzielimy na dane treningowe i testowe.

Dane treningowe służą do znalezienia współczynników funkcji. Dane testowe są odkładane na bok i wykorzystywane dopiero po zakończeniu treningu.

Jest to matematyczny odpowiednik sytuacji projektowej:

- model uczy się na zakończonych inwestycjach,
- następnie otrzymuje dane nowego projektu,
- jego przewidywanie porównujemy z wynikiem, którego nie znał podczas treningu.

Najważniejszym celem nie jest idealne odtworzenie historii.

Celem jest **generalizacja**, czyli poprawne działanie dla nowych przypadków.

---

## 10. Regresja wielowymiarowa

Rzeczywisty projekt jest opisany przez więcej niż jeden parametr.

Rozszerzamy więc model:

$$
\hat{y}
=
b_0
+
b_1x_1
+
b_2x_2
+
\ldots
+
b_px_p
$$

W naszym przykładzie wykorzystujemy:

- lokalizację V-1,
- powierzchnię budynku V-2,
- powierzchnię działki V-3,
- wstępny koszt V-5,
- koszt przeliczony na rok bazowy V-6,
- czas realizacji V-7,
- cenę jednostkową na początku projektu V-8.

Pomijamy V-4, ponieważ jest bezpośrednio wyliczane z V-2 i V-5.

Lokalizacja jest kodem, a nie ciągłą wartością liczbową. Nie powinniśmy więc zakładać, że lokalizacja oznaczona numerem 5 jest matematycznie „większa” niż lokalizacja numer 2.

Zmienną V-1 kodujemy metodą **one-hot encoding**, tworząc osobną kolumnę dla każdej kategorii lokalizacji.

Przykładowe wyniki modelu wielowymiarowego:

| Model | MAE | RMSE | R² |
|---|---:|---:|---:|
| Tylko powierzchnia V-2 | 137,74 | 163,79 | 0,045 |
| Wstępny koszt V-5 | 33,56 | 48,93 | 0,915 |
| Zestaw parametrów projektu | 24,22 | 32,68 | 0,962 |

Dodanie informacji o projekcie poprawiło wynik do około:

$$
R^2 = 0{,}962
$$

Model wyjaśnia więc około 96% zróżnicowania wyników w tym konkretnym zbiorze testowym.

Nie oznacza to jednak, że potrafimy przewidywać koszty dowolnych budynków z dokładnością 96%.

Wynik dotyczy:

- określonego datasetu,
- określonego rynku,
- określonego sposobu podziału danych,
- projektów podobnych do tych, na których model został wytrenowany.

---

## 11. Jak interpretować metryki?

### MAE — średni błąd bezwzględny

MAE oblicza średnią wartość bezwzględną różnic pomiędzy wynikami rzeczywistymi i przewidywanymi:

$$
MAE
=
\frac{1}{n}
\sum_{i=1}^{n}
|y_i - \hat{y}_i|
$$

Dla modelu wielowymiarowego MAE wynosi około 24,22 jednostki datasetu.

Oznacza to, że przeciętne przewidywanie różni się od rzeczywistego wyniku o około 24 jednostki.

### RMSE — pierwiastek średniego błędu kwadratowego

$$
RMSE
=
\sqrt{
\frac{1}{n}
\sum_{i=1}^{n}
(y_i - \hat{y}_i)^2
}
$$

RMSE silniej reaguje na duże pomyłki.

Jeżeli większość predykcji jest dobra, ale kilka projektów zostanie oszacowanych bardzo źle, RMSE może być znacznie większe od MAE.

W naszym przypadku:

$$
RMSE \approx 32{,}68
$$

### R² — współczynnik determinacji

R² opisuje, jaką część zmienności wyników model jest w stanie wyjaśnić.

Najlepsza możliwa wartość wynosi 1. Model przewidujący zawsze średnią wartość osiąga w typowym przypadku R² bliskie zeru. Wynik może być również ujemny, jeśli model działa gorzej od takiego prostego punktu odniesienia.

R² należy jednak zawsze analizować razem z błędem wyrażonym w rzeczywistych jednostkach.

Model może uzyskać wysokie R², a mimo to popełniać błędy zbyt duże z punktu widzenia decyzji biznesowej.

---

## 12. Implementacja w Pythonie

Poniższy kod odtwarza główny eksperyment.

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


# Pierwszy wiersz pliku zawiera nazwy grup,
# a drugi właściwe identyfikatory zmiennych.
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
    "V-6",  # koszt przeliczony na rok bazowy
    "V-7",  # czas realizacji
    "V-8",  # cena jednostkowa na początku projektu
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

Dla przyjętego podziału danych możemy otrzymać wyniki zbliżone do:

```text
MAE:  24.22
RMSE: 32.68
R²:   0.962
```

---

## 13. Czy model rzeczywiście nauczył się kosztów budowy?

Tutaj potrzebna jest ostrożność.

Model uzyskał dobry wynik głównie dlatego, że w danych znajdują się parametry bezpośrednio związane z kosztami:

- wstępne oszacowanie kosztu,
- koszt przeliczony na rok bazowy,
- cena jednostkowa na początku projektu.

Model nie przewiduje kosztu wyłącznie na podstawie geometrii budynku.

W dużym stopniu koryguje wcześniejsze oszacowanie na podstawie zależności obserwowanych w historycznych projektach.

To nadal może być wartościowe zastosowanie.

System mógłby odpowiadać na pytanie:

> Jakiego odchylenia od wstępnego budżetu możemy oczekiwać, biorąc pod uwagę parametry projektu i historię podobnych inwestycji?

Nie należy jednak przedstawiać go jako narzędzia, które samodzielnie wykonuje kompletny kosztorys na podstawie modelu 3D.

---

## 14. Korelacja nie oznacza przyczynowości

Regresja znajduje zależności występujące w danych.

Jeżeli projekty o dłuższym czasie realizacji mają wyższe koszty, model może przypisać dodatni współczynnik czasowi budowy.

Nie oznacza to automatycznie, że wydłużenie harmonogramu zawsze powoduje wzrost kosztu dokładnie o wartość wynikającą ze współczynnika.

Na koszt i czas mogą jednocześnie wpływać:

- skomplikowanie budynku,
- standard wykonania,
- sytuacja gospodarcza,
- dostępność materiałów,
- wielkość zespołu,
- zmiany projektowe.

Dodatkowym problemem są skorelowane cechy. Gdy kilka kolumn opisuje podobną informację, współczynniki regresji liniowej mogą być niestabilne i trudne do bezpośredniej interpretacji.

Model może dobrze przewidywać wynik, ale jednocześnie niepoprawnie przedstawiać „wpływ” pojedynczej zmiennej.

---

## 15. Problem podziału danych w czasie

W przedstawionym eksperymencie zastosowaliśmy losowy podział danych.

Jest on wygodny do nauki, ale w przypadku kosztów budowy nie zawsze będzie najlepszym rozwiązaniem.

Koszty zmieniają się w czasie. Przy losowym podziale projekty z podobnego okresu mogą znaleźć się zarówno w zbiorze treningowym, jak i testowym.

W bardziej realistycznym eksperymencie należałoby:

1. posortować projekty chronologicznie,
2. wytrenować model na starszych inwestycjach,
3. sprawdzić go na projektach rozpoczętych później.

Po zastosowaniu takiego uproszczonego podziału chronologicznego wynik modelu może być słabszy, ale bardziej zbliżony do rzeczywistego przewidywania przyszłości.

Podział danych należy wykonywać przed uczeniem transformacji i modelu. W przeciwnym razie informacje ze zbioru testowego mogą przeniknąć do procesu treningowego, prowadząc do zbyt optymistycznych wyników.

---

## 16. Gdzie znajduje się BIM?

Sam model Revit lub IFC nie jest jeszcze datasetem gotowym do machine learningu.

Aby zbudować podobne rozwiązanie w firmie projektowej, potrzebowalibyśmy powtarzalnego procesu:

**Model BIM → ekstrakcja parametrów → tabela projektów → wyniki rzeczywiste → trening modelu → predykcja**

Poszczególne etapy obejmują:

1. pobranie geometrii i parametrów z modelu BIM,
2. przekształcenie informacji w uporządkowaną tabelę,
3. połączenie parametrów projektu z rzeczywistymi wynikami,
4. wytrenowanie modelu regresyjnego,
5. wykorzystanie modelu do analizy nowego projektu.

Dla każdego projektu należałoby zapisać w ujednolicony sposób:

- powierzchnie,
- objętości,
- liczbę kondygnacji,
- liczbę elementów,
- długości instalacji,
- typ konstrukcji,
- standard wyposażenia,
- harmonogram,
- koszt wstępny,
- koszt końcowy.

Największym wyzwaniem nie musi być wybór algorytmu.

Trudniejsze może okazać się:

- zachowanie spójnych nazw parametrów,
- ujednolicenie jednostek,
- przypisanie danych do odpowiednich etapów projektu,
- połączenie modelu BIM z kosztami rzeczywistymi,
- ustalenie, która wersja modelu odpowiada danemu oszacowaniu,
- zebranie wystarczającej liczby zakończonych projektów.

Machine learning zaczyna się dopiero wtedy, gdy historia projektów zostanie zamieniona w uporządkowany dataset.

---

## 17. Jak przełożyć ten przykład na MEP?

Analogiczny model można zbudować dla instalacji sanitarnych, HVAC lub elektrycznych.

Danymi wejściowymi mogłyby być:

- powierzchnia budynku,
- kubatura,
- liczba kondygnacji,
- liczba pomieszczeń,
- długość kanałów,
- długość rur,
- liczba urządzeń,
- liczba pionów,
- liczba przyborów sanitarnych,
- rodzaj systemu,
- wymagany standard,
- gęstość elementów instalacji.

Przewidywaną wartością mogłyby być:

- koszt instalacji HVAC,
- koszt instalacji wodociągowej,
- liczba roboczogodzin,
- czas modelowania,
- liczba kolizji,
- masa materiałów,
- liczba zmian projektowych,
- przewidywane zużycie energii.

Przykładowa funkcja mogłaby mieć postać:

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

Warto jednak rozróżniać predykcję danych historycznych od obliczeń opartych na fizyce.

Spadek ciśnienia, przepływ czy zapotrzebowanie cieplne można wyznaczać za pomocą modeli fizycznych i normowych. Machine learning może pełnić rolę:

- szybkiego modelu zastępczego,
- narzędzia do wstępnego szacowania,
- systemu wykrywającego nietypowe wyniki,
- mechanizmu porównującego projekt z historią,
- wsparcia decyzji na wczesnym etapie.

Nie powinien bez odpowiedniej walidacji zastępować wymaganych obliczeń inżynierskich.

---

## 18. Ograniczenia eksperymentu

Residential Building Dataset jest dobrym materiałem edukacyjnym, ale ma istotne ograniczenia.

Po pierwsze, obejmuje tylko 372 obserwacje. Jest to niewielki zbiór w porównaniu z liczbą dostępnych zmiennych.

Po drugie, dane dotyczą konkretnego, historycznego rynku w Teheranie. Model nie może zostać bezpośrednio wykorzystany do przewidywania aktualnych kosztów budowy w Polsce.

Po trzecie, dane finansowe zapisano w irańskich rialach i według lokalnych warunków ekonomicznych.

Po czwarte, wśród cech znajdują się wcześniejsze oszacowania kosztu. Wysoki wynik nie oznacza więc, że model potrafi określić koszt wyłącznie na podstawie modelu geometrycznego.

Po piąte, zmienne są ze sobą silnie powiązane. Niektóre są bezpośrednio wyliczone z innych wartości.

Dlatego model należy traktować jako demonstrację mechanizmu regresji, a nie gotowy produkt biznesowy.

---

## 19. Najważniejszy wniosek

Regresja jest jednym z najbardziej praktycznych sposobów wykorzystania machine learningu w branży AEC.

Nie wymaga rozpoczęcia od sieci neuronowych ani dużych modeli językowych.

W najprostszej wersji potrzebujemy:

1. historii projektów,
2. zestawu cech wejściowych,
3. wartości, którą chcemy przewidywać,
4. funkcji opisującej zależność,
5. sposobu mierzenia błędu,
6. procesu optymalizacji,
7. danych testowych pozwalających sprawdzić generalizację.

W naszym eksperymencie powierzchnia budynku nie wystarczyła do dokładnego przewidywania kosztu. Znacznie lepszy wynik uzyskaliśmy, wykorzystując wstępne informacje finansowe i projektowe.

Nie stworzyliśmy w ten sposób automatycznego kosztorysanta.

Pokazaliśmy jednak podstawowy mechanizm, na którym można budować bardziej zaawansowane rozwiązania:

**Dane z projektów → dopasowanie funkcji → ocena błędu → predykcja nowego projektu**

Model BIM nie jest jeszcze sztuczną inteligencją.

Może jednak stać się uporządkowanym źródłem danych, na podstawie których algorytmy uczą się zależności występujących w rzeczywistych projektach.

I właśnie w tym miejscu matematyka, machine learning oraz BIM zaczynają tworzyć jeden wspólny proces.

---

## Źródła

- Hala Nelson, *Essential Math for AI: Next-Level Mathematics for Efficient and Successful AI Systems*.
- [Residential Building Data Set — UCI Machine Learning Repository](https://archive.ics.uci.edu/dataset/437/residential+building+data+set)
- [LinearRegression — scikit-learn](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html)
- [train_test_split — scikit-learn](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html)
- [Regression metrics — scikit-learn](https://scikit-learn.org/stable/modules/model_evaluation.html#regression-metrics)
- [Common pitfalls and recommended practices — scikit-learn](https://scikit-learn.org/stable/common_pitfalls.html)
