document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registrationForm");
  const fname = document.getElementById("fname");
  const rememberMe = document.getElementById("rememberMe");
  const welcomeMessage = document.getElementById("welcomeMessage");
  const newUserArea = document.getElementById("newUserArea");
  const todayDate = document.getElementById("todayDate");
  const painLevel = document.getElementById("painLevel");
  const painValue = document.getElementById("painValue");
  const validateBtn = document.getElementById("validateBtn");
  const submitBtn = document.getElementById("submitBtn");
  const reviewArea = document.getElementById("reviewArea");
  const stateSelect = document.getElementById("state");

  submitBtn.style.display = "none";

  todayDate.textContent = "Today's date: " + new Date().toLocaleDateString();

  // FETCH API: load state options from states.html
  async function loadStates() {
    try {
      const response = await fetch("states.html");
      if (!response.ok) throw new Error("Could not load states");
      const data = await response.text();
      stateSelect.innerHTML = data;
    } catch (error) {
      stateSelect.innerHTML = "<option value=''>State list unavailable</option>";
      console.log(error);
    }
  }

  loadStates();

  // COOKIE FUNCTIONS
  function setCookie(name, value, hours) {
    const date = new Date();
    date.setTime(date.getTime() + hours * 60 * 60 * 1000);
    document.cookie =
      name + "=" + encodeURIComponent(value) +
      ";expires=" + date.toUTCString() +
      ";path=/";
  }

  function getCookie(name) {
    const cookieName = name + "=";
    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(cookieName) === 0) {
        return decodeURIComponent(cookie.substring(cookieName.length));
      }
    }
    return "";
  }

  function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  function clearSavedData() {
    localStorage.clear();
    deleteCookie("firstName");
    form.reset();
    submitBtn.style.display = "none";
    welcomeMessage.textContent = "Welcome New User";
    newUserArea.innerHTML = "";
    painValue.textContent = painLevel.value;
    reviewArea.textContent = "Please review this information.";
  }

  // WELCOME MESSAGE FROM COOKIE
  const savedFirstName = getCookie("firstName");

  if (savedFirstName) {
    welcomeMessage.textContent = "Welcome back, " + savedFirstName;
    fname.value = savedFirstName;

    newUserArea.innerHTML =
      "<label><input type='checkbox' id='notUser'> Not " +
      savedFirstName +
      "? Click here to start as a new user.</label>";

    document.getElementById("notUser").addEventListener("change", function () {
      if (this.checked) {
        clearSavedData();
      }
    });

    loadSavedFormData();
  } else {
    welcomeMessage.textContent = "Welcome New User";
  }

  // LOCAL STORAGE
  const savedFields = [
    "mi",
    "lname",
    "dob",
    "email",
    "phone",
    "address1",
    "address2",
    "city",
    "state",
    "zip",
    "symptoms",
    "userId",
    "painLevel"
  ];

  function saveFormData() {
    if (!rememberMe.checked) return;

    savedFields.forEach(function (id) {
      const element = document.getElementById(id);
      if (element) {
        localStorage.setItem(id, element.value);
      }
    });
  }

  function loadSavedFormData() {
    savedFields.forEach(function (id) {
      const element = document.getElementById(id);
      const savedValue = localStorage.getItem(id);

      if (element && savedValue !== null) {
        element.value = savedValue;
      }
    });

    painValue.textContent = painLevel.value;
  }

  savedFields.forEach(function (id) {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("blur", saveFormData);
      element.addEventListener("change", saveFormData);
    }
  });

  fname.addEventListener("blur", function () {
    if (rememberMe.checked && fname.value.trim() !== "") {
      setCookie("firstName", fname.value.trim(), 48);
      localStorage.setItem("fname", fname.value.trim());
      welcomeMessage.textContent = "Welcome back, " + fname.value.trim();
    }
  });

  rememberMe.addEventListener("change", function () {
    if (!rememberMe.checked) {
      clearSavedData();
    }
  });

  painLevel.addEventListener("input", function () {
    painValue.textContent = painLevel.value;
    saveFormData();
  });

  // ERROR HELPERS
  function showError(id, message) {
    document.getElementById(id).textContent = message;
  }

  function clearError(id) {
    document.getElementById(id).textContent = "";
  }

  function validateName(value) {
    return /^[A-Za-z'-]{1,30}$/.test(value);
  }

  function validateFieldLive(inputId, errorId, testFunction, message) {
    const input = document.getElementById(inputId);

    input.addEventListener("blur", function () {
      if (!testFunction(input.value.trim())) {
        showError(errorId, message);
      } else {
        clearError(errorId);
        saveFormData();
      }
    });
  }

  validateFieldLive("fname", "fnameError", validateName, "First name must use letters, apostrophes, or dashes only.");
  validateFieldLive("lname", "lnameError", validateName, "Last name must use letters, apostrophes, or dashes only.");

  validateFieldLive("mi", "miError", function (value) {
    return value === "" || /^[A-Za-z]$/.test(value);
  }, "Middle initial must be one letter or blank.");

  validateFieldLive("email", "emailError", function (value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }, "Enter a valid email address.");

  validateFieldLive("phone", "phoneError", function (value) {
    return value === "" || /^\d{3}-\d{3}-\d{4}$/.test(value);
  }, "Phone must be in 123-456-7890 format.");

  validateFieldLive("zip", "zipError", function (value) {
    return /^\d{5}$/.test(value);
  }, "Zip code must be exactly 5 digits.");

  validateFieldLive("userId", "userIdError", function (value) {
    return /^[A-Za-z][A-Za-z0-9_-]{4,19}$/.test(value);
  }, "User ID must start with a letter, be 5-20 characters, and only use letters, numbers, dash, or underscore.");

  // MAIN VALIDATION
  function validateForm() {
    let errorCount = 0;
    reviewArea.innerHTML = "";
    submitBtn.style.display = "none";

    function addError(message) {
      errorCount++;
      reviewArea.innerHTML += "<p>" + message + "</p>";
    }

    if (!validateName(fname.value.trim())) {
      showError("fnameError", "Invalid first name.");
      addError("First name is invalid.");
    } else {
      clearError("fnameError");
    }

    const mi = document.getElementById("mi").value.trim();
    if (mi !== "" && !/^[A-Za-z]$/.test(mi)) {
      showError("miError", "Invalid middle initial.");
      addError("Middle initial is invalid.");
    } else {
      clearError("miError");
    }

    const lname = document.getElementById("lname").value.trim();
    if (!validateName(lname)) {
      showError("lnameError", "Invalid last name.");
      addError("Last name is invalid.");
    } else {
      clearError("lnameError");
    }

    const dob = document.getElementById("dob").value;
    if (!dob) {
      showError("dobError", "Date of birth is required.");
      addError("Date of birth is required.");
    } else {
      const birthDate = new Date(dob);
      const today = new Date();
      const oldestDate = new Date();
      oldestDate.setFullYear(today.getFullYear() - 120);

      if (birthDate > today || birthDate < oldestDate) {
        showError("dobError", "Date must not be future or over 120 years ago.");
        addError("Date of birth is outside allowed range.");
      } else {
        clearError("dobError");
      }
    }

    const idNumber = document.getElementById("idNumber").value.trim();
    if (!/^\d{9}$/.test(idNumber)) {
      showError("idError", "ID must be exactly 9 digits.");
      addError("ID number is invalid.");
    } else {
      clearError("idError");
    }

    const email = document.getElementById("email");
    email.value = email.value.toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      showError("emailError", "Invalid email.");
      addError("Email is invalid.");
    } else {
      clearError("emailError");
    }

    const phone = document.getElementById("phone").value.trim();
    if (phone !== "" && !/^\d{3}-\d{3}-\d{4}$/.test(phone)) {
      showError("phoneError", "Phone must be 123-456-7890.");
      addError("Phone number is invalid.");
    } else {
      clearError("phoneError");
    }

    const address1 = document.getElementById("address1").value.trim();
    if (address1.length < 2 || address1.length > 30) {
      showError("address1Error", "Address Line 1 must be 2-30 characters.");
      addError("Address Line 1 is invalid.");
    } else {
      clearError("address1Error");
    }

    const address2 = document.getElementById("address2").value.trim();
    if (address2 !== "" && (address2.length < 2 || address2.length > 30)) {
      showError("address2Error", "Address Line 2 must be 2-30 characters if entered.");
      addError("Address Line 2 is invalid.");
    } else {
      clearError("address2Error");
    }

    const city = document.getElementById("city").value.trim();
    if (city.length < 2 || city.length > 30) {
      showError("cityError", "City must be 2-30 characters.");
      addError("City is invalid.");
    } else {
      clearError("cityError");
    }

    if (stateSelect.value === "") {
      showError("stateError", "Please select a state.");
      addError("State is required.");
    } else {
      clearError("stateError");
    }

    const zip = document.getElementById("zip").value.trim();
    if (!/^\d{5}$/.test(zip)) {
      showError("zipError", "Zip must be exactly 5 digits.");
      addError("Zip code is invalid.");
    } else {
      clearError("zipError");
    }

    const symptoms = document.getElementById("symptoms").value.trim();
    if (symptoms.length < 2) {
      addError("Symptoms description is required.");
    }

    const userId = document.getElementById("userId").value.trim();
    if (!/^[A-Za-z][A-Za-z0-9_-]{4,19}$/.test(userId)) {
      showError("userIdError", "Invalid User ID.");
      addError("User ID is invalid.");
    } else {
      clearError("userIdError");
    }

    const password = document.getElementById("password").value;
    const rePassword = document.getElementById("rePassword").value;

    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      password === userId
    ) {
      showError("passwordError", "Password must be 8+ characters with uppercase, lowercase, and number. It cannot equal User ID.");
      addError("Password is invalid.");
    } else {
      clearError("passwordError");
    }

    if (password !== rePassword) {
      showError("rePasswordError", "Passwords do not match.");
      addError("Passwords do not match.");
    } else {
      clearError("rePasswordError");
    }

    if (rememberMe.checked && fname.value.trim() !== "") {
      setCookie("firstName", fname.value.trim(), 48);
      saveFormData();
    }

    if (errorCount === 0) {
      reviewArea.innerHTML = "<p>All fields passed validation. You may now submit the form.</p>";
      submitBtn.style.display = "inline-block";
    } else {
      submitBtn.style.display = "none";
    }
  }

  validateBtn.addEventListener("click", validateForm);

  form.addEventListener("submit", function (event) {
    validateForm();

    if (submitBtn.style.display === "none") {
      event.preventDefault();
    }
  });

  form.addEventListener("reset", function () {
    clearSavedData();
  });
});
