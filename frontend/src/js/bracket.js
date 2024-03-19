import { loadCSS, router } from "./main.js";

export default () => {
  loadCSS("src/css/bracket.css");

  function pollBackend() {
    fetch('http://localhost:8000/api/tournamentAllRooms')
        .then(response => response.json())
        .then(data => {
          const rooms = data.tourney;
          console.log(rooms);
          const matchups = Object.values(rooms);
          const boxes = document.querySelectorAll('.box');
          
          matchups.forEach((matchup, index) => {
            const teams = matchup.join(' vs ');
            boxes[index].innerHTML = `<p>${teams}</p>`;
          });
        })
        .catch(error => {
            console.error('Error fetching updates:', error);
        });
  }

  pollBackend();
  // setInterval(pollBackend, 5000);

  return `
  <div class="wrapper">
    <div class="col">
      <div class="row">
        <div class="box"><p>a</p></div>
        <div class="box"><p>b</p></div>
        <div class="box"><p>c</p></div>
        <div class="box"><p>d</p></div>
      </div>
      <div class="row">
        <div class="line start"></div>
        <div class="line start"></div>
      </div>
      <div class="row">
        <div class="box middle"><p>e</p></div>
        <div class="box middle"><p>f</p></div>
      </div>
      <div class="row">
        <div class="line end"></div>
      </div>
      <div class="row">
        <div class="box"><p>g</p></div>
      </div>
    <div>
  </div>
  `;
};
