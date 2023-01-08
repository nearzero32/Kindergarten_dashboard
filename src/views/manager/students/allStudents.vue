<template>
  <div>
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center subtitle-4 black--text"> جميع الطلاب </h1>
        <v-row class="mt-5">
          <v-col md="4" cols="12">
            <div class="d-md-flex">
              <!-- <v-btn
                tile
                color="primary"
                class="ml-2 mb-4 mb-md-0 mb-sm-0"
                :block="isScreenXs"
                @click="goToAddPage"
              >
                اضافة طالب
                <v-icon right>
                  fa-plus
                </v-icon>
              </v-btn> -->
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
              <template slot="item._id" slot-scope="props"> {{ props.index + 1 }} </template>
              <template v-slot:item.account_name="{ item }">
                <router-link :to="'/students/studentProfile/' + item._id + '/' + item.account_name"> {{
                  item.account_name
                }} </router-link>
              </template>
              <template v-slot:item.account_division_current="{ item }"> {{
                item.account_division_current.class_name +
                  '__' + item.account_division_current.leader
              }} </template>
              <!-- <template v-slot:item.salary_all="{ item }">
                <v-chip color="primary">
                  {{ item.salary_all }}
                </v-chip>
              </template> -->
              <template v-slot:item.isAccountDisabled="{ item }">
                <span v-if="item.isAccountDisabled === true" class="warning--text">متوقف</span>
                <span v-else>مقعل</span>
              </template>
              <template v-slot:item.isAccountUploadedFile="{ item }">
                <span v-if="!item.isAccountUploadedFile">لا توجد بيانات</span>
                <span v-else>توجد البيانات</span>
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
                    <v-icon color="#FF5252" v-bind="attrs" class="ml-2" size="20" v-on="on" @click="deleteItem(item)">
                      fa-trash </v-icon>
                  </template>
                  <span>حذف</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="secondary" v-bind="attrs" class="ml-2" size="20" v-on="on"
                      @click="deleteImgsItem(item)"> fa-eraser </v-icon>
                  </template>
                  <span>حذف المستمسكات</span>
                </v-tooltip>
                <v-tooltip bottom v-if="!item.isAccountDisabled">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="#FF5252" v-bind="attrs" size="20" v-on="on" @click="stopStudent(item)"> fa-ban
                    </v-icon>
                  </template>
                  <span>ايقاف</span>
                </v-tooltip>
                <v-tooltip bottom v-else>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="accent" v-bind="attrs" size="20" v-on="on" @click="activeStudent(item)"> fa-check
                    </v-icon>
                  </template>
                  <span>تفعيل</span>
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
          <v-btn color="primary" text @click="table.showImageDailog = false"> الغاء </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- image Teacher dialog -->
    <!-- Edit dialog -->
    <v-dialog v-model="EditPasswordDialog" max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">تعديل رمز الطالب</span>
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
          <v-btn color="primary" text @click="EditPasswordDialog = false"> الغاء </v-btn>
          <v-btn color="primary" :loading="EditPasswordLoading" :disabled="!isFormValidEditPassword"
            @click="submitEditTeacher"> تعديل </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Edit dialog -->
    <!-- delete dialog -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline"> هل انت متأكد من حذف هذا الحساب ؟ </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="isFormValidDeletePassword">
              <v-row>
                <v-col cols="12">
                  <v-textarea v-model="deletedItemReason" name="input-7-1" :rules="deleteRules.reason" label="سبب الحذف"
                    append-icon="fa-scroll" outlined></v-textarea>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="; (dialogDelete = false), (deletedItemReason = null)"> الغاء </v-btn>
          <v-btn color="primary" :loading="deleteItemLoading" :disabled="!isFormValidDeletePassword"
            @click="deleteItemConfirm"> حذف </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End delete dailog -->
    <!-- delete imgs dialog -->
    <v-dialog v-model="dialogImgsRemove.open" max-width="500px">
      <v-card>
        <v-card-title class="headline"> هل انت متأكد من حذف مستمسكات هذا الحساب ؟ </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogImgsRemove.open = false"> الغاء </v-btn>
          <v-btn color="secondary" :loading="dialogImgsRemove.loading" @click="deleteImgsItemConfirm"> حذف </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- stop dialog -->
    <v-dialog v-model="dialogStopStudent.open" max-width="500px">
      <v-card>
        <v-card-title class="headline justify-center"> هل انت متأكد من ايقاف هذا الحساب ؟ </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogStopStudent.open = false"> الغاء </v-btn>
          <v-btn color="primary" :loading="dialogStopStudent.loading" @click="stopStudentConfirm"> ايقاف </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End stop dailog -->
    <!-- active dialog -->
    <v-dialog v-model="dialogActiveStudent.open" max-width="500px">
      <v-card>
        <v-card-title class="headline justify-center"> هل انت متأكد من تفعيل هذا الحساب ؟ </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogActiveStudent.open = false"> الغاء </v-btn>
          <v-btn color="primary" :loading="dialogActiveStudent.loading" @click="activeStudentConfirm"> تفعيل </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End active dailog -->
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
import sha512 from 'js-sha512'

export default {
  data() {
    return {
      isFormValidEditPassword: false,

      EditPasswordDialog: false,

      EditPasswordLoading: false,

      deleteItemLoading: false,

      editedItem: {},

      deletedItemReason: null,

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

      deleteRules: {
        reason: [value => !!value || 'السبب مطلوب'],
      },

      dialogDelete: false,

      dialogData: {
        open: false,
        color: 'primary',
        bodyText: 'test',
      },

      isFormValidDeletePassword: false,

      dialogStopStudent: {
        open: false,
        loading: false,
      },

      dialogActiveStudent: {
        open: false,
        loading: false,
      },

      xlsxData: {
        list: null,
        listLoading: true,
        downloadLoading: false,
        filename: 'جميع الطلاب',
        autoWidth: true,
        bookType: 'xlsx',
      },

      allTeacherData: [],

      isScreenXs: false,

      deletedItem: {},

      dialogImgsRemove: {
        open: false,
        loading: false,
        item: {}
      },

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

            value: '_id',
          },
          {
            text: 'الاسم',

            value: 'account_name',
          },
          { text: 'الصف والشعبة', value: 'account_division_current' },
          { text: 'الايميل', value: 'account_email' },
          { text: 'الرمز', value: 'account_password_show' },

          // { text: 'القسط المتبقي', value: 'salary_all' },

          { text: 'حالة الحساب', value: 'isAccountDisabled' },
          { text: 'البيانات', value: 'isAccountUploadedFile' },
          { text: 'العمليات', value: 'actions', sortable: false },
        ],
      },

      activeStudentItem: {},

      featuredFingerId: 1,
      content_url: null,
    }
  },
  watch: {
    tableOptions: {
      handler() {
        const resultsLocalStorage = JSON.parse(localStorage.getItem('results'))
        this.featuredFingerId = resultsLocalStorage.features_finger_id
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

      const response = await Api.getStudents(page, itemsPerPage, search)

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

      const response = await Api.removeStudent(this.deletedItem._id, this.deletedItemReason)

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.dialogDelete = false
        this.deleteItemLoading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.deleteItemLoading = false
        this.dialogDelete = false
        this.getTeacherDataAxios()
        this.showDialogfunction(response.data.results, 'primary')
      }
    },


    deleteImgsItem(item) {
      this.dialogImgsRemove.item = { ...item }
      this.dialogImgsRemove.open = true
    },

    async deleteImgsItemConfirm() {
      this.dialogImgsRemove.loading = true

      const response = await Api.removeStudentInfo(this.dialogImgsRemove.item._id)

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.dialogImgsRemove.open = false
        this.dialogImgsRemove.loading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.dialogImgsRemove.open = false
        this.dialogImgsRemove.loading = false
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
      this.$router.push(`/students/addStudent/${this.$route.params.class_school_id}`)
    },

    showDialogfunction(bodyText, color) {
      this.dialogData.open = true
      this.dialogData.bodyText = bodyText
      this.dialogData.color = color
    },

    stopStudent(item) {
      this.stopStudentItem = { ...item }
      this.dialogStopStudent.open = true
    },

    async stopStudentConfirm() {
      this.dialogStopStudent.loading = true

      const response = await Api.disableStudent(this.stopStudentItem._id)

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.dialogStopStudent.loading = false
        this.dialogStopStudent.open = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.dialogStopStudent.loading = false
        this.dialogStopStudent.open = false
        this.getTeacherDataAxios()
        this.showDialogfunction(response.data.results, 'primary')
      }
    },

    activeStudent(item) {
      this.activeStudentItem = { ...item }
      this.dialogActiveStudent.open = true
    },

    async activeStudentConfirm() {
      this.dialogActiveStudent.loading = true

      const response = await Api.restoreDisabledStudent(this.activeStudentItem._id)

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.dialogActiveStudent.loading = false
        this.dialogActiveStudent.open = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.dialogActiveStudent.loading = false
        this.dialogActiveStudent.open = false
        this.getTeacherDataAxios()
        this.showDialogfunction(response.data.results, 'primary')
      }
    },

    async getAllTeacherDataAxios() {
      this.xlsxData.downloadLoading = true

      const response = await Api.getStudents(1, 10000000000000, null)

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.allTeacherData = response.data.results.data
        this.handleDownload()
      }

    },

    handleDownload() {
      import('@/vendor/Export2Excel').then(excel => {
        /* eslint-disable*/
        var tHeader = ['الاسم', 'الايميل', 'الرمز', 'الصف والشعبة', 'الهاتف الاول', 'الهاتف الثاني', 'الهاتف الثالث', 'الهاتف الرابع', 'عيد الميلاد', 'المنزل', 'المحلة', 'الزقاق']
        var filterVal = [
          'account_name',
          'account_email',
          'account_password_show',
          'account_division_current_for_excel',
          'account_mobile1',
          'account_mobile2',
          'account_mobile3',
          'account_mobile4',
          'account_birthday',
          'account_home',
          'account_city',
          'account_alley',
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
