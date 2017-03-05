# MuVi

[MuVi live][prodlink]

MuVi is a web application that lets users search and stream their favorite music videos. Inspired by Vevo, it is designed to be intuitive and easy to use.

![MuVi home page: http://www.deeptailor.com/MuVi][home page]
![MuVi home page: http://www.deeptailor.com/MuVi][home page still]

## Features & Implementation

###Quick search

Users can search for their favorite music videos in the most minimalistic way. Just enter a search term and click on the video to start playing. No annoying pop-ups or advertisements.

![MuVi home page: http://www.deeptailor.com/MuVi][home page still]


###Continuous stream

Users can minimize the player and continue to listen to their favorite songs while searching for what to play next.

![MuVi home page: http://www.deeptailor.com/MuVi][search]

###Following playlists

Users can follow playlists. Following other playlists add those playlists to the "Followed Playlists" tab.

On the backend, these follows are handled by a PlaylistFollows join table, which track `user_id` and `playlist_id`. The tables are indexed on `user_id` to make it quick to fetch the playlists the currently signed in user follows.

Custom API calls are made when users click 'follow' and 'unfollow' links on the frontend that create and destroy these follow associations.

![Pauseplay tracks page: http://www.pauseplay.com/][search1]
![Pauseplay tracks page: http://www.pauseplay.com/][search2]


###User Experience

One of the primary goals of this project was to create a smooth, desktop-app like user experience in the browser. This was largely accomplished via simple UX design.

User testing was also completed to fine-tune application layout and interactions.

##Future directions

MuVi was designed and built in under 2 days, and as such there's still a lot of room for expansion. Future steps for the project are outlined below.


###Mobile responsive design

###User Playlists

[prodlink]: http://www.deeptailor.com/MuVi
[home page]: ./assets/images/muvi-giphy.gif "Muvi home page"
[home page still]: ./assets/images/MuVi1.jpeg "Muvi home page still"
[search]: ./assets/images/MuVi2.jpeg "Muvi Search"
[search1]: ./assets/images/MuVi3.jpeg "Muvi Search1"
[search2]: ./assets/images/MuVi4.jpeg "Muvi Search2"
