import { loadCSS, navigate, router } from "./main.js";

export default () => {
  let config_palette = localStorage.getItem("palette");
  loadCSS("src/css/palettes/" + config_palette + ".css");
  loadCSS("src/css/bracket.css");
  var clientID = sessionStorage.getItem('username');
  var current = window.location.href;

  window.addEventListener("popstate", handlePopState);

	function handlePopState(event) {
    console.log('Tournament leaving');
		if (window.location.pathname !== "/tournament") {
			const confirmed = confirm("Tournament is in progress.");
			if (!confirmed) {
        console.log(current);
        history.pushState(null, null, current);
			}
      clearInterval(intervalId);
			window.removeEventListener("popstate", handlePopState);
      fetch(`http://localhost:8000/api/tournamentLeave?clientID=${clientID}`, {
        method: "DELETE"
      })
      .then(response => response.json())
      .then(data => {
        console.log('Tournament Leave:', data);
      })
      .catch(error => {
        console.error('Tournament Leave failed:', error);
      });
		}
	}

  fetch(`http://localhost:8000/api/tournamentInit?clientID=${clientID}`, {
    method: "GET"
  })
  .then(response => response.json())
  .then(data => {
    console.log('Tournament Init:', data);
    fetch(`http://localhost:8000/api/tournamentAssign?clientID=${clientID}`, {
      method: "GET"
    })
    .then(response => response.json())
    .then(data => {
      console.log('Tournament Assign:', data);
      pollBackend()
    })
    .catch(error => {
      console.error('Tournament Assign failed:', error);
    });
  })
  .catch(error => {
    console.error('Tournament Init failed:', error);
  });

  function pollBackend() {
    fetch('http://localhost:8000/api/tournamentResults')
    .then(response => response.json())
    .then(data => {
      if (data.status === 'finished') {
        if (data.winner === clientID) {
          alert('Congratulations! You won the tournament!');
          fetch ('http://localhost:8000/api/tournamentGetScore', {
            method: "GET"})
          .then(response => response.json())
          .then(data => {
            console.log(data.results);
            fetch('http://localhost:8000/api/addTournament', {
              method: "POST",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data.results)
            })
            .then(response => response.json())
            .then(data => {
              fetch('http://localhost:8000/api/tournamentClearScore', {
                method: "DELETE"
              })
              .then(response => response.json())
              .catch(error => {
                console.error('Tournament End failed:', error);
              });
            })
            .catch(error => {
              console.error('Add Tournament failed:', error);
            });  
            fetch('http://localhost:8000/api/tournamentEnd', {
              method: "DELETE"
            })
            .then(response => response.json())
            .catch(error => {
              console.error('Tournament End failed:', error);
            });
          })
          .catch(error => {
            console.error('Tournament Winner failed:', error);
          });
        }
        clearInterval(intervalId);
        window.removeEventListener("popstate", handlePopState);
        navigate('/menu');
      }
      const rooms = data.results;
      const boxes = document.querySelectorAll('.box-content');
      boxes.forEach(box => {
        box.textContent = '';
    });
      Object.keys(rooms).forEach((roomId, index) => {
        const players = rooms[roomId]['players'].slice(0, 2); // Get the first two players in the room
        players.forEach((player, i) => {
          boxes[index * 2 + i].textContent = player; // Assign player to corresponding box
        });
      });
      fetch(`http://localhost:8000/api/tournamentRoomID?clientID=${clientID}`, {
        method: "GET"
      })
      .then(response => response.json())
      .then(data => {
        console.log('Tournament Room:', data);
        if (data.roomID)
        {
          clearInterval(intervalId);
          window.removeEventListener("popstate", handlePopState);
          setTimeout(() => {
            navigate(`/pong?tournamentID=${data.roomID}`);
        }, 3000);
        }
      })
    })
    .catch(error => {
        console.error('Error fetching updates:', error);
    });
  }

  const intervalId = setInterval(pollBackend, 10000);

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