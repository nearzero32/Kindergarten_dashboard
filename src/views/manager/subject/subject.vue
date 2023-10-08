<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center mb-3 subtitle-4 black--text"> المواد الدراسية </h1>
        <v-row>
          <v-col md="3" sm="3" cols="12" align-self="center">
            <v-btn tile color="primary" @click="addDialog.open = true"> اضافة مادة <v-icon right
                style="font-size: 15px"> fa-plus </v-icon>
            </v-btn>
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
              :items="driversData" :search="table.search" :items-per-page="10" item-key="class_school_id"
              class="elevation-1" :footer-props="{
                showFirstLastPage: true,
              }">
              <template slot="item._id" slot-scope="props"> {{ props.index + 1 }} </template>
              <template v-slot:item.actions="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="primary" class="ml-2" v-bind="attrs" size="20" v-on="on" @click="editItem(item)">
                      fa-edit </v-icon>
                  </template>
                  <span>تعديل</span>
                </v-tooltip>
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
    <!-- add Class dialog -->
    <v-dialog v-model="addDialog.open" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">اضافة مادة دراسية</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="addDialog.isFormValidAdd">
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="data.subject_name" label="اسم المادة" :rules="addRules.subject_nameRules"
                    outlined></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="ml-3">
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="addDialog.open = false"> الغاء </v-btn>
          <v-btn color="primary" :loading="addDialog.saveLoading" :disabled="!addDialog.isFormValidAdd"
            @click="addSubject"> اضافة </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- add Class dialog -->
    <!-- edit Class dialog -->
    <v-dialog v-model="dialogEdit.open" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">تعديل مادة دراسية</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="dialogEdit.isFormValid">
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="editedItem.subject_name" label="اسم المادة" :rules="addRules.subject_nameRules"
                    outlined></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="ml-3">
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogEdit.open = false"> الغاء </v-btn>
          <v-btn color="primary" :loading="dialogEdit.loading" :disabled="!dialogEdit.isFormValid"
            @click="editItemConform"> تعديل </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- edit Class dialog -->
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
      addDialog: {
        open: false,
        isFormValidAdd: false,
        saveLoading: false,
      },

      data: {
        subject_name: null
      },

      deleteItemLoading: false,

      dialogDelete: false,

      addRules: {
        subject_nameRules: [value => !!value || 'اسم المادة مطلوب'],
      },

      editedItem: {},



      dialogData: {
        open: false,
        color: 'primary',
        bodyText: 'test',
      },

      table: {
        loading: false,
        search: null,
      },

      dialogEdit: {
        open: false,
        isFormValid: false,
        loading: false,
      },

      headers: [
        {
          text: '#',
          align: 'start',
          width: 1,
          sortable: false,
          value: '_id',
        },
        {
          text: 'اسم المادة',
          ortable: false,
          value: 'subject_name',
        },
        { text: 'العمليات', value: 'actions', sortable: false },
      ],
      driversData: [],
      classes: [],
    }
  },

  mounted() {
    this.getData()
  },

  methods: {
    async getData() {
      this.table.loading = true

      const response = await Api.getSubject()

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.table.loading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.table.loading = false
        this.driversData = response.data.results
      }
    },

    deleteItem(item) {
      this.deletedItem = { ...item }
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      this.deleteItemLoading = true

      const response = await Api.removeSubject(this.deletedItem._id)

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

    editItem(item) {
      this.editedItem = { ...item }
      this.dialogEdit.open = true
    },

    async editItemConform() {
      this.dialogEdit.loading = true

      const response = await Api.editSubject(this.editedItem.subject_name, this.editedItem._id)

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.dialogEdit.open = false
        this.dialogEdit.loading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.dialogEdit.open = false
        this.dialogEdit.loading = false
        this.getData()
        this.showDialogfunction(response.data.results, 'primary')
      }
    },

    showDialogfunction(bodyText, color) {
      this.dialogData.open = true
      this.dialogData.bodyText = bodyText
      this.dialogData.color = color
    },

    async addSubject() {
      this.addDialog.saveLoading = true

      const response = await Api.addSubject(this.data.subject_name)

      if (response.status === 401) {
        this.addDialog.saveLoading = true
        this.addDialog.open = false
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.addDialog.open = false
        this.addDialog.saveLoading = true
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.addDialog.open = false
        this.addDialog.saveLoading = true

        this.getData()
        this.showDialogfunction(response.data.results, 'primary')
      }
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
