$(document).ready(function () {
    // console.log("Hello");

    // Function to get the current location of the ISS by lattitude/longitude.
    function getISSLocation() {
        var mymap = L.map('mapid').setView([0, 0], 2);

        function moveISS() {
            $.getJSON('http://api.open-notify.org/iss-now.json?callback=?', function (data) {
                var lat = data['iss_position']['latitude'];
                var lon = data['iss_position']['longitude'];

                iss.setLatLng([lat, lon]);
                isscirc.setLatLng([lat, lon]);
                mymap.panTo([lat, lon], animate = true);
            });
            setTimeout(moveISS, 5000);
        }

        // Leaflet map 
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoiZXdlbGxzODkiLCJhIjoiY2tnY3p6b2pjMDhxODJzcGV1MTlwbHNnayJ9.8c10WiHSmEVy8wf4CbjNjw'
        }).addTo(mymap);

        // Icon to display the ISS position on the leaflet map
        var ISSIcon = L.icon({
            iconUrl: './assets/ISSIcon.png',
            iconSize: [50, 30],
            iconAnchor: [25, 15],
            popupAnchor: [50, 25],
            shadowUrl: './assets/ISSIcon_shadow.png',
            shadowSize: [60, 40],
            shadowAnchor: [30, 15]
        });


        var iss = L.marker([0, 0], { icon: ISSIcon }).addTo(mymap);
        var isscirc = L.circle([0, 0], 800e3, { color: "#c22", opacity: 0.3, weight: 1, fillColor: "#c22", fillOpacity: 0.1 }).addTo(mymap);

        moveISS();

    };

   
    $("#searchBtn").on("click",function(event){
        event.preventDefault();

        var postalCode = "30328"//$("zipCode").val();
        // var city = $("city").val();
        // var state = $("state").val();
        var geocodeURL = 'http://open.mapquestapi.com/geocoding/v1/address?key=CRg7ye19CBAPnrjmea0n5OjRpXHiXHYG' + '&postalCode=' + postalCode 
        // + '&city=' + city + '&state=' + state;

            $.ajax({
                url: geocodeURL,
                method: "GET"
            }).then(function(response) {
                console.log("geocode response");
                console.log(response)
            
                var lat = response.results[0].locations[0].latLng.lat;
                var lon = response.results[0].locations[0].latLng.lng;
                console.log(lat);
                console.log(lon);
                getPassby();

                function getPassby(){
                    $.getJSON('http://api.open-notify.org/iss-pass.json?' + 'lat=' + lat + '&lon=' + lon + '&callback=?', function (data) {
                        data['response'].forEach(function (d) {
                            var date = new Date(d['risetime'] * 1000);
                            $('#isspass').append('<li>' + date.toString() + '</li>');
                            console.log("Passby");
                            console.log(date)
                        });
                    });

                }
            })

        

    })
   
    // Function to get the times when the ISS will pass by a certain location by latitude/longitude.
    // function getPassby() {
    //     // var lat = "";
    //     var lat = "45.0";
    //     // var lon = "";
    //     var lon = "122.3";

    //     $.getJSON('http://api.open-notify.org/iss-pass.json?' + 'lat=' + lat + '&lon=' + lon + '&callback=?', function (data) {
    //         data['response'].forEach(function (d) {
    //             var date = new Date(d['risetime'] * 1000);
    //             $('#isspass').append('<li>' + date.toString() + '</li>');
    //             console.log("Passby");
    //             console.log(date)
    //         });
    //     });
    // }

    // Function to get the list of people who are currently in space and which craft they are on.
    function getPeople() {
        $.getJSON('http://api.open-notify.org/astros.json', function (data) {
            console.log(data.number);
            console.log(data)
        });

    }

    //function for weather
    //call back function
    $("#searchBtn").click(function () {
        var cityLocation = $("formInput").val();
        console.log(cityLocation);
        cityForecast(cityLocation);

        //weather function 
        function cityForecast(cityLocationValue) {
            var apiKey = "63de61e390b4a0f5e75ff9df058d248b";
            var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
                cityLocationValue + "&appid=" + apiKey;
            console.log(queryURL)

            //ajax call
            $.ajax({
                url: queryURL,
                method: "GET",
                dataType: "json",
                success: function (response) {
                    console.log(response);

                    var tempF = Math.round((response.main.temp - 273.15) * 1.8 + 32);
                }
            })


        }
    });

    getISSLocation();
    getPassby();
    getPeople();
});


