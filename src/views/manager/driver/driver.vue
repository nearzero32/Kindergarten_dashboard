<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center mb-3 subtitle-4 black--text"> السواق </h1>
        <v-row>
          <v-col md="4" cols="12">
            <div class="d-md-flex">
              <v-btn tile color="primary" class="ml-2 mb-4 mb-md-0 mb-sm-0" :block="isScreenXs" @click="goToAddPage">
                اضافة سائق <v-icon right> fa-plus </v-icon>
              </v-btn>
              <v-btn tile color="success" :block="isScreenXs" :loading="xlsxData.downloadLoading"
                @click="handleDownload"> تحميل اكسل <v-icon right> fa-download </v-icon>
              </v-btn>
            </div>
          </v-col>
          <v-spacer></v-spacer>
          <v-col md="3" sm="3" cols="12">
            <v-text-field v-model="table.search" label="البحث" append-icon="mdi-magnify" single-line hide-details>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-data-table :loading="table.loading" loading-text="جاري التحميل ... الرجاء الانتظار" :headers="headers"
              :items="driversData" :search="table.search" :items-per-page="10" item-key="_id" class="elevation-1"
              :footer-props="{
                showFirstLastPage: true,

              }">
              <template slot="item._id" slot-scope="props"> {{ props.index + 1 }} </template>
              <template v-slot:item.account_name="{ item }">
                <router-link :to="'/drivers/' + item._id + '/' + item.account_name"> {{ item.account_name }}
                </router-link>
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
                    <v-icon color="#FF5252" class="ml-2" v-bind="attrs" size="20" v-on="on" @click="deleteItem(item)"> fa-trash
                    </v-icon>
                  </template>
                  <span>حذف</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="rgb(255 180 0)" v-bind="attrs" size="18" v-on="on" @click="goToPrintPage(item)"> fa-print
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
          <v-btn color="primary white--text" :loading="deleteItemLoading" @click="deleteItemConfirm"> حذف </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End delete dailog -->
    <!-- Edit dialog -->
    <v-dialog v-model="EditPasswordDialog" max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">تعديل رمز السائق</span>
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
                  <v-text-field v-model="editedItem.ensurePassword" label="تاكيد الرمز"
                    :rules="editRules.ensurePasswordRules" outlined required></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="ml-3">
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="EditPasswordDialog = false"> الغاء </v-btn>
          <v-btn color="primary white--text" :loading="EditPasswordLoading" :disabled="!isFormValidEditPassword"
            @click="submitEditTeacher"> تعديل </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Edit dialog -->
    <!--- dialog for show info to user-->
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

      isScreenXs: false,

      xlsxData: {
        list: null,
        listLoading: true,
        downloadLoading: false,
        filename: 'السواق',
        autoWidth: true,
        bookType: 'xlsx',
      },

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

      table: {
        loading: false,
        search: null,
        imageUrlForShow: null,
        showImageDailog: false,
      },
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
        { text: 'الهاتف', value: 'account_mobile' },
        { text: 'الايميل', value: 'account_email' },
        { text: 'الرمز', value: 'account_password_show' },
        { text: 'عدد الطلاب', value: 'number_of_student' },
        { text: 'الراتب', value: 'account_salary' },
        {
          text: 'العنوان',

          value: 'account_address',
        },
        { text: 'الصورة', value: 'account_img' },
        { text: 'العمليات', value: 'actions', sortable: false },
      ],
      driversData: [],
      content_url: null,
    }
  },
  watch: {
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
  mounted() {
    this.getData()
  },

  methods: {
    async getData() {
      this.table.loading = true

      const response = await Api.getDriver()

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.table.loading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.table.loading = false
        this.driversData = response.data.results
        this.content_url = response.data.content_url
      }
    },

    deleteItem(item) {
      this.deletedItem = { ...item }
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      this.deleteItemLoading = true

      const response = await Api.removeDriver(this.deletedItem._id)

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.deleteItemLoading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.deleteItemLoading = false
        this.dialogDelete = false
        this.getData()
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

        const response = await Api.editPasswordDriver(
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
          this.getData()
          this.showDialogfunction(response.data.results, 'primary')
        }
      }
    },

    goToAddPage() {
      this.$router.push('/drivers/addDriver')
    },

    showImage(image) {
      this.table.showImageDailog = true
      this.table.imageUrlForShow = image
    },

    showDialogfunction(bodyText, color) {
      this.dialogData.open = true
      this.dialogData.bodyText = bodyText
      this.dialogData.color = color
    },

    handleDownload() {
      this.xlsxData.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        // console.log(this.studentsData)
        const tHeader = ['الاسم', 'الايميل', 'الرمز', 'الهاتف', 'العنوان', 'الراتب', 'تاريخ الميلاد', 'عدد الطلاب']
        const filterVal = [
          'account_name',
          'account_email',
          'account_password_show',
          'account_mobile',
          'account_address',
          'account_salary',
          'account_birthday',
          'number_of_student',
        ]

        // const { list } = this
        const data = this.formatJson(filterVal, this.driversData)
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

    goToPrintPage(item) {
      let routeData = this.$router.resolve({ name: 'printOneDriver' })
      window.open(routeData.href, '_blank')

      localStorage.setItem('printOneDriver', JSON.stringify(item))
    },

  },
}
</script>

<style>
.teacher_image_table {
  cursor: pointer;
}
</style>

<style scoped>
a {
  text-decoration: none;
}
</style>
