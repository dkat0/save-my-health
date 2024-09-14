# Save My Health App

## Overview

**Let's Live Longer** is an AI-powered longevity tool designed to provide personalized health insights and actionable steps to help users improve their health and increase their life expectancy. The app leverages AI models and the latest scientific research to offer recommendations on diet, exercise, habits, and stress management while predicting future medical costs and life expectancy based on user input.

## Features

1. **Personalized Dashboard**:
   - Enter your personal data and lifestyle habits (age, sex, height, weight, sleep hours, exercise frequency, weekly alcohol consumption, smoker status, etc.).

2. **Life Expectancy & Medical Cost Predictions**:
   - The app calculates your projected life expectancy and lifetime medical insurance costs based on your input data and lifestyle habits.
   - These predictions are backed by scientific models and research data, utilizing advanced machine learning (ML) methods and curated datasets.

3. **Actionable Health Tips**:
   - Get AI-generated tips on improving various aspects of your lifestyle, including diet, exercise, habits, and stress management.
   - Suggested changes are presented in a accessible, easy-to-implement format.
   - Leverages NOVOS database on longevity, by leading MIT and Harvard researchers.

4. **App Insights**:
   - Learn how the app calculates your health metrics.

## Technical Details

### Datasets:
- **NOVOS: Longevity Guide Blogs**: Unstructured text [data](https://novoslabs.com/live-longer-slow-aging-life-extension-blog/) used to generate personalized health tips and advice. This dataset includes longevity and lifestyle guides curated from NOVOS research.
- **Medical Cost Personal Dataset**: Based on "Machine Learning with R" by Brett Lantz, this dataset contains anonymized personal health information related to insurance costs.
- **Longevity Factors**: A collection of variables including age, sex, smoking habits, BMI, exercise frequency, sleep patterns, and more, derived from various health and longevity studies.

### Models:
- **Weighted Sum Average - Life Expectancy**: Life expectancy is estimated using a weighted sum average method based on key longevity factors such as age, exercise, sleep, and alcohol consumption.
- **Random Forest Regression - Medical Cost**: A Random Forest Regression model is used to predict lifetime medical insurance costs. This model is trained on the Medical Cost Personal Dataset.
- **Language Model - Actionable Items**: The system leverages a language model, utilizing in-context learning based on NOVOS research, to generate personalized health tips in optimal JSON format and return it to the frontend interface for easy display.
