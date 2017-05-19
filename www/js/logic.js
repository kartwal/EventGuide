
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
  if (checkConnection()){
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
                  localStorage.setItem("userEmail", response["email"]);
                  localStorage.setItem("userApiKey", response["apiKey"]);
                  localStorage.setItem("userLogin", response["name"]);
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
  else{
    alert("You dont have internet connection. Action cannot be performed.");
  }

}

function registerAccount(userEmail, userPassword, userLogin)
{


  if (checkConnection()){
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
  else{
    alert("You dont have internet connection. Action cannot be performed.");
  }

}

function signUserToEvent(buttonIndex)
{
  if (buttonIndex == 1)
  {
    if (checkConnection()){
      showActivityIndicator("Signing to evnet...");

      $.ajax({
                type: "POST",
                url: "http://kartwal.ayz.pl/EventGuide_API/v1/index.php/signUserToEvent",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': localStorage.userApiKey },
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
    else{
      alert("You dont have internet connection. Action cannot be performed.");
    }

  }
}

function askToSign()
{
  navigator.notification.confirm(
    'Do you want to sign in this event ?',  // message
    signUserToEvent,         // callback
    'Sign to event',            // title
    ['Yes','No']                 // buttonName
  );
}

function askToAddIntoCalendar()
{
  navigator.notification.confirm(
    'Do you want to add this event into your calendar?',  // message
    createEventInCalendar,         // callback
    'Sign to event',            // title
    ['Yes','No']                 // buttonName
  );
}

$(document).on('pagecreate', "#listPage",function(){

  showActivityIndicator("Downloading content...");
  downloadEventsList();
  $('#listDiv').show();
  hideActivityIndicator();

});

$(document).on('pagebeforeshow', "#settings",function(){

  $('#settingsContent').hide();

});

$(document).on('pageshow', "#settings",function(){

  showActivityIndicator("Downloading user data...");
  $('#userEventsList').empty();
  $('#userCredData').empty();
  $('#userNoEvents').empty();
  downloadUserEvents();
  $('#userEventsContainer').show();
  $('#settingsContent').show();
  hideActivityIndicator();

});

$(document).on('pagebeforeshow', "#inviteUsers",function(){
  $('#usersSet').empty();
  downloadUsers();
});

$(document).on('pagebeforeshow', "#listPage", function(){
  $('#detailsContent').empty();
  eventDetails = {};

});

$(document).on('pagebeforeshow', "#settings", function(){
  $('#detailsContent').empty();
  eventDetails = {};
});

$(document).on('pagecreate', '#login', function(){
    if (localStorage.userEmail)
    {
      document.getElementById("email").value = localStorage.userEmail;
    }
});

$(document).on('pagebeforehide', '#createEvent', function(){
  clearCreateForm();
});


function refreshList()
{
  showActivityIndicator("Downloading content...");
  $('#eventsList').empty();
  downloadEventsList();
  hideActivityIndicator();
}

function navigateToEventPlace()
{
  launchnavigator.navigate([eventDetails["Event Latitude"], eventDetails["Event Longitude"]]);
}

function goToEventWebsite()
{
  window.open(eventDetails['Event Website'], '_blank', 'location=yes');
}

function createEventInCalendar(buttonIndex)
{
  if (buttonIndex == 1)
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
  if (checkConnection()){
    $.ajax({
              type: "GET",
              url: "http://kartwal.ayz.pl/EventGuide_API/v1/index.php/getEventsList",
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              headers: { 'Authorization': localStorage.userApiKey },
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
  else{
    alert("You dont have internet connection. Action cannot be performed.");
  }
}

function downloadUsers()
{
  if (checkConnection()){
    showActivityIndicator("Downloading users list...");
    $.ajax({
              type: "GET",
              url: "http://kartwal.ayz.pl/EventGuide_API/v1/index.php/getAllUsers",
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              headers: { 'Authorization': localStorage.userApiKey },
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
  else{
    alert("You dont have internet connection. Action cannot be performed.");
  }

}

function downloadEventDetails(detailsID)
{
  if (checkConnection()){
    $.ajax({
              type: "GET",
              url: "http://kartwal.ayz.pl/EventGuide_API/v1/index.php/event/" + detailsID,
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              headers: { 'Authorization': localStorage.userApiKey },
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
  else{
    alert("You dont have internet connection. Action cannot be performed.");
  }

}

function downloadUserEvents()
{
  if (checkConnection()){
    $.ajax({
              type: "GET",
              url: "http://kartwal.ayz.pl/EventGuide_API/v1/index.php/getAllUserEvents",
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              headers: { 'Authorization': localStorage.userApiKey },
              success: function (response) {
                if (response["error"] == true)
                {
                  console.log(response["message"]);
                }
                else {

                  var userDataTable = "";

                  userDataTable += '<tr><th>' + "Login:" + '</th><td>' + localStorage.userLogin + '</td></tr></div';
                  userDataTable += '<tr><th>' + "Email Address:" + '</th><td>' + localStorage.userEmail + '</td></tr></div';


                  userDataTable += '</table></div>';
                  $('#userCredData').append('<div class="eventTable"><table class="eventTableStyle">' + userDataTable);

                  if (response["events"].length == 0)
                  {
                    $('#userNoEvents').append('<p>You have not subscribed to any event yet</p>');
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
  else{
    alert("You dont have internet connection. Action cannot be performed.");
  }

}

function downloadUserCreatedEvents()
{
  if (checkConnection()){
    $.ajax({
              type: "GET",
              url: "http://kartwal.ayz.pl/EventGuide_API/v1/index.php/getAllUserEvents",
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              headers: { 'Authorization': localStorage.userApiKey },
              success: function (response) {
                if (response["error"] == true)
                {
                  console.log(response["message"]);
                }
                else {

                  if (response["events"].length == 0)
                  {
                    $('#userNoEvents').append('<p>You have not subscribed to any event yet</p>');
                  }
                  else {
                    for(var i = 0; i < response["events"].length; i += 1)
                    {
                       $('#userEventsCreatedList').append('<li class="listItem"><a id="eventListItem" onclick="goToEventDetails(' + response["events"][i]["event_id"] + ')"><img src=' + response["events"][i]["event_image"] + '><div class="listTitle">' + response["events"][i]["event_title"] + '</div>' + '<div class="listDesc">' + response["events"][i]["event_description_short"] + '</div>' + '<div class="listDate"><img class="listIconSize" src="img/icons/calendarIcon.png">' + response["events"][i]["event_start_date"] + '</div>' + '<div class="listNumberUsers"><img class="listIconSize" src="img/icons/usersIcon.png">' + response["events"][i]["participants"] + '</div>'+ '</div></a></li>').listview('refresh');
                    }
                  }
                }
              },
              error: function (errormessage) {
                  console.log(errormessage);
              }
          });
}

function scan()
{
  console.log("Starting scanning");
  showActivityIndicator("Scanner is turning on...")
  cordova.plugins.barcodeScanner.scan(
         function (result) {
              if(!result.cancelled){
                     if(result.format == "QR_CODE"){
                          $.mobile.pageContainer.pagecontainer('change', '#detailPage', {reverse: false, changeHash: true, transition: 'slide'});
                          showActivityIndicator("Downloading event details...");
                          downloadEventDetails(result.text);
                          hideActivityIndicator();

                     }else{
                        alert("Sorry, only qr codes are supported");
                     }
              }else{
                //scan was dismissed by user, no alert
                hideActivityIndicator();
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

function sendInvs(){
    var count = $("#usersFieldSet input:checked").length;
    var str = "";

    for(i=0;i<count;i++){
        str += " "+$("#usersFieldSet input:checked")[i].value+" , ";

    }
    var links = str;

    if (str == "")
    {
      alert("You have not selected any user!");
    }
    else {
      window.location = 'mailto:' + links + '?subject=' + "Event Guide Invitation" + '&body=' +   'You have recieved invitation to Event by EventGuide App. Scan QR CODE by EventGuide app to see details and sign in this Event. Link: ' + eventDetails["QR Code"] ;
    }
}

function createNewEvent()
{
  var valid = true;
  var dict = [];
  $('#createEventFielset :input').each(function(index,element) {
      if (element.value == "")
      {
        valid = false
      }
      else {
        dict.push({
          value:  element.value
        });
      }
  });
  if (valid == false)
  {
    alert("You must fill all the fields");
  }else {
    alert("Great !");
    console.log(dict);
    sendEventData(dict);
  }

}

function clearCreateForm()
{
  var dict = [];
  $('#createEventFielset :input').each(function(index,element) {
      if (element.value != "")
      {
        element.value = ""
      }
  });

}

function sendEventData(newEventData){

  if (checkConnection()){
    $.ajax({
              type: "POST",
              url: "http://kartwal.ayz.pl/EventGuide_API/v1/index.php/createEvent",
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': localStorage.userApiKey},
              data: jQuery.param({event_title: newEventData[0].value, event_description : newEventData[1].value, event_latitude : newEventData[2].value, event_longitude : newEventData[3].value, event_start_date : newEventData[4].value, event_end_date : newEventData[5].value, event_additional_info : newEventData[6].value, event_image : newEventData[7].value, event_max_participants : newEventData[8].value, event_description_short : newEventData[9].value, event_address : newEventData[10].value, event_city : newEventData[11].value, event_tickets : newEventData[13].value, event_card_payment : newEventData[14].value, event_accepted : "0", event_website : newEventData[12].value}),
              success: function (response) {
                  console.log(response);
                if (response["error"] == true)
                {
                  console.log(response["error"]);
                  hideActivityIndicator();
                  alert(response["message"]);
                } else {
                  hideActivityIndicator();
                  alert("Event was created successfully. Admin must accept your event. It will take couple of minutes");
                }
              },
              error: function (errormessage) {
                hideActivityIndicator();
                console.log(errormessage["responseText"]);
                  alert("There was an error - try again later");
              }
          });
  }
  else{
    alert("You dont have internet connection. Action cannot be performed.");
  }

}

function checkConnection() {
    var networkState = navigator.connection.type;
    var isConnected = false;
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    alert(states[networkState]);
    if (states[networkState] != 'No network connection' ||  states[networkState] != 'Unknown connection' || states[networkState] != 'Cell generic connection')
    {
      isConnected = true;
    }

    return isConnected;
}
