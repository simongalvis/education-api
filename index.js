function submitform() {
    $('#school-search-form').on('submit', function(event) {
        event.preventDefalt();

    })
}
'use strict';


const apiKey = '0e8c31eab44ec4fa6ae11abfbd01ecb9';
const appID = 'ccda50fa';
const searchURL = 'https://api.schooldigger.com/v1.2/schools';
var state = $();

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function findSchools(query, state, schoolLevel) {
    const params = {
        appKey: apiKey,
        appID: appID,
        q: query,
        st: state,
        perPage: 50,
        level: schoolLevel

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
    // iterate through the items array
    for (let i = 0; i < responseJson.schoolList.length; i++) {


        $("#results-list").append(
            `<li>${responseJson.schoolList[i].schoolName}<br>
           <a href=' ${responseJson.schoolList[i].schoolName}'>Click here for more info</a>
             </li>`
        );
    }

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