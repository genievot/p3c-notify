// import something here
import * as firebaseui from 'firebaseui'
// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  // something to do
  Vue.prototype.$firebaseui = firebaseui
}
