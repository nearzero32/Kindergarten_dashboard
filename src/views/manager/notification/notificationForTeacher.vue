<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center subtitle-4 black--text"> الاشعارات </h1>
        <h2 class="text-center subtitle-5 black--text"> {{ this.$route.params.teacher_name }} </h2>
        <h3 class="text-center subtitle-5 black--text"> {{ `عدد الاشعارات ${table.totalTeacherData}` }} </h3>
        <v-btn tile color="success" :loading="xlsxData.downloadLoading" :block="isScreenXs"
          @click="getAllNotificationDataAxios"> تحميل اكسل <v-icon right> fa-download </v-icon>
        </v-btn>
        <v-row class="mt-2">
          <v-col cols="12">
            <v-data-table :headers="table.headers" loading-text="جاري التحميل ... الرجاء الانتظار"
              :items="table.teacherData" :options.sync="tableOptions" :server-items-length="table.totalTeacherData"
              :loading="table.loading" class="elevation-1" :footer-props="{
                itemsPerPageOptions: [10, 50, 100],
              }">
              <template slot="item.notifications_id" slot-scope="props"> {{ (tableOptions.page - 1) *
                  tableOptions.itemsPerPage + props.index + 1
              }} </template>
              <template v-slot:item.notifications_type="{ item }">
                <span v-if="item.notifications_type == 'homework'">واجب</span>
                <span v-else-if="item.notifications_type == 'message'">رسالة</span>
                <span v-else-if="item.notifications_type == 'report'">تقارير</span>
                <span v-else-if="item.notifications_type == 'finger'">بصمة</span>
                <span v-else>تبليغ</span>
              </template>
              <template v-slot:item.receiver="{ item }">
                <span style="color: #000">{{ showRecieverType(item.receiverType) }}</span>
                <ul v-if="item.receiverType === 'class_school'">
                  <li v-for="(user, index) in item.receiver" :key="index"> {{ user.classes_name + "_" +
                      user.class_school_leader
                  }} </li>
                </ul>
                <ul v-else>
                  <li v-for="(user, index) in item.receiver" :key="index"> {{ user.account_name }} </li>
                </ul>
              </template>
              <template v-slot:item.notifications_link="{ item }">
                <v-btn v-if="item.notifications_link" color="primary" small @click="goToLink(item.notifications_link)">
                  فتح </v-btn>
              </template>
              <template v-slot:item.notifications_pdf="{ item }">
                <v-btn v-if="item.notifications_pdf" color="warning" small @click="goToPdf(item.notifications_pdf)">
                  تحميل </v-btn>
              </template>
              <template v-slot:item.notifications_img1="{ item }">
                <img v-if="item.notifications_img1" class="teacher_image_table"
                  :src="$store.state.FileUrl + item.notifications_img1" alt width="50" height="50"
                  @click="showImage(item.notifications_img1)" />
              </template>
              <template v-slot:item.notifications_img2="{ item }">
                <img v-if="item.notifications_img2" class="teacher_image_table"
                  :src="$store.state.FileUrl + item.notifications_img2" alt width="50" height="50"
                  @click="showImage(item.notifications_img2)" />
              </template>
              <template v-slot:item.notifications_img3="{ item }">
                <img v-if="item.notifications_img2" class="teacher_image_table"
                  :src="$store.state.FileUrl + item.notifications_img3" alt width="50" height="50"
                  @click="showImage(item.notifications_img3)" />
              </template>
              <template v-slot:item.actions="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="#FF8A80" v-bind="attrs" size="18" v-on="on" @click="deleteItem(item)"> fa-trash
                    </v-icon>
                  </template>
                  <span>حذف</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
    <!-- image Teacher dialog -->
    <v-dialog v-model="table.showImageDailog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">عرض الصورة</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form>
              <v-row class="justify-center">
                <img :src="this.$store.state.FileUrl + table.imageUrlForShow" alt width="300" height="200" />
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="ml-3">
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="table.showImageDailog = false"> الغاء </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- image Teacher dialog -->
    <!-- delete dialog -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline justify-center"> هل انت متأكد من حذف هذا الحساب ؟ </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogDelete = false"> الغاء </v-btn>
          <v-btn color="primary" :loading="deleteItemLoading" @click="deleteItemConfirm"> حذف </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End delete dailog -->
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
      isFormValidEditPassword: false,

      deleteItemLoading: false,

      dialogDelete: false,

      dialogData: {
        open: false,
        color: 'primary',
        bodyText: 'test',
      },

      allNotificationData: [],

      xlsxData: {
        list: null,
        listLoading: true,
        downloadLoading: false,
        filename: `اشعارات الاستاذ ${this.$route.params.teacher_name}`,
        autoWidth: true,
        bookType: 'xlsx',
      },

      notificationTypeSelectItems: [
        { text: 'واجب بيتي (للطلاب)', value: 'homework' },
        { text: 'رسالة (للطلاب)', value: 'message' },
        { text: 'تقرير (زي - كتب - قرطاسية)', value: 'report' },
        { text: 'تبليغ (للاساتذة و الخطوط)', value: 'announcement' },
        { text: 'اقساط (للطلاب)', value: 'installments' },
        { text: 'ملخص الدروس اليومية (للطلاب)', value: 'summary' },
      ],

      deletedItem: {},

      tableOptions: {},

      isScreenXs: false,

      table: {
        totalTeacherData: 0,
        teacherData: [],
        loading: true,
        showImageDailog: false,
        imageUrlForShow: null,

        headers: [
          {
            text: '#',
            align: 'start',
            width: 1,
            sortable: false,
            value: 'notifications_id',
          },
          {
            text: 'العنوان',
            sortable: false,
            value: 'notifications_title',
          },
          { text: 'النوع', sortable: false, value: 'notifications_type' },
          { text: 'المرسل', sortable: false, value: 'account_name' },
          { text: 'المستلم', sortable: false, value: 'receiver' },
          { text: 'الرابط', sortable: false, value: 'notifications_link' },

          { text: 'الملفات', sortable: false, value: 'notifications_pdf' },
          { text: 'الصورة1', sortable: false, value: 'notifications_img1' },
          { text: 'الصورة2', sortable: false, value: 'notifications_img2' },
          { text: 'الصورة3', sortable: false, value: 'notifications_img3' },
          {
            text: 'الوصف',
            sortable: false,
            value: 'notifications_description',
          },
          { text: 'التاريخ', sortable: false, value: 'created_at' },
          {
            text: 'العمليات',
            width: 1,
            align: 'center',
            value: 'actions',
            sortable: false,
          },
        ],
      },
      menuStartDate: false,
      menuEndDate: false,
      tableModifier: {
        notificationTypeSelected: null,
        startDate: null,
        endDate: null,
      },
    }
  },
  watch: {
    tableOptions: {
      handler() {
        this.getTeacherDataAxios()
      },
      deep: true,
    },
    '$vuetify.breakpoint': {
      handler() {
        if (this.$vuetify.breakpoint.xs) {
          this.isScreenXs = true
        } else {
          this.isScreenXs = false
        }
      },
      deep: true,
    },
    '$route.query.search': {
      handler(search) {
        this.table.search = search
        this.getTeacherDataAxios(search)
      },
      deep: true,

      // immediate: true,
    },

    tableModifier: {
      deep: true,
      handler() {
        this.getTeacherDataAxios()
      },
    },
  },

  // async mounted() {
  //   this.getTeacherDataAxios()
  // },
  methods: {
    getTeacherDataAxios() {
      // let search = this.table.search;
      this.table.loading = true
      let { page, itemsPerPage } = this.tableOptions

      // if (!search) {
      //   search = "";
      // }

      if (!page) {
        page = 1
      }
      if (!itemsPerPage) {
        itemsPerPage = 10
      }

      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .get(`teacher/notification/teacher_id/${this.$route.params.teacher_id}/page/${page}/limit/${itemsPerPage}`)
        .then(Response => {
          this.table.loading = false
          this.table.teacherData = Response.data.results
          this.table.totalTeacherData = Response.data.count
        })
        .catch(error => {
          this.table.loading = false
          console.log('error', error)
        })
    },

    showImage(image) {
      this.table.showImageDailog = true
      this.table.imageUrlForShow = image
    },

    deleteItem(item) {
      this.deletedItem = { ...item }
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.deleteItemLoading = true
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .delete(`notifications/${this.deletedItem.notifications_id}`)
        .then(Response => {
          if (Response.data.error === false) {
            this.deleteItemLoading = false
            this.dialogDelete = false
            this.getTeacherDataAxios()
            this.showDialogfunction(Response.data.results, 'primary')
          } else {
            this.showDialogfunction(Response.data.results, '#FF8A80')
          }
        })
        .catch(error => {
          this.deleteItemLoading = false
          this.dialogDelete = false
          this.showDialogfunction('حصلت مشكلة يرجى المحاولة مجددا', '#FF8A80')
          console.log('error', error)
        })
    },

    showDialogfunction(bodyText, color) {
      this.dialogData.open = true
      this.dialogData.bodyText = bodyText
      this.dialogData.color = color
    },

    getAllNotificationDataAxios() {
      this.xlsxData.downloadLoading = true

      const page = 1
      const itemsPerPage = 100000000
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .get(`teacher/notification/teacher_id/${this.$route.params.teacher_id}/page/${page}/limit/${itemsPerPage}`)
        .then(Response => {
          if (Response.data.results === 'غير مصرح') {
            this.$store.dispatch('submitLogout')
          } else {
            this.allNotificationData = Response.data.results
            this.handleDownload()
          }
        })
        .catch(error => {
          this.xlsxData.downloadLoading = false
          this.showDialogfunction(Response.data.results, '#FF5252')
          console.log('error', error)
        })
    },

    goToLink(file) {
      window.open(file)
    },

    goToPdf(file) {
      window.open(this.$store.state.FileUrl + file)
    },

    handleDownload() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['العنوان', 'النوع', 'المرسل', 'الرابط', 'الوصف', 'التاريخ']
        const filterVal = [
          'notifications_title',
          'notifications_type_ar',
          'account_name',
          'notifications_link',
          'notifications_description',
          'created_at',
        ]

        // const { list } = this
        const data = this.formatJson(filterVal, this.allNotificationData)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.xlsxData.filename,
          autoWidth: this.xlsxData.autoWidth,
          bookType: this.xlsxData.bookType,
        })
        this.xlsxData.downloadLoading = false
      })
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },

    showRecieverType(receiverType) {
      if (receiverType === 'student') {
        return 'طلاب: '
      }
      if (receiverType === 'teacher') {
        return 'اساتذة: '
      }

      if (receiverType === 'driver') {
        return 'سائقين: '
      }

      if (receiverType === 'manager') {
        return 'مدير'
      }

      if (receiverType === 'class_school') {
        return 'صفوف وشعب: '
      }

      return 'كل الطلاب'
    },
  },
}
</script>

<style scoped>
.teacher_image_table {
  cursor: pointer;
}

a {
  text-decoration: none;
}
</style>
