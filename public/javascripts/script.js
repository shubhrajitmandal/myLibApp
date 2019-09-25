const forms = document.querySelector(".form-delete");

forms.forEach(form => {
  form.addEventListener("submit", e => {
    e.preventDefault();
  });
});
