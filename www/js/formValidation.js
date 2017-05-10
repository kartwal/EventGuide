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
      email: "Input email",
      password: {
        required: "Input password",
        minlength: "Password must contain at least 5 characters"
      },
    },

    submitHandler: function(form) {

      $(document).ajaxStart(function() {
          $.mobile.loading('show');
      });
      // $.mobile.pageContainer.pagecontainer('change', '#listPage', {reverse: false, changeHash: true, transition: 'slide'});
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
            $(document).ajaxStop(function() {
                $.mobile.loading('hide');
            });
          }
          else {
            console.log("ok");
            $(document).ajaxStop(function() {
                $.mobile.loading('hide');
            });
            $.mobile.pageContainer.pagecontainer('change', '#listPage', {reverse: false, changeHash: true, transition: 'slide'});
          }
        } else {
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
      email: "Provide email",
      password: {
        required: "Provide password",
        minlength: "Password must contain at least 5 characters"
      },
    },

    submitHandler: function(form) {

      // $(':mobile-pagecontainer').pagecontainer('change', '#listPage');
      // $.mobile.changePage('#listPage', { transition: 'slide', reverse: false });

      $(document).ajaxStart(function() {
          $.mobile.loading('show');
      });
      // $.mobile.pageContainer.pagecontainer('change', '#listPage', {reverse: false, changeHash: true, transition: 'slide'});
      var values = {};
      $.each($('#registerForm').serializeArray(), function(i, field) {
          values[field.name] = field.value;
      });

      // navigator.notification.activityStart("Please Wait", "Its loading.....");
      var postTo = 'http://kartwal.ayz.pl/EventGuide_API/v1/index.php/register';


    $.post(postTo,({email: values["email"], password: values["password"], login: "login"}),
    function(data) {

      console.log( data.error );
        if(data != "") {
          if (data.error === true)
          {
            console.log( data.error );
            $(document).ajaxStop(function() {
                $.mobile.loading('hide');
                $('#popupRegisterFail').popup('open');
            });
          }
          else {
            console.log("ok");
            $(document).ajaxStop(function() {
                $.mobile.loading('hide');
            });
            $('#popupRegisterOk').popup('open');
          }
        } else {
            console.log("błąd połączenia");
        }
        },'json');
        return false;

    }

  });
}

function closeRegisterPopup()
{
  $('#popupRegister').popup('close');
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
