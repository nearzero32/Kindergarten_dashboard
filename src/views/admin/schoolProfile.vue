<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center mb-3 subtitle-4 black--text">حساب الروضة</h1>
        <h3 class="text-center mb-3 subtitle-4 black--text">{{ $route.params.name }}</h3>
        <v-row>
          <v-col md="3" sm="3" xs="12" align-self="center">
            <v-btn tile color="primary" @click="goToAddPage">
              اضافة حساب <v-icon right small> fa-plus </v-icon>
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <!-- <v-col
            md="3"
            sm="3"
            xs="12"
          >
            <v-text-field
              v-model="table.search"
              label="البحث"
              append-icon="mdi-magnify"
              single-line
              hide-details
            ></v-text-field>
          </v-col> -->
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-data-table
              :loading="table.loading"
              loading-text="جاري التحميل ... الرجاء الانتظار"
              :headers="headers"
              :items="studentsData"
              :search="table.search"
              :items-per-page="10"
              item-key="account_id"
              class="elevation-1"
              :footer-props="{
                showFirstLastPage: true,
              }"
            >
              <template slot="item.account_id" slot-scope="props">
                {{ props.index + 1 }}
              </template>
              <template v-slot:item.account_type="{ item }">
                <span v-if="item.account_type === 'manager'">مدير</span>
                <span v-else-if="item.account_type === 'assistance'">اداري</span>
                <span v-else-if="item.account_type === 'accountantPrivilege'">محاسب</span>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      color="primary"
                      class="ml-2"
                      size="20"
                      v-bind="attrs"
                      v-on="on"
                      @click="EditPassword(item)"
                    >
                      fa-edit
                    </v-icon>
                  </template>
                  <span>تعديل</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      color="#FF5252"
                      v-bind="attrs"
                      size="20"
                      v-on="on"
                      @click="deleteItem(item)"
                    >
                      fa-trash
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
                <img
                  :src="this.$store.state.FileUrl + table.imageUrlForShow"
                  alt
                  width="300"
                  height="200"
                />
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="ml-3">
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="table.showImageDailog = false">
            الغاء
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- image Teacher dialog -->
    <!-- Edit dialog -->
    <v-dialog v-model="EditPasswordDialog" max-width="700px">
      <v-card>
        <v-card-title>
          <span class="headline">التعديل</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="isFormValidEditPassword">
              <v-row>
                <!-- name -->
                <v-col md="6" cols="12">
                  <v-text-field
                    v-model="editedItem.account_name"
                    dense
                    label="الاسم"
                    :rules="editRules.account_name"
                    outlined
                    required
                  ></v-text-field>
                </v-col>
                <!-- mobile -->
                <v-col md="6" cols="12">
                  <v-text-field
                    v-model="editedItem.account_mobile"
                    dense
                    label="الهاتف"
                    :rules="editRules.account_mobile"
                    outlined
                    required
                  ></v-text-field>
                </v-col>
                <!-- email -->
                <v-col md="6" cols="12">
                  <v-text-field
                    v-model="editedItem.account_email"
                    dense
                    label="الايميل"
                    :rules="editRules.account_email"
                    outlined
                    required
                  ></v-text-field>
                </v-col>
                <!-- password -->
                <v-col md="6" cols="12">
                  <v-text-field
                    v-model="editedItem.account_password_show"
                    dense
                    label="الرمز"
                    :rules="editRules.account_password_show"
                    outlined
                    required
                  ></v-text-field>
                </v-col>
                <!-- gender -->
                <v-col md="6" cols="12">
                  <v-select
                    v-model="editedItem.account_gender"
                    dense
                    :items="account_genderItems"
                    item-text="text"
                    item-value="value"
                    label="الجنس"
                    outlined
                  ></v-select>
                </v-col>
                <!-- type -->
                <!-- <v-col md="6" cols="12">
                  <v-select v-model="editedItem.account_type" :items="account_typeItems" dense item-text="text"
                    item-value="value" label="نوع الحساب" outlined></v-select>
                </v-col> -->
                <!-- birthday -->
                <v-col md="6" cols="12">
                  <v-menu
                    v-model="menuAccountBirthday"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="editedItem.account_birthday"
                        :rules="editRules.account_birthdayRules"
                        dense
                        label="المواليد"
                        outlined
                        clearable
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="editedItem.account_birthday"
                      @input="menuAccountBirthday = false"
                    >
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <!-- address -->
                <v-col md="6" cols="12">
                  <v-text-field
                    v-model="editedItem.account_address"
                    :rules="editRules.account_addressRules"
                    dense
                    label="العنوان"
                    outlined
                    required
                  ></v-text-field>
                </v-col>
                <!-- type -->
                <v-col md="6" cols="12">
                  <v-select
                    v-model="editedItem.account_type"
                    :items="account_typeItems"
                    dense
                    item-text="text"
                    item-value="value"
                    label="نوع الحساب"
                    outlined
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="ml-3">
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="EditPasswordDialog = false"> الغاء </v-btn>
          <v-btn
            color="primary"
            :loading="EditPasswordLoading"
            :disabled="!isFormValidEditPassword"
            @click="submitEditTeacher"
          >
            تعديل
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Edit dialog -->
    <!-- delete dialog -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline justify-center">
          هل انت متأكد من حذف هذا الحساب ؟
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogDelete = false"> الغاء </v-btn>
          <v-btn color="primary" :loading="deleteItemLoading" @click="deleteItemConfirm">
            حذف
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End delete dailog -->
    <!--- Dailog for show info to user-->
    <v-dialog v-model="dialogData.open" max-width="500px">
      <v-toolbar :color="dialogData.color" dense></v-toolbar>
      <v-card>
        <v-card-title class="headline justify-center">
          {{ dialogData.bodyText }}
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogData.open = false"> تم </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import adminApi from '@/api/adminApi'
import sha512 from 'js-sha512'

export default {
  data() {
    return {
      isFormValidEditPassword: false,

      EditPasswordDialog: false,

      EditPasswordLoading: false,

      deleteItemLoading: false,

      menuAccountBirthday: false,

      editedItem: {},

      account_typeItems: [
        { text: 'مدير', value: 'manager' },
        { text: 'اداري', value: 'assistance' },
        { text: 'محاسب', value: 'accountantPrivilege' },
      ],

      editRules: {
        account_name: [value => !!value || 'الاسم مطلوب'],
        account_type: [value => !!value || 'النوع مطلوب'],
        account_email: [
          value => !!value || 'الايميل مطلوب',

          // (value) =>
          //   (value && value.length > 4) || "خمسة احرف او ارفام على الاقل",
          v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'يجب ادخال عنوان بريد الكتروني صالح',
        ],
        account_birthdayRules: [value => !!value || 'المواليد مطلوبة'],
        account_addressRules: [value => !!value || 'العنوان مطلوب'],
        account_password_show: [
          value => !!value || 'الرمز مطلوب',
          value => (value && value.length > 5) || 'ستة احرف او ارفام على الاقل',
        ],
      },

      account_genderItems: ['ذكر', 'انثى'],

      dialogDelete: false,
      dialogData: {
        open: false,
        color: 'primary',
        bodyText: 'test',
      },

      deletedItem: {},

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

          value: 'account_id',
        },
        {
          text: 'الاسم',

          value: 'account_name',
        },
        { text: 'الهاتف', value: 'account_mobile' },
        { text: 'الايميل', value: 'account_email' },
        { text: 'الباسورد', value: 'account_password_show' },
        { text: 'النوع', value: 'account_type' },

        {
          text: 'العنوان',

          value: 'account_address',
        },
        { text: 'العمليات', value: 'actions', sortable: false },
      ],
      studentsData: [],
      content_url: null,
    }
  },
  mounted() {
    this.getStudentData()
  },

  methods: {
    async getStudentData() {
      this.table.loading = true

      const response = await adminApi.getManager(this.$route.params.id)

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.table.loading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.table.loading = false
        this.studentsData = response.data.results
        this.content_url = response.data.content_url
      }
    },

    deleteItem(item) {
      this.deletedItem = { ...item }
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      this.deleteItemLoading = true

      const response = await adminApi.removeManager(this.deletedItem._id)

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.deleteItemLoading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.deleteItemLoading = false
        this.dialogDelete = false
        this.getStudentData()
        this.showDialogfunction(response.data.results, 'primary')
      }
    },

    EditPassword(item) {
      this.editedItem = { ...item }
      this.EditPasswordDialog = true
    },

    async submitEditTeacher() {
      this.EditPasswordLoading = true

      this.editedItem.account_password = sha512(this.editedItem.account_password_show)

      const response = await adminApi.editManager(this.editedItem)

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.EditPasswordDialog = false
        this.EditPasswordLoading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.EditPasswordLoading = false
        this.EditPasswordDialog = false
        this.getStudentData()
        this.showDialogfunction(response.data.results, 'primary')
      }
    },

    goToAddPage() {
      this.$router.push(`/AddSchoolAccount/${this.$route.params.id}`)
    },

    showDialogfunction(bodyText, color) {
      this.dialogData.open = true
      this.dialogData.bodyText = bodyText
      this.dialogData.color = color
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
