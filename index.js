function submitform() {
    $('#school-search-form').on('submit', function(event) {
        event.preventDefalt();

    })
}
'use strict';


const apiKey = 'aec6358aeeb22f6ce43a57db13ffb87e';
const appID = 'ccda50fa';


const searchURL = 'https://api.schooldigger.com/v1.2/schools';
var state = $();


//Format the query parameters
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

//Function taking in school name or city and state abbreviation
function findSchools(query, state) {
    const params = {
        appKey: apiKey,
        appID: appID,
        q: query,
        st: state,
        perPage: 500

    };
    const queryString = formatQueryParams(params);
    const url = searchURL + "?" + queryString;

    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                $('#error-message').addClass("hidden");
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $("#error-message").html(`<h3>Something went wrong, please try again! For the 'State' section,
             remember to enter an abbreviation such as 'FL' instead of 'Florida' ${err.message}</h3>`);
            $('#error-message').removeClass("hidden");
        });
}

//Results to DOM
function displayResults(responseJson) {
    console.log(responseJson);
    $('#results-list').empty();
    for (let i = 0; i < responseJson.schoolList.length; i++) {
        $("#results-list").append(`<div class="item"><li><div class="list-item-content">Name: ${responseJson.schoolList[i].schoolName} <br>
        Grade Level(s): ${responseJson.schoolList[i].lowGrade} -  ${responseJson.schoolList[i].highGrade}<br>
        Private School: ${responseJson.schoolList[i].isPrivate} <br>
        Phone #: ${responseJson.schoolList[i].phone} <br>
        More Info: <a href ="${responseJson.schoolList[i].url}" target = '_blank' >School Info Link</a> </div> </li>`);
        removeHidden();
    }

}

//Remove hidden class from footer
function removeHidden() {
    $('footer').removeClass("hidden");
    console.log("removeHidden Ran");
}



function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-search-term').val();
        const searchState = $('#js-state').val();
        findSchools(searchTerm, searchState);
        console.log(searchState)
        $(".insertState").text(`Search results for ${searchTerm}`);
    });
}

$(watchForm);



//Base url: https://api.schooldigger.com
