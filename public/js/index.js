const urlSearch = new URLSearchParams(window.location.search);
const username = urlSearch.get('username');
document.getElementById('username_input').value = username;

document.getElementById('username_input').addEventListener('keyup', (event) => {
  event.target.value = event.target.value.trim();
});
