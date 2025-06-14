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
    const selectedIngredientsDiv = document.getElementById('selectedIngredients'); // ID'yi div olarak güncelledik
    selectedIngredientsDiv.innerHTML = ''; // Önceki içeriği temizle

    if (selectedItems.length > 0) {
        selectedItems.forEach(item => {
            const ingredientBlock = document.createElement('span');
            ingredientBlock.textContent = item.textContent; // Seçili öğenin metnini al
            ingredientBlock.style.display = 'inline-block';
            ingredientBlock.style.padding = '5px 10px';
            ingredientBlock.style.margin = '5px';
            ingredientBlock.style.border = '1px solid #4CAF50';
            ingredientBlock.style.borderRadius = '15px';
            ingredientBlock.style.backgroundColor = '#e8f5e9';
            ingredientBlock.style.color = '#2e7d32';
            ingredientBlock.style.cursor = 'pointer'; // Tekrar tıklanabilir olduğunu belirtmek için
            // İsteğe bağlı: bloğa tıklandığında seçimi kaldırma
            ingredientBlock.onclick = function() {
                item.classList.remove('selected');
                updateSelectedIngredientsDisplay();
            };
            selectedIngredientsDiv.appendChild(ingredientBlock);
        });
    } else {
        selectedIngredientsDiv.textContent = 'None'; // Display 'None' if no items are selected
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
  updateSelectedIngredientsDisplay();
});