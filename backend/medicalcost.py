import pandas as pd
import json
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import numpy as np

class InsuranceModel:
    def __init__(self, csv_file_path):
        # Load data
        data = pd.read_csv(csv_file_path)

        self.le_sex = LabelEncoder()
        self.le_sex.fit(data.sex.drop_duplicates()) 
        data.sex = self.le_sex.transform(data.sex)

        self.le_smoker = LabelEncoder()
        self.le_smoker.fit(data.smoker.drop_duplicates()) 
        data.smoker = self.le_smoker.transform(data.smoker)

        x = data.drop(['charges', 'region'], axis = 1)
        y = data['charges']

        x_train,x_test,y_train,y_test = train_test_split(x,y,random_state = 0)

        self.model = RandomForestRegressor(n_estimators = 100,
                                    criterion = 'squared_error',
                                    random_state = 1,
                                    n_jobs = -1)
        self.model.fit(x_train,y_train)

    def predict(self, user_data):
        bmi = user_data['weight'] / (user_data['height'] ** 2) * 703

        # Encode the categorical values
        sex_encoded = self.le_sex.transform([user_data['sex']])[0]
        smoker_encoded = self.le_smoker.transform([user_data['smoking']])[0]

        # Create the input array in the same order as the features: [age, sex, bmi, children, smoker]
        input_data = np.array([[user_data['age'], sex_encoded, bmi, 0, smoker_encoded]])  # Assuming region=0

        # Make the prediction
        prediction = self.model.predict(input_data)

        # Return the predicted charges
        return prediction[0]

# Example usage:
"""
model = InsuranceModel('insurance.csv')

data = {
    "age": 29,
    "sex": "male",
    "height": 70,   # in inches
    "weight": 180,  # in pounds
    "children": 0,
    "smoking": "no"
}

prediction = model.predict(data)
print(prediction)
"""