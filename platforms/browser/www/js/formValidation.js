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

      console.log("Starting...");
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
            // $(':mobile-pagecontainer').pagecontainer('change', '#listPage', { transition: 'slide', reverse: true });
            $.mobile.changePage('#listPage', { transition: 'slide', reverse: false });
          }
        } else {
            // navigator.notification.alert("błąd", onConfirm, ["ok"], ["ok"])
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

      // $(':mobile-pagecontainer').pagecontainer('change', '#listPage');
      $.mobile.changePage('#listPage', { transition: 'slide', reverse: false });
    }
  });
}

function scan()
{
  console.log("Starting scanning");

  cordova.plugins.barcodeScanner.scan(
         function (result) {
              if(!result.cancelled){
                     // In this case we only want to process QR Codes
                     if(result.format == "QR_CODE"){
                          var value = result.text;
                          // This is the retrieved content of the qr code
                          console.log(value);
                     }else{
                        alert("Sorry, only qr codes this time ;)");
                     }
              }else{
                alert("The user has dismissed the scan");
              }
           },
           function (error) {
                alert("An error ocurred: " + error);
           }
        );
}
