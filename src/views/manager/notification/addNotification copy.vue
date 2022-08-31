<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center subtitle-4 black--text"> اضافة اشعار </h1>
        <v-form v-model="isFormValid">
          <v-row class="mt-5">
            <!-- notifications_type -->
            <v-col md="4" sm="6" cols="12">
              <v-select v-model="teacherData.notifications_type" :items="notifications_typeItems"
                :rules="Rules.notifications_type" dense item-text="text" item-value="value" label="النوع" outlined
                @change="changeNotificationType"></v-select>
            </v-col>
            <!-- notifications_title -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.notifications_title" :rules="Rules.notifications_title" dense
                :label="titleLable" outlined></v-text-field>
            </v-col>
            <!-- notifications_link -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.notifications_link" dense label="الرابط" outlined></v-text-field>
            </v-col>
            <!-- notifications_img1 -->
            <v-col md="4" sm="6" cols="12">
              <div class="d-flex justify-space-around align-center">
                <v-btn text color="primary" @click="$refs.img1Upload.click()"> اضافة صور </v-btn>
                <input v-show="false" id="img1" ref="img1Upload" type="file" @change="changeImg1($event)" multiple />
                <div v-show="imgAndDivShowControll.IsDiv1Showing"
                  style="width: 70px; height: 70px; border: 1px solid red"></div>
                <img v-show="imgAndDivShowControll.isImg1Showing" class="teacher_image_table" :src="img1Url" alt
                  width="70" height="70" />
              </div>
            </v-col>
            <!-- receiver -->
            <v-col md="4" sm="6" cols="12">
              <v-select v-model="receiverData" :items="receiverItems" :rules="Rules.receiver" dense item-text="text"
                item-value="value" label="المستلم" outlined @change="receiverChange">
              </v-select>
            </v-col>
            <!-- notifications_class_school_id -->
            <v-col v-show="isClassSchoolSelectShowing" md="4" sm="6" cols="12">
              <!-- <v-select
                v-model="teacherData.notifications_class_school_id"
                :items="classSchoolData"
                :loading="classLoading"
                dense
                :item-text="
                  (item) => item.classes_name + ' - ' + item.class_school_leader
                "
                item-value="class_school_id"
                label="الصفوف"
                outlined
                multiple
              >
              </v-select> -->
              <v-autocomplete v-model="teacherData.notifications_class_school_id" :loading="classLoading"
                :items="classSchoolData" :item-text="
                  (item) => item.classes_name + ' - ' + item.class_school_leader
                " item-value="class_school_id" clearable outlined dense label="الصفوف" multiple
                @click:clear="teacherData.notifications_class_school_id = null"></v-autocomplete>
            </v-col>
            <!-- notifications_student_id -->
            <v-col v-show="isStudentSelectShowing" md="4" sm="6" cols="12">
              <v-autocomplete v-model="teacherData.notifications_student_id" :loading="studentLoading"
                :items="studentsData" item-text="account_name" item-value="account_id" clearable outlined dense
                label="الطلاب" multiple @click:clear="teacherData.notifications_student_id = null"></v-autocomplete>
            </v-col>
            <!-- notifications_teacher_id -->
            <v-col v-show="isTeacherSelectShowing" md="4" sm="6" cols="12">
              <v-autocomplete v-model="teacherData.notifications_student_id" :loading="teacherLoading"
                :items="teachersData" item-text="account_name" item-value="account_id" clearable outlined dense
                label="الاساتذة" multiple @click:clear="teacherData.notifications_student_id = null"></v-autocomplete>
            </v-col>
            <!-- notifications_driver_id -->
            <v-col v-show="isDriverSelectShowing" md="4" sm="6" cols="12">
              <v-autocomplete v-model="teacherData.notifications_student_id" :loading="driverLoading"
                :items="driversData" item-text="account_name" item-value="account_id" clearable outlined dense
                label="السواق" multiple @click:clear="teacherData.notifications_student_id = null"></v-autocomplete>
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
        { text: 'واجب بيتي (للطلاب)', value: 'homework' },
        { text: 'رسالة (للطلاب)', value: 'message' },
        { text: 'تقرير (زي - كتب - قرطاسية)', value: 'report' },
        { text: 'تبليغ (للاساتذة و الخطوط)', value: 'announcement' },
        { text: 'اقساط (للطلاب)', value: 'installments' },
        { text: 'ملخص الدروس اليومية (للطلاب)', value: 'summary' },
      ],

      receiverItems: [
        { text: 'كل الطلاب', value: 'schoolReceiver' },
        { text: 'صفوف وشعب', value: 'classSchoolReceiver' },
        { text: 'طالب', value: 'studentReceiver' },
        { text: 'استاذ', value: 'teacherReceiver' },
        { text: 'السائق', value: 'driverReceiver' },
      ],

      account_disableItems: [
        { text: 'مفعل', value: 0 },
        { text: 'متوقف', value: 1 },
      ],

      classSchoolData: [],

      studentsData: [],

      teachersData: [],

      driversData: [],

      account_payment_typeItems: ['ملاك', 'محاضر'],

      account_genderItems: ['ذكر', 'انثى'],

      menuAccountStartDate: false,

      menuAccountBirthday: false,

      receiverData: null,

      teacherData: {
        notifications_class_school_id: '',
        notifications_student_id: '',
        notifications_type: '',
        notifications_title: '',
        notifications_description: '',
        notifications_img1: null,
        notifications_img2: null,
        notifications_img3: null,
        notifications_pdf: null,
        notifications_link: '',
      },

      addBtnLoading: false,
    }
  },
  async created() {
    await this.getClassSchool()
    await this.getStudents()
    await this.getTeachers()
    await this.getDrivers()
  },
  methods: {
    getClassSchool() {
      this.classLoading = true
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .get('/teacher/classSchool')
        .then(Response => {
          this.classLoading = false
          this.classSchoolData = Response.data.results
        })
        .catch(error => {
          this.classLoading = false
          console.log('error', error)
        })
    },

    getStudents() {
      this.studentLoading = true
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .post('teacher/teacherList', {
          page: 1,
          account_type: 'student',
          limit: 10000,

          // search: '',
        })
        .then(Response => {
          console.log('Response', Response.data)
          this.studentLoading = false
          this.studentsData = Response.data.results
        })
        .catch(error => {
          this.studentLoading = false
          console.log('error', error)
        })
    },

    getTeachers() {
      this.teacherLoading = true
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .post('teacher/teacherList', {
          page: 1,
          account_type: 'teacher',
          limit: 10000,

          // search: '',
        })
        .then(Response => {
          this.teacherLoading = false
          this.teachersData = Response.data.results
        })
        .catch(error => {
          this.teacherLoading = false
          console.log('error', error)
        })
    },

    getDrivers() {
      this.driverLoading = true
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .post('teacher/teacherList', {
          page: 1,
          account_type: 'driver',
          limit: 10000,

          // search: '',
        })
        .then(Response => {
          this.driverLoading = false
          this.driversData = Response.data.results
        })
        .catch(error => {
          this.driverLoading = false
          console.log('error', error)
        })
    },

    submitAdd() {
      if (this.receiverData === 'classSchoolReceiver' && !this.teacherData.notifications_class_school_id) {
        this.showDialogfunction('عند اختيار المستلم الصف والشعبة يجب تحديد الشعبة', '#FF8A80')
      } else if (this.receiverData === 'studentReceiver' && !this.teacherData.notifications_student_id) {
        this.showDialogfunction('عند اختيار المستلم طالب يجب تحديد الطلبة', '#FF8A80')
      } else {
        this.addBtnLoading = true

        const formData = new FormData()

        const img1 = document.querySelector('#img1')

        const img2 = document.querySelector('#img2')

        const img3 = document.querySelector('#img3')

        const pdf = this.teacherData.notifications_pdf

        this.formAppend(formData, img1, img2, img3, pdf)

        this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

        this.axios
          .post('notifications', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(Response => {
            this.addBtnLoading = false
            if (Response.data.error === false) {
              this.showDialogfunction(Response.data.results, 'primary')
            } else {
              this.showDialogfunction(Response.data.results, '#FF8A80ed')
            }
          })
          .catch(error => {
            this.addBtnLoading = false
            this.showDialogfunction('حدث خطأ يرجى المحاولة مجددا', '#FF8A80')
            console.log('error', error)
          })
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

    changeImg2(event) {
      this.imgAndDivShowControll.IsDiv2Showing = false
      this.imgAndDivShowControll.isImg2Showing = true

      const file = event.target.files[0]
      this.img2Url = null
      if (typeof file !== 'undefined' && file !== null) {
        const fileExt = file.name.split('.').pop()
        if (
          fileExt.toLowerCase() === 'jpg' ||
          fileExt.toLowerCase() === 'jpeg' ||
          fileExt.toLowerCase() === 'png' ||
          fileExt.toLowerCase() === 'png' ||
          fileExt.toLowerCase() === 'gif'
        ) {
          this.img2Url = URL.createObjectURL(file)
        } else {
          console.log('error_image_add')
        }
      } else {
        this.img2Url = null
      }
    },

    changeImg3(event) {
      this.imgAndDivShowControll.IsDiv3Showing = false
      this.imgAndDivShowControll.isImg3Showing = true

      const file = event.target.files[0]
      this.img3Url = null
      if (typeof file !== 'undefined' && file !== null) {
        const fileExt = file.name.split('.').pop()
        if (
          fileExt.toLowerCase() === 'jpg' ||
          fileExt.toLowerCase() === 'jpeg' ||
          fileExt.toLowerCase() === 'png' ||
          fileExt.toLowerCase() === 'png' ||
          fileExt.toLowerCase() === 'gif'
        ) {
          this.img3Url = URL.createObjectURL(file)
        } else {
          console.log('error_image_add')
        }
      } else {
        this.img3Url = null
      }
    },

    formAppend(formData, img1, img2, img3, pdf) {
      formData.append('img1', img1.files[0])
      formData.append('img2', img2.files[0])
      formData.append('img3', img3.files[0])
      formData.append('pdf', pdf)
      formData.append('notifications_description', this.teacherData.notifications_description)
      formData.append('notifications_link', this.teacherData.notifications_link)
      formData.append('notifications_type', this.teacherData.notifications_type)
      formData.append('notifications_title', this.teacherData.notifications_title)
      formData.append('notifications_student_id', this.teacherData.notifications_student_id)
      formData.append('notifications_class_school_id', this.teacherData.notifications_class_school_id)
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
      if (this.teacherData.notifications_type === 'homework') {
        this.isPdfShowing = true
        this.receiverItems = [
          // { text: 'كل الطلاب', value: 'schoolReceiver' },
          { text: 'صفوف وشعب', value: 'classSchoolReceiver' },
          { text: 'طالب', value: 'studentReceiver' },

          // { text: 'استاذ', value: 'teacherReceiver' },
          // { text: 'السائق', value: 'driverReceiver' },
        ]
      } else if (this.teacherData.notifications_type === 'announcement') {
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
  },
}
</script>
