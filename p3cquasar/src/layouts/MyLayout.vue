<template>
<q-layout view="lHh Lpr lFf">
  <q-modal v-model="opened" maximized no-backdrop-dismiss>
    <div class="row justify-center">
      <p class="text-light" align="center">Press `ESC` to go back or click
        <q-btn color="grey-9" outline @click.native="closeModal" label="back" />
      </p>
    </div>
    <span class="text-light" align="center">Posting in {{this.wheretoPost.replace('/','')}}
    </span>
    <!-- title field  -->
    <div class="row justify-center" style="background-color: #f7f7f7">
      <div class="col-9">
        <q-input type="text" inverted :maxlength="90" class="q-mt-md q-ml-sm q-mr-sm" color="white text-black" no-shadow :error="error_title" v-model="title" float-label="Add Title *" clearable />
      </div>
      <div class="col-9 q-ma-md">
        <q-editor v-model="model" :readonly="readonly" toolbar-color="grey-10" :disable="disable_editor" :toolbar="[
     ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
     ['token', 'hr', 'link', 'custom_btn'],
     ['print', 'fullscreen'],
     [
       {
         label: $q.i18n.editor.formatting,
         icon: $q.icon.editor.formatting,
         list: 'no-icons',
         options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
       },
       {
         label: $q.i18n.editor.fontSize,
         icon: $q.icon.editor.fontSize,
         fixedLabel: true,
         fixedIcon: true,
         list: 'no-icons',
         options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7']
       },
       {
         label: $q.i18n.editor.defaultFont,
         icon: $q.icon.editor.font,
         fixedIcon: true,
         list: 'no-icons',
         options: ['default_font', 'arial', 'arial_black', 'comic_sans', 'courier_new', 'impact', 'lucida_grande', 'times_new_roman', 'verdana']
       },
       'removeFormat'
     ],
     ['quote', 'unordered', 'ordered'],
     [
       {
         label: $q.i18n.editor.align,
         icon: $q.icon.editor.align,
         fixedLabel: true,
         options: ['left', 'center', 'right', 'justify']
       }
     ],
     ['undo', 'redo']
   ]"
          :fonts="{
     arial: 'Arial',
     arial_black: 'Arial Black',
     comic_sans: 'Comic Sans MS',
     courier_new: 'Courier New',
     impact: 'Impact',
     lucida_grande: 'Lucida Grande',
     times_new_roman: 'Times New Roman',
     verdana: 'Verdana'
   }" />

        <!-- <q-editor v-model="model" :toolbar="[]" readonly /> -->

      </div>
    </div>
    <br>
    <hr/>
    <div style="padding: 10px" class="row justify-around" color="black">
      <div class="col-md-5">
        <q-uploader :url="uploader_url" @add="thumbnailAdded" @remove:cancel="thumbnailRemoved" @remove:done="thumbnailRemoved" @remove:abort="thumbnailRemoved" hide-upload-button :name='thumbnail' float-label="Upload Thumbnail" extensions=".jpeg, .jpg, .png, .gif"
          :error="error_thumbnail" />
        <!-- <q-input type="url" readonly :error="error_thumbnail" v-model="thumbnail" float-label="Add Thumbnail *" clearable />
          <q-btn flat dense icon="file_upload" class="float-right" css="position: absolute;"/> -->
      </div>

      <div class="col-md-5">
        <q-uploader :url="uploader_url" @add="ppadded" @remove:cancel="ppRemoved" @remove:done="ppRemoved" @remove:abort="ppRemoved" hide-upload-button :name="profile_pic" float-label="Upload Profile Picture" extensions=".jpeg, .jpg, .png, .gif"
          :error="error_profilepic" />
        <!-- <q-input type="url" readonly :error="error_profilepic" v-model="profile_pic" float-label="Add Profile Pic *" clearable />
          <q-btn flat dense icon="file_upload" class="float-right"/> -->
      </div>
    </div>
    <div class="row justify-center">
      <!-- Instead of input add a button here -->
      <div class="col-7 q-pr-sm">
        <q-input type="tel" :readonly="readonly_code" :error="error_auth_code" v-model="auth_text" required float-label="AUTH Code *" clearable :maxlength="10" :decimals="0" placeholder="Enter AUTH Code" />
      </div>
      <div class="col-7 q-pr-sm">
        <q-input type="tel" :error="error_mobile" prefix="+" v-model="text" required float-label="Mobile number *" clearable :maxlength="15" :decimals="0" placeholder="Enter mobile number with Country code" />
      </div>
      <div class="col-6 q-pl-sm">
        <q-input type="tel" :error="error_verification" v-model="code" :disable="disable" float-label="Verification Code *" clearable :maxlength="6" :decimals="0" />
      </div>
      <div class="col-8 q-pl-sm">
        <p class="text-light" align="center">You will receive SMS message with a code and standard rates will apply.</p>
      </div>
    </div>
    <div class="row q-pa-sm justify-center">
      <q-btn :label="send" id="sendSms" @click.native="sendsms" />
      <q-btn :hidden="hidden" :disable="disable_confirm" label="Confirm" color="primary" @click.native="publishPost" class="q-ml-sm" />
    </div>
  </q-modal>
  <q-layout-header>
    <q-toolbar color="white text-green" :inverted="$q.theme === 'ios'">
      <q-item>
    <q-item-tile avatar>
        <img src="statics/whale.png">
      </q-item-tile>
    </q-item>

      <q-toolbar-title>
        p3c.io
        <div slot="subtitle">online p3c notice board by Jeevanjot singh</div>
      </q-toolbar-title>
      <q-btn icon="create" round flat id="postbtn" @click.native="openModal" />
    </q-toolbar>
  </q-layout-header>
  <q-page-container>
    <q-page>
      <q-tabs underline-color="green" swipeable color="white text-green" align="justify">
        <q-tab label="admin Board" slot="title" default icon="dashboard" @select="openp3c_adminBoard" />
        <q-tab label="community board" slot="title" icon="developer_board" @select="openp3c_communityBoard" />
      </q-tabs>
      <!-- // random string generator for urls https://helloacm.com/api/random/?n=128 -->
      <div class="row justify-center">
        <q-card class="q-ma-sm" inline style="width: 400px; height:auto;" v-for='book in books.slice().reverse()' v-if='book.null === "false"' :key='book.Random_Seed'>
          <q-item>
            <q-item-side :avatar="book.Profile_Pic" />
            <q-item-main>
              <router-link :to="'post/' + wheretoPost + book.Random_Seed + '/' + book.post_id" style="color: #000000; text-decoration: none">
                <q-item-tile label>{{book.Title}}</q-item-tile>
                <q-item-tile sublabel>{{book.DateTime}}</q-item-tile>
              </router-link>
            </q-item-main>
          </q-item>
          <q-card-media>
            <!-- <img v-bind:src="book.Image" style="width: 400px; height:250px;"/> -->
            <div class="wrap" style="overflow: hidden;">
              <object width="400px" height="250px" style="object-fit:cover" v-bind:data="book.Image" frameborder="0"></object>
            </div>
          </q-card-media>
          <q-card-main>
            <!-- <a href="#" style="color: #000000; text-decoration: none;"> Upcoming feature for sorting posts based on mobile numbers-->
              <p class="text-faded">{{book.Mobile}}</p>
            <!-- </a> -->
          </q-card-main>
        </q-card>
      </div>
    </q-page>
  </q-page-container>
</q-layout>
</template>

<script>
import {
  required,
  minLength,
  maxLength
} from 'vuelidate/lib/validators'
import { colors } from 'quasar'
colors.setBrand('green', '#62d165')
export default {
  name: 'MyLayout',
  data () {
    return {
      uid: null,
      leftDrawerOpen: this.$q.platform.is.desktop,
      books: [],
      opened: false,
      selectedTab: 'tab-1',
      text: '',
      title: '',
      code: '',
      disable: true,
      hidden: true,
      send: 'Send',
      model: 'Hi...',
      disable_editor: false,
      readonly: false,
      thumbnail: '',
      error_mobile: false,
      error_verification: false,
      error_thumbnail: false,
      error_title: false,
      error_profilepic: false,
      profile_pic: '',
      uploader_url: '', // Add server url to handle upload
      timestamp: null,
      pp_files: [],
      thumbnail_files: [],
      pp_fileURL: null,
      thumbnail_fileURL: null,
      wheretoPost: 'p3c_admin/',
      auth_text: '',
      error_auth_code: false,
      p3c_admin_keys: [],
      p3c_community_keys: [],
      canPostInp3c_admin: false,
      canPostInP3c_community: false,
      readonly_code: false,
      posting_now: false,
      disable_confirm: false
    }
  },
  methods: {
    ppadded (files) {
      // console.log(files[0])
      this.pp_files = files
      this.profile_pic = files[0].name
    },
    thumbnailAdded (files) {
      // console.log(files[0])
      this.thumbnail_files = files
      this.thumbnail = files[0].name
    },
    ppRemoved (file) {
      this.profile_pic = ''
      this.pp_files = []
    },
    thumbnailRemoved (file) {
      this.thumbnail_files = []
      this.thumbnail = ''
    },
    openp3c_communityBoard () {
      this.$q.loading.show()
      // this.$router.push('/p3c_community')
      this.wheretoPost = 'p3c_community/'
      // console.log('opening S board')
      this.$bookref.off()
      this.books = []
      this.$p3c_communityref.on('value', (snapshoti) => {
        // console.log(snapshoti.val())
        if (this.posting_now === false) {
          this.$q.loading.hide()
        }
        // console.log('"openp3c_communityBoard"')
        // console.log('"Printing selection"')
        this.books = snapshoti.val()
        // console.log(this.books.length)
        // console.log(this.books)
      }, function (errorObject) {
        console.log('The read failed: ' + errorObject.code)
      })
    },
    sendsms () {
      this.$q.loading.show({message: 'Please Wait...'})
      if (this.$v.text.$invalid) {
        this.$q.notify('Mobile number with country code is required.')
        this.error_mobile = true
        this.$q.loading.hide()
      } else if (this.$v.thumbnail.$invalid) {
        this.$q.notify('A Thumbnail image or video is required')
        this.error_thumbnail = true
        this.error_mobile = false
        this.$q.loading.hide()
      } else if (this.$v.title.$invalid) {
        this.$q.notify('Enter a valid title with a length of 8 characters or more but less than 90.')
        this.error_thumbnail = false
        this.error_mobile = false
        this.error_title = true
        this.$q.loading.hide()
      } else if (this.$v.profile_pic.$invalid) {
        this.$q.notify('Enter a valid title with a length of 8 characters or more but less than 90.')
        this.error_thumbnail = false
        this.error_mobile = false
        this.error_title = false
        this.error_profilepic = true
        this.$q.loading.hide()
      } else if (this.$v.auth_text.$invalid) {
        this.$q.notify('Enter a valid AUTH code')
        this.error_thumbnail = false
        this.error_mobile = false
        this.error_title = false
        this.error_profilepic = false
        this.error_auth_code = true
        this.$q.loading.hide()
      } else {
        this.error_mobile = false
        this.error_thumbnail = false
        this.error_title = false
        this.error_profilepic = false
        this.error_auth_code = false
        let mobileNo = '+' + this.text
        // console.log(mobileNo)
        if (this.wheretoPost === 'p3c_community/') {
          this.canPostInP3c_community = false
          this.canPostInp3c_admin = false // These lines here and in below block ensure that after posting on p3c_community the user cannot post in p3c_admin.
          for (var i = 0; i < this.p3c_community_keys.length; i++) {
            if (this.p3c_community_keys[i].Key.toString() === this.auth_text && this.p3c_community_keys[i].Can_Use === 'true') {
              this.canPostInP3c_community = true
              this.canPostInp3c_admin = false
              this.readonly_code = true
            }
          }
          if (this.canPostInP3c_community === false) {
            this.$q.notify('Your code is not correct or your code is disabled.')
            this.$q.loading.hide()
          }
        } else if (this.wheretoPost === 'p3c_admin/') {
          this.canPostInP3c_community = false
          this.canPostInp3c_admin = false
          for (var ia = 0; ia < this.p3c_admin_keys.length; ia++) {
            if (this.p3c_admin_keys[ia].Key.toString() === this.auth_text && this.p3c_admin_keys[ia].Can_Use === 'true') {
              this.canPostInP3c_community = false
              this.canPostInp3c_admin = true
              this.readonly_code = true
            }
          }
          if (this.canPostInp3c_admin === false) {
            this.$q.notify('Your code is not correct or your code is disabled.')
            this.$q.loading.hide()
          }
        }
        if (this.canPostInp3c_admin === true || this.canPostInP3c_community === true) {
          try {
            this.$firebase.auth().signInWithPhoneNumber(mobileNo, window.recaptchaVerifier).then((confirmationResult) => {
              window.confirmationResult = confirmationResult
              this.$q.loading.hide()
              this.disable = false
              this.hidden = false
              this.send = 'Resend'
              this.$q.notify({
                message: 'Sent!',
                color: 'primary'
              })
              // console.log(confirmationResult)
            }).catch((err) => {
              this.$q.loading.hide()
              this.disable = true
              this.hidden = true
              this.send = 'Send'
              this.$q.notify(err.message)
            })
          } catch (err) {
            this.$q.notify(err)
            this.$q.loading.hide()
          }
        }
      }
    },
    openp3c_adminBoard () {
      this.$q.loading.show()
      // console.log('opening A board')
      this.$p3c_communityref.off()
      this.books = []
      this.wheretoPost = 'p3c_admin/'
      this.$bookref.on('value', (snapshot) => {
        // console.log(snapshot.val())
        this.books = snapshot.val()
        // console.log(this.books.length)
        if (this.posting_now === false) {
          this.$q.loading.hide()
        }
        // console.log('"openp3c_adminBoard"')
        // console.log(this.books[1]['Random Seed'])
      }, function (errorObject) {
        console.log('The read failed: ' + errorObject.code)
      })
    },
    onCreate () {
      console.log('creating post')
    },
    openModal () {
      this.opened = true
    },
    closeModal () {
      this.opened = false
    },
    async publishPost () { // First checks all validation -> Upload Profile Pic -> Uplaod Thumbnail -> post on firebase
      if (this.wheretoPost === 'p3c_community/') {
        this.canPostInP3c_community = false
        this.canPostInp3c_admin = false // These lines here and in below block ensure that after posting on p3c_community the user cannot post in p3c_admin.
        for (var i = 0; i < this.p3c_community_keys.length; i++) {
          if (this.p3c_community_keys[i].Key.toString() === this.auth_text && this.p3c_community_keys[i].Can_Use === 'true') {
            this.canPostInP3c_community = true
            this.canPostInp3c_admin = false
            this.readonly_code = true
          }
        }
        if (this.canPostInP3c_community === false) {
          this.$q.notify('Your code is not correct or your code is disabled.')
          this.$q.loading.hide()
        }
      } else if (this.wheretoPost === 'p3c_admin/') {
        this.canPostInP3c_community = false
        this.canPostInp3c_admin = false
        for (var ia = 0; ia < this.p3c_admin_keys.length; ia++) {
          if (this.p3c_admin_keys[ia].Key.toString() === this.auth_text && this.p3c_admin_keys[ia].Can_Use === 'true') {
            this.canPostInP3c_community = false
            this.canPostInp3c_admin = true
            this.readonly_code = true
          }
        }
        if (this.canPostInp3c_admin === false) {
          this.$q.notify('Your code is not correct or your code is disabled.')
          this.$q.loading.hide()
        }
      }
      await this.setTimeStamp() // Updating time here everytime before posting.
      if (this.canPostInp3c_admin === true || this.canPostInP3c_community === true) {
        this.$firebase.auth().signInAnonymously().catch((error) => {
          // Handle Errors here.
          this.$q.notify(error.message)
          // ...
        })
        // await this.getdata()
        if (this.$v.text.$invalid) {
          this.$q.notify('Mobile number with country code is required.')
          this.error_mobile = true
        } else if (this.$v.thumbnail.$invalid) {
          this.$q.notify('A Thumbnail image or video is required')
          this.error_mobile = false
          this.error_thumbnail = true
        } else if (this.$v.title.$invalid) {
          this.$q.notify('Enter a valid title with a length of 8 or more but less than 90.')
          this.error_thumbnail = false
          this.error_mobile = false
          this.error_title = true
        } else if (this.$v.code.$invalid) {
          this.error_mobile = false
          this.error_thumbnail = false
          this.error_title = false
          this.error_verification = true
          this.$q.notify('Please enter correct 6 digit verification code')
        } else if (this.$v.profile_pic.$invalid) {
          this.$q.notify('Enter a valid title with a length of 8 characters or more but less than 90.')
          this.error_thumbnail = false
          this.error_mobile = false
          this.error_title = false
          this.error_profilepic = true
        } else if (this.$v.auth_text.$invalid) {
          this.$q.notify('Enter a valid AUTH code')
          this.error_thumbnail = false
          this.error_mobile = false
          this.error_title = false
          this.error_profilepic = false
          this.error_auth_code = true
        } else {
          this.error_mobile = false
          this.error_thumbnail = false
          this.error_verification = false
          this.error_title = false
          this.error_profilepic = false
          this.error_auth_code = false
          this.posting_now = true
          this.disable_confirm = true
          this.$q.loading.show({message: 'Please wait and do not refresh the page.'})
          this.closeModal()
          window.confirmationResult.confirm(this.code).then(() => {
            let formDatap = new FormData()
            // console.log(this.pp_files[0])
            formDatap.append('file', this.pp_files[0])
            formDatap.append('tags', `gndu, board, notice`)
            formDatap.append('upload_preset', 'myldschl')
            formDatap.append('api_key', '985345875982584')
            formDatap.append('timestamp', (this.timestamp / 1000) | 0)
            this.$q.loading.show({message: 'Uploading Profile Pic...'})
            this.$axios.post('https://api.cloudinary.com/v1_1/dpnrocxf9/image/upload', formDatap, {
              headers: {
                'X-Requested-With': 'XMLHttpRequest'
              }
            }).then((responsep) => {
              let datap = responsep.data
              this.pp_fileURL = datap.secure_url // You should store this URL for future references in your app
              // console.log(data)
              console.log(this.pp_fileURL)
              // Thumbnail upload...
              let formData2 = new FormData()
              formData2.append('file', this.thumbnail_files[0])
              formData2.append('tags', `gndu, board, notice`)
              formData2.append('upload_preset', 'myldschl')
              formData2.append('api_key', '985345875982584')
              formData2.append('timestamp', (this.timestamp / 1000) | 0)
              this.$q.loading.show({message: 'Uploading Thumbnail Pic...'})
              this.$axios.post('https://api.cloudinary.com/v1_1/dpnrocxf9/image/upload', formData2, {
                headers: {
                  'X-Requested-With': 'XMLHttpRequest'
                }
              }).then((responset) => {
                let datat = responset.data
                this.thumbnail_fileURL = datat.secure_url
                // console.log(data)
                // console.log(this.books.length)
                console.log(this.thumbnail_fileURL)
                this.$q.loading.show({message: 'Posting Your Request...'})
                this.$axios.get('https://helloacm.com/api/random/?n=128').then((response) => {
                  this.$firebase.database().ref(this.wheretoPost + this.books.length).set({
                    Body: this.model,
                    Comments: 'later',
                    Image: this.thumbnail_fileURL,
                    Mobile: this.text,
                    Random_Seed: response.data,
                    Recent_Post: this.books.length - 1,
                    Title: this.title,
                    Upvotes: '0',
                    DateTime: this.timestamp.toString(),
                    Profile_Pic: this.pp_fileURL,
                    Updated_On: this.timestamp.toString(),
                    null: 'false',
                    code_used: this.auth_text,
                    post_id: this.books.length // for routing purposes
                  }).then(() => {
                    this.$q.notify({
                      message: 'Post Published!',
                      color: 'green'
                    })
                    console.log('"Hiding"')
                    this.$q.loading.hide()
                    this.readonly_code = false
                    this.hidden = true
                    this.posting_now = false
                    this.disable_confirm = false
                  }).catch((err) => {
                    this.$q.notify(err.message)
                    this.$q.loading.hide()
                    this.posting_now = false
                    this.disable_confirm = false
                  })
                }).catch((err) => {
                  this.$q.notify(err)
                  this.$q.loading.hide()
                  this.posting_now = false
                  this.disable_confirm = false
                })
              }).catch((err) => {
                this.$q.notify(err)
                this.$q.loading.hide()
                this.posting_now = false
                this.disable_confirm = false
              })
            }).catch((err) => {
              this.$q.notify(err)
              this.$q.loading.hide()
              this.posting_now = false
              this.disable_confirm = false
            })
          }).catch((err) => {
            this.$q.notify(err)
            this.$q.loading.hide()
            this.posting_now = false
            this.disable_confirm = false
          })
        }
      }
    },
    async setTimeStamp () {
      await this.$axios.get('http://worldclockapi.com/api/json/utc/now').then((res) => {
        this.timestamp = new Date(res.data.currentDateTime)
        // console.log(this.timestamp / 1000 + 'OK')
      }).catch((err) => {
        this.$q.notify(err)
      })
    },
    getdata () {
      // console.log('"getdata"')
      if (this.wheretoPost === 'p3c_community/') {
        this.$p3c_communityref.on('value', (snapshot) => {
          // console.log(snapshot.val())
          this.books = snapshot.val()
          if (this.posting_now === false) {
            this.$q.loading.hide()
          }
        }, function (errorObject) {
          console.log('The read failed: ' + errorObject.code)
        })
      } else if (this.wheretoPost === 'p3c_admin/') {
        this.$bookref.on('value', (snapshot) => {
          // console.log(snapshot.val())
          this.books = snapshot.val()
          if (this.posting_now === false) {
            this.$q.loading.hide()
          }
        }, function (errorObject) {
          console.log('The read failed: ' + errorObject.code)
        })
      }
      this.$p3c_adminKeys.on('value', (snapshot) => {
        // console.log(snapshot.val())
        this.p3c_admin_keys = snapshot.val()
        if (this.posting_now === false) {
          this.$q.loading.hide()
        }
      }, function (errorObject) {
        console.log('The read failed: ' + errorObject.code)
      })
      this.$p3c_communityKeys.on('value', (snapshot) => {
        // console.log(snapshot.val())
        this.p3c_community_keys = snapshot.val()
        if (this.posting_now === false) {
          this.$q.loading.hide()
        }
      }, function (errorObject) {
        console.log('The read failed: ' + errorObject.code)
      })
    }
  },
  mounted () {
    // let book = null
    this.$firebase.auth().signInAnonymously().catch((error) => {
      // Handle Errors here.
      this.$q.notify(error.message)
      // ...
    })
    // known error: Get data runs again when user authorized from mobile phone.
    this.$firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        // var isAnonymous = user.isAnonymous
        this.uid = user.uid
        this.getdata()
        // console.log(this.uid)
      // ...
      } else {
      // User is signed out.
      // ...
      }
      // ...
    })
    this.books = []
    this.$q.loading.show()
    this.setTimeStamp()
    this.$firebase.auth().useDeviceLanguage()
    try {
      window.recaptchaVerifier = new this.$firebase.auth.RecaptchaVerifier('sendSms', {
        'size': 'invisible',
        'callback': function (response) {}
      })
    } catch (err) {
      this.$q.notify(err)
      this.$q.loading.hide()
    }
    //  console.log(this.books[1])
  },
  validations: {
    text: {
      required,
      minLength: minLength(5)
    },
    thumbnail: {
      required
    },
    code: {
      required,
      minLength: minLength(6)
    },
    title: {
      required,
      minLength: minLength(8),
      maxlength: maxLength(90)
    },
    profile_pic: {
      required
    },
    auth_text: {
      required,
      minLength: minLength(9),
      maxlength: maxLength(10)
    }
  }
}
</script>

<style>
</style>
