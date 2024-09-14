# Life Expectancy Calculator using data from user_input.json

import json


def calculate_life_expectancy(user_data):
    # Define the factors and their impacts
    factors = [
        {
            'key': 'smoking',
            'impact': -10,
            'condition': lambda ans: ans.lower() == 'yes',
            'follow_up': {
                'key':
                'quit_age',
                'impact':
                lambda age: -5 if 35 <= age <= 59 else 0 if age < 35 else -10,
                'condition':
                lambda ans: ans.isdigit() or ans.lower() == 'still smoking',
            },
        },
        {
            'key': 'sitting',
            'impact': -3,
            'condition': lambda ans: ans.lower() == 'yes',
        },
        {
            'key': 'sleeping_more_than_8hrs',
            'impact': -1.5,
            'condition': lambda ans: ans.lower() == 'yes',
        },
        {
            'key': 'sex',
            'impact': 5.1,
            'condition': lambda ans: ans.lower() == 'female',
            'sex': True,
        },
        {
            'key': 'optimistic',
            'impact': 2,
            'condition': lambda ans: ans.lower() == 'yes',
            'sex_specific': 'female',
        },
        {
            'key': 'pet_owner',
            'impact': 3,
            'condition': lambda ans: ans.lower() == 'yes',
        },
        {
            'key': 'high_professional',
            'impact': 3.5,
            'condition': lambda ans: ans.lower() == 'yes',
            'sex_specific': 'male',
        },
        {
            'key': 'healthy_diet',
            'impact': 7,
            'condition': lambda ans: ans.lower() == 'yes',
        },
        {
            'key': 'high_red_meat_diet',
            'impact': -1,
            'condition': lambda ans: ans.lower() == 'yes',
        },
        {
            'key': 'alcohol_abuse',
            'impact': -11,
            'condition': lambda ans: ans.lower() == 'yes',
        },
        {
            'key': 'city_living',
            'impact': -2.5,
            'condition': lambda ans: ans.lower() == 'yes',
        },
        {
            'key': 'severe_mental_illness',
            'impact': -25,
            'condition': lambda ans: ans.lower() == 'yes',
        },
        {
            'key': 'obese',
            'impact': -8.5,
            'condition': lambda ans: ans.lower() == 'yes',
        },
        {
            'key': 'high_altitude',
            'impact': 2,
            'condition': lambda ans: ans.lower() == 'yes',
        },
        {
            'key': 'married',
            'impact': 10,
            'condition': lambda ans: ans.lower() == 'yes',
        },
        {
            'key': 'caloric_restriction',
            'impact': 11.67,
            'condition': lambda ans: ans.lower() == 'yes',
        },
        {
            'key': 'meditation',
            'impact': 12,
            'condition': lambda ans: ans.lower() == 'yes',
        },
        {
            'key': 'exercise_150min',
            'impact': 2,
            'condition': lambda ans: ans.lower() == 'yes',
        },
        {
            'key': 'moderate_alcohol',
            'impact': 2,
            'condition': lambda ans: ans.lower() == 'yes',
            'sex_specific': 'male',
        },
        {
            'key': 'conscientious',
            'impact': 2.5,
            'condition': lambda ans: ans.lower() == 'yes',
        },
        {
            'key': 'frequent_orgasms',
            'impact': 4,
            'condition': lambda ans: ans.lower() == 'yes',
            'sex_specific': 'male',
        },
        {
            'key': 'above_average_income',
            'impact': 7.5,
            'condition': lambda ans: ans.lower() == 'yes',
        },
        {
            'key': 'strong_social_relationships',
            'impact': 5.3,
            'condition': lambda ans: ans.lower() == 'yes',
        },
        {
            'key': 'regular_church_attendance',
            'impact': 7,
            'condition': lambda ans: ans.lower() == 'yes',
        },
        {
            'key': 'country_living',
            'impact': 8,
            'condition': lambda ans: ans.lower() == 'yes',
        },
        {
            'key': 'polygamous_marriage',
            'impact': 9.3,
            'condition': lambda ans: ans.lower() == 'yes',
            'sex_specific': 'male',
        },
        {
            'key': 'long_lived_siblings',
            'impact': 5,
            'condition': lambda ans: ans.lower() == 'yes',
        },
        # Add any additional factors if necessary
    ]

    life_expectancy = 75  # Base life expectancy
    sex = user_data.get('sex', '').lower()

    for factor in factors:
        # Handle sex-specific factors
        if 'sex' in factor and factor['sex']:
            ans = user_data.get('sex', '').lower()
            if ans in ['male', 'female']:
                if factor['condition'](ans):
                    life_expectancy += factor['impact']
                sex = ans
            else:
                print("Sex not specified or invalid. Assuming 'male'.")
                sex = 'male'
                user_data['sex'] = sex
            continue

        # Skip factors not applicable to the user's sex
        if 'sex_specific' in factor:
            if sex != factor['sex_specific']:
                continue

        ans = user_data.get(factor['key'], 'no')
        if factor['condition'](ans):
            # Check for follow-up questions
            if 'follow_up' in factor:
                follow_up = factor['follow_up']
                follow_ans = user_data.get(follow_up['key'], 'still smoking')
                if follow_up['condition'](str(follow_ans)):
                    if str(follow_ans).isdigit():
                        age = int(follow_ans)
                        impact = follow_up['impact'](age)
                        life_expectancy += impact
                    elif follow_ans.lower() == 'still smoking':
                        life_expectancy += factor['impact']
                else:
                    print(f"Invalid data for '{follow_up['key']}'.")
            else:
                life_expectancy += factor['impact']

    return life_expectancy


if __name__ == "__main__":
    # Read user data from user_input.json
    try:
        with open('user_input.json', 'r') as file:
            user_data = json.load(file)
    except FileNotFoundError:
        print("Error: The file 'user_input.json' was not found.")
        exit(1)
    except json.JSONDecodeError:
        print("Error: The file 'user_input.json' contains invalid JSON.")
        exit(1)

    final_life_expectancy = calculate_life_expectancy(user_data)
    print(
        f"Based on your data, your estimated life expectancy is: {final_life_expectancy:.2f} years."
    )
