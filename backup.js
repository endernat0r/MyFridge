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

// Add this new code to handle selection
document.addEventListener('DOMContentLoaded', function() {
  const menuItems = document.querySelectorAll('#myMenu li a');

  menuItems.forEach(function(item) {
    item.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent default anchor action
      // Toggle the 'selected' class
      this.classList.toggle('selected');

      // After each click, let's check and log the selected items
      logSelectedItems();
    });
  });

  // You can also call it once on load if needed, though initially nothing will be selected
  // logSelectedItems();
});

function logSelectedItems() {
    const selectedItems = document.querySelectorAll('#myMenu li a.selected');
    if (selectedItems.length > 0) {
        console.log("selected items:", selectedItems, selectedItems.length);
    }
    else {
        console.log("No items selected");
    }
}