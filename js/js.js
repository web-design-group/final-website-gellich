document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("profileForm");
  const burger = document.getElementById("burger");
  const menu = document.getElementById("menu");
  const toast = document.getElementById("toast");

  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const birthDate = document.getElementById("birthDate");
  const phone = document.getElementById("phone");


  burger.addEventListener("click", () => {
    menu.classList.toggle("active");
  });

  // сохран. д.
  loadProfileData();

  phone.addEventListener("input", formatPhone);

  // отпр. формы

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    clearErrors();

    let isValid = true;

    // ФИО
    if (fullName.value.trim().length < 5) {
      showError(fullName, "Введите полное ФИО");
      isValid = false;
    }

    //email
    if (!validateEmail(email.value.trim())) {
      showError(email, "Введите корректную почту");
      isValid = false;
    }

    // дата рождения
    if (!birthDate.value) {
      showError(birthDate, "Укажите дату рождения");
      isValid = false;
    }

    // телефон
    if (phone.value.replace(/\D/g, "").length < 11) {
      showError(phone, "Введите корректный номер телефона");
      isValid = false;
    }

    if (!isValid) return;

    const profileData = {
      fullName: fullName.value.trim(),
      email: email.value.trim(),
      birthDate: birthDate.value,
      phone: phone.value.trim()
    };

    localStorage.setItem("profileData", JSON.stringify(profileData));

    showToast("Данные успешно сохранены 💅");
    form.reset();
    loadProfileData();
  });

  function loadProfileData() {
    const savedData = localStorage.getItem("profileData");

    if (savedData) {
      const data = JSON.parse(savedData);

      fullName.value = data.fullName || "";
      email.value = data.email || "";
      birthDate.value = data.birthDate || "";
      phone.value = data.phone || "";
    }
  }

  function validateEmail(emailValue) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
  }

  function showError(input, message) {
    const formGroup = input.closest(".form-group");
    const error = formGroup.querySelector(".error-message");
    error.textContent = message;
    input.style.borderColor = "#ff7b7b";
  }

  function clearErrors() {
    document.querySelectorAll(".error-message").forEach(el => {
      el.textContent = "";
    });

    document.querySelectorAll(".form-group input").forEach(input => {
      input.style.borderColor = "rgba(255,255,255,0.6)";
    });
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  function formatPhone(e) {
    let numbers = e.target.value.replace(/\D/g, "");

    if (numbers.startsWith("8")) {
      numbers = "7" + numbers.slice(1);
    }

    if (!numbers.startsWith("7")) {
      numbers = "7" + numbers;
    }

    numbers = numbers.substring(0, 11);

    let formatted = "+7";

    if (numbers.length > 1) {
      formatted += " (" + numbers.substring(1, 4);
    }
    if (numbers.length >= 5) {
      formatted += ") " + numbers.substring(4, 7);
    }
    if (numbers.length >= 8) {
      formatted += "-" + numbers.substring(7, 9);
    }
    if (numbers.length >= 10) {
      formatted += "-" + numbers.substring(9, 11);
    }

    e.target.value = formatted;
  }
});