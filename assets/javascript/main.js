$(document).ready(() => {
  let magnify = $('.magnify');
  let searchBar = $('.searchBar');
  let player = $('.player');
  let x = $('.fa-times');
  let results = $('.searchResults');

  magnify.on('click', () => {
    searchBar.focus();
  });

  searchBar.keypress((e) => {
    if(e.which == 13){
      search();
      $('.results').removeClass('invisible');
      let position = $('.results').offset();
      $('html, body').animate({scrollTop: position.top}, 1200);
    }
  });

  x.on('click', () => {
    console.log('clicked');
    player.addClass('invisible');
  });

  results.on('click', 'li', thumbnailClick);


});

//performs an ajax request with value from input box, and calls displayResults on success
function search(){
  let val = this.value || document.querySelector('.searchBar').value;

  console.log(val);
  window.setTimeout(() => {
    $.ajax({
      url: 'https://www.googleapis.com/youtube/v3/search',
      data: {
        part: 'snippet',
        key: 'AIzaSyAaihODOctZXROz80ygr0E5y297jQ30tfM',
        order: 'viewCount',
        q: `${val} vevo`,
        safeSearch: 'none',
        type: 'video',
        videoDefinition: 'high',
        maxResults: 50
      },
      success: displayResults,
      error: (e) => console.log(e)
    });
  }, 200);
}

//accepts data in form of an object, maps it to a html string and adds li's to search list
function displayResults(data){
  const searchResults = $('.searchResults');

  let html = data.items? data.items.map(item => `<li class="video-thumbnails" data-id=${item.id.videoId}><img src=${item.snippet.thumbnails.high.url}><h2>${item.snippet.title}</h2></li>`) : '';

  if (data.length === 0){
    html = `<li>No Results Found</li>`;
  }

  searchResults.html(html);
}

function thumbnailClick(){
  $('.player').removeClass('invisible');
  let link = $(this);
  let h1 = $('.player-title');
  let youtubePlayer = document.querySelector('#ytplayer');
  let url = `https://www.youtube.com/embed/${link.data('id')}?autoplay=1&origin="https://www.example.com"`;

  h1.text(link.children('h2').text());
  youtubePlayer.src = url;


}
