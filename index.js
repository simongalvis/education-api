function submitform() {
    $('#school-search-form').on('submit', function(event) {
        event.preventDefalt();

    })
}
'use strict';



// const apiKey = '2baff53cae2d4ab826a5355443a529ba';
// const appID = '095e8d22';


const apiKey = 'aec6358aeeb22f6ce43a57db13ffb87e';
const appID = 'ccda50fa';


const searchURL = 'https://api.schooldigger.com/v1.2/schools';
var state = $();

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

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
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $("#js-error-message").text(`Something went wrong: ${err.message}`);
        });
}


function displayResults(responseJson) {
    console.log(responseJson);
    $('#results-list').empty();
    for (let i = 0; i < responseJson.schoolList.length; i++) {
        $("#results-list").append(`<div class="item"><li><div class="list-item-content">Name: ${responseJson.schoolList[i].schoolName} <br>
        Grade Level(s): ${responseJson.schoolList[i].lowGrade} -  ${responseJson.schoolList[i].highGrade}<br>
        Private School: ${responseJson.schoolList[i].isPrivate} <br>
          Phone #: ${responseJson.schoolList[i].phone} <br>
           More Info: <a href ="${responseJson.schoolList[i].url}" target = '_blank' >School Info Link</a> </div> </li>`);
        console.log("This function ran");
        removeHidden();
    }

}

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
        console.log('edede');

    });
}

$(watchForm);



//Base url: https://api.schooldigger.com