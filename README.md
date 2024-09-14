# Save My Health - Personalized Health Recommendations App

<img src="frontend/assets/images/icon.png" alt="Save My Health Logo" style="width:300px;"/>

[**Save My Health**](https://savemyhealth.aeylabs.com) is an AI-powered web application designed not just for simple health improvements, but also for people who may be living dangerously unhealthy lifestyles. Whether you’re struggling to find a way to improve or don’t know where to start, this app will clearly show the exact steps you need to take—potentially saving your life. By inputting basic personal and health information, users receive tailored advice on diet, exercise, habits, and stress management, all based on their unique profiles and supported by cutting-edge scientific findings in the longevity and wellness space.

## Features

- **Personalized Health Dashboard**: After submitting personal data, users receive a personalized dashboard displaying their estimated life expectancy and lifetime medical costs.
- **Actionable Health Tips**: Users are provided with practical health advice in four key areas. By focusing on four easy to understand areas which someone of any level of physical and mental health can focus on, Save My Health is accessible to the broadest audience. You don't need to be obsessed with your wellbeing or learn much about how your body works to start making improvements, just follow the steps Save My Health suggests and start feeling better immediately. The areas are:
  - **Diet**: Suggestions for improving dietary habits, focusing on longevity.
  - **Exercise**: Recommendations for physical activities suited to the user’s current fitness level.
  - **Habits**: Strategies for reducing harmful habits (e.g., smoking, alcohol consumption).
  - **Stress**: Techniques for managing stress based on the user's stress levels and lifestyle.
- **User-Friendly Interface**: The intuitive and sleek design makes it easy to input health data and receive customized results in real-time.

## How It Works

1. **Input Data**: Users enter personal and health-related information, including age, weight, height, activity levels, sleep habits, and more.
2. **Data Processing**: The app calculates life expectancy and lifetime medical costs using an internal algorithm based on user input.
3. **Personalized Recommendations**: Based on the user's profile and scientific insights into longevity, the app generates actionable health recommendations.
4. **Monitor Progress**: Users can track improvements in their health metrics over time by adjusting their inputs and observing the changes in recommendations and outcomes.

## Datasets:
- **NOVOS: Longevity Guide Blogs**: Unstructured text [data](https://novoslabs.com/live-longer-slow-aging-life-extension-blog/) used to generate personalized health tips and advice. This dataset includes longevity and lifestyle guides curated from NOVOS research.
- **Medical Cost Personal Dataset**: Based on "Machine Learning with R" by Brett Lantz, this dataset contains anonymized personal health information related to insurance costs.
- **Longevity Factors**: A collection of variables including age, sex, smoking habits, BMI, exercise frequency, sleep patterns, and more, derived from various health and longevity studies.

## Models:
- **Weighted Sum Average - Life Expectancy**: Life expectancy is estimated using a weighted sum average method based on key longevity factors such as age, exercise, sleep, and alcohol consumption.
- **Random Forest Regression - Medical Cost**: A Random Forest Regression model is used to predict lifetime medical insurance costs. This model is trained on the Medical Cost Personal Dataset.
- **Language Model - Actionable Items**: The system leverages a language model, utilizing in-context learning based on NOVOS research, to generate personalized health tips in optimal JSON format and return it to the frontend interface for easy display.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Flask
- **Libraries**: 
  - `Flask`: For serving the web application.
  - `requests`: For handling API requests.
  - `pandas`: For data manipulation.
  - `scikit-learn`: For the machine learning model that generates health predictions.
  - `numpy`: For numerical operations.

## Use

To use the app, go to https://savemyhealth.aeylabs.com and get personalized health advice now.
