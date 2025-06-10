function myFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("mySearch");
  filter = input.value.toUpperCase();
  ul = document.getElementById("myMenu");
  li = ul.getElementsByTagName("li");
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

// Function to update the display of selected ingredients in the HTML
function updateSelectedIngredientsDisplay() {
    const selectedItems = document.querySelectorAll('#myMenu li a.selected');
    const selectedIngredientsSpan = document.getElementById('selectedIngredients');
    let ingredientsTextArray = [];

    if (selectedItems.length > 0) {
        selectedItems.forEach(item => {
            ingredientsTextArray.push(item.textContent); // Get the text of the selected item
        });
        selectedIngredientsSpan.textContent = ingredientsTextArray.join(', ');
    } else {
        selectedIngredientsSpan.textContent = 'None'; // Display 'None' if no items are selected
    }
}

// Define selectIngredients to fix the ReferenceError.
// This function will now call updateSelectedIngredientsDisplay.
function selectIngredients() {
    updateSelectedIngredientsDisplay();
}

document.addEventListener('DOMContentLoaded', function() {
  const menuItems = document.querySelectorAll('#myMenu li a');

  menuItems.forEach(function(item) {
    item.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent default anchor action
      this.classList.toggle('selected'); // Toggle the 'selected' class on the clicked item
      updateSelectedIngredientsDisplay(); // Update the display of selected ingredients
    });
  });

  // Initialize the display when the page loads.
  // This ensures the "Your selected ingredients are:" section is correctly populated.
  updateSelectedIngredientsDisplay();
});

// The old logSelectedItems function is effectively replaced by updateSelectedIngredientsDisplay.
// If you still need console logging for debugging, you can add console.log statements
// within updateSelectedIngredientsDisplay or keep a separate logging function.