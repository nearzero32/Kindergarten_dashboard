<template>
  <div>
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center subtitle-4 black--text"> الكادر التدريسي </h1>
        <v-row class="mt-5">
          <v-col md="4" cols="12">
            <div class="d-md-flex">
              <v-btn tile color="primary" class="ml-2 mb-4 mb-md-0 mb-sm-0" :block="isScreenXs" @click="goToAddPage">
                اضافة استاذ <v-icon right> fa-plus </v-icon>
              </v-btn>
              <v-btn tile color="success" :loading="xlsxData.downloadLoading" :block="isScreenXs"
                @click="getAllTeacherDataAxios"> تحميل اكسل <v-icon right> fa-download </v-icon>
              </v-btn>
            </div>
          </v-col>
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
            <v-data-table :headers="table.headers" loading-text="جاري التحميل ... الرجاء الانتظار"
              :items="table.teacherData" :options.sync="tableOptions" :server-items-length="table.totalTeacherData"
              :loading="table.loading" class="elevation-1" :footer-props="{
                itemsPerPageOptions: [10, 50, 100],
              }">
              <template slot="item._id" slot-scope="props"> {{ ((tableOptions.page - 1) * tableOptions.itemsPerPage +
                  props.index) + 1
              }} </template>
              <template v-slot:item.account_name="{ item }">
                <!-- <router-link :to="'/teacher/' + item._id">
                  {{
                    item.account_name
                  }}
                </router-link> -->
                <a @click="goToEditPage(item._id, item.account_name)">{{ item.account_name }}</a>
              </template>
              <template v-slot:item.salariesAmount="{ item }">
                <v-chip color="primary" dark> {{ item.salariesAmount }} </v-chip>
              </template>
              <template v-slot:item.account_img="{ item }">
                <img v-if="item.account_img" class="teacher_image_table" :src="content_url + item.account_img" alt
                  width="50" height="50" @click="showImage(item.account_img)" />
              </template>
              <template v-slot:item.actions="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="primary" class="ml-2" v-bind="attrs" size="20" v-on="on" @click="EditPassword(item)">
                      fa-key </v-icon>
                  </template>
                  <span>تعديل الرمز</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="#FF5252" v-bind="attrs" size="20" v-on="on" @click="deleteItem(item)"> fa-trash
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
                <img :src="this.content_url + table.imageUrlForShow" alt width="300" height="200" />
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="ml-3">
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="table.showImageDailog = false"> الغاء </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- image Teacher dialog -->
    <!-- Edit dialog -->
    <v-dialog v-model="EditPasswordDialog" max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">تعديل رمز الاستاذ</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="isFormValidEditPassword">
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="editedItem.account_password_show" label="الرمز"
                    :rules="editRules.passwordRules" outlined required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="editedItem.ensurePassword" label="تاكيد المركز"
                    :rules="editRules.ensurePasswordRules" outlined required></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="ml-3">
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="EditPasswordDialog = false"> الغاء </v-btn>
          <v-btn color="primary white--text" :loading="EditPasswordLoading" :disabled="!isFormValidEditPassword"
            @click="submitEditTeacher"> تعديل </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Edit dialog -->
    <!-- delete dialog -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline justify-center"> هل انت متأكد من حذف هذا الحساب ؟ </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogDelete = false"> الغاء </v-btn>
          <v-btn color="primary white--text" :loading="deleteItemLoading" @click="deleteItemConfirm"> حذف </v-btn>
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
          <v-btn color="blue darken-1 justify-start" text @click="dialogData.open = false"> تم </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Api from '@/api/api'
import sha512 from 'js-sha512'

export default {
  data() {
    return {
      isFormValidEditPassword: false,

      EditPasswordDialog: false,

      EditPasswordLoading: false,

      deleteItemLoading: false,

      editedItem: {},

      content_url: null,

      editRules: {
        passwordRules: [
          value => !!value || 'الرمز مطلوب',
          value => (value && value.length > 5) || 'ستة احرف او ارفام على الاقل',
        ],
        ensurePasswordRules: [
          value => !!value || 'تاكيد الرمز مطلوب',
          value => (value && value.length > 5) || 'ستة احرف او ارفام على الاقل',
        ],
      },

      dialogDelete: false,

      dialogData: {
        open: false,
        color: 'primary',
        bodyText: 'test',
      },

      xlsxData: {
        list: null,
        listLoading: true,
        downloadLoading: false,
        filename: 'الاساتذة',
        autoWidth: true,
        bookType: 'xlsx',
      },

      allTeacherData: [],

      isScreenXs: false,

      deletedItem: {},

      tableOptions: {},

      table: {
        search: null,
        totalTeacherData: 0,
        teacherData: [],
        loading: true,
        showImageDailog: false,
        imageUrlForShow: null,

        headers: [
          {
            text: '#',
            align: 'start',
            sortable: false,
            value: '_id',
          },
          {
            text: 'الاسم',
            sortable: false,
            value: 'account_name',
          },
          { text: 'الهاتف', sortable: false, value: 'account_mobile' },
          { text: 'الايميل', sortable: false, value: 'account_email' },
          { text: 'الراتب', sortable: false, value: 'salariesAmount' },
          {
            text: 'تاريخ بدء عمله',
            sortable: false,
            value: 'salariesStartDate',
          },
          {
            text: 'المسمى الوظيفي',
            sortable: false,
            value: 'account_payment_type',
          },
          { text: 'الصورة', sortable: false, value: 'account_img' },
          { text: 'العمليات', value: 'actions', sortable: false },
        ],
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
    '$route.query.search': {
      handler(search) {
        this.table.search = search
        this.getTeacherDataAxios(search)
      },
      deep: true,

      // immediate: true,
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
  },

  // async mounted() {
  //   this.getTeacherDataAxios()
  // },
  methods: {
    async getTeacherDataAxios() {
      let { search } = this.table
      this.table.loading = true
      let { page, itemsPerPage } = this.tableOptions
      if (!search) {
        search = ''
      }

      if (!page) {
        page = 1
      }
      if (!itemsPerPage) {
        itemsPerPage = 10
      }

      const response = await Api.getTeachers(page, itemsPerPage, search)
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

    search() {
      this.$router.replace(
        {
          query: { search: this.table.search },
        },
        () => { },
      )
    },

    deleteItem(item) {
      this.deletedItem = { ...item }
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      this.deleteItemLoading = true

      const response = await Api.removeTeacher(this.deletedItem._id)

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

    EditPassword(item) {
      this.editedItem = { ...item }
      this.EditPasswordDialog = true
    },

    async submitEditTeacher() {
      if (this.editedItem.account_password_show !== this.editedItem.ensurePassword) {
        this.showDialogfunction('تاكيد الرمز خاطئ', '#FF5252')
      } else {
        this.EditPasswordLoading = true

        const response = await Api.editPasswordTeacher(
          this.editedItem._id,
          sha512(this.editedItem.account_password_show),
          this.editedItem.account_password_show,
        )

        if (response.status === 401) {
          this.$store.dispatch('submitLogout')
        } else if (response.status === 500) {
          this.EditPasswordDialog = false
          this.EditPasswordLoading = false
          this.showDialogfunction(response.data.results, '#FF5252')
        } else {
          this.EditPasswordLoading = false
          this.EditPasswordDialog = false
          this.getTeacherDataAxios()
          this.showDialogfunction(response.data.results, 'primary')
        }
      }
    },

    goToAddPage() {
      this.$router.push('/teachers/addTeacher')
    },

    goToEditPage(id, name) {
      this.$router.push(`teachers/${id}/${name}`)
    },

    showDialogfunction(bodyText, color) {
      this.dialogData.open = true
      this.dialogData.bodyText = bodyText
      this.dialogData.color = color
    },

    async getAllTeacherDataAxios() {
      this.xlsxData.downloadLoading = true

      const response = await Api.getAllTeachers()
      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.xlsxData.downloadLoading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.allTeacherData = response.data.results
        this.handleDownload()
      }
    },

    handleDownload() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['الاسم', 'الايميل', 'الرمز', 'الهاتف', 'العنوان', 'الراتب', 'رقم البصمة']
        const filterVal = [
          'account_name',
          'account_email',
          'account_password_show',
          'account_mobile',
          'account_address',
          'salariesAmount',
          'account_card_number',
        ]

        // const { list } = this
        const data = this.formatJson(filterVal, this.allTeacherData)
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

table.v-table tbody td {
  color: black;
}
</style>
