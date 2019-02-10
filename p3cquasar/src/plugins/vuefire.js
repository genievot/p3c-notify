// import something here
import VueFire from 'vuefire'
// leave the export, even if you don't use it
export default ({
  app,
  router,
  Vue
}) => {
  // something to do
  Vue.use(VueFire)
  Vue.prototype.$vfire = VueFire
}
