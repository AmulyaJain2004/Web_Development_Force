const YOUTUBE_API_KEY = "AIzaSyBnzDaFOhLVtro-x22omyTvsgJyBUGxt-8";
const searchQuery = "Unstoppable - Sia";

fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&key=${YOUTUBE_API_KEY}`)
  .then(response => response.json())
  .then(data => console.log(data));

const SPOTIFY_ACCESS_TOKEN = "YOUR_SPOTIFY_ACCESS_TOKEN";

  fetch("https://api.spotify.com/v1/me/top/tracks", {
    headers: {
      Authorization: `Bearer ${SPOTIFY_ACCESS_TOKEN}`
    }
  })
    .then(response => response.json())
    .then(data => console.log(data));
  