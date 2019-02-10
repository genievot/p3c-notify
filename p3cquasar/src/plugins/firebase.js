// import something here
import Firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
let config = {
  apiKey: 'AIzaSyBuMrGyuh5z3yr6bSNZxCo2eU2zxudV47c',
  authDomain: 'webnoticeboard.firebaseapp.com',
  databaseURL: 'https://webnoticeboard.firebaseio.com',
  projectId: 'webnoticeboard',
  storageBucket: 'webnoticeboard.appspot.com',
  messagingSenderId: '919374125152'
}
let app = Firebase.initializeApp(config)
let db = app.database()
// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  // something to do
  Vue.prototype.$firebase = Firebase
  Vue.prototype.$bookref = db.ref('p3c_admin')
  Vue.prototype.$p3c_communityref = db.ref('p3c_community')
  Vue.prototype.$p3c_adminKeys = db.ref('p3c_admin_keys')
  Vue.prototype.$p3c_communityKeys = db.ref('p3c_community_keys')
  Vue.prototype.$specialKeys = db.ref('p3c_Special_Keys')
}
