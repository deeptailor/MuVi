var whichPage = {};
whichPage.pageNumber = 1;
var onYouTubeIframeAPIReady;
window.playlist = [];

$(document).ready(() => {
  let searchWrapper = $('.searchBar-wrapper');
  let magnify = $('.magnify');
  let searchBar = $('.searchBar');
  let player = $('.player');
  let x = $('.fa-chevron-down');
  let results = $('.searchResults');
  let go = $('.searchButton');
  let overlayInstructions = $('.overlay-instructions');
  let nextPage = $('.fa-chevron-right');
  let prevPage = $('.fa-chevron-left');
  let button = $('.buttons');

  /* Trying Youtube iframe api */

  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[1];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


  onYouTubeIframeAPIReady = function () {
    // console.log('player created')
    window.ytPlayer = new YT.Player('ytplayer', {
      height: '390',
      width: '640',
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }

  function onPlayerReady(event) {
    // console.log('player ready');
  }

  function onPlayerStateChange(event) {
    if(event.data === 0){
      if(window.playlist.length){
        var nextSongObject = window.playlist.shift();
        var nextSong = nextSongObject.videoId;
        var nextTitle = decodeURI(nextSongObject.title);

        window.ytPlayer.loadVideoById(nextSong);

        $('.player-title').text(nextTitle);
      }
    }
  }

  /* End Youtube Api*/


  searchWrapper.on('click', () => {
    searchBar.focus();
  });

  overlayInstructions.on('click', () => {
    searchBar.focus();
  });

  searchBar.keypress((e) => {
    if(e.which == 13){
      whichPage.pageNumber = 1;
      search();
      $('.results').removeClass('invisible');
      let position = $('.results').offset();
      $('html, body').animate({scrollTop: position.top}, 1200);
    }
  });

  go.on('click', (e) => {
    e.stopPropagation();
    whichPage.pageNumber = 1;
    search();
    $('.results').removeClass('invisible');
  });

  x.on('click', (e) => {
    e.stopPropagation();
    player.toggleClass('minimized');
  });

  results.on('click', 'li', thumbnailClick);
  results.on('click', '.buttons', playlistAddClick);
  nextPage.on('click', pageClick('next'));
  prevPage.on('click', pageClick('prev'));

  const p = document.getElementById('player');
  p.onmouseup = function(e){
    e.stopPropagation();
    if(document.getSelection){
      let term = document.getSelection().toString();
      if(term !== ''){
        searchBar.val(term);
        search({string: term, override:true});
      }
    }
  }

});

//performs an ajax request with value from input box, and calls displayResults on success
function search(def = {}){
  let date = new Date();
  let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  def.string = def.string || `top 50 songs of the week ${months[date.getMonth()]} ${date.getFullYear()}`;
  var order = 'viewCount';
  let val = this.value || document.querySelector('.searchBar').value;
  let whichPage = def.pageToken;

  if(!val){
    val = def.string;
    order = 'date';
  }

  if(def.override){
    val = def.string;
  }

  window.setTimeout(() => {
    $.ajax({
      url: 'https://www.googleapis.com/youtube/v3/search',
      data: {
        part: 'snippet',
        key: 'AIzaSyAaihODOctZXROz80ygr0E5y297jQ30tfM',
        order: order,
        q: `${val}`,
        safeSearch: 'none',
        type: 'video',
        videoDefinition: 'high',
        maxResults: 50,
        pageToken: whichPage
      },
      success: displayResults,
      error: (e) => console.log(e)
    });
  }, 200);

}

//accepts data in form of an object, maps it to a html string and adds li's to search list
function displayResults(data){
  whichPage.nextPageToken = data.nextPageToken;
  whichPage.prevPageToken = data.prevPageToken;
  const searchResults = $('.searchResults');
  const pageNumber = $('.pageNumber');
  let position = $('.results').offset();
  $('html, body').animate({scrollTop: position.top}, 1200);
  $('.player').addClass('minimized');

  //console.log(data.items[0]);

  let html = data.items? data.items.map(item =>
    `<li class="video-thumbnails" data-id=${item.id.videoId}>
        <div>
          <img src=${item.snippet.thumbnails.high.url}>
          <div class="buttons" data-id=${item.id.videoId} data-title=${encodeURI(item.snippet.title)}>
            <i class="fa fa-plus-square-o" aria-hidden="true"></i>
          </div>
        </div>
        <h2>${item.snippet.title}</h2>
    </li>`) : '';

  if (data.length === 0){
    html = `<li>No Results Found</li>`;
  }

  searchResults.html(html);
  pageNumber.html(whichPage.pageNumber);
}

function playlistAddClick(e){
  e.stopPropagation();

  let videoId = $(this).data('id');
  let title = $(this).data('title')
  window.playlist.push({videoId: videoId, title: title});

  $(this).html('<i class="fa fa-check-square" aria-hidden="true"></i>').css('color', '#17FF00');
}

function thumbnailClick(){

  $('.player').removeClass('invisible');
  $('.player').removeClass('minimized');

  let h1 = $('.player-title');
  let youtubePlayer = document.querySelector('#ytplayer');
  let link = $(this);
  let url = `https://www.youtube.com/embed/${link.data('id')}?autoplay=1&origin="https://www.example.com"`;

  h1.text(link.children('h2').text());

  window.ytPlayer.loadVideoById(link.data('id'));
}

function pageClick(string){
  return () => {
    if(string === 'next'){
      whichPage.pageNumber++;
      search({pageToken: whichPage.nextPageToken});
    } else if(string === 'prev'){
      if(whichPage.pageNumber === 1){
        return;
      }
      whichPage.pageNumber--;
      search({pageToken: whichPage.prevPageToken});
    }
  }
}
