function validateLogin() {
  $("#loginForm").validate({
    rules: {
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 5
      }
    },

    messages: {
      email: "Podaj email na którym założone zostało konto",
      password: {
        required: "Podaj hasło",
        minlength: "Hasło posiadać musi minimum 5 znaków"
      },
    },

    submitHandler: function(form) {

      var values = {};
      $.each($('#loginForm').serializeArray(), function(i, field) {
          values[field.name] = field.value;
      });

      // navigator.notification.activityStart("Please Wait", "Its loading.....");
      var postTo = 'http://kartwal.ayz.pl/EventGuide_API/v1/index.php/login';

    $.post(postTo,({email: values["email"], password: values["password"]}),
    function(data) {

      console.log( data.error );
        if(data != "") {
          if (data.error === true)
          {
            console.log( data.error );
          }
          else {
            console.log("ok");
            $(':mobile-pagecontainer').pagecontainer('change', '#listPage');

          }
        } else {
            navigator.notification.alert("błąd", onConfirm, ["ok"], ["ok"])
            console.log("błąd połączenia");
        }
        },'json');
        return false;

    }
  });
}

function alertCallback()
{

}

function onConfirm(buttonIndex) {
    alert('You selected button ' + buttonIndex);
    var options = { dimBackground: true };
}

function validateRegister() {
  $("#registerForm").validate({
    rules: {
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 5
      }
    },

    messages: {
      email: "Podaj login",
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
