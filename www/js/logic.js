var userCredentialsData = {};
var eventDetails = {};


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

      var values = {};
      $.each($('#loginForm').serializeArray(), function(i, field) {
          values[field.name] = field.value;
      });

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

      var values = {};
      $.each($('#registerForm').serializeArray(), function(i, field) {
          values[field.name] = field.value;
      });

      registerAccount(values["email"], values["password"], values["userLogin"]);

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
  showActivityIndicator("Logging in...");
  $.ajax({
            type: "POST",
            url: "http://kartwal.ayz.pl/EventGuide_API/v1/index.php/login",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: jQuery.param({email: userEmail, password: userPassword}),
            success: function (response) {
              if (response["error"] == true) {
                hideActivityIndicator();
                alert(response["message"]);
              }
              else {

                console.log(response);
                userCredentialsData = response;
                hideActivityIndicator();
                $.mobile.pageContainer.pagecontainer('change', '#listPage', {reverse: false, changeHash: true, transition: 'slide'});
              }
            },
            error: function (errormessage) {
              hideActivityIndicator();
              alert(errormessage);
              console.log(errormessage);
            }
        });
}

function registerAccount(userEmail, userPassword, userLogin)
{
  showActivityIndicator("Register is performing...");

  $.ajax({
            type: "POST",
            url: "http://kartwal.ayz.pl/EventGuide_API/v1/index.php/register",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: jQuery.param({email: userEmail, password: userPassword, login: userLogin }),
            success: function (response) {
              if (response["error"] == true)
              {
                console.log(response["error"]);
                hideActivityIndicator();
                alert(response["message"]);
              } else {
                hideActivityIndicator();
                alert("Registration complete. Now you can log in.");
              }
            },
            error: function (errormessage) {
              hideActivityIndicator();
                alert(errormessage);
            }
        });
}

function signUserToEvent()
{
  showActivityIndicator("Signing to evnet...");

  $.ajax({
            type: "POST",
            url: "http://kartwal.ayz.pl/EventGuide_API/v1/index.php/signUserToEvent",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': "0510427259451e8d38bf38ef2a5b2bac" },
            data: jQuery.param({eventID: eventDetails["Event ID"]}),
            success: function (response) {

              hideActivityIndicator();

              switch (response["responseCode"]) {

                case 1:
                  alert(response["message"]);
                  break;

                case 2:
                  alert(response["message"]);
                  break;

                case 0:
                  alert(response["message"]);
                  break;
                default:

              }

            },
            error: function (errormessage) {
                console.log(errormessage);
            }
        });
}

$(document).on('pagecreate', "#listPage",function(){

  showActivityIndicator("Downloading content...");
  downloadEventsList();
  $('#listDiv').show();
  hideActivityIndicator();

});

$(document).on('pagecreate', "#settings",function(){

  showActivityIndicator("Downloading user data...");
  downloadUserEvents();
  $('#userEventsContainer').show();
  hideActivityIndicator();

});

$(document).on('pagechange', "#detailPage",function(){
  $('#detailsContent').empty();
  eventDetails = {};
  showActivityIndicator("Downloading content...");

});

$(document).on('pagecreate', "#inviteUsers",function(){

  downloadUsers();

});

$(document).on('pagebeforeshow', "#listPage", function(){

  $('#detailsContent').empty();
  eventDetails = {};
});

function navigateToEventPlace()
{
  launchnavigator.navigate([eventDetails["Event Latitude"], eventDetails["Event Longitude"]]);
}

function goToEventWebsite()
{
  window.open(eventDetails['Event Website'], '_blank', 'location=yes');
}

function createEventInCalendar()
{
  var start = new Date(eventDetails["Event Start Date"]);
  var end = new Date(eventDetails["Event End Date"]);

  var addingComplete = function(message) {alert("Adding into your calendar is complete");};

  var addingError = function(message) {alert(message);};

  var success = function(message) {
      if (message == ""){
        window.plugins.calendar.createEvent(eventDetails["event_title"],eventDetails["Event Start Date"],eventDetails["event_description_short"],start,end,addingComplete,addingError);
      }
      else {
        alert("You already have this event in your calendar");
      }
  };

  var error = function(message) { alert(JSON.stringify(message)); };

  window.plugins.calendar.findEvent(eventDetails["event_title"],eventDetails["Event Start Date"],eventDetails["event_description_short"],start,end,success,error);
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
    // showActivityIndicator("Downloading event details...");
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

function downloadUsers()
{
  showActivityIndicator("Downloading users list...");
  $.ajax({
            type: "GET",
            url: "http://kartwal.ayz.pl/EventGuide_API/v1/index.php/getAllUsers",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: { 'Authorization': "7194581c02ab6087e7da5881be984fe0" },
            success: function (response) {
              if (response["error"] == true)
              {
                console.log(response["message"]);
              }
              else {

                createCheckboxes(response["users"]);

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
                eventDetails = response;
                $('#detailsContent').append('<div><img class="eventImage" src=' + response["event_image"] + '></div><div class="eventTitle">' + response["event_title"] + '</div><div class="eventDescription">' + response["event_description"] + '</div>');
                var tempString = '';
                $.each(response, function (index, itemData) {
                  if (index != "error" && index != "event_title" && index != "event_image" && index != "event_description" && index != "event_description_short" && index != "event_accepted" && index != "QR Code" && index != "Event Website" && index != "Event Latitude" && index != "Event Longitude")
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
                console.log(errormessage);
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

                if (response["events"].length == 0)
                {
                  $('#userEventsList').append('<p>You have not subscribed to any event yet</p>');
                }
                else {
                  for(var i = 0; i < response["events"].length; i += 1)
                  {
                     $('#userEventsList').append('<li class="listItem"><a id="eventListItem" onclick="goToEventDetails(' + response["events"][i]["event_id"] + ')"><img src=' + response["events"][i]["event_image"] + '><div class="listTitle">' + response["events"][i]["event_title"] + '</div>' + '<div class="listDesc">' + response["events"][i]["event_description_short"] + '</div>' + '<div class="listDate"><img class="listIconSize" src="img/icons/calendarIcon.png">' + response["events"][i]["event_start_date"] + '</div>' + '<div class="listNumberUsers"><img class="listIconSize" src="img/icons/usersIcon.png">' + response["events"][i]["participants"] + '</div>'+ '</div></a></li>').listview('refresh');
                  }
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
                //scan was dismissed by user, no alert
              }
           },
           function (error) {
                alert("An error ocurred: " + error);
           }
        );

}

function createCheckboxes(usersArray){
         var array = [{ name: "John", value: "1"}, { name: "Alex", value: "2"},{ name: "John2", value: "3"}, { name: "Alex2", value: "4"}];
         var length = usersArray.length;

          $("#usersSet").append('<fieldset id="usersFieldSet" data-role="controlgroup">');
         for(var i=0;i<length;i++){
            $("#usersFieldSet").append('<input type="checkbox" name="'+ usersArray[i]["user_id"] +'" id="' + i +'" value="'+ usersArray[i]["user_email"] + '"/><label for="'+ i + '">' + usersArray[i]["user_login"] +'</label>');
         }
         $("#usersFieldSet").trigger("create");

}

showToast = function (text) {
                text = text == null ? 'finished or canceled' : text;
                setTimeout(function () {
                    if (window.Windows !== undefined) {
                        showWinDialog(text);
                    } else
                    if (window.plugins && window.plugins.toast) {
                        window.plugins.toast.showShortBottom(String(text));
                    }
                    else {
                        alert(text);
                    }
                }, 100);
            };

function sendInvs(){
    var count = $("#usersFieldSet input:checked").length;
    var str = '';
    for(i=0;i<count;i++){
        str += ' '+$("#usersFieldSet input:checked")[i].value+', ';
    }
    alert("You selected----"+str);

    cordova.plugins.email.isAvailable(

        function (isAvailable) {
            alert('Before proceeding check your mail settings ...') ;
        }
    );

    cordova.plugins.email.open();
}
