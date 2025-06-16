import pandas as pd
import ast
import os
import re

script_directory = os.path.dirname(os.path.abspath(__file__))
csv_file_path = os.path.join(script_directory, 'full_dataset.csv')
data = pd.read_csv(csv_file_path)

data["ingredients"] = data["NER"].apply(ast.literal_eval)

all_ingredients_from_csv = [ingredient for sublist in data["ingredients"] for ingredient in sublist]

# Step 1: Initial cleaning (symbols, lowercase, strip, http check, short words, consecutive letters)
processed_ingredients_list = []
for ingredient in all_ingredients_from_csv:
    # Convert to string and lowercase first for the http check
    original_ingredient_str = str(ingredient).lower()

    # Check for "http"
    if "http" in original_ingredient_str:
        continue # Skip this ingredient entirely

    # Remove symbols, and strip whitespace (lowercase already done)
    cleaned_ingredient = re.sub(r'[^\w\s]', '', original_ingredient_str) # original_ingredient_str is already lowercase
    cleaned_ingredient = cleaned_ingredient.strip()


    if cleaned_ingredient:
        # Split into words, remove short words, then rejoin
        words = cleaned_ingredient.split()
        meaningful_words = [word for word in words if len(word) > 2]
        ingredient_after_short_word_removal = " ".join(meaningful_words).strip()
        
        if ingredient_after_short_word_removal:
            ingredient_after_consecutive_reduction = re.sub(r'(.)\1\1+', r'\1\1', ingredient_after_short_word_removal)
            
            if ingredient_after_consecutive_reduction:
                processed_ingredients_list.append(ingredient_after_consecutive_reduction)

initial_unique_set = set(processed_ingredients_list)
final_preferred_ingredients_set = set()

for item in initial_unique_set: 
    if item.endswith('s'):
        singular_form_candidate = item[:-1]
        if singular_form_candidate in initial_unique_set:
            final_preferred_ingredients_set.add(item)
        else:
            final_preferred_ingredients_set.add(item)
    else:
        potential_plural_form = item + "s"
        if potential_plural_form not in initial_unique_set:
            final_preferred_ingredients_set.add(item)
       
unique_ingredients = sorted(list(final_preferred_ingredients_set))

print(f"Found {len(unique_ingredients)} unique ingredients after all processing.")
# print(unique_ingredients) # You can uncomment this to see the list

output_file_path = os.path.join(script_directory, 'ingredients.txt')
with open(output_file_path, "w", encoding="utf-8") as f:
    f.write("\n".join(unique_ingredients))

print(f"Ingredients saved to {output_file_path}")