'use strict';

// API key 
// regular wesites roots
const apiKey = 'AIzaSyDrR9FT_TwhuwtPXO-IFlzP_G7UdA4LgZM'; 
const youTubeURL = 'https://www.googleapis.com/youtube/v3/search';
const youTubeWatch = 'https://www.youtube.com/watch';
const libraryURL = 'https://openlibrary.org/subjects/';
const coverImgURL = 'https://covers.openlibrary.org/b/id/';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayYouTubeResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#y-results-list').empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.items.length; i++){
    // for each video object in the items 
    //array, add a list item to the results 
    //list with the video title, 
    //and thumbnail
    // making the video url from the video id and channel title
    const params = {
        v: responseJson.items[i].id.videoId,
        ab_channel: responseJson.items[i].snippet.channelTitle.replace(/\s/g, ''),
      };
    const queryString = formatQueryParams(params)
    const cUrl = youTubeWatch + '?' + queryString;
  
    $('#y-results-list').append(
        `<div class="card" onclick="clickHandler('${cUrl}')">
            <img src='${responseJson.items[i].snippet.thumbnails.medium.url}'>
            <div class="cont">
              <h4>${responseJson.items[i].snippet.title}</h4>
            </div>
        </div>`
    )};
  //display the results section  
  $('#y-results').removeClass('hidden');
};

function displayLibraryResults(responseJson) {
    // if there are previous results, remove them
    console.log(responseJson);
    $('#l-results-list').empty();

    if(responseJson.ebook_count === 0){
      $('#l-results-list').html(
        `<div>
          <h3>There are no results.</h3>
        </div>`
      )} else {

    // iterate through the items array
    for (let i = 0; i < responseJson.works.length; i++){
    //   for each book in the array,
    //   it will display the cover and title with links
      $('#l-results-list').append(
        `<div class="card" onclick="clickHandler('http://openlibrary.org${responseJson.works[i].key}')">
            <img src="${coverImgURL}${responseJson.works[i].cover_id}-L.jpg">
            <div class="cont">
            <h4>${responseJson.works[i].title}</h4>
            </div>
        </div>`
      )};
      
    } 

    //display the results section  
    $('#results').removeClass('hidden');
  };

function getYouTubeVideos(query, maxResults=10) {

  const params = {
    key: apiKey,
    q: query,
    part: 'snippet',
    maxResults,
    type: 'video'
  };

  const queryString = formatQueryParams(params)
  const yUrl = youTubeURL + '?' + queryString;

  console.log(yUrl);

  fetch(yUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayYouTubeResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function getOpenLibraryBooks(query, maxResults=10) {

    const params = {
      mode: 'ebooks',
      limit: maxResults,
      has_fulltext: 'true'
    };

    const queryString = formatQueryParams(params)
    const lUrl = libraryURL + `${query}.json` + '?' + queryString;
  
    console.log(lUrl);
  
    fetch(lUrl)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => displayLibraryResults(responseJson))
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });
}
// click on cards to got to the item's url
function clickHandler (url){
    window.open(url, "_blank");
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val().toLowerCase();
    const maxResults = $('#js-max-results').val();
    getYouTubeVideos(searchTerm, maxResults);
    getOpenLibraryBooks(searchTerm, maxResults);
  });
}

$(watchForm);