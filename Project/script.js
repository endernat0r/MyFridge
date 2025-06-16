function myFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("mySearch");
  filter = input.value.toUpperCase(); // Keep the filter text for startsWith check
  ul = document.getElementById("myMenu");

  if (!ul) return; // Guard clause

  if (input.value.trim() === "") {
    ul.style.display = "none";
    return;
  } else {
    ul.style.display = "block";
  }

  li = ul.getElementsByTagName("li");
  let matchingItems = [];

  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
      matchingItems.push({
        element: li[i],
        text: a.innerHTML,
        startsWithFilter: a.innerHTML.toUpperCase().startsWith(filter) // Add a flag
      });
    }
    li[i].style.display = "none";
  }

  matchingItems.sort(function(itemA, itemB) {
    // Priority 1: Starts with filter
    if (itemA.startsWithFilter && !itemB.startsWithFilter) {
      return -1; // itemA comes first
    }
    if (!itemA.startsWithFilter && itemB.startsWithFilter) {
      return 1; // itemB comes first
    }

    // Priority 2: Number of words (ascending)
    const wordsA = itemA.text.split(' ').length;
    const wordsB = itemB.text.split(' ').length;
    if (wordsA !== wordsB) {
      return wordsA - wordsB;
    }

    // Priority 3: Length of text content (ascending)
    return itemA.text.length - itemB.text.length;
  });

  let visibleCount = 0;
  for (i = 0; i < matchingItems.length; i++) {
    if (visibleCount < 10) {
      matchingItems[i].element.style.display = "";
      visibleCount++;
    } else {
      break;
    }
  }
}

// Function to update the display of selected ingredients in the HTML
function updateSelectedIngredientsDisplay() {
    const selectedItems = document.querySelectorAll('#myMenu li a.selected');
    const selectedIngredientsDiv = document.getElementById('selectedIngredients');
    const readyBtn = document.getElementById('readyBtn'); // Get the ready button
    const requirementMsg = document.getElementById('ingredientRequirementMsg'); // Get the message element
    const recipeResultsUl = document.getElementById('recipeResults');


    if (!selectedIngredientsDiv || !readyBtn || !requirementMsg) { // Check all required elements
        console.error("One or more required elements for ingredient display/recipe action are missing.");
        return;
    }
    selectedIngredientsDiv.innerHTML = ''; // Clear previous content

    if (selectedItems.length > 0) {
        selectedItems.forEach(item => {
            const ingredientBlock = document.createElement('span');
            ingredientBlock.textContent = item.textContent;
            ingredientBlock.classList.add('ingredient-chip'); // Apply CSS class for styling
            
            ingredientBlock.onclick = function() {
                item.classList.remove('selected'); // Deselect from the list
                updateSelectedIngredientsDisplay(); // Re-render the selected ingredients display
            };
            selectedIngredientsDiv.appendChild(ingredientBlock);
        });
    } else {
        selectedIngredientsDiv.textContent = 'No ingredients selected';
    }

    // Handle "Ready" button state and message
    const minIngredients = 10;
    if (selectedItems.length >= minIngredients) {
        readyBtn.disabled = false;
        if(requirementMsg) requirementMsg.style.display = 'none'; // Hide message
    } else {
        readyBtn.disabled = true;
        if(requirementMsg) {
            requirementMsg.textContent = `Select at least ${minIngredients} ingredients to find recipes. (${selectedItems.length}/${minIngredients})`;
            requirementMsg.style.display = 'block'; // Show message
        }
        if (recipeResultsUl) {
            recipeResultsUl.innerHTML = ''; // Clear previous recipe results if count drops below min
        }
    }
} 

// Function to load ingredients from the text file and populate the menu
async function loadAndPopulateIngredients() {
  const ingredientsFilePath = '../Data&Data_Extraction/ingredients.txt';
  const ul = document.getElementById('myMenu');

  if (!ul) {
    console.error("Element with ID 'myMenu' not found for populating ingredients.");
    return;
  }

  try {
    const response = await fetch(ingredientsFilePath);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}, file: ${ingredientsFilePath}`);
    }
    const text = await response.text();
    const ingredients = text.split('\n').filter(ingredient => ingredient.trim() !== ''); // Filter out empty lines

    ul.innerHTML = ''; // Clear existing items

    ingredients.forEach(ingredientName => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = "#"; // Make it behave like a link
      a.textContent = ingredientName.trim();
      li.appendChild(a);
      ul.appendChild(li);
    });

  } catch (error) {
    console.error('Error loading or populating ingredients:', error);
    ul.innerHTML = '<li>Error loading ingredients.</li>';
  }
}

// Global variable to cache recipe data once loaded
let allRecipesData = null;

async function fetchRecipeData() {
    if (allRecipesData) {
        return allRecipesData; // Return cached data if available
    }
    const recipesFilePath = '../Data&Data_Extraction/full_dataset.csv'; // Path to your CSV
    try {
        const response = await fetch(recipesFilePath);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}, file: ${recipesFilePath}`);
        }
        const csvText = await response.text();
        const lines = csvText.split('\n').map(line => line.trim()).filter(line => line);
        if (lines.length < 2) { // Need at least header and one data line
            console.error("CSV data is empty or only has headers.");
            return [];
        }
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase()); // lowercased headers
        const titleIndex = headers.indexOf('title');
        const nerIndex = headers.indexOf('ner'); // Ensure your CSV header for ingredients is 'ner' (lowercase)

        if (titleIndex === -1 || nerIndex === -1) {
            console.error("CSV must contain 'title' and 'ner' columns. Found headers:", headers);
            return [];
        }

        allRecipesData = lines.slice(1).map(line => {
            // A more robust CSV line splitting:
            const values = [];
            let currentVal = '';
            let inQuotes = false;
            for (let char of line) {
                if (char === '"' && (currentVal.length === 0 || currentVal.slice(-1) !== '\\')) { // Handle escaped quotes if any, basic version here
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    values.push(currentVal.trim());
                    currentVal = '';
                } else {
                    currentVal += char;
                }
            }
            values.push(currentVal.trim()); // Add the last value


            const title = values[titleIndex] ? values[titleIndex].replace(/^"|"$/g, '') : 'Untitled Recipe'; // Remove surrounding quotes if any
            let ingredients = [];
            if (values[nerIndex]) {
                try {
                    const nerString = values[nerIndex].replace(/^"|"$/g, ''); // Remove surrounding quotes if any
                    const jsonFriendlyNerString = nerString.replace(/'/g, '"');
                    ingredients = JSON.parse(jsonFriendlyNerString).map(ing => ing.toLowerCase().trim());
                } catch (e) {
                    console.warn(`Could not parse ingredients for recipe "${title}": ${values[nerIndex]}`, e);
                }
            }
            return { title, ingredients };
        });
        return allRecipesData;
    } catch (error) {
        console.error('Error loading or processing recipe data:', error);
        return [];
    }
}


async function findAndDisplayRecipes() {
    const selectedItems = document.querySelectorAll('#myMenu li a.selected');
    const selectedIngredients = Array.from(selectedItems).map(item => item.textContent.toLowerCase().trim());
    const recipeResultsUl = document.getElementById('recipeResults');

    if (!recipeResultsUl) {
        console.error("Recipe results UL element not found.");
        return;
    }
    recipeResultsUl.innerHTML = '<li>Loading recipes...</li>';

    // This check is now primarily handled by the button's disabled state,
    // but good as a safeguard if the function is called directly.
    if (selectedIngredients.length < 10) { 
        recipeResultsUl.innerHTML = '<li>Please select at least 10 ingredients.</li>';
        return;
    }

    const recipes = await fetchRecipeData();
    if (!recipes || recipes.length === 0) {
        recipeResultsUl.innerHTML = '<li>Could not load recipe data or no recipes found.</li>';
        return;
    }

    const possibleRecipes = recipes.filter(recipe => {
        if (!recipe.ingredients || recipe.ingredients.length === 0) {
            return false;
        }
        return recipe.ingredients.every(ing => selectedIngredients.includes(ing.toLowerCase().trim()));
    });

    if (possibleRecipes.length === 0) {
        recipeResultsUl.innerHTML = '<li>No recipes found that can be made with all selected ingredients.</li>';
        return;
    }

    const shuffledRecipes = possibleRecipes.sort(() => 0.5 - Math.random());
    const recipesToShow = shuffledRecipes.slice(0, 5);

    recipeResultsUl.innerHTML = '';
    if (recipesToShow.length > 0) {
        recipesToShow.forEach(recipe => {
            const li = document.createElement('li');
            li.textContent = recipe.title;
            recipeResultsUl.appendChild(li);
        });
    } else {
        recipeResultsUl.innerHTML = '<li>No recipes found with the selected ingredients.</li>';
    }
}


document.addEventListener('DOMContentLoaded', async function() {
  await loadAndPopulateIngredients();

  const menuUl = document.getElementById('myMenu');
  const searchInput = document.getElementById('mySearch');
  const readyBtn = document.getElementById('readyBtn'); // Get the ready button

  if (searchInput && menuUl && searchInput.value.trim() === "") {
    menuUl.style.display = "none";
  }

  if (menuUl) {
    menuUl.addEventListener('click', function(event) {
      if (event.target && event.target.nodeName === "A") {
        event.preventDefault();
        event.target.classList.toggle('selected');
        updateSelectedIngredientsDisplay(); // This will now update the button state
      }
    });
  } else {
      console.error("Menu UL not found for attaching click listener.");
  }
  
  updateSelectedIngredientsDisplay(); // Initial call to set up the display and button state

  if (readyBtn) { // Attach listener to the ready button
    readyBtn.addEventListener('click', findAndDisplayRecipes);
  } else {
    console.error("Ready button (id='readyBtn') not found!");
  }
});