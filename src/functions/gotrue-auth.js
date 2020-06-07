import GoTrue from "gotrue-js"

export default new GoTrue({
  APIUrl: "https://overtimetrackr.netlify.app/.netlify/identity",
  audience: "",
  setCookie: true
})