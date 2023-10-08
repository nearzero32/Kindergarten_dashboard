<template>
  <div class="team">
    <v-container class="indigo lighten-5">
      <v-card class="white pa-3">
        <h1 class="text-center subtitle-4 black--text">طلبات التسجيل في الاستمارة الالكترونية</h1>
        <v-row class="mt-5">
          <v-spacer></v-spacer>
          <v-col md="4" cols="12">
            <div class="d-flex flex-row">
              <v-text-field v-model="table.search" label="البحث" outlined dense @keyup.enter="search()"></v-text-field>
              <button class="search-btn" @click="search()">
                <v-icon style="font-size: 18px; color: white"> fa-search </v-icon>
              </button>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-data-table
              :headers="table.headers"
              loading-text="جاري التحميل ... الرجاء الانتظار"
              :items="table.teacherData"
              :options.sync="tableOptions"
              :server-items-length="table.totalTeacherData"
              :loading="table.loading"
              class="elevation-1"
              :footer-props="{
                itemsPerPageOptions: [10, 50, 100],
              }"
            >
              <template slot="item._id" slot-scope="props">
                {{ (tableOptions.page - 1) * tableOptions.itemsPerPage + props.index + 1 }}
              </template>
              <template v-slot:item.image="{ item }">
                <img
                  v-if="item.image"
                  class="teacher_image_table"
                  :src="content_url + item.image"
                  alt
                  width="50"
                  height="50"
                  @click="showImage(item.image)"
                />
              </template>
              <template v-slot:item.is_staying_with_his_fathers="{ item }">
                <v-icon v-if="item.is_staying_with_his_fathers" color="green"> fa-check </v-icon>
                <v-icon v-else color="red"> fa-times </v-icon>
              </template>
              <template v-slot:item.address="{ item }">
                <span>{{
                  item.address + ' - ' + item.address_m + ' - ' + item.address_z + ' - ' + item.address_d
                }}</span>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="primary" class="ml-2" v-bind="attrs" size="18" v-on="on" @click="showDetails(item)">
                      fa-info-circle
                    </v-icon>
                  </template>
                  <span>عرض معلومات الطالب</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="#FF8A80" v-bind="attrs" size="18" v-on="on" @click="deleteItem(item)">
                      fa-trash
                    </v-icon>
                  </template>
                  <span>حذف</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="rgb(255 180 0)" v-bind="attrs" size="18" v-on="on" @click="goToPrintPage(item)">
                      fa-print
                    </v-icon>
                  </template>
                  <span>طباعة</span>
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
                <img :src="content_url + table.imageUrlForShow" alt width="300" height="200" />
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
    <!--- Dialog for show info to user-->
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
import school_work_register_api from '@/api/school_work_register'

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
        filename: 'الاشعارات',
        autoWidth: true,
        bookType: 'xlsx',
      },
      studentClassSelected: null,
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
            value: '_id',
          },
          {
            text: 'الاسم',
            sortable: false,
            value: 'name',
          },
          { text: 'الصورة', sortable: false, value: 'image' },
          { text: 'تاريخ الميلاد', sortable: false, value: 'birthday' },
          { text: 'العنوان - م - ز - د', sortable: false, value: 'address' },
          { text: 'اقرب نقطة دالة', sortable: false, value: 'nearest_landmark' },
          { text: 'الجامعة', sortable: false, value: 'college' },
          { text: 'الهاتف1', sortable: false, value: 'phone1' },
          { text: 'الهاتف2', sortable: false, value: 'phone2' },
          { text: 'الحالة الاجتماعية', sortable: false, value: 'social_status' },
          { text: 'التاريخ', sortable: false, value: 'createdAt' },
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

      content_url: null,
      one: 1,
      two: 1,
      three: 1,
      four: 1,
      five: 1,
      six: 1,
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
  },

  // async mounted() {
  //   this.getTeacherDataAxios()
  // },
  methods: {
    async getTeacherDataAxios() {
      let search = this.table.search
      this.table.loading = true
      let { page, itemsPerPage } = this.tableOptions

      if (!search) {
        search = null
      }
      if (!page) {
        page = 1
      }
      if (!itemsPerPage) {
        itemsPerPage = 10
      }

      const response = await school_work_register_api.get({
        page: page,
        limit: itemsPerPage,
        search,
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

      const response = await school_work_register_api.remove(this.deletedItem._id)

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

    search() {
      this.$router.replace(
        {
          query: { search: this.table.search },
        },
        () => {},
      )
    },

    showDetails(item) {
      let data = {
        item,
        content_url: this.content_url,
      }

      localStorage.setItem('schoolWorkReqMoreDetails', JSON.stringify(data))
      this.$router.push('/schoolWorkReqMoreDetails')
    },

    goToPrintPage(item) {
      let routeData = this.$router.resolve({ name: 'printOneSchoolWorkReq' })
      window.open(routeData.href, '_blank')

      localStorage.setItem('printOneSchoolWorkReq', JSON.stringify(item))
    },
  },
}
</script>

<style scoped>
.teacher_image_table {
  cursor: pointer;
  margin-left: 2px;
}

.search-btn {
  width: 49px;
  height: 40px;
  padding: 10px;
  background: #2196f3;
  font-size: 17px;
  border: 1px solid grey;
  border-right: none;
  cursor: pointer;
  line-height: 100%;
  border-radius: 7px;
}

a {
  text-decoration: none;
}
</style>
