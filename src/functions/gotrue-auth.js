import GoTrue from "gotrue-js"

export default new GoTrue({
  APIUrl: "https://frosty-liskov-a5f4a1.netlify.app/.netlify/identity",
  // audience: "",
  setCookie: true
})