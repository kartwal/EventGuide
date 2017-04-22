function validateLogin() {
  $("#loginForm").validate({
    rules: {
      login: "required",
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


      // navigator.notification.activityStart("Please Wait", "Its loading.....");
      var postTo = 'http://kartwal.ayz.pl/EventGuide_API/v1/index.php/login';

    $.post(postTo,({email: $('[name=email]').val(), password: $('[name=password]').val()}),
    function(data) {
        alert(data);
        if(data != "") {
            $(':mobile-pagecontainer').pagecontainer('change', '#listPage');
        } else {
            navigator.notification.alert("błąd", onConfirm, ["ok"], ["ok"])
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
      login: "required",
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
