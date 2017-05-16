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

$(document).on('pageinit', "#settings",function(){

  showActivityIndicator("Downloading user data...");
  downloadUserEvents();
  $('#userEventsContainer').show();
  hideActivityIndicator();

});

$(document).on('pagebeforehide', "#detailPage", function(){
  $('#detailsContent').empty();

});

function navigateToEventPlace()
{
  console.log("Nawiguje");

  launchnavigator.navigate("London, UK");
}

function createEventInCalendar()
{
  console.log("creating event...");
  var start = new Date(2017,4,26,18,30,0,0,0); // beware: month 0 = january, 11 = december
  var end = new Date(2017,4,36,19,30,0,0,0);
  var success = function(message) { alert("Success: " + JSON.stringify(message)); };
  var error = function(message) { alert("Error: " + message); };
  window.plugins.calendar.createEvent("test","SO","Short event info",start,end,success,error);
}

function showActivityIndicator(popupMessage)
{
    $.mobile.loading( 'show', {text : popupMessage, textVisible : true});
}

function hideActivityIndicator()
{
    $.mobile.loading( 'hide');
}

function goToEventDetails(eventDetailsID)
{
    $.mobile.pageContainer.pagecontainer('change', '#detailPage', {reverse: false, changeHash: true, transition: 'slide'});
    showActivityIndicator("Downloading event details...");
    downloadEventDetails(eventDetailsID);
    hideActivityIndicator();
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
                   $('#eventsList').append('<li class="listItem"><a id="eventListItem" onclick="goToEventDetails(' + response["events"][i]["event_id"] + ')"><img src=' + response["events"][i]["event_image"] + '><div class="listTitle">' + response["events"][i]["event_title"] + '</div>' + '<div class="listDesc">' + response["events"][i]["event_description_short"] + '</div>' + '<div class="listDate"><img class="listIconSize" src="img/icons/calendarIcon.png">' + response["events"][i]["event_start_date"] + '</div>' + '<div class="listNumberUsers"><img class="listIconSize" src="img/icons/usersIcon.png">' + response["events"][i]["participants"] + '</div>'+ '</div></a></li>').listview('refresh');
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
            success: function (response) {
              if (response["error"] == true)
              {
                console.log(response["message"]);
              }
              else
              {
                console.log(response["event_title"]);

                $('#detailsContent').append('<div><img class="eventImage" src=' + response["event_image"] + '></div><div class="eventTitle">' + response["event_title"] + '</div><div class="eventDescription">' + response["event_description"] + '</div>');
                var tempString = '';
                $.each(response, function (index, itemData) {
                  if (index != "error" && index != "event_title" && index != "event_image" && index != "event_description" && index != "event_description_short" && index != "event_accepted" && index != "QR Code")
                  {
                    console.log(index);
                      switch (index) {
                        case ('Event Tickets'):
                          if (itemData == 0)
                          {
                            tempString += '<tr><th>' + index + '</th><td>' + "Tickets are not required" + '</td></tr></div';
                          }
                          else {
                            tempString += '<tr><th>' + index + '</th><td>' + "Tickets are required" + '</td></tr></div';
                          }
                          break;
                        case ("Event card payment"):
                          if (itemData == 0)
                          {
                            tempString += '<tr><th>' + index + '</th><td>' + "Card payment is not supported" + '</td></tr></div';
                          }
                          else {
                            tempString += '<tr><th>' + index + '</th><td>' + "You can pay by card" + '</td></tr></div';
                          }
                          break;
                        case ("Event max participants"):
                          if (itemData == 0)
                          {
                            tempString += '<tr><th>' + index + '</th><td>' + "Unlimited" + '</td></tr></div';
                          }
                          else {
                            tempString += '<tr><th>' + index + '</th><td>' + itemData + '</td></tr></div';
                          }
                          break;
                        default:
                          tempString += '<tr><th>' + index + '</th><td>' + itemData + '</td></tr></div';
                          break;
                      }


                  }
                });
                tempString += '</table></div>';
                $('#detailsContent').append('<div class="eventTable"><table class="eventTableStyle">' + tempString);
                $('#detailsContent').append('<div><img class="eventQRCode" id="QRcode" src=' + response["QR Code"] + '></div>');
              }
            },
            error: function (errormessage) {
                console.log("elo");
            }
        });

}

function downloadUserEvents()
{
  $.ajax({
            type: "GET",
            url: "http://kartwal.ayz.pl/EventGuide_API/v1/index.php/getAllUserEvents",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: { 'Authorization': '7194581c02ab6087e7da5881be984fe0' },
            success: function (response) {
              if (response["error"] == true)
              {
                console.log(response["message"]);
              }
              else {
                console.log(response);
                for(var i = 0; i < response["events"].length; i += 1)
                {
                   $('#userEventsList').append('<li class="listItem"><a id="eventListItem" onclick="goToEventDetails(' + response["events"][i]["event_id"] + ')"><img src=' + response["events"][i]["event_image"] + '><div class="listTitle">' + response["events"][i]["event_title"] + '</div>' + '<div class="listDesc">' + response["events"][i]["event_description_short"] + '</div>' + '<div class="listDate"><img class="listIconSize" src="img/icons/calendarIcon.png">' + response["events"][i]["event_start_date"] + '</div>' + '<div class="listNumberUsers"><img class="listIconSize" src="img/icons/usersIcon.png">' + response["events"][i]["participants"] + '</div>'+ '</div></a></li>').listview('refresh');
                }

              }
            },
            error: function (errormessage) {
                console.log(errormessage);
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
                     if(result.format == "QR_CODE"){
                          $.mobile.pageContainer.pagecontainer('change', '#detailPage', {reverse: false, changeHash: true, transition: 'slide'});
                          showActivityIndicator("Downloading event details...");
                          downloadEventDetails(value);
                          hideActivityIndicator();

                     }else{
                        alert("Sorry, only qr codes are supported");
                     }
              }else{
                //scan was dismissed by user
              }
           },
           function (error) {
                alert("An error ocurred: " + error);
           }
        );

}
