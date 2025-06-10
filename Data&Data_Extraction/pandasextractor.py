import pandas as pd
import ast

data = pd.read_csv('full_dataset.csv')

data["ingredients"] = data["NER"].apply(ast.literal_eval)

all_ingredients = [ingredient for sublist in data["ingredients"] for ingredient in sublist]

all_ingredients = [ingredient.lower() for ingredient in all_ingredients]

all_ingredients = pd.Series(all_ingredients).drop_duplicates().tolist()

print(all_ingredients, len(all_ingredients))

with open("ingredients.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(all_ingredients))