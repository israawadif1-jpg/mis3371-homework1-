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

  document.getElementById("painLevel").addEventListener("input", updateSlider);
  document.getElementById("fname").addEventListener("input", validateFirstName);
  document.getElementById("mi").addEventListener("blur", validateMiddleInitial);
  document.getElementById("lname").addEventListener("input", validateLastName);
  document.getElementById("dob").addEventListener("change", validateDOB);
  document.getElementById("idnum").addEventListener("input", validateIdNum);
  document.getElementById("email").addEventListener("blur", validateEmail);
  document.getElementById("phone").addEventListener("input", validatePhone);
  document.getElementById("addr1").addEventListener("blur", validateAddr1);
  document.getElementById("addr2").addEventListener("blur", validateAddr2);
  document.getElementById("city").addEventListener("blur", validateCity);
  document.getElementById("state").addEventListener("change", validateState);
  document.getElementById("zip").addEventListener("input", validateZip);
  document.getElementById("about").addEventListener("blur", validateAbout);
  document.getElementById("userid").addEventListener("input", validateUserId);
  document.getElementById("password").addEventListener("input", validatePassword);
  document.getElementById("confirmPassword").addEventListener("input", validateConfirmPassword);

  const vaccinatedRadios = document.querySelectorAll('input[name="vaccinated"]');
  vaccinatedRadios.forEach(function (radio) {
    radio.addEventListener("change", validateVaccinated);
  });

  const conditionBoxes = document.querySelectorAll('input[name="conditions"]');
  conditionBoxes.forEach(function (box) {
    box.addEventListener("change", validateConditions);
  });

  document.getElementById("registrationForm").addEventListener("submit", function (event) {
    if (document.getElementById("submitBtn").style.display === "none") {
      event.preventDefault();
      document.getElementById("errorMessages").textContent = "Please click Validate and fix any errors before submitting.";
    }
  });

  document.getElementById("registrationForm").addEventListener("reset", function () {
    document.getElementById("errorMessages").textContent = "";
    document.querySelector("#reviewTable tbody").innerHTML = "";
    document.getElementById("submitBtn").style.display = "none";

    document.querySelectorAll(".field-error").forEach(function (el) {
      el.textContent = "";
    });

    document.querySelectorAll("input, select, textarea").forEach(function (el) {
      el.classList.remove("invalid", "valid");
    });

    setTimeout(function () {
      document.getElementById("painValue").textContent = document.getElementById("painLevel").value;
    }, 0);
  });
};

function updateSlider() {
  const painLevel = document.getElementById("painLevel");
  const painValue = document.getElementById("painValue");

  if (painLevel && painValue) {
    painValue.textContent = painLevel.value;
  }
}

function showFieldError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);

  if (field) {
    field.classList.add("invalid");
    field.classList.remove("valid");
  }

  if (error) {
    error.textContent = message;
  }
}

function clearFieldError(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);

  if (field) {
    field.classList.remove("invalid");
    field.classList.add("valid");
  }

  if (error) {
    error.textContent = "";
  }
}

function showGroupError(errorId, message) {
  const error = document.getElementById(errorId);
  if (error) {
    error.textContent = message;
  }
}

function clearGroupError(errorId) {
  const error = document.getElementById(errorId);
  if (error) {
    error.textContent = "";
  }
}

function validateFirstName() {
  const value = document.getElementById("fname").value.trim();
  const regex = /^[A-Za-z'-]{1,30}$/;

  if (!value) {
    showFieldError("fname", "fnameError", "First name is required.");
    return false;
  }
  if (!regex.test(value)) {
    showFieldError("fname", "fnameError", "Use 1 to 30 letters, apostrophes, or dashes only.");
    return false;
  }

  clearFieldError("fname", "fnameError");
  return true;
}

function validateMiddleInitial() {
  const value = document.getElementById("mi").value.trim();
  const regex = /^[A-Za-z]$/;

  if (!value) {
    document.getElementById("mi").classList.remove("invalid", "valid");
    clearGroupError("miError");
    return true;
  }

  if (!regex.test(value)) {
    showFieldError("mi", "miError", "Middle initial must be one letter.");
    return false;
  }

  clearFieldError("mi", "miError");
  return true;
}

function validateLastName() {
  const value = document.getElementById("lname").value.trim();
  const regex = /^[A-Za-z'-]{1,30}$/;

  if (!value) {
    showFieldError("lname", "lnameError", "Last name is required.");
    return false;
  }
  if (!regex.test(value)) {
    showFieldError("lname", "lnameError", "Use 1 to 30 letters, apostrophes, or dashes only.");
    return false;
  }

  clearFieldError("lname", "lnameError");
  return true;
}

function validateDOB() {
  const value = document.getElementById("dob").value;

  if (!value) {
    showFieldError("dob", "dobError", "Date of birth is required.");
    return false;
  }

  const dob = new Date(value);
  const today = new Date();
  const oldest = new Date();
  oldest.setFullYear(today.getFullYear() - 120);

  if (dob > today) {
    showFieldError("dob", "dobError", "Birth date cannot be in the future.");
    return false;
  }

  if (dob < oldest) {
    showFieldError("dob", "dobError", "Birth date cannot be more than 120 years ago.");
    return false;
  }

  clearFieldError("dob", "dobError");
  return true;
}

function validateIdNum() {
  const value = document.getElementById("idnum").value.trim();
  const regex = /^\d{9}$/;

  if (!value) {
    showFieldError("idnum", "idnumError", "ID number is required.");
    return false;
  }
  if (!regex.test(value)) {
    showFieldError("idnum", "idnumError", "Enter exactly 9 digits.");
    return false;
  }

  clearFieldError("idnum", "idnumError");
  return true;
}

function validateEmail() {
  const field = document.getElementById("email");
  const value = field.value.trim().toLowerCase();
  field.value = value;

  const regex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

  if (!value) {
    showFieldError("email", "emailError", "Email is required.");
    return false;
  }
  if (!regex.test(value)) {
    showFieldError("email", "emailError", "Enter a valid email address.");
    return false;
  }

  clearFieldError("email", "emailError");
  return true;
}

function validatePhone() {
  const field = document.getElementById("phone");
  let value = field.value.replace(/[^\d]/g, "");
  if (value.length > 10) {
    value = value.substring(0, 10);
  }

  if (value.length > 6) {
    field.value = value.replace(/(\d{3})(\d{3})(\d+)/, "$1-$2-$3");
  } else if (value.length > 3) {
    field.value = value.replace(/(\d{3})(\d+)/, "$1-$2");
  } else {
    field.value = value;
  }

  const finalValue = field.value.trim();
  const regex = /^\d{3}-\d{3}-\d{4}$/;

  if (!finalValue) {
    showFieldError("phone", "phoneError", "Phone number is required.");
    return false;
  }
  if (!regex.test(finalValue)) {
    showFieldError("phone", "phoneError", "Use format 123-456-7890.");
    return false;
  }

  clearFieldError("phone", "phoneError");
  return true;
}

function validateAddr1() {
  const value = document.getElementById("addr1").value.trim();

  if (!value) {
    showFieldError("addr1", "addr1Error", "Address Line 1 is required.");
    return false;
  }
  if (value.length < 2 || value.length > 30) {
    showFieldError("addr1", "addr1Error", "Use 2 to 30 characters.");
    return false;
  }

  clearFieldError("addr1", "addr1Error");
  return true;
}

function validateAddr2() {
  const value = document.getElementById("addr2").value.trim();

  if (!value) {
    document.getElementById("addr2").classList.remove("invalid", "valid");
    clearGroupError("addr2Error");
    return true;
  }
  if (value.length < 2 || value.length > 30) {
    showFieldError("addr2", "addr2Error", "If entered, use 2 to 30 characters.");
    return false;
  }

  clearFieldError("addr2", "addr2Error");
  return true;
}

function validateCity() {
  const value = document.getElementById("city").value.trim();

  if (!value) {
    showFieldError("city", "cityError", "City is required.");
    return false;
  }
  if (value.length < 2 || value.length > 30) {
    showFieldError("city", "cityError", "Use 2 to 30 characters.");
    return false;
  }

  clearFieldError("city", "cityError");
  return true;
}

function validateState() {
  const value = document.getElementById("state").value;

  if (!value) {
    showFieldError("state", "stateError", "Please select a state.");
    return false;
  }

  clearFieldError("state", "stateError");
  return true;
}

function validateZip() {
  const field = document.getElementById("zip");
  field.value = field.value.replace(/[^\d]/g, "").substring(0, 5);

  const value = field.value.trim();
  const regex = /^\d{5}$/;

  if (!value) {
    showFieldError("zip", "zipError", "ZIP code is required.");
    return false;
  }
  if (!regex.test(value)) {
    showFieldError("zip", "zipError", "Enter exactly 5 digits.");
    return false;
  }

  clearFieldError("zip", "zipError");
  return true;
}

function validateConditions() {
  clearGroupError("conditionsError");
  return true;
}

function validateVaccinated() {
  const vaccinatedNode = document.querySelector('input[name="vaccinated"]:checked');

  if (!vaccinatedNode) {
    showGroupError("vaccinatedError", "Please choose one option.");
    return false;
  }

  clearGroupError("vaccinatedError");
  return true;
}

function validateAbout() {
  const value = document.getElementById("about").value;

  if (value.includes('"')) {
    showFieldError("about", "aboutError", "Please avoid quotation marks.");
    return false;
  }

  clearFieldError("about", "aboutError");
  return true;
}

function validateUserId() {
  const field = document.getElementById("userid");
  const rawValue = field.value.trim();
  const regex = /^[A-Za-z][A-Za-z0-9_-]{4,19}$/;

  if (!rawValue) {
    showFieldError("userid", "useridError", "User ID is required.");
    return false;
  }
  if (!regex.test(rawValue)) {
    showFieldError("userid", "useridError", "5 to 20 chars, start with a letter, no spaces.");
    return false;
  }

  field.value = rawValue.toLowerCase();
  clearFieldError("userid", "useridError");
  return true;
}

function validatePassword() {
  const password = document.getElementById("password").value;
  const userId = document.getElementById("userid").value.trim();
  const firstName = document.getElementById("fname").value.trim().toLowerCase();
  const lastName = document.getElementById("lname").value.trim().toLowerCase();
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,30}$/;

  if (!password) {
    showFieldError("password", "passwordError", "Password is required.");
    return false;
  }
  if (!regex.test(password)) {
    showFieldError("password", "passwordError", "8 to 30 chars, with upper, lower, and number.");
    return false;
  }

  const lowerPassword = password.toLowerCase();

  if (lowerPassword === userId.toLowerCase()) {
    showFieldError("password", "passwordError", "Password cannot equal your user ID.");
    return false;
  }

  if (
    userId &&
    lowerPassword.includes(userId.toLowerCase())
  ) {
    showFieldError("password", "passwordError", "Password cannot contain your user ID.");
    return false;
  }

  if (firstName && lowerPassword.includes(firstName)) {
    showFieldError("password", "passwordError", "Password cannot contain your first name.");
    return false;
  }

  if (lastName && lowerPassword.includes(lastName)) {
    showFieldError("password", "passwordError", "Password cannot contain your last name.");
    return false;
  }

  clearFieldError("password", "passwordError");
  return true;
}

function validateConfirmPassword() {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!confirmPassword) {
    showFieldError("confirmPassword", "confirmPasswordError", "Please re-enter your password.");
    return false;
  }
  if (password !== confirmPassword) {
    showFieldError("confirmPassword", "confirmPasswordError", "Passwords do not match.");
    return false;
  }

  clearFieldError("confirmPassword", "confirmPasswordError");
  return true;
}

function validateAllFields() {
  const errorBox = document.getElementById("errorMessages");

  const results = [
    validateFirstName(),
    validateMiddleInitial(),
    validateLastName(),
    validateDOB(),
    validateIdNum(),
    validateEmail(),
    validatePhone(),
    validateAddr1(),
    validateAddr2(),
    validateCity(),
    validateState(),
    validateZip(),
    validateConditions(),
    validateVaccinated(),
    validateAbout(),
    validateUserId(),
    validatePassword(),
    validateConfirmPassword()
  ];

  const allValid = results.every(function (result) {
    return result === true;
  });

  if (allValid) {
    errorBox.textContent = "All fields look good. You may now submit.";
    document.getElementById("submitBtn").style.display = "inline-block";
    generateReviewTable();
  } else {
    errorBox.textContent = "Please fix the errors shown below.";
    document.getElementById("submitBtn").style.display = "none";
    document.querySelector("#reviewTable tbody").innerHTML = "";
  }
}

function generateReviewTable() {
  const tbody = document.querySelector("#reviewTable tbody");
  tbody.innerHTML = "";

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
  const zip = document.getElementById("zip").value;
  const about = document.getElementById("about").value;
  const painLevel = document.getElementById("painLevel").value;
  const userId = document.getElementById("userid").value;

  const conditions = Array.from(
    document.querySelectorAll('input[name="conditions"]:checked')
  ).map(function (item) {
    return item.value;
  }).join(", ");

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
    ["Level of Pain", painLevel + " out of 10"],
    ["Describe Symptoms", about || "No additional comments"],
    ["User ID", userId]
  ];

  rows.forEach(function (row) {
    const tr = document.createElement("tr");
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");

    td1.innerHTML = "<strong>" + row[0] + "</strong>";
    td2.textContent = row[1];

    tr.appendChild(td1);
    tr.appendChild(td2);
    tbody.appendChild(tr);
  });
}
