<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center mb-3 subtitle-4 black--text"> المواد الدراسية </h1>
        <v-row>
          <v-col md="4" cols="12" align-self="center">
            <v-btn tile color="primary" @click="AddDialog.open = true"> اضافة مادة <v-icon right
                style="font-size: 15px"> fa-plus </v-icon>
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col md="4" cols="12">
            <v-text-field v-model="table.search" label="البحث" append-icon="mdi-magnify" single-line hide-details>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-data-table :loading="table.loading" loading-text="جاري التحميل ... الرجاء الانتظار" :headers="headers"
              :items="driversData" :search="table.search" :items-per-page="10" item-key="account_id" class="elevation-1"
              :footer-props="{
                showFirstLastPage: true,

              }">
              <template slot="item.account_id" slot-scope="props"> {{ props.index + 1 }} </template>
              <template v-slot:item.account_name="{ item }">
                <router-link :to="'/drivers/' + item.account_id"> {{ item.account_name }} </router-link>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="primary" class="ml-2" v-bind="attrs" size="20" v-on="on" @click="Edit(item)"> fa-edit
                    </v-icon>
                  </template>
                  <span>تعديل</span>
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
    <!-- delete dialog -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline justify-center"> هل انت متأكد من حذف هذه المادة ؟ </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogDelete = false"> الغاء </v-btn>
          <v-btn color="primary white--text" :loading="deleteItemLoading" @click="deleteItemConfirm"> حذف </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End delete dailog -->
    <!-- Add dialog -->
    <v-dialog v-model="AddDialog.open" max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">اضافة</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="AddDialog.isFormValid">
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="AddDialog.data.subject_name" label="اسم المادة" :rules="editRules.nameRules"
                    outlined required></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="ml-3">
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="AddDialog.open = false"> الغاء </v-btn>
          <v-btn color="primary white--text" :loading="AddDialog.loading" :disabled="!AddDialog.isFormValid"
            @click="submitAdd"> اضافة </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Edit dialog -->
    <!-- Edit dialog -->
    <v-dialog v-model="EditDialog.open" max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">تعديل</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="EditDialog.isFormValid">
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="editedItem.subject_name" label="اسم المادة" :rules="editRules.nameRules"
                    outlined required></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="ml-3">
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="EditDialog.open = false"> الغاء </v-btn>
          <v-btn color="primary white--text" :loading="EditDialog.loading" :disabled="!EditDialog.isFormValid"
            @click="submitEdit"> تعديل </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Edit dialog -->
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
      AddDialog: {
        loading: false,
        open: false,
        isFormValid: false,
        data: {
          subject_name: null,
        },
      },

      EditDialog: {
        loading: false,
        open: false,
        isFormValid: false,
      },

      deleteItemLoading: false,

      editedItem: {},

      editRules: {
        nameRules: [value => !!value || 'اسم المادة مطلوب'],
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
          value: 'subject_id',
        },
        {
          text: 'اسم المادة',
          value: 'subject_name',
        },

        { text: 'العمليات', value: 'actions', sortable: false },
      ],
      driversData: [],
    }
  },
  mounted() {
    this.getData()
  },

  methods: {
    getData() {
      this.table.loading = true
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.$http
        .get('admin/subject')
        .then(Response => {
          this.table.loading = false
          if (Response.data.error === false) {
            this.driversData = Response.data.results
          }
        })
        .catch(error => {
          this.table.loading = false
          console.log(error)
        })
    },

    submitAdd() {
      this.AddDialog.loading = true
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .post('admin/subject', {
          subject_name: this.AddDialog.data.subject_name,
        })
        .then(Response => {
          this.AddDialog.open = false
          if (Response.data.error === false) {
            this.AddDialog.loading = false
            this.AddDialog.data.subject_name = null
            this.getData()
            this.showDialogfunction(Response.data.results, 'primary')
          } else {
            this.AddDialog.loading = false
            this.showDialogfunction(Response.data.results, '#FF5252')
          }
        })
        .catch(error => {
          this.AddDialog.loading = false
          this.AddDialog.open = false
          this.showDialogfunction(response.data.results, '#FF5252')
          console.log('error', error)
        })
    },

    deleteItem(item) {
      this.deletedItem = { ...item }
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.deleteItemLoading = true
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .delete(`admin/subject/${this.deletedItem.subject_id}`)
        .then(Response => {
          if (Response.data.error === false) {
            this.deleteItemLoading = false
            this.dialogDelete = false
            this.getData()
            this.showDialogfunction(Response.data.results, 'primary')
          } else {
            this.deleteItemLoading = false
            this.showDialogfunction(Response.data.results, '#FF5252')
          }
        })
        .catch(error => {
          this.dialogDelete = false
          this.showDialogfunction(response.data.results, '#FF5252')
          console.log('error', error)
        })
    },

    Edit(item) {
      this.editedItem = { ...item }
      this.EditDialog.open = true
    },

    submitEdit() {
      this.EditDialog.loading = true
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .put('admin/subject', {
          subject_id: this.editedItem.subject_id,
          subject_name: this.editedItem.subject_name,
        })
        .then(Response => {
          this.EditDialog.open = false
          if (Response.data.error === false) {
            this.EditDialog.loading = false
            this.getData()
            this.showDialogfunction(Response.data.results, 'primary')
          } else {
            this.showDialogfunction(Response.data.results, '#FF5252')
          }
        })
        .catch(error => {
          this.EditDialog.loading = false
          this.EditDialog.open = false
          this.showDialogfunction(response.data.results, '#FF5252')
          console.log('error', error)
        })
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
