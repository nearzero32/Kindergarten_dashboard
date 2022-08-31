<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center subtitle-4 black--text"> اضافة مناسبة </h1>
        <v-form v-model="isFormValid">
          <v-row class="mt-5">
            <!-- notifications_type -->
            <!-- <v-col md="4" sm="6" cols="12">
              <v-select v-model="teacherData.notifications_type" :items="notifications_typeItems"
                :rules="Rules.notifications_type" dense item-text="text" item-value="value" label="النوع" outlined
                @change="changeNotificationType"></v-select>
            </v-col> -->
            <!-- notifications_title -->
            <v-col md="4" sm="6" cols="12">
              <v-autocomplete v-if="teacherData.notifications_type === 'واجب بيتي'"
                v-model="teacherData.notifications_title" :loading="studentLoading" :items="subjectsData"
                item-text="subject_name" clearable outlined dense label="المواد"
                @click:clear="teacherData.notifications_title = null"></v-autocomplete>
              <v-text-field v-else v-model="teacherData.notifications_title" :rules="Rules.notifications_title" dense
                :label="titleLable" outlined></v-text-field>
            </v-col>
            <!-- notifications_link -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.notifications_link" dense label="الرابط" outlined></v-text-field>
            </v-col>
            <!-- notifications_img1 -->
            <v-col cols="12">
              <v-row>
                <v-col md="2" sm="12">
                  <v-btn text color="primary" @click="$refs.img1Upload.click()"> اضافة صور </v-btn>
                  <input v-show="false" id="imgs_upload" ref="img1Upload" type="file" @change="changeImgs($event)"
                    multiple />
                </v-col>
                <v-col md="10" sm="12">
                  <div v-if="imgsUrl.length >= 1" v-for="(imgUrl, index) in imgsUrl" :key="index" class="imgs_div">
                    <img id="imgs" :src="imgUrl" class="teacher_image_table mt-sm-5" alt width="70" height="70" />
                    <v-tooltip left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon class="image-dismis" v-bind="attrs" v-on="on" @click="deleteImages(index)">
                          fa-minus-circle </v-icon>
                      </template>
                      <span>مسح الصورة</span>
                    </v-tooltip>
                  </div>
                </v-col>
              </v-row>
            </v-col>
            <!-- receiver -->
            <v-col md="4" sm="6" cols="12">
              <v-select v-model="receiverData" :items="receiverItems" :rules="Rules.receiver" dense item-text="text"
                item-value="value" label="المستلم" outlined @change="receiverChange">
              </v-select>
            </v-col>
            <!-- notifications_class_school_id -->
            <v-col v-show="isClassSchoolSelectShowing" md="4" sm="6" cols="12">
              <v-autocomplete v-model="teacherData.notifications_class_school_id" :loading="classLoading"
                :items="classSchoolData" :item-text="(item) => item.class_name + ' - ' + item.leader" item-value="_id"
                clearable outlined dense label="الصفوف" multiple
                @click:clear="teacherData.notifications_class_school_id = null"></v-autocomplete>
            </v-col>
            <!-- notifications_student_id -->
            <v-col v-show="isStudentSelectShowing" md="4" sm="6" cols="12">
              <v-autocomplete v-model="teacherData.notifications_student_id" :loading="studentLoading"
                :items="studentsData" item-text="account_name" item-value="_id" clearable outlined dense label="الطلاب"
                multiple @click:clear="teacherData.notifications_student_id = null"></v-autocomplete>
            </v-col>
            <!-- notifications_teacher_id -->
            <v-col v-show="isTeacherSelectShowing" md="4" sm="6" cols="12">
              <v-autocomplete v-model="teacherData.notifications_student_id" :loading="teacherLoading"
                :items="teachersData" item-text="account_name" item-value="_id" clearable outlined dense
                label="الاساتذة" multiple @click:clear="teacherData.notifications_student_id = null"></v-autocomplete>
            </v-col>
            <!-- notifications_driver_id -->
            <v-col v-show="isDriverSelectShowing" md="4" sm="6" cols="12">
              <v-autocomplete v-model="teacherData.notifications_student_id" :loading="driverLoading"
                :items="driversData" item-text="account_name" item-value="_id" clearable outlined dense label="السواق"
                multiple @click:clear="teacherData.notifications_student_id = null"></v-autocomplete>
            </v-col>
            <!-- notifications_pdf -->
            <v-col v-show="isPdfShowing" md="4" sm="6" cols="12">
              <v-file-input v-model="teacherData.notifications_pdf" accept="application/pdf" outlined
                label="رفع ملف (اختياري)" dense show-size truncate-length="17"></v-file-input>
            </v-col>
            <!-- notifications_description -->
            <v-col cols="12">
              <v-textarea v-model="teacherData.notifications_description" name="input-7-1" label="الوصف"
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
import Api from '@/api/api'
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

      imgsUrl: [],

      studentLoading: false,

      teacherLoading: false,

      driverLoading: false,

      classLoading: false,

      subjectLoading: false,

      isFormValid: false,

      titleLable: 'العنوان',

      Rules: {
        notifications_title: [value => !!value || 'العنوان مطلوب'],
        notifications_type: [value => !!value || 'النوع مطلوب'],
        receiver: [value => !!value || 'المستلم مطلوب'],
      },

      dialogData: {
        open: false,
        color: 'primary',
        bodyText: 'test',
      },

      isClassSchoolSelectShowing: false,

      isStudentSelectShowing: false,

      isTeacherSelectShowing: false,

      isDriverSelectShowing: false,

      isPdfShowing: false,

      notifications_typeItems: [
        { text: 'واجب بيتي (للطلاب)', value: 'واجب بيتي' },
        { text: 'رسالة (للطلاب)', value: 'رسالة' },
        { text: 'تقرير (زي - كتب - قرطاسية)', value: 'تقرير' },
        { text: 'تبليغ (للاساتذة و الخطوط)', value: 'تبليغ' },
        { text: 'اقساط (للطلاب)', value: 'اقساط' },
        { text: 'ملخص الدروس اليومية (للطلاب)', value: 'ملخص' },
      ],

      receiverItems: [
        { text: 'كل الطلاب', value: 'schoolReceiver' },
        { text: 'صفوف وشعب', value: 'classSchoolReceiver' },
        { text: 'طالب', value: 'studentReceiver' },
        // { text: 'استاذ', value: 'teacherReceiver' },
        // { text: 'السائق', value: 'driverReceiver' },
      ],

      account_disableItems: [
        { text: 'مفعل', value: 0 },
        { text: 'متوقف', value: 1 },
      ],

      classSchoolData: [],

      studentsData: [],

      teachersData: [],

      driversData: [],

      subjectsData: [],

      account_payment_typeItems: ['ملاك', 'محاضر'],

      account_genderItems: ['ذكر', 'انثى'],

      menuAccountStartDate: false,

      menuAccountBirthday: false,

      receiverData: null,

      teacherData: {
        notifications_class_school_id: null,
        notifications_student_id: null,
        notifications_type: "مناسبات",
        notifications_title: null,
        notifications_description: null,
        notifications_imgs: null,
        notifications_pdf: null,
        notifications_link: null,
        notifications_study_year: null,
        receiver: null
      },

      addBtnLoading: false,
    }
  },
  async created() {
    await this.getClassSchool()
    await this.getStudents()
    // await this.getTeachers()
    // await this.getDrivers()
    // await this.getSubject()
  },
  methods: {
    async getClassSchool() {
      this.classLoading = true
      const response = await Api.getClassSchool()

      if (response.status === 401) {
        this.classLoading = false
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.classLoading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.classLoading = false
        this.classSchoolData = response.data.results
      }
    },

    async getStudents() {
      this.studentLoading = true

      const response = await Api.getAllStudents()

      if (response.status === 401) {
        this.studentLoading = false
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.studentLoading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.studentLoading = false
        this.studentsData = response.data.results
      }

    },

    async getTeachers() {
      this.teacherLoading = true

      const response = await Api.getAllTeachers()

      if (response.status === 401) {
        this.teacherLoading = false
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.teacherLoading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.teacherLoading = false
        this.teachersData = response.data.results
      }
    },

    async getDrivers() {
      this.driverLoading = true

      const response = await Api.getDriver()

      if (response.status === 401) {
        this.driverLoading = false
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.driverLoading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.driverLoading = false
        this.driversData = response.data.results
      }

    },

    async getSubject() {
      this.subjectLoading = true

      const response = await Api.getSubjectWithoutFeatures()

      if (response.status === 401) {
        this.subjectLoading = false
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.subjectLoading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.subjectLoading = false
        this.subjectsData = response.data.results
      }

    },

    async submitAdd() {
      if (this.receiverData === 'classSchoolReceiver' && !this.teacherData.notifications_class_school_id) {
        this.showDialogfunction('عند اختيار المستلم الصف والشعبة يجب تحديد الشعبة', '#FF8A80')
      } else if (this.receiverData === 'studentReceiver' && !this.teacherData.notifications_student_id) {
        this.showDialogfunction('عند اختيار المستلم طالب يجب تحديد الطلبة', '#FF8A80')
      } else {
        this.addBtnLoading = true
        const imgs = document.querySelector('#imgs_upload');
        this.teacherData.notifications_imgs = imgs.files
        this.teacherData.notifications_study_year = JSON.parse(localStorage.getItem("study_year"))
        this.teacherData.receiver = this.receiverData

        const formData = convertModelToFormData(this.teacherData)


        const response = await Api.addNotification(formData)

        if (response.status === 401) {
          this.addBtnLoading = false
          this.$store.dispatch('submitLogout')
        } else if (response.status === 500) {
          this.addBtnLoading = false
          this.showDialogfunction(response.data.results, '#FF5252')
        } else {
          this.addBtnLoading = false
          this.showDialogfunction(response.data.results, 'primary')
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

    receiverChange() {
      if (this.receiverData === 'classSchoolReceiver') {
        this.teacherData.notifications_student_id = ''
        this.showOnlyClassSchoolSelect()
      } else if (this.receiverData === 'studentReceiver') {
        this.teacherData.notifications_class_school_id = ''
        this.showOnlyStudentlSelect()
      } else if (this.receiverData === 'teacherReceiver') {
        this.teacherData.notifications_class_school_id = ''
        this.showOnlyTeacherSelect()
      } else if (this.receiverData === 'driverReceiver') {
        this.teacherData.notifications_class_school_id = ''
        this.showOnlyDriverSelect()
      } else {
        this.teacherData.notifications_class_school_id = ''
        this.teacherData.notifications_student_id = ''
        this.dontShowAnySelect()
      }
    },

    async changeImgs(event) {
      const files = event.target.files;
      this.imgsUrl = []
      if (files.length > 10) {
        this.showDialogfunction("لا يمكن اضافة اكثر من عشر صور", "#FF8A80")
      } else {
        for await (const file of files) {
          this.imgsUrl.push(URL.createObjectURL(file))
        }
      }
    },

    showOnlyClassSchoolSelect() {
      this.isClassSchoolSelectShowing = true
      this.isStudentSelectShowing = false
      this.isTeacherSelectShowing = false
      this.isDriverSelectShowing = false
    },

    showOnlyStudentlSelect() {
      this.isStudentSelectShowing = true
      this.isClassSchoolSelectShowing = false
      this.isTeacherSelectShowing = false
      this.isDriverSelectShowing = false
    },

    showOnlyTeacherSelect() {
      this.isStudentSelectShowing = false
      this.isClassSchoolSelectShowing = false
      this.isTeacherSelectShowing = true
      this.isDriverSelectShowing = false
    },

    showOnlyDriverSelect() {
      this.isStudentSelectShowing = false
      this.isClassSchoolSelectShowing = false
      this.isTeacherSelectShowing = false
      this.isDriverSelectShowing = true
    },

    dontShowAnySelect() {
      this.isStudentSelectShowing = false
      this.isClassSchoolSelectShowing = false
      this.isTeacherSelectShowing = false
      this.isDriverSelectShowing = false
    },

    formAppend(formData, imgs, pdf) {
      const study_year = JSON.parse(localStorage.getItem('study_year'))

      // formData.append('photos', imgs.files)
      formData.append('pdf', pdf)
      formData.append('notifications_description', this.teacherData.notifications_description)
      formData.append('notifications_link', this.teacherData.notifications_link)
      formData.append('notifications_type', this.teacherData.notifications_type)
      formData.append('notifications_title', this.teacherData.notifications_title)
      // formData.append('notifications_student_id', this.teacherData.notifications_student_id)
      formData.append('notifications_study_year', study_year)
      formData.append('photos', imgs.files)
      if ((imgs.files).length > 1) {
        this.loopThrowImgs(formData, imgs)
      } else {
        formData.append('photos', imgs.files);
      }

      formData.append('notifications_class_school_id', JSON.stringify(this.teacherData.notifications_class_school_id));
      formData.append('notifications_student_id', this.teacherData.notifications_student_id);


      // if ((this.teacherData.notifications_class_school_id).length > 1) {
      //   for (var i = 0; i < this.teacherData.notifications_class_school_id.length; i++) {
      //     await formData.append('notifications_class_school_id', this.teacherData.notifications_class_school_id[i]);
      //   }

      // } else {

      // }

      // if ((this.teacherData.notifications_student_id).length > 1) {
      //   for (var i = 0; i < this.teacherData.notifications_student_id.length; i++) {
      //     await formData.append('notifications_student_id', this.teacherData.notifications_student_id[i]);
      //   }

      // } else {
      //   formData.append('notifications_class_school_id', this.teacherData.notifications_class_school_id);
      // }
      // formData.append('notifications_class_school_id', this.teacherData.notifications_class_school_id)
    },

    loopThrowImgs() {
      for (const photo of (imgs.files)) {
        formData.append('photos', photo)
      }
    },

    changeNotificationType() {
      this.resetValueOnChangeNotificationType()

      this.changeTitleNameOnChangeNotificationTyoe()

      this.changeReceiverItemsOnChangeNotificationType()
    },

    changeTitleNameOnChangeNotificationTyoe() {
      const title =
        this.teacherData.notifications_type === 'homework' || this.teacherData.notifications_type === 'summary'
          ? 'اسم المادة'
          : 'العنوان'
      this.titleLable = title
    },

    changeReceiverItemsOnChangeNotificationType() {
      if (this.teacherData.notifications_type === 'واجب بيتي') {
        this.isPdfShowing = true
        this.receiverItems = [
          // { text: 'كل الطلاب', value: 'schoolReceiver' },
          { text: 'صفوف وشعب', value: 'classSchoolReceiver' },
          { text: 'طالب', value: 'studentReceiver' },

          // { text: 'استاذ', value: 'teacherReceiver' },
          // { text: 'السائق', value: 'driverReceiver' },
        ]
      } else if (this.teacherData.notifications_type === 'تبليغ') {
        this.isPdfShowing = false
        this.receiverItems = [
          // { text: 'كل الطلاب', value: 'schoolReceiver' },
          // { text: 'صفوف وشعب', value: 'classSchoolReceiver' },
          // { text: 'طالب', value: 'studentReceiver' },

          { text: 'استاذ', value: 'teacherReceiver' },
          { text: 'السائق', value: 'driverReceiver' },
        ]
      } else {
        this.isPdfShowing = false
        this.receiverItems = [
          { text: 'كل الطلاب', value: 'schoolReceiver' },
          { text: 'صفوف وشعب', value: 'classSchoolReceiver' },
          { text: 'طالب', value: 'studentReceiver' },

          // { text: 'استاذ', value: 'teacherReceiver' },
          // { text: 'السائق', value: 'driverReceiver' },
        ]
      }
    },

    resetValueOnChangeNotificationType() {
      this.receiverData = null
      this.teacherData.notifications_class_school_id = null
      this.teacherData.notifications_student_id = null
      this.isStudentSelectShowing = false
      this.isClassSchoolSelectShowing = false
      this.isTeacherSelectShowing = false
      this.isDriverSelectShowing = false
    },

    deleteImages(index) {
      this.imgsUrl.splice(index, 1)
      // console.log('this.imgsUrl', this.imgsUrl);
      // const imgs = document.querySelector('#imgs_upload');
      // const fileListAsArray = Array.from(imgs)
      // var files = document.getElementById('imgs_upload').files
      // var fileObject = files[0].toObject()
      // var filesArray = files.toArray()
      // console.log('filesArray', filesArray);
      // (imgs.files).splice(0, 1)
    },
  },
}
</script>

<style scoped>
#galeria {
  display: flex;
}

.imgs_div {
  display: inline-block;
  position: relative;

}

.teacher_image_table {
  margin-left: 10px;
}

.image-dismis {
  position: absolute;
  content: 'x';
  top: -3px;
  left: 0px;
  color: red;
  cursor: pointer;
  /* background: red; */
  /* padding: 5px 5px; */
  border-radius: 50%;
}
</style>
