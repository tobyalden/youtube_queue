var queue = [];

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'p89luc-8I_s',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  // event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED && queue.length > 0) {
    nextVideo = queue.shift();
    console.log("video finished! nextVideo = " + nextVideo);
    player.loadVideoById(nextVideo);
    drawPage();
  }
}

// jQuery

$(document).ready(function() {

  $("#changeVideo").click(function(event) {
    event.preventDefault()
    console.log("changeVideo clicked");
    var url = $("input#videoUrl").val();
    var id = getIdFromUrl(url);
    player.loadVideoById(id);
    $("input#videoUrl").val("");
  });

  $("#queueVideo").click(function(event) {
    event.preventDefault()
    console.log("queueVideo clicked");
    url = $("input#videoUrl").val();
    queue.push(getIdFromUrl(url));
    drawPage();
    $("input#videoUrl").val("");
  });

  drawPage = function drawPage() {
    $("#queue").empty();
    for(var i = 0; i < queue.length; i++) {
      $("#queue").append('<li> <img src="http://img.youtube.com/vi/' + queue[i] + '/default.jpg"/> </li>');
    }
  }

  function getIdFromUrl(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    } else {
      console.log("Error: Invalid URL");
    }
  }

  $("#getInfo").on("click", function() {
        var url = $("input#videoUrl").val();
        var videoid = getIdFromUrl(url);
				$.getJSON("https://www.googleapis.com/youtube/v3/videos", {
					key: "AIzaSyDEeNLNCbn1bVKlSr36mhssp37QO8n-Cfw",
					part: "snippet,statistics",
					id: videoid
				}, function(data) {
					if (data.items.length === 0) {
						$("<p style='color: #F00;'>Video not found.</p>").appendTo("#video-data-1");
						return;
					}
					$("<img>", {
						src: data.items[0].snippet.thumbnails.medium.url,
						width: data.items[0].snippet.thumbnails.medium.width,
						height: data.items[0].snippet.thumbnails.medium.height
					}).appendTo("#video-data-1");
					$("<h1></h1>").text(data.items[0].snippet.title).appendTo("#video-data-1");
					$("<p></p>").text(data.items[0].snippet.description).appendTo("#video-data-1");
					$("<li></li>").text("Published at: " + data.items[0].snippet.publishedAt).appendTo("#video-data-2");
					$("<li></li>").text("View count: " + data.items[0].statistics.viewCount).appendTo("#video-data-2");
					$("<li></li>").text("Favorite count: " + data.items[0].statistics.favoriteCount).appendTo("#video-data-2");
					$("<li></li>").text("Like count: " + data.items[0].statistics.likeCount).appendTo("#video-data-2");
					$("<li></li>").text("Dislike count: " + data.items[0].statistics.dislikeCount).appendTo("#video-data-2");
				}).fail(function(jqXHR, textStatus, errorThrown) {
					$("<p style='color: #F00;'></p>").text(jqXHR.responseText || errorThrown).appendTo("#video-data-1");
				});
			});

});
