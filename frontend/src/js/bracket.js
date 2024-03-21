import { loadCSS, router } from "./main.js";

export default () => {
  let config_palette = localStorage.getItem("palette");
  loadCSS("src/css/palettes/" + config_palette + ".css");
  loadCSS("src/css/bracket.css");

  function pollBackend() {
    fetch('http://localhost:8000/api/tournamentResults')
        .then(response => response.json())
        .then(data => {
          const rooms = data.results;
          const boxes = document.querySelectorAll('.box-content');
          Object.keys(rooms).forEach((roomId, index) => {
            const players = rooms[roomId]['players'].slice(0, 2); // Get the first two players in the room
            players.forEach((player, i) => {
              boxes[index * 2 + i].textContent = player; // Assign player to corresponding box
            });
          });
        })
        .catch(error => {
            console.error('Error fetching updates:', error);
        });
  }

  // pollBackend();
  setInterval(pollBackend, 5000);

  return `
  <button data-link="/menu" type="button" class="go-back-button scale-up ml-4" style="z-index: 1">
    <p class="description scale-up cursor-pointer">GO BACK</p>
  </button>
  <div class="menu-header unselectable">
    <p class="text-center menu-header-title h-100 my-4">TOURNAMENT</p>
  </div>
  <button title="To dashboard" data-link="/dashboard?username=${sessionStorage.getItem('username')}" type="submit" class="user-profile unselectable scale-up mr-4" style="z-index: 1">
    <div class="user-img"><img src="${sessionStorage.getItem('profile_pic')}"></img></div>
    <p class="description cursor-pointer">${sessionStorage.getItem('display_name')}</p>
  </button>
  <div class="wrapper">
    <div class="col">
      <div class="row">
        <div class="box">
          <div class="box-content"> </div>
          <div class="box-content"> </div>
        </div>
        <div class="box">
          <div class="box-content"> </div>
          <div class="box-content"> </div>
        </div>
        <div class="box">
          <div class="box-content"> </div>
          <div class="box-content"> </div>
        </div>
        <div class="box">
          <div class="box-content"> </div>
          <div class="box-content"> </div>
        </div>
      </div>
      <div class="row">
        <div class="line start"></div>
        <div class="line start"></div>
      </div>
      <div class="row">
        <div class="box middle">
          <div class="box-content"> </div>
          <div class="box-content"> </div>
        </div>
        <div class="box middle">
          <div class="box-content"> </div>
          <div class="box-content"> </div>
        </div>
      </div>
      <div class="row">
        <div class="line end"></div>
      </div>
      <div class="row">
        <div class="box">
          <div class="box-content box-content-up"> </div>
          <div class="box-content"> </div>
        </div>
      </div>
    <div>
  </div>
  `;
};
