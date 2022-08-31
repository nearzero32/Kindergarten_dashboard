<template>
  <div class="team">
    <v-card class="white pa-3">
      <h1 class="text-center mb-3 subtitle-4 black--text"> اتصل بنا </h1>
      <form id="uploadForm" enctype="multipart/form-data">
        <v-row v-if="isPageNotLoading" class="mt-5">
          <!-- website -->
          <v-col md="6" cols="12">
            <v-text-field v-model="data.website" dense append-icon="fa-globe-americas" label="الموقع الالكتروني"
              outlined></v-text-field>
          </v-col>
          <!-- facebook -->
          <v-col md="6" cols="12">
            <v-text-field v-model="data.facebook" dense append-icon="fab fa-facebook" label="فيسبوك" outlined>
            </v-text-field>
          </v-col>
          <!-- whatsapp -->
          <v-col md="6" cols="12">
            <v-text-field v-model="data.whatsapp" dense append-icon="fab fa-whatsapp" label="واتساب" outlined>
            </v-text-field>
          </v-col>
          <!-- phone -->
          <v-col md="6" cols="12">
            <v-text-field v-model="data.phone" dense append-icon="fa-phone" label="الهاتف" outlined></v-text-field>
          </v-col>
          <!-- location -->
          <v-col md="6" cols="12">
            <v-text-field v-model="data.location" dense append-icon="fa-location-arrow" label="الموقع" outlined>
            </v-text-field>
          </v-col>
          <!-- google_map -->
          <v-col cols="6">
            <v-text-field v-model="data.google_map" dense append-icon="fa-map-marker-alt" label="خرائط غوغل" outlined>
            </v-text-field>
          </v-col>
          <v-col md="6" cols="12">
            <div class="d-flex align-center">
              <span class="ml-5">الصورة:</span>
              <img class="teacher_image_table" :src="showImage()" />
              <v-btn text color="primary" @click="$refs.inputImageUpload.click()"> تعديل الصورة </v-btn>
              <input v-show="false" id="image" ref="inputImageUpload" type="file" @change="changeImage($event)" />
            </div>
          </v-col>
          <!-- descrition -->
          <v-col cols="12">
            <v-textarea v-model="data.description" name="input-7-1" :rules="rules.descrition" label="الوصف"
              append-icon="fa-scroll" outlined></v-textarea>
          </v-col>
        </v-row>
        <v-row v-else class="mt-10 mb-2 d-flex justify-center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-row>
      </form>
      <div v-if="isPageNotLoading" class="d-flex justify-center mt-2">
        <v-btn :loading="editBtnLoading" color="primary" @click="submitAdd()"> تعديل </v-btn>
      </div>
    </v-card>
    <!--- Dailog for show info to user-->
    <v-dialog v-model="dialogData.open" max-width="500px">
      <v-toolbar :color="dialogData.color" dense></v-toolbar>
      <v-card>
        <v-card-title class="headline justify-center"> {{ dialogData.bodyText }} </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogData.open = false"> تم </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import adminApi from '@/api/adminApi'

import { convertModelToFormData } from '@/utility/formData'

export default {
  data() {
    return {
      editBtnLoading: false,

      isFormValid: false,

      isPageNotLoading: true,

      deleteItemLoading: false,

      dialogDelete: false,

      rules: {
        website: [value => !!value || 'الموقع مطلوب'],
        facebook: [value => !!value || 'الفيسبوك مطلوب'],
        whatsapp: [value => !!value || 'الواتساب مطلوب'],
        phone: [value => !!value || 'الهاتف مطلوب'],
        location: [value => !!value || 'الموقع مطلوب'],
        google_map: [value => !!value || 'خرائط غوغل مطلوبة'],
        description: [value => !!value || 'الوصف مطلوب'],
      },

      dialogData: {
        open: false,
        color: 'primary',
        bodyText: 'test',
      },

      imageUrl: null,

      hideImage: false,

      data: {
        _id: null,
        description: null,
        website: null,
        img: null,
        oldImg: null,
        facebook: null,
        whatsapp: null,
        phone: null,
        google_map: null,
        location: null,
      },
      testUrl: null,
      content_url: null,
    }
  },

  mounted() {
    this.getData()
  },

  methods: {
    async getData() {
      this.isPageNotLoading = false

      const response = await adminApi.getContactUs()
      if (response.status === 401) {
        this.isPageNotLoading = true
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.isPageNotLoading = true
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.isPageNotLoading = true
        this.data = response.data.results
        this.content_url = response.data.content_url
      }
    },

    async submitAdd() {
      this.editBtnLoading = true

      const imageFile = document.querySelector('#image')


      this.data.oldImg = this.data.img

      if ((imageFile.files).length >= 1) {
        this.data.img = imageFile.files[0]
      } else {
        delete this.data.img;
      }

      const formData = convertModelToFormData(this.data)

      const response = await adminApi.editContactUs(formData)
      if (response.status === 401) {
        this.editBtnLoading = false
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.editBtnLoading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.showDialogfunction(response.data.results, 'primary')
        this.data.img = this.data.oldImg
      }
    },

    showDialogfunction(bodyText, color) {
      this.dialogData.open = true
      this.dialogData.bodyText = bodyText
      this.dialogData.color = color
    },

    changeImage(event) {
      const file = event.target.files[0]
      this.imageUrl = null
      if (typeof file !== 'undefined' && file !== null) {
        const fileExt = file.name.split('.').pop()
        if (
          fileExt.toLowerCase() === 'jpg' ||
          fileExt.toLowerCase() === 'jpeg' ||
          fileExt.toLowerCase() === 'png' ||
          fileExt.toLowerCase() === 'png' ||
          fileExt.toLowerCase() === 'gif'
        ) {
          this.imageUrl = URL.createObjectURL(file)
        } else {
          console.log('error_image_add')
        }
      } else {
        this.imageUrl = null
      }
    },

    showImage() {
      if (!this.imageUrl) {
        return this.content_url + this.data.img
      }

      return this.imageUrl
    },

    appendFormWithImage(formData, imagefile) {
      formData.append('img', imagefile.files[0])
      formData.append('description', this.data.description)
      formData.append('website', this.data.website)
      formData.append('facebook', this.data.facebook)
      formData.append('whatsapp', this.data.whatsapp)
      formData.append('phone', this.data.phone)
      formData.append('google_map', this.data.google_map)
      formData.append('location', this.data.location)
    },
    appendFormWithoutImage(formData) {
      formData.append('description', this.data.description)
      formData.append('website', this.data.website)
      formData.append('facebook', this.data.facebook)
      formData.append('whatsapp', this.data.whatsapp)
      formData.append('phone', this.data.phone)
      formData.append('google_map', this.data.google_map)
      formData.append('location', this.data.location)
    },
  },
}
</script>

<style scoped>
.teacher_image_table {
  cursor: pointer;
  width: 109px;
  height: 100px;
}

.default_image_show {
  width: 109px;
  height: 100px;
  border: 1px solid red;
}
</style>

<style scoped>
a {
  text-decoration: none;
}
</style>
