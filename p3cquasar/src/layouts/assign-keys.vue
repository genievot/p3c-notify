<template>
<q-layout>
  <!-- Be sure to play with the Layout demo on docs -->

  <!-- (Optional) The Header -->
  <q-layout-header>
    <q-toolbar>
      <q-btn flat round dense icon="arrow_back" @click="$router.push('/')" />
      <q-toolbar-title>
        Create new key
        <span slot="subtitle">new key assignment</span>
      </q-toolbar-title>
    </q-toolbar>
  </q-layout-header>
  <!-- (Optional) The Footer -->

  <!-- (Optional) A Drawer; you can add one more with side="right" or change this one's side -->
  <q-page-container>
    <!-- This is where pages get injected -->
    <q-page>
      <div class="row justify-center q-pa-md">
        <div class="col-7">
          <q-input v-model="text" @input="checkVal" float-label="Enter your hash" color="white" inverted class="text-black" />
        </div>
        <div class="col-4 q-ml-sm">
          <q-input v-model="mobile_no" :hidden="hide" float-label="Enter mobile number" color="white" inverted class="text-black" />
        </div>
      </div>
      <div class="row justify-center">
        <q-btn label="Create Admin key" @click.native="createp3c_adminKey" class="q-mr-sm q-mt-sm" :hidden="hide" />
        <q-btn label="Create Community key" @click.native="createp3c_communityKey" class="q-ml-sm q-mt-sm" :hidden="hide" />
      </div>
      <div class="row justify-center q-title">
        {{this.made_key}}
      </div>
    </q-page>
  </q-page-container>
</q-layout>
</template>

<script>
export default {
  // name: 'LayoutName',
  data () {
    return {
      text: '',
      keys: [],
      p3c_admin_keys: [],
      p3c_community_keys: [],
      hide: true,
      mobile_no: '',
      new_key: null,
      made_key: null,
      uid: null
    }
  },
  methods: {
    checkVal (val) {
      if (val === this.keys[0].make_key) {
        this.hide = false
      } else {
        this.hide = true
      }
    },
    createp3c_adminKey () {
      this.new_key = Math.round((Math.random() * (900000000) + 100000000)).toString()
      this.$firebase.database().ref('p3c_admin_keys/' + this.p3c_admin_keys.length).set({
        Can_Use: 'true',
        Key: this.new_key,
        authorize_to: this.mobile_no
      }).then(() => {
        this.$q.notify({
          message: 'New admin Key Created',
          color: 'green'
        })
        this.made_key = this.new_key
        this.reReadValues()
      })
    },
    createp3c_communityKey () {
      this.new_key = Math.round((Math.random() * (9000000000) + 1000000000)).toString()
      this.$firebase.database().ref('p3c_community_keys/' + this.p3c_community_keys.length).set({
        Can_Use: 'true',
        Key: this.new_key,
        authorize_to: this.mobile_no
      }).then(() => {
        this.$q.notify({
          message: 'New p3c_community Key Created',
          color: 'green'
        })
        this.made_key = this.new_key
        this.reReadValues()
      })
    },
    reReadValues () {
      this.$specialKeys.once('value', (snapshot) => {
        this.keys = snapshot.val()
      }, function (errorObject) {
        console.log('The read failed: ' + errorObject.code)
      })
      this.$p3c_adminKeys.once('value', (snapshot) => {
        this.p3c_admin_keys = snapshot.val()
      }, function (errorObject) {
        console.log('The read failed: ' + errorObject.code)
      })
      this.$p3c_communityKeys.once('value', (snapshot) => {
        this.p3c_community_keys = snapshot.val()
      }, function (errorObject) {
        console.log('The read failed: ' + errorObject.code)
      })
    }
  },
  mounted () {
    this.$firebase.auth().signInAnonymously().catch((error) => {
      // Handle Errors here.
      this.$q.notify(error.message)
      // ...
    })
    this.$firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        // var isAnonymous = user.isAnonymous
        this.uid = user.uid
        this.reReadValues()
        // console.log(this.uid)
      // ...
      } else {
      // User is signed out.
      // ...
      }
      // ...
    })
  }
}
</script>

<style>
</style>
