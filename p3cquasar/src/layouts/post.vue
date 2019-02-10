<template>
  <q-layout> <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-layout-header class="no-shadow">
      <q-toolbar color="white" class="text-black">
        <q-btn
          round
          dense
          icon="arrow_back"
          @click="$router.push('/')"
        />
                  <!-- On click change the page to home -->
        <q-item>
          <q-item-side :avatar="this.profile_pic" />
        </q-item>
        <q-toolbar-title>
          {{this.title}}
          <span slot="subtitle">{{this.mobile_no}} - {{this.datetime}}</span>
        </q-toolbar-title>
        <q-btn round color="green text-grey-1" dense size="lg" side="right" icon="update"  @click.native="openUpdatePostModal"/>
      </q-toolbar>
    </q-layout-header>
<!-- Post avatar here show big in circle image and then view to post starts -->
    <q-page-container>
      <q-page>
        <div class="row">
          <q-modal v-model="opened" maximized no-backdrop-dismiss>
            <div class="row justify-center">
              <p class="text-light" align="center">Press `ESC` to go back or click
                <q-btn color="grey-9" @click.native="closeModal" label="back" outline />
              </p>
            </div>
            <div class="row justify-center q-mb-sm">
              <q-toggle color="teal-8" v-model="make_it_null" @input="makeItNull" label="Hide Post"/>
            </div>
            <div class="row justify-center" style="background-color: #f7f7f7">
              <div class="col-9">
                <q-input type="text" inverted class="q-mt-md q-ml-sm q-mr-sm" :maxlength="90" :disable="disable_editor" color="white text-black" :error="error_title" v-model="title" float-label="Add New Title *" clearable />
              </div>
              <div class="col-9 q-ma-md">
                <q-editor v-model="model" :disable="disable_editor" toolbar-color="grey-10" :toolbar="[
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
            <div style="padding: 10px" class="row justify-around" color="black">
              <div class="col-md-5">
                <q-uploader :url='uploader_url' :disable="disable_uploader" @add="thumbnailAdded" @remove:cancel="thumbnailRemoved" @remove:done="thumbnailRemoved" @remove:abort="thumbnailRemoved" hide-upload-button :name='thumbnail' float-label="Upload Thumbnail" extensions=".jpeg, .jpg, .png, .gif"
                  :error="error_thumbnail" />
                <!-- <q-input type="url" readonly :error="error_thumbnail" v-model="thumbnail" float-label="Add Thumbnail *" clearable />
                  <q-btn flat dense icon="file_upload" class="float-right" css="position: absolute;"/> -->
              </div>

              <div class="col-md-5">
                <q-uploader :url='uploader_url' :disable="disable_uploader" @add="ppadded" @remove:cancel="ppRemoved" @remove:done="ppRemoved" @remove:abort="ppRemoved" hide-upload-button :name="profile_pic" float-label="Upload Profile Picture" extensions=".jpeg, .jpg, .png, .gif"
                  :error="error_profilepic" />
                <!-- <q-input type="url" readonly :error="error_profilepic" v-model="profile_pic" float-label="Add Profile Pic *" clearable />
                  <q-btn flat dense icon="file_upload" class="float-right"/> -->
              </div>
            </div>
            <div class="row justify-center">
              <!-- Instead of input add a button here -->
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
              <q-btn :hidden="hidden" label="Confirm" color="primary" @click.native="publishUpdate" class="q-ml-sm" />
            </div>
          </q-modal>
        </div>
        <div class="row justify-center">
          <a :href="this.image">
            <img :src="this.image" class="responsive" style="object-fit: cover; height: 35vw">
          </a>
          <div class="col-6">
          <q-editor v-model="model" :toolbar="[]" class="q-mt-sm" content-class="" readonly style="width: 100%;"/>
          </div>
        </div>
        <div class="row justify-center q-mt-lg" separator>
          <div class="col-2">
            <hr color="#f1f1f1"/>
          </div>
        </div>
      </q-page>
    </q-page-container>

  </q-layout>
</template>

<style>
</style>
<script>

import {
  required,
  minLength,
  maxLength
} from 'vuelidate/lib/validators'
export default {
  // name: 'LayoutName',
  data () {
    return {
      model: '',
      title: '',
      datetime: '',
      mobile_no: '',
      books: [],
      image: '',
      opened: false, // Refers to opening or closing Modal with full editor
      thumbail_files: [],
      pp_files: [],
      profile_pic: '',
      thumbnail: '',
      uploader_url: '',
      error_mobile: false,
      error_verification: false,
      error_thumbnail: false,
      error_title: false,
      error_profilepic: false,
      disable: true,
      code: '',
      text: '',
      send: 'Send SMS',
      hidden: true, // publish_update Btn (Confirm Button in Mylayout)
      wheretoPost: '',
      post_number: null,
      timestamp: null,
      thumbnail_fileURL: '',
      pp_fileURL: '',
      code_used: null,
      make_it_null: false,
      disable_editor: false,
      disable_uploader: false,
      recent_post: '',
      post_id: 0,
      uid: null,
      onstart: true
    }
  },
  mounted () {
    this.onstart = true
    this.$q.loading.show()
    this.$firebase.auth().signInAnonymously().then(() => console.log('"Mounted Signed Anny"')).catch((error) => {
      // Handle Errors here.
      this.$q.notify(error.message)
      // ...
    })
    this.$firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        // var isAnonymous = user.isAnonymous
        this.uid = user.uid
        this.getData()
        // console.log(this.uid)
      // ...
      } else {
      // User is signed out.
      // ...
      }
      // ...
    })
    this.wheretoPost = this.$route.params.location
    this.post_number = this.$route.params.pn
  },
  methods: {
    makeItNull (val) {
      if (val === true) {
        this.disable_editor = true
        this.disable_uploader = true
      } else {
        this.disable_editor = false
        this.disable_uploader = false
      }
    },
    openUpdatePostModal () {
      this.opened = true
    },
    closeModal () {
      this.opened = false
    },
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
    async publishUpdate () { // First checks all validation -> Upload Profile Pic -> Uplaod Thumbnail -> post on firebase
      this.onstart = false
      this.$firebase.auth().signInAnonymously().catch((error) => {
        // Handle Errors here.
        this.$q.notify(error.message)
        // ...
      })
      this.$q.loading.show({message: 'Please Wait...'})
      await this.setTimeStamp() // Updating time here everytime before posting.
      if (this.$v.text.$invalid && this.disable_editor === false) {
        this.$q.notify('Mobile number with country code is required.')
        this.error_mobile = true
        this.$q.loading.hide()
      } else if (this.$v.thumbnail.$invalid && this.disable_editor === false) {
        this.$q.notify('A Thumbnail image or video is required')
        this.error_mobile = false
        this.error_thumbnail = true
        this.$q.loading.hide()
      } else if (this.$v.title.$invalid && this.disable_editor === false) {
        this.$q.notify('Enter a valid title with a length of 8 or more but less than 90.')
        this.error_thumbnail = false
        this.error_mobile = false
        this.error_title = true
        this.$q.loading.hide()
      } else if (this.$v.code.$invalid) {
        this.error_mobile = false
        this.error_thumbnail = false
        this.error_title = false
        this.error_verification = true
        this.$q.loading.hide()
        this.$q.notify('Please enter correct 6 digit verification code')
      } else if (this.$v.profile_pic.$invalid && this.disable_editor === false) {
        this.$q.notify('Enter a valid title with a length of 8 characters or more but less than 90.')
        this.error_thumbnail = false
        this.error_mobile = false
        this.error_title = false
        this.error_profilepic = true
        this.$q.loading.hide()
      } else if (this.mobile_no !== this.text) {
        this.$q.notify('Please enter the mobile number that you used to create post')
        this.error_mobile = true
        this.$q.loading.hide()
      } else if (this.disable_editor === true) {
        this.error_mobile = false
        this.error_thumbnail = false
        this.error_verification = false
        this.error_title = false
        this.error_profilepic = false
        window.confirmationResult.confirm(this.code).then(() => {
          this.$axios.get('https://helloacm.com/api/random/?n=128').then((response) => {
            this.$firebase.database().ref(this.wheretoPost + '/' + this.post_number + '/null').set('true').then(() => {
              this.$q.notify({
                message: 'Update Published!',
                color: 'green'
              })
              this.$q.loading.hide()
              this.opened = false
              this.$router.push('/')
              this.hidden = true
            }).catch((err) => {
              this.$q.notify(err)
              this.$q.loading.hide()
            })
          }).catch((err) => {
            this.$q.notify(err)
            this.$q.loading.hide()
          })
        }).catch((err) => {
          this.$q.notify(err)
          this.$q.loading.hide()
        })
      } else {
        this.error_mobile = false
        this.error_thumbnail = false
        this.error_verification = false
        this.error_title = false
        this.error_profilepic = false
        this.closeModal()
        this.$q.loading.show({message: 'Please Wait While Uploading Profile Pic...'})
        window.confirmationResult.confirm(this.code).then(() => {
          let formDatap = new FormData()
          formDatap.append('file', this.pp_files[0])
          formDatap.append('tags', `gndu, board, notice`)
          formDatap.append('upload_preset', 'myldschl') // Replace the preset name with your own
          formDatap.append('api_key', '985345875982584') // Replace API key with your own Cloudinary key
          formDatap.append('timestamp', (this.timestamp / 1000) | 0)
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
            formData2.append('upload_preset', 'myldschl') // Replace the preset name with your own
            formData2.append('api_key', '985345875982584') // Replace API key with your own Cloudinary key
            formData2.append('timestamp', (this.timestamp / 1000) | 0)
            this.$q.loading.show({message: 'Please Wait While Uploading Thumbnail Pic...'})
            this.$axios.post('https://api.cloudinary.com/v1_1/dpnrocxf9/image/upload', formData2, {
              headers: {
                'X-Requested-With': 'XMLHttpRequest'
              }
            }).then((responset) => {
              let datat = responset.data
              this.thumbnail_fileURL = datat.secure_url
              // console.log(data)
              console.log(this.thumbnail_fileURL)
              this.$q.loading.show({message: 'Please Wait While Posting Your Request...'})
              this.$axios.get('https://helloacm.com/api/random/?n=128').then((response) => {
                this.$firebase.database().ref(this.wheretoPost + '/' + this.post_number + '/').set({
                  Body: this.model,
                  Comments: 'later',
                  Image: this.thumbnail_fileURL,
                  Mobile: this.text,
                  Random_Seed: response.data,
                  Recent_Post: this.recent_post,
                  Title: this.title,
                  Upvotes: '0',
                  DateTime: this.datetime,
                  Profile_Pic: this.pp_fileURL,
                  Updated_On: this.timestamp.toString(),
                  null: this.disable_editor.toString(), // If editor is enabled then keep the null to false
                  code_used: this.code_used,
                  post_id: this.post_id
                }).then(() => {
                  this.$q.notify({
                    message: 'Update Published!',
                    color: 'green'
                  })
                  this.$q.loading.hide()
                  this.$router.push('/')
                  this.hidden = true
                }).catch((err) => {
                  this.$q.notify(err)
                  this.$q.loading.hide()
                })
              }).catch((err) => {
                this.$q.notify(err)
                this.$q.loading.hide()
              })
            }).catch((err) => {
              this.$q.notify(err)
              this.$q.loading.hide()
            })
          }).catch((err) => {
            this.$q.notify(err)
            this.$q.loading.hide()
          })
        }).catch((err) => {
          this.$q.notify(err)
          this.$q.loading.hide()
        })
      }
    },
    sendsms () {
      console.log(this.title)
      this.$q.loading.show({message: 'Please Wait...'})
      if (this.$v.text.$invalid && this.disable_editor === false) {
        this.$q.notify('Mobile number with country code is required.')
        this.error_mobile = true
        this.$q.loading.hide()
      } else if (this.$v.thumbnail.$invalid && this.disable_editor === false) {
        this.$q.notify('A Thumbnail image or video is required')
        this.error_thumbnail = true
        this.error_mobile = false
        this.$q.loading.hide()
      } else if (this.$v.title.$invalid && this.disable_editor === false) {
        this.$q.notify('Enter a valid title with a length of 8 characters or more but less than 90.')
        this.error_thumbnail = false
        this.error_mobile = false
        this.error_title = true
        this.$q.loading.hide()
      } else if (this.$v.profile_pic.$invalid && this.disable_editor === false) {
        this.$q.notify('Enter a valid title with a length of 8 characters or more but less than 90.')
        this.error_thumbnail = false
        this.error_mobile = false
        this.error_title = false
        this.error_profilepic = true
        this.$q.loading.hide()
      } else if (this.mobile_no !== this.text) {
        this.$q.notify('Please enter the mobile number that you used to create post')
        this.error_mobile = true
        this.$q.loading.hide()
      } else {
        this.error_mobile = false
        this.error_thumbnail = false
        this.error_title = false
        this.error_profilepic = false
        let mobileNo = '+' + this.text
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
    },
    async setTimeStamp () {
      await this.$axios.get('http://worldclockapi.com/api/json/utc/now').then((res) => {
        this.timestamp = new Date(res.data.currentDateTime)
        // console.log(this.timestamp / 1000 + 'OK')
      }).catch((err) => {
        this.$q.notify(err)
      })
    },
    getData () {
      if (this.$route.params.location === 'p3c_admin' && this.onstart === true) {
        this.$p3c_communityref.off()
        this.$bookref.on('value', (snapshot) => {
          this.books = []
          this.books = snapshot.val()
          for (var i = 0; i < this.books.length; i++) {
            if (this.books[i].Random_Seed === this.$route.params.id) {
              this.model = this.books[i].Body
              this.mobile_no = this.books[i].Mobile
              this.title = this.books[i].Title
              this.datetime = this.books[i].DateTime
              this.profile_pic = this.books[i].Profile_Pic
              this.image = this.books[i].Image
              this.code_used = this.books[i].code_used
              this.post_id = this.books[i].post_id
              this.$q.loading.hide()
            }
          }
        }, function (errorObject) {
          console.log('The read failed: ' + errorObject.code)
        })
      } else if (this.$route.params.location === 'p3c_community' && this.onstart === true) {
        this.$bookref.off()
        this.$p3c_communityref.on('value', (snapshot) => {
          this.books = []
          this.books = snapshot.val()
          for (var i = 0; i < this.books.length; i++) {
            if (this.books[i].Random_Seed === this.$route.params.id) {
              this.model = this.books[i].Body
              this.mobile_no = this.books[i].Mobile
              this.title = this.books[i].Title
              this.datetime = this.books[i].DateTime
              this.profile_pic = this.books[i].Profile_Pic
              this.image = this.books[i].Image
              this.code_used = this.books[i].code_used
              this.post_id = this.books[i].post_id
              this.$q.loading.hide()
            }
          }
        }, function (errorObject) {
          console.log('The read failed: ' + errorObject.code)
        })
      }
    }
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
    }
  }
}
</script>
