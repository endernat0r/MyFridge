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
    const selectedIngredientsDiv = document.getElementById('selectedIngredients');
    selectedIngredientsDiv.innerHTML = ''; // Delete previous content

    if (selectedItems.length > 0) {
        selectedItems.forEach(item => {
            const ingredientBlock = document.createElement('span');
            ingredientBlock.textContent = item.textContent;
            ingredientBlock.style.display = 'inline-block';
            ingredientBlock.style.padding = '5px 10px';
            ingredientBlock.style.margin = '5px';
            ingredientBlock.style.border = '1px solid #4CAF50';
            ingredientBlock.style.borderRadius = '15px';
            ingredientBlock.style.backgroundColor = '#e8f5e9';
            ingredientBlock.style.color = '#2e7d32';
            ingredientBlock.style.cursor = 'pointer';
            ingredientBlock.onclick = function() {
                item.classList.remove('selected');
                updateSelectedIngredientsDisplay();
            };
            selectedIngredientsDiv.appendChild(ingredientBlock);
        });
    } else {
        selectedIngredientsDiv.textContent = 'No ingredients selected';
    }
}

async function loadAndPopulateIngredients() {
    const ingredientsFilePath = '../Data&Data_Extraction/ingredients.txt';
    const menuUl = document.getElementById('myMenu');

    if (!menuUl) {
        console.error('Hata: myMenu UL elementi bulunamadı.');
        return;
    }

    try {
        const response = await fetch(ingredientsFilePath);
        if (!response.ok) {
            throw new Error(`HTTP hatası! Durum: ${response.status}, dosya: ${ingredientsFilePath}`);
        }
        const text = await response.text();
        const ingredients = text.split('\n')
                                .map(ingredient => ingredient.trim())
                                .filter(ingredient => ingredient);

        const menuHTML = ingredients.map(ingredientText => {
            return `<li><a href="#">${ingredientText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</a></li>`;
        }).join('');
        menuUl.innerHTML = menuHTML;

    } catch (error) {
        console.error('Malzemeler yüklenirken veya işlenirken hata oluştu:', error);
        menuUl.innerHTML = '<li><a href="#">Malzemeler yüklenemedi. Lütfen konsolu kontrol edin.</a></li>';
    }
}

document.addEventListener('DOMContentLoaded', async function() {
  await loadAndPopulateIngredients();

  const menuItems = document.querySelectorAll('#myMenu li a');
  menuItems.forEach(function(item) {
    item.addEventListener('click', function(event) {
      event.preventDefault();
      this.classList.toggle('selected');
      updateSelectedIngredientsDisplay();
    });
  });

  updateSelectedIngredientsDisplay();
});

function selectIngredients() {
    updateSelectedIngredientsDisplay();
}