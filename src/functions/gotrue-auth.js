import GoTrue from "gotrue-js"

// Find out if we're on localhost
const isLocal = document.location.host.split(':').shift() === 'localhost'

export default new GoTrue({
  APIUrl: "https://cors-anywhere.herokuapp.com/https://frosty-liskov-a5f4a1.netlify.app/.netlify/identity",
  audience: "",
  setCookie: true
})