<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center subtitle-4 black--text"> اضافة اعلان </h1>
        <v-form v-model="isFormValid">
          <v-row class="mt-5">
            <!-- title -->
            <v-col md="4" sm="4" cols="12">
              <v-text-field v-model="teacherData.title" :rules="Rules.title" dense label="العنوان" outlined>
              </v-text-field>
            </v-col>
            <!-- link -->
            <v-col md="4" sm="4" cols="12">
              <v-text-field v-model="teacherData.link" dense label="الرابط" outlined></v-text-field>
            </v-col>
            <!-- phone -->
            <v-col md="4" sm="4" cols="12">
              <v-text-field v-model="teacherData.phone" dense label="الهاتف" outlined></v-text-field>
            </v-col>
            <!-- notifications_img1 -->
            <v-col md="4" sm="6" cols="12">
              <div class="d-flex justify-space-around align-center">
                <v-btn text color="primary" @click="$refs.img1Upload.click()"> اضافة صورة </v-btn>
                <input v-show="false" id="img1" ref="img1Upload" type="file" @change="changeImg1($event)" />
                <div v-show="imgAndDivShowControll.IsDiv1Showing"
                  style="width: 70px; height: 70px; border: 1px solid red"></div>
                <img v-show="imgAndDivShowControll.isImg1Showing" class="teacher_image_table" :src="img1Url" alt
                  width="70" height="70" />
              </div>
            </v-col>
            <!-- description -->
            <v-col cols="12">
              <v-textarea v-model="teacherData.desc" :rules="Rules.desc" name="input-7-1" label="الوصف"
                append-icon="fa-scroll" outlined></v-textarea>
            </v-col>
          </v-row>
        </v-form>
        <div class="d-flex justify-center mt-2">
          <v-btn :loading="addBtnLoading" :disabled="!isFormValid" color="primary" @click="submitAdd()"> اضافة </v-btn>
          <v-btn class="mr-5" @click="cancelAdd()"> الغاء </v-btn>
        </div>
      </v-card>
    </v-container>
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
import api from '@/api/api'
import { convertModelToFormData } from '@/utility/formData'
export default {
  data() {
    return {
      imgAndDivShowControll: {
        IsDiv1Showing: true,
        isImg1Showing: false,

        IsDiv2Showing: true,
        isImg2Showing: false,

        IsDiv3Showing: true,
        isImg3Showing: false,
      },

      img1Url: null,
      img2Url: null,
      img3Url: null,

      studentLoading: false,

      teacherLoading: false,

      driverLoading: false,

      classLoading: false,

      isFormValid: false,

      Rules: {
        title: [value => !!value || 'العنوان مطلوب'],
        desc: [value => !!value || 'الوصف مطلوب'],
      },

      dialogData: {
        open: false,
        color: 'primary',
        bodyText: 'test',
      },

      receiverData: null,

      teacherData: {
        title: null,
        desc: null,
        link: null,
        img: null,
        phone: null
      },

      addBtnLoading: false,
    }
  },
  methods: {
    async submitAdd() {
      const img1 = document.querySelector('#img1')

      if (!img1.files.length) {
        this.showDialogfunction('يجب اختيار صورة', '#FF8A80')
      } else {

        this.addBtnLoading = true


        this.teacherData.img = img1.files

        const formData = convertModelToFormData(this.teacherData)


        const response = await api.addAds(formData)

        if (response.status === 401) {
          this.addBtnLoading = false
          this.$store.dispatch('submitLogout')
        } else if (response.status === 500) {
          this.addBtnLoading = false
          this.showDialogfunction(response.data.results, '#FF5252')
        } else {
          this.addBtnLoading = false
          this.showDialogfunction(response.data.results, 'primary')
          // this.$router.push("/latestNews")
        }
      }
    },

    cancelAdd() {
      this.$router.back(1)
    },

    showDialogfunction(bodyText, color) {
      this.dialogData.open = true
      this.dialogData.bodyText = bodyText
      this.dialogData.color = color
    },

    changeImg1(event) {
      this.imgAndDivShowControll.IsDiv1Showing = false
      this.imgAndDivShowControll.isImg1Showing = true

      const file = event.target.files[0]
      this.img1Url = null
      if (typeof file !== 'undefined' && file !== null) {
        const fileExt = file.name.split('.').pop()
        if (
          fileExt.toLowerCase() === 'jpg' ||
          fileExt.toLowerCase() === 'jpeg' ||
          fileExt.toLowerCase() === 'png' ||
          fileExt.toLowerCase() === 'png' ||
          fileExt.toLowerCase() === 'gif'
        ) {
          this.img1Url = URL.createObjectURL(file)
        } else {
          console.log('error_image_add')
        }
      } else {
        this.img1Url = null
      }
    },

    formAppend(formData, img1) {
      formData.append('latest_news_img', img1.files[0])
      formData.append('latest_news_title', this.teacherData.latest_news_title)
      formData.append('latest_news_description', this.teacherData.latest_news_description)
      formData.append('latest_news_link', this.teacherData.latest_news_link)
    },
  },
}
</script>
