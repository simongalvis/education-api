'use strict';

function submitform() {
    $('#school-search-form').on('submit', function(event) {
        event.preventDefalt();

    })
}



const apiKey = 'aec6358aeeb22f6ce43a57db13ffb87e';
const appID = 'ccda50fa';
let userFriendlyPrivateSchoolBoolean = 'Yes';


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



    fetch(url)

    .then(response => {
            if (response.ok) {
                $('#error-message').addClass("hidden");
                //console.log(response);
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            if (responseJson.numberOfSchools === 0) {
                $('#results-list').empty();
                $("#error-message").html(`<b>We couldn't find any results based on your search, please try again! For both input sections, make sure that there are no extra spaces in your submission and double check that you're using correct spelling.</b>`);
                $('#error-message').removeClass("hidden");
            }
            isPrivateFormatter(responseJson)
            displayResults(responseJson)
        })
        .catch(err => {
            $('#results-list').empty();
            $("#error-message").html(`<b>Something went wrong, please try again! For both input sections, make sure that there are no extra spaces in your submission.</b> ${err.message}`);
            $('#error-message').removeClass("hidden");
        });
}

//Changes user result of Private School from "true" or "false" to "Yes" or "No"
function isPrivateFormatter(responseJson) {
    for (let i = 0; i < responseJson.schoolList.length; i++) {
        if (responseJson.schoolList[i].isPrivate === false) {
            responseJson.schoolList[i].isPrivate = 'No';
        } else responseJson.schoolList[i].isPrivate = 'Yes';
    }
}
//Results to DOM
function displayResults(responseJson) {
    // console.log(responseJson);
    //console.log(responseJson.numberOfSchools);
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
}


//Include placeholder text when form is clicked
function insertPlaceholder() {

    $('#js-search-term').focusin(function(event) {
        $(this).attr('placeholder', 'Example: "Denver"');
    });
    $('#js-search-term').focusout(function(event) {
        $(this).attr('placeholder', '');
    });

    $('#js-state').focusin(function(event) {
        $(this).attr('placeholder', 'Example: "CO"');
    });
    $('#js-state').focusout(function(event) {
        $(this).attr('placeholder', '');
    });
}


function watchForm() {
    insertPlaceholder();
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-search-term').val();
        const searchState = $('#js-state').val();
        findSchools(searchTerm, searchState);
        //console.log(searchState);
        $(".insertState").text(`Search results for ${searchTerm}`);
    });
}

$(watchForm);



//Base url: https://api.schooldigger.com