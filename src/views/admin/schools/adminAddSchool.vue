<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center subtitle-4 black--text"> الروضة </h1>
        <v-row class="mt-5">
          <v-col md="3" cols="12">
            <div class="d-md-flex">
              <v-btn tile color="primary" class="ml-2 mb-4 mb-md-0 mb-sm-0" @click="goToAddPage" :block="isScreenXs">
                اضافة روضة <v-icon right style="font-size: 15px"> fa-plus </v-icon>
              </v-btn>
              <v-btn tile color="success" :loading="xlsxData.downloadLoading" @click="getAllTeacherDataAxios"
                :block="isScreenXs"> تحميل اكسل <v-icon right> fa-download </v-icon>
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
              <template slot="item.school_id" slot-scope="props"> {{ (tableOptions.page - 1) * tableOptions.itemsPerPage
                  + props.index + 1
              }} </template>
              <template v-slot:item.school_name="{ item }">
                <router-link :to="'/schoolProfile/' + item.school_name + '/' + item._id"> {{ item.school_name }}
                </router-link>
              </template>
              <template v-slot:item.currency="{ item }">
                <span v-if="item.currency === 'IQD'">عراقي</span>
                <span v-else>دولار</span>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="primary" class="ml-2" size="20" v-bind="attrs" v-on="on" @click="goToEditPage(item)">
                      fa-edit </v-icon>
                  </template>
                  <span>تعديل</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="warning" size="20" v-bind="attrs" v-on="on" @click="editNoteItem(item)"> fa-file
                    </v-icon>
                  </template>
                  <span>اضافة ملاحظة</span>
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
    <!-- edit dialog -->
    <v-dialog v-model="editDailog.open" max-width="1200px">
      <v-card>
        <v-card-title>
          <span class="headline">تعديل</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="editDailog.isFormValid">
              <v-row>
                <!-- schholName -->
                <v-col cols="12" md="6">
                  <v-text-field v-model="editedItem.school_name" label="اسم المدرسة" outlined dense required>
                  </v-text-field>
                </v-col>
                <!-- location -->
                <v-col cols="12" md="6">
                  <v-text-field v-model="editedItem.school_location" label="الموقع" outlined dense required>
                  </v-text-field>
                </v-col>
                <!-- Logo -->
                <v-col md="6" sm="6" cols="12">
                  <div class="d-flex justify-space-around align-center">
                    <v-btn text color="primary" @click="$refs.img1Upload.click()"> تعديل لوكو </v-btn>
                    <input v-show="false" id="img1" ref="img1Upload" type="file" @change="changeLogo($event)" />
                    <div class="image-container">
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-show="IsLogoShowing" class="image-dismis" v-bind="attrs" v-on="on"
                            @click="deleteLogoImage"> fa-minus-circle </v-icon>
                        </template>
                        <span>مسح الصورة</span>
                      </v-tooltip>
                      <img v-show="IsLogoShowing" :src="logoUrl" :lazy-src="logoUrl" alt width="60" height="60" />
                    </div>
                  </div>
                </v-col>
                <!-- img-->
                <v-col md="6" sm="6" cols="12">
                  <div class="d-flex justify-space-around align-center">
                    <v-btn text color="primary" @click="$refs.img2Upload.click()"> تعديل صورة (اختياري) </v-btn>
                    <input v-show="false" id="img2" ref="img2Upload" type="file" @change="changeImg" />
                    <div class="image-container">
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-show="IsImageShowing" class="image-dismis" v-bind="attrs" v-on="on"
                            @click="deleteImage"> fa-minus-circle </v-icon>
                        </template>
                        <span>مسح الصورة</span>
                      </v-tooltip>
                      <img v-show="IsImageShowing" :src="imgUrl" :lazy-src="imgUrl" alt width="60" height="60" />
                    </div>
                  </div>
                </v-col>
                <!-- phone -->
                <v-col cols="12" md="4">
                  <v-text-field v-model="editedItem.school_phone" label="الهاتف" outlined dense required></v-text-field>
                </v-col>
                <!-- whatsapp -->
                <v-col cols="12" md="4">
                  <v-text-field v-model="editedItem.school_whatsapp" label="الواتساب" outlined dense required>
                  </v-text-field>
                </v-col>
                <!-- facebook -->
                <v-col cols="12" md="4">
                  <v-text-field v-model="editedItem.school_facebook" label="فيسبوك" outlined dense required>
                  </v-text-field>
                </v-col>
                <!-- web -->
                <v-col cols="12" md="4">
                  <v-text-field v-model="editedItem.school_website" label="الويب (اختياري)" outlined dense required>
                  </v-text-field>
                </v-col>
                <!-- googleMap -->
                <v-col cols="12" md="4">
                  <v-text-field v-model="editedItem.school_google_map" dense label="خرائط غوغل (اختياري)" outlined>
                  </v-text-field>
                </v-col>
                <!-- currency -->
                <v-col cols="12" md="4">
                  <v-select v-model="editedItem.currency" :items="currencyItems" dense item-text="text"
                    item-value="value" label="العملة النقدية" outlined>
                  </v-select>
                </v-col>
                <!-- features -->
              </v-row>
              <!-- description -->
              <v-col cols="12">
                <v-textarea v-model="editedItem.school_description" name="input-7-1" label="الوصف"
                  append-icon="fa-scroll" dense outlined></v-textarea>
              </v-col>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="ml-3">
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="editDailog.open = false"> الغاء </v-btn>
          <v-btn color="primary" :loading="editDailog.loading" :disabled="!editDailog.isFormValid" @click="submitEdit">
            تعديل </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- edit dialog -->
    <!-- edit note dialog -->
    <v-dialog v-model="editNoteDailog.open" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">تعديل ملاحظة الادمن</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form>
              <v-row>
                <!-- school_admin_note -->
                <v-col cols="12">
                  <v-textarea v-model="editedNoteItem.school_admin_note" label="الملاحظة" outlined dense required>
                  </v-textarea>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="ml-3">
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="editNoteDailog.open = false"> الغاء </v-btn>
          <v-btn color="primary" :loading="editNoteDailog.loading" @click="submitEditNote"> تعديل </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- edit note dialog -->
  </div>
</template>
<script>
import adminApi from '@/api/adminApi'
export default {
  data() {
    return {
      isFormValidEditPassword: false,

      logoUrl: null,

      imgUrl: null,

      deleteItemLoading: false,

      dialogDelete: false,

      editDailog: {
        open: false,
        loading: false,
        isFormValid: false,
      },

      xlsxData: {
        list: null,
        listLoading: true,
        downloadLoading: false,
        filename: 'المدارس',
        autoWidth: true,
        bookType: 'xlsx',
      },

      editNoteDailog: {
        open: false,
        loading: false,
        isFormValid: false,
      },

      dialogData: {
        open: false,
        color: 'primary',
        bodyText: 'test',
      },

      deletedItem: {},

      tableOptions: {},

      editedItem: {},

      editedNoteItem: {},

      selectedLogo: null,

      selectedimg: null,

      IsImageShowing: true,

      IsLogoShowing: true,

      content_url: null,

      isScreenXs: false,

      allSchoolsData: [],

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
            text: 'اسم الروضة',
            sortable: false,
            value: 'school_name',
          },
          { text: 'عدد الطلاب', sortable: false, value: 'student_count' },
          { text: 'الكادر التدريسي', sortable: false, value: 'staff_count' },
          { text: 'الهاتف', sortable: false, value: 'school_phone' },
          { text: 'العملة', sortable: false, value: 'school_currency' },
          { text: 'الموقع', sortable: false, value: 'school_location' },
          { text: 'ملاحظة الادمن', sortable: false, value: 'school_admin_note' },

          { text: 'العمليات', value: 'actions', sortable: false },
        ],
      },
      currencyItems: [
        { text: 'عراقي', value: 'IQD' },
        { text: 'دولار', value: 'US' },
      ],
    }
  },
  watch: {
    tableOptions: {
      handler() {
        this.getTeacherDataAxios()
      },
      deep: true,
    },

    'editDailog.open': {
      handler() {
        if (this.editDailog.open === false) {
          this.selectedLogo = null
          this.selectedimg = null
        } else {
          this.logoUrl = this.$store.state.FileUrl + this.editedItem.logo
          this.imgUrl = this.$store.state.FileUrl + this.editedItem.img
        }
      },
    },

    selectedLogo: {
      handler() {
        if (this.selectedLogo === null) {
          this.logoUrl = this.$store.state.FileUrl + this.editedItem.logo
          this.selectedimg = null
        } else {
          this.logoUrl = this.selectedLogo
        }
      },
    },

    selectedimg: {
      handler() {
        if (this.selectedimg === null) {
          this.imgUrl = this.$store.state.FileUrl + this.editedItem.img
          this.selectedimg = null
        } else {
          this.imgUrl = this.selectedimg
        }
      },
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

      const response = await adminApi.getSchools(page, itemsPerPage, search)

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

    deleteItemConfirm() {
      this.deleteItemLoading = true
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .delete(`admin/school/${this.deletedItem.school_id}`)
        .then(Response => {
          this.deleteItemLoading = false
          if (Response.data.error === false) {
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

    deleteLogoImage() {
      this.IsLogoShowing = false
      this.editedItem.logo = null
      this.logoUrl = null
      document.querySelector('#img1').value = ''
    },

    deleteImage() {
      this.IsImageShowing = false
      this.editedItem.img = null
      this.imgUrl = null
      document.querySelector('#img2').value = ''
    },

    editItem(item) {
      this.editedItem = { ...item }
      if (!this.editedItem.img) {
        this.IsImageShowing = false
      } else {
        this.IsImageShowing = true
      }
      if (!this.editedItem.logo) {
        this.IsLogoShowing = false
      } else {
        this.IsLogoShowing = true
      }
      this.editDailog.open = true
    },

    async submitEdit() {
      // console.log('this.editedItem: ', this.editedItem)

      this.editDailog.loading = true
      const logoSelected = document.querySelector('#img1')
      const imageSelected = document.querySelector('#img2')

      const formData = new FormData()

      if (logoSelected.value === '' && this.editedItem.logo == null) {
        // if there is no logo and no selected logo
        this.editDailog.loading = false
        this.showDialogfunction('يجب اختيار صورة لوكو للمدرسة', '#FF8A80')
      } else {
        // if there is no logo and no image
        /* eslint-disable */
        const image = this.editedItem.img
          ? this.editedItem.img
          : imageSelected.files[0] === undefined
            ? null
            : imageSelected.files[0]
        const logo = this.editedItem.logo ? this.editedItem.logo : logoSelected.files[0]

        await this.formAppend(formData, logo, image)

        this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

        this.axios
          .put('admin/school', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(Response => {
            this.editDailog.loading = false
            if (Response.data.error === false) {
              this.showDialogfunction(Response.data.results, 'primary')
              this.getTeacherDataAxios()
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

    editNoteItem(item) {
      this.editedNoteItem = { ...item }
      this.editNoteDailog.open = true
    },

    async submitEditNote() {
      this.editNoteDailog.loading = true

      const response = await adminApi.editNoteSchool(
        this.editedNoteItem._id,
        this.editedNoteItem.school_admin_note,
      )

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.editNoteDailog.open = false
        this.editNoteDailog.loading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.editNoteDailog.open = false
        this.editNoteDailog.loading = false
        this.getTeacherDataAxios()
        this.showDialogfunction(response.data.results, 'primary')
      }
    },

    changeLogo(event) {
      // this.imgAndDivShowControll.IsDiv1Showing = false
      this.IsLogoShowing = true

      const file = event.target.files[0]
      this.selectedLogo = null
      if (typeof file !== 'undefined' && file !== null) {
        const fileExt = file.name.split('.').pop()
        if (
          fileExt.toLowerCase() === 'jpg' ||
          fileExt.toLowerCase() === 'jpeg' ||
          fileExt.toLowerCase() === 'png' ||
          fileExt.toLowerCase() === 'png' ||
          fileExt.toLowerCase() === 'gif'
        ) {
          this.editedItem.logo = null
          this.selectedLogo = URL.createObjectURL(file)
        } else {
          console.log('error_image_add')
        }
      } else {
        this.selectedLogo = null
      }
    },

    changeImg(event) {
      // this.imgAndDivShowControll.IsDiv1Showing = false
      this.IsImageShowing = true

      const file = event.target.files[0]
      this.selectedimg = null
      if (typeof file !== 'undefined' && file !== null) {
        const fileExt = file.name.split('.').pop()
        if (
          fileExt.toLowerCase() === 'jpg' ||
          fileExt.toLowerCase() === 'jpeg' ||
          fileExt.toLowerCase() === 'png' ||
          fileExt.toLowerCase() === 'png' ||
          fileExt.toLowerCase() === 'gif'
        ) {
          this.editedItem.img = null
          this.selectedimg = URL.createObjectURL(file)
        } else {
          console.log('error_image_add')
        }
      } else {
        this.selectedimg = null
      }
    },

    goToAddPage() {
      this.$router.push('addSchool')
    },

    goToEditPage(item) {
      this.$router.push(`editSchool/school_name/${item.school_name}/school_id/${item._id}`)
    },

    showDialogfunction(bodyText, color) {
      this.dialogData.open = true
      this.dialogData.bodyText = bodyText
      this.dialogData.color = color
    },

    goToLink(file) {
      window.open(file)
    },

    formAppend(formData, logo, image) {
      formData.append('logo', logo)
      formData.append('img', image)
      formData.append('school_name', this.editedItem.school_name)
      formData.append('description', this.editedItem.description)
      formData.append('website', this.editedItem.website)
      formData.append('facebook', this.editedItem.facebook)
      formData.append('whatsapp', this.editedItem.whatsapp)
      formData.append('phone', this.editedItem.phone)
      formData.append('google_map', this.editedItem.google_map)
      formData.append('location', this.editedItem.location)
      formData.append('currency', this.editedItem.currency)
      formData.append('features_finger_id', this.editedItem.features_finger_id)
      formData.append('features_absence', this.editedItem.features_absence)
      formData.append('features_teachers_absence', this.editedItem.features_teachers_absence)
      formData.append('features_review', this.editedItem.features_review)
      formData.append('features_dailyExam', this.editedItem.features_dailyExam)
      formData.append('features_drivers', this.editedItem.features_drivers)
      formData.append('features_exams', this.editedItem.features_exams)
      formData.append('features_notifications', this.editedItem.features_notifications)
      formData.append('school_id', this.editedItem.school_id)
    },

    search() {
      this.$router.replace(
        {
          query: { search: this.table.search },
        },
        () => { },
      )
    },

    async getAllTeacherDataAxios() {
      this.xlsxData.downloadLoading = true

      const response = await adminApi.getAllSchools()

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.xlsxData.downloadLoading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.allSchoolsData = response.data.results
        this.handleDownload()
      }
    },

    handleDownload() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['اسم المدرسة', 'عدد الطلاب', 'الكادر التدريسي', 'الهاتف', 'العملة', 'الموقع', 'ملاحظة الادمن']
        const filterVal = [
          'school_name',
          'student_count',
          'staff_count',
          'school_phone',
          'school_currency',
          'school_location',
          'school_admin_note',
        ]

        // const { list } = this
        const data = this.formatJson(filterVal, this.allSchoolsData)
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

.image-container {
  width: 80px;
  height: 80px;
  border: 1px solid #dedede;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: default;
}

.image-dismis {
  position: absolute;
  content: 'x';
  top: -12px;
  left: -13px;
  color: red;
  cursor: pointer;
  /* background: red; */
  /* padding: 5px 5px; */
  border-radius: 50%;
}
</style>
