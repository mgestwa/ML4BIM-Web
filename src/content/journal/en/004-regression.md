---
title: "Regression in BIM 5D: Fitting a Function to Data and Predicting Construction Costs"
description: "An accessible introduction to regression and the mathematics behind machine learning for BIM, AEC and MEP, using the Residential Building Dataset."
date: 2026-10-06
tags: ["bim", "ai", "regression", "mep", "5d"]
thumbnail: "/journal/004-regresja/miniaturka.png"
translationSlug: "004-regresja"
draft: false
author: "Mateusz"
project: "ML4BIM"
language: "en"
---

## An accessible introduction to AI and machine learning for BIM, AEC and MEP

Imagine that we are starting a new residential building project.

At an early stage, we already know a few basic details:

- the approximate building area,
- the plot area,
- the project location,
- the expected construction duration,
- the preliminary unit cost,
- the estimated budget.

What we do not know is the final construction cost. That will only become clear once the project is complete.

However, if we have data from many completed projects, we can ask:

> Can we use the information available at the start of a project to predict its actual cost?

This is a typical **regression** problem: predicting a numerical value.

In this article, we will use construction costs as an educational example. The aim is to understand the mathematical mechanism behind one of the fundamental tasks in machine learning, rather than to build a complete cost-estimating system.

**problem → data → model function → loss function → optimisation → evaluation on new data**

The BIM 5D example, the Residential Building Dataset, the Python code and the AEC interpretation form our practical adaptation of these ideas.

## 1. Regression: predicting a numerical value

Regression is a machine learning task in which the model outputs a number.

In the AEC industry, this might be:

- the construction cost,
- the cost of an HVAC installation,
- the construction duration,
- the number of labour hours,
- energy consumption,
- the required heating capacity,
- the mass of a building services installation,
- the length of service runs,
- the expected number of clashes.

We usually denote the input data by $x$ and the value we want to predict by $y$.

The model produces a prediction:

$$
\hat{y} = f(x)
$$

where:

- $x$ is the input data,
- $y$ is the actual value,
- $\hat{y}$ is the predicted value,
- $f$ is the function describing the relationship between the input and the output.

In our example:

- $x$ may represent the project parameters,
- $y$ is the actual construction cost,
- $\hat{y}$ is the cost predicted by the model.

## 2. Machine learning as fitting a function to data

In conventional programming, a person writes the rule.

For example:

$$
\text{Cost}
=
\text{area}
\cdot
\text{unit cost}
$$

The person specifies both the formula and all its parameters.

Machine learning works differently.

First, we choose a **family of functions**. Then we use data to find the function parameters that best fit the observations.

For simple linear regression:

$$
\hat{y} = b_0 + b_1x
$$

where:

- $b_0$ is the intercept,
- $b_1$ is the slope,
- $x$ is the input feature,
- $\hat{y}$ is the predicted value.

The algorithm is not given fixed values for $b_0$ and $b_1$.

It has to determine them from the data.

This gives us three key elements:

1. **The model function**: how the model calculates a prediction.
2. **The loss function**: how we measure the quality of the prediction.
3. **Optimisation**: how we find the parameters that minimise the loss.

This structure matters much more than the choice of a particular library or algorithm.

## 3. The model function

The function being fitted during training is sometimes called a **training function**. Here, we will use **model function**; other terms include hypothesis function, prediction function, or simply model.

In linear regression, the model function can be:

$$
f(x) = b_0 + b_1x
$$

For each input value $x$, the model calculates:

$$
\hat{y} = b_0 + b_1x
$$

Suppose we are trying to predict the construction cost using only the building area.

The model might take the form:

$$
\widehat{\text{cost}}
=
20 + 0.35 \cdot \text{area}
$$

If the area is 500 units, the model returns:

$$
\widehat{\text{cost}}
=
20 + 0.35 \cdot 500
=
195
$$

The value 195 is a **prediction**.

That does not yet tell us whether the model is any good.

We need to compare the prediction with the actual value.

## 4. The Residential Building Dataset

For this experiment, we will use the **Residential Building Dataset** from the UCI Machine Learning Repository.

The dataset covers residential projects in Tehran and contains 372 observations. UCI lists regression among its supported tasks.

The data include:

- 8 physical and financial project variables,
- 19 economic indicators recorded at 5 time lags, giving 95 values in total,
- 2 output variables: the actual sale price and the actual construction cost.

Our example focuses on **V-10: actual construction cost**.

The initial project variables can be interpreted as follows:

| Variable | Meaning | Potential source in a BIM workflow |
|---|---|---|
| V-1 | Project location | Project data / GIS |
| V-2 | Total building area | Revit / IFC |
| V-3 | Plot area | Site model / GIS |
| V-4 | Total preliminary construction cost | BIM 5D / cost estimate |
| V-5 | Preliminary estimated unit cost | Cost database |
| V-6 | Cost adjusted to the base year | Cost database / indexation |
| V-7 | Construction duration | Programme / BIM 4D |
| V-8 | Unit price at the start of the project | Market data |
| V-10 | Actual construction cost | ERP / as-built records |

Not all of these data come directly from BIM geometry.

In a real workflow, we can combine them:

**Revit / IFC → geometry and quantities**

**BIM 4D → programme**

**BIM 5D → cost estimate**

**ERP / project database → actual costs**

Together, they form a dataset suitable for training a model.

## 5. Predicted values and actual values

For each observation, we have two values:

- $y_i$: the actual value,
- $\hat{y}_i$: the value predicted by the model.

We can write the difference between them as:

$$
e_i = y_i - \hat{y}_i
$$

We call $e_i$ the **residual**, or prediction error.

For example:

- actual cost: 300,
- predicted cost: 270.

Then:

$$
e = 300 - 270 = 30
$$

For another project:

- actual cost: 300,
- predicted cost: 340.

We obtain:

$$
e = 300 - 340 = -40
$$

The sign tells us whether the model underestimated or overestimated the result.

To assess the model as a whole, however, we need a single value that summarises the errors across all observations.

This is where the **loss function** comes in.

## 6. The loss function

The loss function answers the question:

> How poorly does our current model function fit the data?

We can express it symbolically as:

$$
L = L(y, \hat{y})
$$

The lower the loss, the better the model fits the data according to our chosen criterion.

There is no single loss function that is best for every problem.

The choice of loss function determines which errors the model treats as particularly important.

## 7. Absolute error and squared error

The simplest idea is to measure the absolute difference:

$$
|y_i - \hat{y}_i|
$$

For an error of $-40$, we get:

$$
|-40| = 40
$$

Taking the absolute value prevents positive and negative errors from cancelling each other out.

This gives us **MAE: Mean Absolute Error**:

$$
MAE
=
\frac{1}{n}
\sum_{i=1}^{n}
|y_i - \hat{y}_i|
$$

Another approach is to square the error:

$$
(y_i - \hat{y}_i)^2
$$

This gives us **MSE: Mean Squared Error**:

$$
MSE
=
\frac{1}{n}
\sum_{i=1}^{n}
(y_i - \hat{y}_i)^2
$$

The difference matters.

For errors of 2 and 10:

- the absolute values are 2 and 10,
- the squared values are 4 and 100.

A large error therefore receives a much greater penalty.

### What does squaring give us mathematically?

The function:

$$
e^2
$$

is smooth and differentiable.

By contrast, the function:

$$
|e|
$$

has a sharp corner at $e=0$ and no ordinary derivative at that point.

This matters for optimisation because derivatives are one of the main tools used to locate a function's minima.

It does not make MAE a “bad” loss function. It simply behaves differently from MSE mathematically.

## 8. MSE is a natural loss function for linear regression

For linear regression:

$$
\hat{y}_i = b_0 + b_1x_i
$$

we can substitute the prediction directly into the loss function:

$$
L(b_0,b_1)
=
\frac{1}{n}
\sum_{i=1}^{n}
\left[
y_i-(b_0+b_1x_i)
\right]^2
$$

Now the loss is expressed as a function of the model parameters:

$$
L = L(b_0,b_1)
$$

One set of coefficients produces a higher loss; another produces a lower one.

Training the model means finding the parameters that make this loss as small as possible.

That is an optimisation problem.

## 9. Optimisation: minimising the loss function

We can write the objective as:

$$
(b_0^*,b_1^*)
=
\underset{b_0,b_1}{\operatorname{argmin}}
\;
L(b_0,b_1)
$$

The symbol `argmin` means:

> Find the arguments of the function at which its value is smallest.

We are looking for the model parameters that produce the minimum, rather than just the minimum value itself.

In our case, we:

- change $b_0$,
- change $b_1$,
- observe the MSE,
- look for the combination that produces the smallest error.

We can therefore think of training a regression model as:

**parameters → prediction → loss → search for better parameters**

## 10. Analytical and numerical solutions

### Analytical solution

For classical linear regression, the least-squares problem has a solution that can be found using linear algebra.

We do not necessarily need thousands of small iterations.

We can solve the mathematical problem directly.

In practice, numerical libraries use stable linear algebra algorithms to solve the least-squares problem.

### Numerical solution

For more complex models, finding an analytical solution may be difficult or impossible.

We then use iterative methods:

1. Start with an initial set of parameters.
2. Calculate the loss.
3. Identify a direction in which the loss decreases.
4. Update the parameters.
5. Repeat the process.

**Gradient descent** is one example.

It helps to distinguish two things:

> Optimisation is the problem: find the minimum of the loss function.

> Gradient descent is one possible way to solve that problem.

In our example, scikit-learn's `LinearRegression` solves the classical least-squares problem. We do not need to implement gradient descent to fit a straight line.

## 11. Convexity and the minimiser

Imagine that the graph of the loss function looks like a bowl.

The minimum lies at its lowest point.

For classical linear regression with MSE, the loss function is **convex** with respect to the model parameters.

This is a useful property.

In simple terms, there are no separate “valleys” that trap us in different, suboptimal local minima.

Moving towards a minimum can therefore lead us to a globally optimal solution.

For more complex models, such as deep neural networks, the loss landscape can be much more complicated.

Linear regression is therefore a good starting point for understanding the basics of optimisation.

## 12. The derivative as a clue to the minimum

For a simple function of one variable, the minimum often occurs where:

$$
\frac{dL}{dw} = 0
$$

The derivative tells us how quickly, and in which direction, the function changes.

If:

$$
\frac{dL}{dw} > 0
$$

the function increases as $w$ increases.

If:

$$
\frac{dL}{dw} < 0
$$

the function decreases.

At a minimum, the slope may be zero:

$$
\frac{dL}{dw}=0
$$

With multiple regression, we have several parameters at once, so we use partial derivatives and the gradient instead of a single derivative.

We do not have to work through all the calculus by hand to understand the idea:

> A minimum of the loss function corresponds to model parameters for which a further small change no longer improves the fit.

## 13. Multiple regression and vector notation

A real project is not described by just one feature.

We might have:

$$
x_1 = \text{area}
$$

$$
x_2 = \text{construction duration}
$$

$$
x_3 = \text{preliminary cost}
$$

and further variables.

The regression then takes the form:

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

We can write the features as a column vector:

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

and the coefficients as:

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

The equation becomes much shorter:

$$
\hat{y}
=
\mathbf{w}^T\mathbf{x}
+
b
$$

It is the same model.

Only the mathematical notation has changed.

Vector notation will become especially useful when we get to neural networks, where operations involving many inputs and weights occur all the time.

## 14. Training, validation and test sets

A good fit to the training data is not enough.

The model needs to work for new projects.

That is why we divide the data into separate subsets.

### Training set

This is used to determine the model parameters:

$$
b_0,\;b_1,\;\mathbf{w}
$$

These are the data on which we minimise the loss function.

### Validation set

This is used to make decisions about the model.

We can use it to compare:

- different algorithms,
- sets of features,
- preprocessing approaches,
- hyperparameters.

The validation set should not be used for the final evaluation of the model.

### Test set

This should remain unseen until the end.

It answers the question:

> How well does the model handle new data that we did not use to build or select it?

In our simple code example, we will use a **train/test** split because we are not carrying out extensive hyperparameter tuning.

In a real ML project, especially when comparing many alternatives, we should use:

**train → validation → test**

or an appropriate cross-validation method.

## 15. Highly correlated features

Project data often contain several parameters that describe almost the same information.

For example:

- area,
- unit cost,
- total cost.

If:

$$
\text{total cost}
=
\text{area}
\cdot
\text{unit cost}
$$

these three variables are not independent.

A similar issue occurs in the Residential Building Dataset.

For example, V-4 is calculated from other cost and area parameters.

If we include many highly correlated features in a regression model, it may still predict well, but interpreting individual coefficients becomes harder.

The weights may be unstable.

We should not automatically interpret a large coefficient as evidence that a feature “causes” the cost to change.

This leads to an important principle:

> Prediction and causal interpretation are two different problems.

## Practical section: regression with BIM 5D data

## 16. First experiment: is area enough?

Let us start with the simplest question:

> Is the total building area enough to predict the actual construction cost?

The model:

$$
\widehat{V10}
=
b_0
+
b_1V2
$$

We split the data:

- 80% for training,
- 20% for testing.

For reproducibility, we use:

```python
random_state=42
```

Our experiment produced approximately the following results:

| Model | MAE | RMSE | R² |
|---|---:|---:|---:|
| Area only, V-2 | 137.74 | 163.79 | 0.045 |

The result is poor.

Area alone explains only a small proportion of the variation in costs.

From an AEC perspective, this makes sense.

Two buildings with similar areas may differ in:

- location,
- specification,
- structural system,
- construction duration,
- material prices,
- economic conditions,
- contractual terms.

Machine learning therefore does more than make predictions.
It also allows us to check whether our intuitive assumptions are supported by the data.

## 17. Second experiment: preliminary cost and actual cost

In the next model, we use V-5: the preliminary cost estimate.

The model is still linear:

$$
\widehat{V10}
=
b_0
+
b_1V5
$$

For our data split, we obtained approximately the following relationship:

$$
\widehat{V10}
=
7.15
+
1.376 \cdot V5
$$

and these results:

| Model | MAE | RMSE | R² |
|---|---:|---:|---:|
| Area only, V-2 | 137.74 | 163.79 | 0.045 |
| Preliminary cost, V-5 | 33.56 | 48.93 | 0.915 |

The preliminary cost is a much better predictor of the final cost than area alone.

However, this does not make the coefficient 1.376 a universal cost relationship.
It is a parameter fitted to a particular dataset.

## 18. Multiple regression

Next, we use more project features:

- V-1: location,
- V-2: building area,
- V-3: plot area,
- V-5: preliminary cost,
- V-6: cost adjusted to the base year,
- V-7: construction duration,
- V-8: unit price.

We omit V-4 because it is directly related to other cost features.

The model takes the form:

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

In our experiment:

| Model | MAE | RMSE | R² |
|---|---:|---:|---:|
| Area only, V-2 | 137.74 | 163.79 | 0.045 |
| Preliminary cost, V-5 | 33.56 | 48.93 | 0.915 |
| Set of project parameters | 24.22 | 32.68 | 0.962 |

Adding project information significantly improved the result.

However, we should not interpret:

$$
R^2 = 0.962
$$

as meaning that the model “predicts costs with 96.2% accuracy”.

R² is not percentage prediction accuracy.

It describes how much of the variation in the target the model explains relative to a simple baseline.

## 19. Training loss and evaluation metrics

We should distinguish two concepts.

### Loss function

This is used to fit the model parameters.

For classical linear regression:

$$
MSE
=
\frac{1}{n}
\sum_{i=1}^{n}
(y_i-\hat{y}_i)^2
$$

### Evaluation metrics

After training, we can use several different measures.

#### MAE

$$
MAE
=
\frac{1}{n}
\sum_{i=1}^{n}
|y_i-\hat{y}_i|
$$

This is easy to interpret because it has the same unit as the predicted value.

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

This is more sensitive to large errors.

#### R²

This compares the model with a simple baseline based on the mean target value.

The best possible value is 1.

A value around 0 means that the model offers little improvement over predicting the mean.

R² can also be negative.

## 20. Python implementation

The following code implements the multiple regression experiment.

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


# The first row contains group headings;
# the next row contains the variable identifiers.
df = pd.read_excel(
    "Residential-Building-Data-Set.xlsx",
    sheet_name="Data",
    header=1,
)

features = [
    "V-1",  # location
    "V-2",  # building area
    "V-3",  # plot area
    "V-5",  # preliminary cost
    "V-6",  # cost adjusted to the base year
    "V-7",  # construction duration
    "V-8",  # unit price
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

The results for this split should be close to:

```text
MAE:  24.22
RMSE: 32.68
R²:   0.962
```

## 21. What did `fit()` actually do?

A single line:

```python
model.fit(X_train, y_train)
```

hides the entire mathematical process.

In simplified terms, we can understand it as follows:

### 1. Model function

The model assumes a linear relationship:

$$
\hat{y}
=
\mathbf{w}^T\mathbf{x}
+
b
$$

### 2. Prediction

Predicted values are calculated for the training data:

$$
\hat{y}_1,\hat{y}_2,\ldots,\hat{y}_n
$$

### 3. Loss function

We compare them with the actual values:

$$
MSE
=
\frac{1}{n}
\sum_{i=1}^{n}
(y_i-\hat{y}_i)^2
$$

### 4. Optimisation

The algorithm finds the parameters:

$$
\mathbf{w},b
$$

that minimise the least-squares error.

### 5. Prediction on new data

After training, we can run:

```python
predictions = model.predict(X_test)
```

The model uses the parameters it has already learned.

It does not train again.

## 22. Do we need a validation set in this example?

The code uses:

**train → test**

This is a deliberate simplification.

We are not tuning parameters such as:

- tree depth,
- the number of trees,
- the learning rate,
- polynomial degree,
- regularisation strength.

If we started comparing many models and selecting the best based on their results, we should not keep using the test set to make those decisions.

The appropriate workflow would then be:

**train → validation → test**

or:

**train + cross-validation → final test**

The test set should remain the final exam.

## 23. The problem of data that change over time

Construction costs are not stationary.

The following change over time:

- material prices,
- labour rates,
- inflation,
- contractor availability,
- economic conditions.

A random data split can therefore give an overly optimistic picture.

If a project from 2007 is in the training set and a very similar project from the same period is in the test set, the task is easier than predicting the future in practice.

For a real cost-prediction system, it is worth considering a chronological split:

**older projects → training**

**newer projects → validation / testing**

This better reflects the question:

> Can we use historical data to predict the outcome of a future project?

## 24. Has the model really learned construction costs?

A high R² can look impressive.

However, we need to look at the input features.

The model receives, among other things:

- a preliminary cost estimate,
- a cost adjusted to the base year,
- a unit price.

It is therefore not predicting the cost from building geometry alone.

To a large extent, it is learning the relationship between an earlier estimate and the actual cost.

That can still be a valuable application.

The model can answer the question:

> How much deviation from the preliminary estimate should we expect, based on the history of similar projects?

That is a different task from:

> How much will a building cost, based only on its 3D model?

Defining the problem clearly is essential.

## 25. Correlation does not imply causation

A regression model finds patterns in the data.

If projects with longer construction durations have higher costs, a regression coefficient may indicate a positive relationship.

This does not automatically mean:

> Extending construction by one month causes the cost to increase by exactly X.

Both duration and cost may be influenced by:

- the scale of the project,
- the specification,
- the level of complexity,
- economic conditions,
- the number of design changes.

A predictive model can perform very well without describing causal relationships.

This is especially relevant in engineering, where it is easy to mistake a correlation found in data for a physical law or a design relationship.

## 26. Where does BIM fit in?

A Revit or IFC model is not yet a machine learning dataset.

We need a repeatable process:

**BIM model → feature extraction → project table → actual outcomes → training → validation → prediction**

For each project, we could collect:

- areas,
- volumes,
- the number of storeys,
- the number of rooms,
- material quantities,
- the lengths of building services runs,
- equipment counts,
- structural system type,
- HVAC system type,
- the programme,
- the preliminary cost,
- the actual cost.

The algorithm itself is often not the biggest challenge.

More difficult tasks may include:

- standardising parameters,
- keeping units consistent,
- identifying model versions,
- linking BIM data to ERP records,
- collecting final outcomes,
- maintaining data quality over many years.

In this sense, BIM can become more than a 3D model.

It can be a **source of features for machine learning models**.

## 27. How can we apply this example to MEP?

We can use the same approach for HVAC, plumbing and electrical systems.

Possible inputs include:

- building area,
- volume,
- the number of storeys,
- the number of rooms,
- the design air flow rate,
- duct length,
- pipe length,
- equipment counts,
- the number of risers,
- the number of fixtures,
- system type,
- project specification.

The predicted value might be:

- the cost of an HVAC installation,
- the number of design labour hours,
- modelling time,
- the number of clashes,
- duct mass,
- pipe mass,
- the number of changes,
- energy consumption.

For example:

$$
\text{HVAC cost}
=
f(
\text{area},
\text{air flow rate},
\text{duct length},
\text{equipment count},
\text{system type}
)
$$

The model could later serve as:

- a quick estimator,
- a surrogate model,
- a tool for checking results,
- an anomaly detection tool,
- support for concept design decisions.

This does not mean automatically replacing physics-based calculations.
If we can calculate pressure drop accurately using the laws of fluid mechanics, we do not need ML just to reproduce a known formula.
Machine learning becomes particularly interesting when a relationship is difficult to describe with a single equation, but we have plenty of useful historical data.

## 28. Limitations of the experiment

The Residential Building Dataset is useful for learning, but it is not a ready-to-deploy dataset for the Polish construction industry.

Its main limitations are:

1. It contains only 372 observations.
2. The data come from a specific historical market in Tehran.
3. The economic conditions differ from those of today.
4. Some features are directly related to earlier cost estimates.
5. Some features are highly correlated.
6. A random split may not reflect the challenge of predicting future projects.
7. Good predictive performance does not establish a causal relationship.

The model should therefore be treated as a demonstration of the mathematics of regression, rather than a complete cost-estimating system.

## 29. The key mathematical lesson

The central structure of this article can be written as follows:

### Model function

$$
\hat{y}=f(x;\theta)
$$

where $\theta$ represents the model parameters.

### Loss function

$$
L(\theta)
=
\frac{1}{n}
\sum_{i=1}^{n}
(y_i-\hat{y}_i)^2
$$

### Optimisation

$$
\theta^*
=
\underset{\theta}{\operatorname{argmin}}
\;
L(\theta)
$$

### Evaluation

After finding $\theta^*$, we test the model on data that it did not use during training.

This is at the heart of much of classical machine learning.

The algorithms may change.

The functions may be linear, polynomial or extremely complex.

The loss functions may take different forms.

The optimisation methods may also differ.

But the basic way of thinking remains similar:

**define a function → measure the error → find the parameters that minimise the error → test the model on new data**

## 30. The key takeaway for BIM and AEC

Regression is not a magical way to predict the future.

It is a mathematical process of fitting a function to data.

In BIM, this means that we can use project parameters as input features and train models to predict values that matter to designers, contractors or clients.

However, we need more than an algorithm:

- a well-defined problem,
- suitable data,
- an appropriate model function,
- a sensible loss function,
- sound optimisation,
- an appropriate data split,
- validation on new cases,
- engineering knowledge to interpret the results.

In our experiment, building area alone was not enough to predict the cost well.

We obtained much better results after adding financial and project data.

We have not created an automated cost estimator.

We have, however, demonstrated a mechanism that could be developed into a real ML4BIM system:

**BIM data + project history → model function → loss function → optimisation → prediction for a new project**

A BIM model is not, by itself, artificial intelligence.

It can, however, become a structured source of data from which algorithms learn relationships found in real projects.

This is where mathematics, machine learning and BIM begin to form a shared process.

## Sources

- Hala Nelson, *Matematyka i sztuczna inteligencja*, Chapter 3: “Dopasowywanie funkcji do danych” (Fitting Functions to Data), Helion, Polish edition.
- Hala Nelson, *Essential Math for AI: Next-Level Mathematics for Efficient and Successful AI Systems*, O’Reilly Media.
- UCI Machine Learning Repository: [Residential Building Dataset](https://archive.ics.uci.edu/dataset/437/residential+building+data+set).
- Dataset DOI: [10.24432/C5S896](https://doi.org/10.24432/C5S896).
- scikit-learn: [LinearRegression](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html).
- scikit-learn: [train_test_split](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html).
- scikit-learn: [Regression metrics](https://scikit-learn.org/stable/modules/model_evaluation.html#regression-metrics).

## What next?

A natural next step is to compare linear regression with a nonlinear model.

We can try the following on the same dataset:

- Random Forest,
- Gradient Boosting,
- XGBoost.

This raises another important question:

> Does a more complex function actually generalise better, or does it merely fit the training data more closely?

That leads directly to the next topics: overfitting, regularisation, cross-validation and model interpretation.
