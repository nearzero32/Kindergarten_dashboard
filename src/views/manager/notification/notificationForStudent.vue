<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center subtitle-4 black--text"> الاشعارات </h1>
        <h2 class="text-center subtitle-5 black--text"> {{ this.$route.params.student_name }} </h2>
        <h3 class="text-center subtitle-5 black--text"> {{ `عدد الاشعارات ${table.totalTeacherData}` }} </h3>
        <!-- <v-btn tile color="success" :loading="xlsxData.downloadLoading" :block="isScreenXs"
          @click="getAllNotificationDataAxios"> تحميل اكسل <v-icon right> fa-download </v-icon>
        </v-btn> -->
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
                <span>{{ item.notifications_type }}</span>
              </template>
              <template v-slot:item.sender="{ item }">
                <span>{{ item.sender.account_name }}</span>
              </template>
              <template v-slot:item.receiver="{ item }">
                <span style="color: #000">{{ item.receiver }}</span>
                <ul v-if="item.receiver === 'صفوف وشعب'">
                  <li v-for="(user, index) in item.notifications_class_school_id" :key="index"> {{ user.class_name + "_"
                      + user.leader
                  }} </li>
                </ul>
                <ul v-else-if="item.receiver === 'طلاب' || item.receiver === 'سائقين' || item.receiver === 'اساتذة'">
                  <li v-for="(user, index) in item.notifications_student_id" :key="index"> {{ user.account_name }} </li>
                </ul>
                <!-- <ul v-else>
              <li v-for="(user, index) in item.receiver" :key="index"> {{ user.account_name }} </li>
            </ul> -->
              </template>
              <template v-slot:item.notifications_link="{ item }">
                <v-btn v-if="item.notifications_link" color="primary" small @click="goToLink(item.notifications_link)">
                  فتح </v-btn>
              </template>
              <template v-slot:item.notifications_pdf="{ item }">
                <v-btn v-if="item.notifications_pdf" color="warning" small @click="goToPdf(item.notifications_pdf)">
                  تحميل </v-btn>
              </template>
              <template v-slot:item.notifications_imgs="{ item }">
                <img v-for="(img, index) in item.notifications_imgs" :key="index" class="teacher_image_table"
                  :src="content_url + img" alt width="50" height="50" @click="showImage(img)" />
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
import Api from '@/api/api'

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

      content_url: null,

      xlsxData: {
        list: null,
        listLoading: true,
        downloadLoading: false,
        filename: `اشعارات الطالب ${this.$route.params.student_name}`,
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
          { text: 'المرسل', sortable: false, value: 'sender' },
          { text: 'المستلم', sortable: false, value: 'receiver' },
          { text: 'الرابط', sortable: false, value: 'notifications_link' },
          { text: 'الملفات', sortable: false, value: 'notifications_pdf' },
          { text: 'الصور', sortable: false, value: 'notifications_imgs' },
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
    async getTeacherDataAxios() {
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

      const response = await Api.getNotificationStudent({
        account_id: this.$route.params.student_id,
        class_school: this.$route.params.class_school,
        page,
        limit: itemsPerPage,
      })
      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.table.loading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.table.loading = false
        this.table.teacherData = response.data.results.data
        this.table.totalTeacherData = response.data.results.count
        this.content_url = response.data.content_url
      }
    },

    showImage(image) {
      this.table.showImageDailog = true
      this.table.imageUrlForShow = image
    },

    deleteItem(item) {
      this.deletedItem = { ...item }
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      this.deleteItemLoading = true

      const response = await Api.removeNotification(this.deletedItem._id)

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.deleteItemLoading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.deleteItemLoading = false
        this.dialogDelete = false
        this.getTeacherDataAxios()
        this.showDialogfunction(response.data.results, 'primary')
      }
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
        .get(
          `student/notification/class_school/${this.$route.params.class_school}/student_id/${this.$route.params.student_id}/page/${page}/limit/${itemsPerPage}`,
        )
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
