import pandas as pd
import ast
import os
import re

script_directory = os.path.dirname(os.path.abspath(__file__))
csv_file_path = os.path.join(script_directory, 'full_dataset.csv')
data = pd.read_csv(csv_file_path)

data["ingredients"] = data["NER"].apply(ast.literal_eval)

all_ingredients_from_csv = [ingredient for sublist in data["ingredients"] for ingredient in sublist]

# Step 1: Initial cleaning (symbols, lowercase, strip, short words)
processed_ingredients_list = []
for ingredient in all_ingredients_from_csv:
    cleaned_ingredient = re.sub(r'[^\w\s]', '', str(ingredient))
    cleaned_ingredient = cleaned_ingredient.lower().strip()

    if cleaned_ingredient:
        words = cleaned_ingredient.split()
        meaningful_words = [word for word in words if len(word) > 2]
        final_ingredient_after_short_word_removal = " ".join(meaningful_words).strip()
        
        if final_ingredient_after_short_word_removal:
            processed_ingredients_list.append(final_ingredient_after_short_word_removal)

# Step 2: Plural handling and final deduplication
# Get a set of unique ingredients after the initial processing
initial_unique_set = set(processed_ingredients_list)
final_preferred_ingredients_set = set()

for item in initial_unique_set: # Iterate over each unique cleaned item
    if item.endswith('s'):
        # This item is potentially a plural form
        singular_form_candidate = item[:-1]
        if singular_form_candidate in initial_unique_set:
            # Both the item (e.g., "apples") and its singular form (e.g., "apple")
            # exist in the cleaned set. Prefer the plural form.
            final_preferred_ingredients_set.add(item)
        else:
            # Only this plural form (e.g., "apples" without "apple", or "molasses") exists. Keep it.
            final_preferred_ingredients_set.add(item)
    else:
        # This item is a singular form (does not end with 's')
        potential_plural_form = item + "s"
        if potential_plural_form not in initial_unique_set:
            # This singular item exists, and its corresponding plural form does NOT exist. Keep the singular.
            final_preferred_ingredients_set.add(item)
        # Else (the singular item's plural form DOES exist in initial_unique_set):
            # The plural form would have been added when it was processed.
            # So, we do nothing here for this singular item, effectively discarding it in favor of its plural.

# Convert the final set to a sorted list for consistent output
unique_ingredients = sorted(list(final_preferred_ingredients_set))

print(f"Found {len(unique_ingredients)} unique ingredients after all processing.")
# print(unique_ingredients) # You can uncomment this to see the list

output_file_path = os.path.join(script_directory, 'ingredients.txt')
with open(output_file_path, "w", encoding="utf-8") as f:
    f.write("\n".join(unique_ingredients))

print(f"Ingredients saved to {output_file_path}")