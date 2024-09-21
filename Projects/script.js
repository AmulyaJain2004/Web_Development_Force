document.getElementById('videoForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const videoUrl = document.getElementById('videoUrl').value;
    const videoId = extractVideoId(videoUrl);
    if (videoId) {
        embedVideo(videoId);
    } else {
        alert("Invalid YouTube URL!");
    }
});

function extractVideoId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

function embedVideo(videoId) {
    const videoContainer = document.getElementById('videoContainer');
    videoContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&showinfo=0&rel=0&modestbranding=1" allowfullscreen></iframe>`;
}
