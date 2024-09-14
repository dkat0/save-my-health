import os
import json
import requests
from flask import Flask, request, jsonify
from lifeExpectancy import calculate_life_expectancy
from medicalcost import InsuranceModel

app = Flask(__name__)

# API keys and OpenAI configuration
OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
OPENAI_MODEL = "gpt-4o-mini"  # Replace with the specific model you wish to use.

with open('prompt.txt', 'r', encoding='utf-8') as file:
    main_prompt_content = file.read()

with open('data_sources/novos_guide.txt', 'r', encoding='utf-8') as file:
    novos_content = file.read()

model = InsuranceModel('insurance.csv')


# OpenAI API headers
def get_openai_headers():
    return {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "OpenAI-Organization": "org-cyO3AnBMoiH2jidsDOz7Bl1Y",
        "OpenAI-Project": "proj_RAzQzPmhTWkHDmZJQwvOsmcI"
    }


# Utility function to make OpenAI API call
def query_openai(prompt):
    url = "https://api.openai.com/v1/chat/completions"
    headers = get_openai_headers()

    data = {
        "model": OPENAI_MODEL,
        "messages": [{
            "role": "user",
            "content": prompt
        }],
    }

    response = requests.post(url, headers=headers, data=json.dumps(data))

    if response.status_code == 200:
        try:
            return response.json()["choices"][0]["message"]["content"]
        except (KeyError, IndexError):
            return "Error: Unexpected response format from OpenAI API"
    else:
        return f"Error: {response.status_code} - {response.text}"


def extract_json_from_string(s):
    start = s.find('{')
    end = s.rfind('}') + 1
    return json.loads(s[start:end])


# API endpoint to query OpenAI
@app.route("/initial_query", methods=["POST"])
def initial_query():
    data = request.get_json()
    input_data = data.get("input_data", {})

    if not input_data:
        return jsonify({"error": "Input data is required"}), 400

    input_data_clean = {}
    maps = {
        "name": "Name",
        "sex": "Sex",
        "age": "Age",
        "weightPounds": "Weight (lbs)",
        "sleepHours": "Average Sleep Hours per Night",
        "exerciseFrequency": "Weekly Exercise Frequency",
        "drinksConsumed": "Drinks Consumed per Week",
        "smoker": "Smoker"
    }
    for k, v in input_data.items():
        if k in maps:
            input_data_clean[maps[k]] = v
        elif k == "heightInches":
            input_data_clean["Height (Inches)"] = round(float(v), 2)
        else:
            input_data_clean[k] = v
    input_data_text = "User Profile:\n" + "\n".join(
        [f"{k}: {v}" for k, v in input_data_clean.items()])

    prompt = main_prompt_content.replace("<<INPUT_DATA>>", input_data_text)
    prompt = prompt.replace("<<SCIENCE_DATA>>", novos_content)

    result = query_openai(prompt)
    suggested_tips = extract_json_from_string(result)

    return jsonify({"response": suggested_tips})


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers[
        "Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response


def get_life_expectancy(input_data):
    bmi = int(float(input_data.get("weightPounds"))) / (int(
        float(input_data.get("heightInches")))**2) * 703
    obese = bmi >= 30
    target_json = {
        "age":
        input_data.get("age"),
        "sex":
        input_data.get("sex").lower(),
        "smoking":
        "yes" if input_data.get("smoker") else "no",
        "sleeping_more_than_8hrs":
        "no" if float(input_data.get("sleepHours")) < 8 else "yes",
        "alcohol_abuse":
        "yes" if float(input_data.get("drinksConsumed")) > 10 else "no",
        "city_living":
        "yes" if input_data.get("city") else "no",
        "married":
        "yes" if input_data.get("married") else "no",
        "exercise_150min":
        "yes" if float(input_data.get("exerciseFrequency")) >= 2 else "no",
        "moderate_alcohol":
        "yes" if float(input_data.get("drinksConsumed")) > 2 else "no",
        "obese":
        "yes" if obese else "no"
    }

    final_life_expectancy = calculate_life_expectancy(target_json)

    return float(f"{final_life_expectancy:.2f}")


def get_medical_cost(input_data):
    target_json = {
        "age": int(input_data.get("age")),
        "sex": input_data.get("sex").lower(),
        "height": int(float(input_data.get("heightInches"))),  # in inches
        "weight": int(float(input_data.get("weightPounds"))),  # in pounds
        "children": 0,
        "smoking": "yes" if input_data.get("smoker") else "no"
    }
    prediction = model.predict(target_json)

    return round(prediction, 2)


# API endpoint for future ML model inference
@app.route("/ml_info", methods=["POST"])
def ml_info():
    data = request.get_json()

    # Assume input_data is provided in the request
    input_data = data.get("input_data", {})

    if not input_data:
        return jsonify({"error": "Input data is required"}), 400

    life_expectancy = get_life_expectancy(input_data)
    medical_cost = get_medical_cost(input_data)
    result = {
        "life_expectancy_years": life_expectancy,
        "medical_cost": medical_cost
    }
    return jsonify(result)


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers[
        "Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response


if __name__ == "__main__":
    app.run(debug=True)
