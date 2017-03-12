var whichPage = {};
whichPage.pageNumber = 1;

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
  nextPage.on('click', pageClick('next'));
  prevPage.on('click', pageClick('prev'));

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

  console.log(data.items[0]);

  let html = data.items? data.items.map(item =>
    `<li class="video-thumbnails" data-id=${item.id.videoId}>
        <img src=${item.snippet.thumbnails.high.url}>
        <h2>${item.snippet.title}</h2>
    </li>`) : '';

  if (data.length === 0){
    html = `<li>No Results Found</li>`;
  }

  searchResults.html(html);
  pageNumber.html(whichPage.pageNumber);
}

function thumbnailClick(){
  $('.player').removeClass('invisible');
  let link = $(this);
  let h1 = $('.player-title');
  let youtubePlayer = document.querySelector('#ytplayer');
  let url = `https://www.youtube.com/embed/${link.data('id')}?autoplay=1&origin="https://www.example.com"`;

  h1.text(link.children('h2').text());
  youtubePlayer.src = url;
  youtubePlayer.width = window.innerWidth * 0.8;
  youtubePlayer.height = window.innerHeight * 0.8;
}

function pageClick(string){
  return () => {
    if(string === 'next'){
      whichPage.pageNumber++;
      search({pageToken: whichPage.nextPageToken});
    } else if(string === 'prev'){
      whichPage.pageNumber--;
      search({pageToken: whichPage.prevPageToken});
    }
  }
}
