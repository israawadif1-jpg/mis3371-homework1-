window.onload = function () {
  const today = new Date();

  document.getElementById("todayDate").textContent =
    "Today's date: " +
    (today.getMonth() + 1) + "/" +
    today.getDate() + "/" +
    today.getFullYear();

  const dob = document.getElementById("dob");
  if (dob) {
    const maxDate = new Date();
    const minDate = new Date();
    minDate.setFullYear(maxDate.getFullYear() - 120);

    dob.max = maxDate.toISOString().split("T")[0];
    dob.min = minDate.toISOString().split("T")[0];
  }

  updateSlider();
};

function updateSlider() {
  const budget = document.getElementById("budget");
  const budgetValue = document.getElementById("budgetValue");
  const formatted = Number(budget.value).toLocaleString();
  budgetValue.textContent = "$" + formatted;
}

function reviewForm() {
  const form = document.getElementById("registrationForm");
  const errorBox = document.getElementById("errorMessages");
  const tbody = document.querySelector("#reviewTable tbody");

  errorBox.innerHTML = "";
  tbody.innerHTML = "";

  const userIdField = document.getElementById("userid");
  userIdField.value = userIdField.value.toLowerCase();

  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const userId = document.getElementById("userid").value;
  const firstName = document.getElementById("fname").value.toLowerCase();
  const lastName = document.getElementById("lname").value.toLowerCase();

  if (!form.checkValidity()) {
    errorBox.innerHTML = "Please fix the highlighted fields before reviewing.";
    form.reportValidity();
    return;
  }

  if (password !== confirmPassword) {
    errorBox.innerHTML = "Passwords do not match.";
    return;
  }

  const lowerPassword = password.toLowerCase();
  if (
    lowerPassword.includes(userId.toLowerCase()) ||
    lowerPassword.includes(firstName) ||
    lowerPassword.includes(lastName)
  ) {
    errorBox.innerHTML = "Password cannot contain your user ID or name.";
    return;
  }

  const first = document.getElementById("fname").value;
  const mi = document.getElementById("mi").value;
  const last = document.getElementById("lname").value;
  const dob = document.getElementById("dob").value;
  const idnum = document.getElementById("idnum").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const addr1 = document.getElementById("addr1").value;
  const addr2 = document.getElementById("addr2").value;
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value;
  let zip = document.getElementById("zip").value;
  const about = document.getElementById("about").value;

  if (zip.length > 5) {
    zip = zip.substring(0, 5);
  }

  const conditions = Array.from(
    document.querySelectorAll('input[name="conditions"]:checked')
  )
    .map(function (item) {
      return item.value;
    })
    .join(", ");

  const vaccinatedNode = document.querySelector('input[name="vaccinated"]:checked');
  const vaccinated = vaccinatedNode ? vaccinatedNode.value : "";

  const rows = [
    ["Name", first + " " + mi + " " + last],
    ["Date of Birth", dob],
    ["ID Number", idnum],
    ["Email", email],
    ["Phone", phone],
    ["Address", addr1 + (addr2 ? " " + addr2 : "") + ", " + city + ", " + state + " " + zip],
    ["Conditions", conditions || "None selected"],
    ["Vaccinated", vaccinated],
    ["Home Budget", "$" + Number(document.getElementById("budget").value).toLocaleString()],
    ["About You", about || "No additional comments"],
    ["User ID", userId],
    ["Password", password]
  ];

  rows.forEach(function (row) {
    const tr = document.createElement("tr");
    tr.innerHTML = "<td><strong>" + row[0] + "</strong></td><td>" + row[1] + "</td>";
    tbody.appendChild(tr);
  });

  errorBox.innerHTML = "Review generated successfully.";
}
