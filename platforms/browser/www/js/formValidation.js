var userCredentialsData = {};


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

      // $(document).ajaxStart(function() {
      //     $.mobile.loading('show');
      // });

      var values = {};
      $.each($('#loginForm').serializeArray(), function(i, field) {
          values[field.name] = field.value;
      });

      console.log("Starting...");

      loginInto(values["email"], values["password"]);

      return false;

    }
  });
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

function loginInto(userEmail, userPassword)
{
  console.log(userEmail, userPassword);
  $.ajax({
            type: "POST",
            url: "http://kartwal.ayz.pl/EventGuide_API/v1/index.php/login",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: jQuery.param({email: userEmail, password: userPassword}),
            success: function (response) {
              if (response["error"] == true) {
                console.log(response["message"]);
              }
              else {

                console.log(response);
                userCredentialsData = response;
                $.mobile.pageContainer.pagecontainer('change', '#listPage', {reverse: false, changeHash: true, transition: 'slide'});
              }
            },
            error: function (errormessage) {
                console.log(errormessage);
            }
        });

}
$(document).on('pageinit', "#listPage",function(){

  showActivityIndicator("Downloading content...");
  downloadEventsList();
  $('#listDiv').show();
  hideActivityIndicator();

});

function showActivityIndicator(popupMessage)
{
    $.mobile.loading( 'show', {text : popupMessage, textVisible : true});
}

function hideActivityIndicator()
{
    $.mobile.loading( 'hide');
}



function downloadEventsList()
{
  $.ajax({
            type: "GET",
            url: "http://kartwal.ayz.pl/EventGuide_API/v1/index.php/getEventsList",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: { 'Authorization': "7194581c02ab6087e7da5881be984fe0" },
            success: function (response) {
              if (response["error"] == true)
              {
                console.log(response["message"]);
              }
              else {
                for(var i = 0; i < response["events"].length; i += 1)
                {
                   $('#eventsList').append('<li class="listItem"><a id="eventListItem" data-transition="slide" href="#detailPage"><img src="testImage/testImage.gif"><div class="listTitle">' + response["events"][i]["event_title"] + '</div>' + '<div class="listDesc">' + response["events"][i]["event_description_short"] + '</div>' + '<div class="listDate"><img class="listIconSize" src="img/icons/calendarIcon.png">' + response["events"][i]["event_start_date"] + '</div>' + '<div class="listNumberUsers"><img class="listIconSize" src="img/icons/usersIcon.png">' + response["events"][i]["participants"] + '</div>'+ '</div></a></li>').listview('refresh');
                }

              }
            },
            error: function (errormessage) {
                console.log(errormessage);
            }
        });

}



function downloadEventDetails(detailsID)
{
  $.ajax({
            type: "GET",
            url: "http://kartwal.ayz.pl/EventGuide_API/v1/index.php/event/" + detailsID,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: { 'Authorization': '7194581c02ab6087e7da5881be984fe0' },
            success: function (msg) {
               console.log(msg);
            },
            error: function (errormessage) {
                console.log("elo");
            }
        });

}


function onConfirm(buttonIndex) {
    alert('You selected button ' + buttonIndex);
    var options = { dimBackground: true };
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
