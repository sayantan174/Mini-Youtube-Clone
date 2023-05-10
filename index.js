const apiKey = "AIzaSyDCl-mPdssmOZ977Hqkx8avB6As3yR6ZoM";
const videosContainer = document.getElementById("videos-container");

//function to load categories for videos
(async function loadCategories() {
  const categoryId =
    "1,2,10,15,17,18,19,20,21,22,34,24,25,26,27,28,29,30,31,32,33,35,36,37,38,39,40,41";
  const endpoint = `https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&key=${apiKey}&id=${categoryId}`;
  const response = await fetch(endpoint);
  const data = await response.json();
  appendCategories(data.items);
})();

//function to load videos based on a sepecific category
async function loadVideosByCategory(id, searchString = "") {
  videosContainer.innerHTML = "";
  if (id !== -1)
    var endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${apiKey}&q=${searchString}&videoCategoryId=${id}&maxResults=50&type=video`;
  else
    var endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${apiKey}&q=${searchString}&maxResults=50&type=video`;
  const response = await fetch(endpoint);
  const data = await response.json();
  for (let i = 0; i < data.items.length; i++) {
    const thumbnail = data.items[i].snippet.thumbnails.high.url;
    const channelIcon = await getChannelIcon(data.items[i].snippet.channelId);
    const videoTitle = data.items[i].snippet.title;
    const channelName = data.items[i].snippet.channelTitle;
    const viewCount = await getViewCount(data.items[i].id.videoId);
    const publishedAt = data.items[i].snippet.publishTime;
    const div = document.createElement("div");
    div.className = "video";
    div.innerHTML = `<img
    src=${thumbnail}
  />
  <div class="logo-container">
    <img
      src=${channelIcon}
    />
    <p>
    ${videoTitle}
    </p>
  </div>
  <p>${channelName}</p>
  <div class="views-container">
    <p>${viewCount}</p>
    <p>${publishedAt}</p>
  </div>`;
    videosContainer.appendChild(div);
  }
}

//function to load videos on clicking a category
function loadVideo(e) {
  const searchInput = document.getElementById("search-input");
  loadVideosByCategory(e.target.dataset.id, searchInput);
}

//function to append categories
function appendCategories(item) {
  const categoryContainer = document.getElementById("chip-container");
  item.forEach((category) => {
    const div = document.createElement("div");
    div.className = "chip";
    div.innerText = category.snippet.title;
    div.setAttribute("data-id", category.id);
    div.addEventListener("click", loadVideo);
    categoryContainer.appendChild(div);
  });
}

//function to get the channel icon
async function getChannelIcon(channelId) {
  const endpoint = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`;
  const response = await fetch(endpoint);
  const data = await response.json();
  return data.items[0].snippet.thumbnails.high.url;
}

//function to get view count of a video
async function getViewCount(videoId) {
  const endpoint = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`;
  const response = await fetch(endpoint);
  const data = await response.json();
  return data.items[0].statistics.viewCount;
}

const search = document.getElementById("search");
search.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchInput = document.getElementById("search-input");
  loadVideosByCategory(-1, searchInput.value);
});
