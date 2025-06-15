function myFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("mySearch");
  filter = input.value.toUpperCase();
  ul = document.getElementById("myMenu");

  // If the search bar is empty, hide the menu and exit the function
  if (input.value.trim() === "") {
    ul.style.display = "none";
    return;
  } else {
    // If there is text in the search bar, show the menu
    ul.style.display = "block"; 
  }

  li = ul.getElementsByTagName("li");
  let visibleCount = 0; // Counter for visible items
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
      if (visibleCount < 10) { // Only display if less than 10 items are already visible
        li[i].style.display = "";
        visibleCount++;
      } else {
        li[i].style.display = "none"; // Hide if 10 items are already shown
      }
    } else {
      li[i].style.display = "none";
    }
  }
}

// Function to update the display of selected ingredients in the HTML
function updateSelectedIngredientsDisplay() {
    const selectedItems = document.querySelectorAll('#myMenu li a.selected');
    const selectedIngredientsDiv = document.getElementById('selectedIngredients');
    selectedIngredientsDiv.innerHTML = ''; // Clear previous content

    if (selectedItems.length > 0) {
        selectedItems.forEach(item => {
            const ingredientBlock = document.createElement('span');
            ingredientBlock.textContent = item.textContent; // Get the text of the selected item
            // Basic style for the block (can also be moved to a CSS file)
            ingredientBlock.style.display = 'inline-block';
            ingredientBlock.style.padding = '5px 10px';
            ingredientBlock.style.margin = '5px';
            ingredientBlock.style.border = '1px solid #4CAF50';
            ingredientBlock.style.borderRadius = '15px';
            ingredientBlock.style.backgroundColor = '#e8f5e9';
            ingredientBlock.style.color = '#2e7d32';
            ingredientBlock.style.cursor = 'pointer'; // To indicate it's clickable again
            // Optional: remove selection when the block is clicked
            ingredientBlock.onclick = function() {
                item.classList.remove('selected');
                updateSelectedIngredientsDisplay();
            };
            selectedIngredientsDiv.appendChild(ingredientBlock);
        });
    } else {
        selectedIngredientsDiv.textContent = 'No ingredients selected'; // Display 'No ingredients selected' if no items are selected
    }
}

// Function to load ingredients from the text file and populate the menu
async function loadAndPopulateIngredients() {
  const ingredientsFilePath = '../Data&Data_Extraction/ingredients.txt'; // Relative path from script.js to ingredients.txt
  const menuUl = document.getElementById('myMenu');

  if (!menuUl) {
      console.error('Error: myMenu UL element not found.');
      return;
  }

  try {
      const response = await fetch(ingredientsFilePath);
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}, file: ${ingredientsFilePath}`);
      }
      const text = await response.text();
      const ingredients = text.split('\n')
                              .map(ingredient => ingredient.trim()) // Remove leading/trailing whitespace
                              .filter(ingredient => ingredient);   // Remove empty lines

      // Create HTML string and populate the menu using innerHTML
      const menuHTML = ingredients.map(ingredientText => {
          return `<li><a href="#">${ingredientText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</a></li>`; // Simple XSS protection
      }).join('');
      menuUl.innerHTML = menuHTML;

  } catch (error) {
      console.error('Error loading or processing ingredients:', error);
      menuUl.innerHTML = '<li><a href="#">Could not load ingredients. Please check console.</a></li>';
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  await loadAndPopulateIngredients(); // Load ingredients and populate the menu

  const menuUl = document.getElementById('myMenu');
  const searchInput = document.getElementById('mySearch');

  // Initially hide the menu if the search bar is empty
  if (searchInput.value.trim() === "") {
    menuUl.style.display = "none";
  }

  // Add event listeners after ingredients are loaded
  const menuItems = document.querySelectorAll('#myMenu li a');
  menuItems.forEach(function(item) {
    item.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent default link action
      this.classList.toggle('selected'); // Toggle the 'selected' class on the clicked item
      updateSelectedIngredientsDisplay(); // Update the display of selected ingredients
    });
  });

  updateSelectedIngredientsDisplay(); // Set up the selected ingredients display initially (e.g., "No ingredients selected")
});

// selectIngredients function (if used elsewhere, otherwise it can be removed)
function selectIngredients() {
    updateSelectedIngredientsDisplay();
}