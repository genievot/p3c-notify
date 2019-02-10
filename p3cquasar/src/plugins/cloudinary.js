// import something here
// Not in the using in this app right now ....
let cloudinary = require('cloudinary')
let cloudApp = cloudinary.config({
  cloud_name: 'notyfy',
  api_key: '985345875982584',
  api_secret: ''
})
// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  // something to do
  Vue.prototype.$cloudinary = cloudApp
}
