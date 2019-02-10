
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue')
  },
  { // Use random seed to get exact post from both databases.
    path: '/post/:location/:id/:pn',
    component: () => import('layouts/post.vue')
  },
  { // Use random seed to get exact post from both databases.
    path: '/make-key',
    component: () => import('layouts/assign-keys.vue')
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
