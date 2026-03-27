window.onload = function () {
  const today = new Date();
  document.getElementById("todayDate").textContent =
    "Today's date: " + (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear();
};

function updateSlider() {
  document.getElementById("budgetValue").textContent =
    "$" + document.getElementById("budget").value;
}
