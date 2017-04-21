function validateLogin() {
  $("#loginForm").validate({
    rules: {
      login: "required",
      lastname: "required",
      password: {
        required: true,
        minlength: 5
      }
    },

    messages: {
      login: "Podaj login",
      password: {
        required: "Podaj hasło",
        minlength: "Hasło posiadać musi minimum 5 znaków"
      },
    },

    submitHandler: function(form) {
      
      $(':mobile-pagecontainer').pagecontainer('change', '#listPage');

    }
  });
}
