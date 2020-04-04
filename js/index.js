let link = "https://www.googleapis.com/youtube/v3/search?key=";
let YouTubeKey = "AIzaSyBpFRzvUcTKEApgOlsexyeEIUfm5kERN9Q";
let type = "&type=video";
let part = "&part=snippet";
let maxResults = "&maxResults=10";
let videos = document.querySelector(".results");
let token = "&pageToken=";
let order = "&order=rating";

//Fetch call of the YouTube API
function fetchVideos(search, page) {
  console.log(search);
  let url =
    link +
    YouTubeKey +
    type +
    part +
    maxResults +
    token +
    page +
    order +
    "&" +
    "q=" +
    search;
  console.log(url);
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJSON) => {
      displayVideos(responseJSON, search);
    })
    .catch((err) => {
      console.log(err.message);
    });
}
//Function display videos for displaying the results of the Fetch call to the result ul
function displayVideos(response, search) {
  let results = document.querySelector(".results");
  results.innerHTML = "";
  response.items.forEach((element) => {
    let videoLink = `https://www.youtube.com/watch?v=${element.id.videoId}`;
    let videoImage = element.snippet.thumbnails.medium.url;
    let videoTitle = element.snippet.title;
    results.innerHTML += `
    <div class="segment">
    <img src = ${videoImage} alt="videoThumbnail">  
    <a href = ${videoLink} target="_blank">
        <p>${videoTitle}</p>
      </a>
    </div>
  `;
  });

  // Selecting the buttons through the DOM
  let next = document.querySelector("#next");
  let prev = document.querySelector("#previous");

  //Removing the hidden attribute of the next button when doing the first search
  next.removeAttribute("hidden");

  //Adding the attribute of the nextPageToken to reuse it when next button is pressed
  next.setAttribute("value", response.nextPageToken);

  //Event listener of the next button
  next.addEventListener("click", (event) => {
    event.preventDefault();
    //Fetch call using the attribute of the nextPageToken added to the button
    fetchVideos(search, next.getAttribute("value"));
    //Removing the hidden attribute of the prev button
    prev.removeAttribute("hidden");
    //Setting the new attributes of the prev and next tokens
    next.setAttribute("value", response.nextPageToken);
    prev.setAttribute("value", response.prevPageToken);
  });

  //Event listner of the previous button
  prev.addEventListener("click", (event) => {
    event.preventDefault();
    //Fetch call using the attribute of the prevPageToken added to the button
    fetchVideos(search, response.prevPageToken);
    //Updating the previous token
    prev.setAttribute("value", response.prevPageToken);
  });
}
// Search video function that gets the input of the search bar
function searchVideo() {
  let clickBtn = document.querySelector(".search-button");
  clickBtn.addEventListener("click", (event) => {
    event.preventDefault();
    let input = document.querySelector("#videoSearch").value.trim();
    if (input !== "") {
      fetchVideos(input, "");
    }
    input.value == "";
  });
}

function init() {
  searchVideo();
}

init();
