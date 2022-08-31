<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center mb-3 subtitle-4 black--text"> الحسابات </h1>
        <v-row>
          <v-col md="3" sm="3" cols="12" align-self="center">
            <v-btn tile color="primary" @click="goToAccountPage"> فتح صفحة الحسابات <v-icon right
                style="font-size: 15px"> fa-plus </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import Api from '../../api/api'

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

    goToAccountPage() {
      localStorage.setItem("typeDashboard", 'account')
      window.open('http://localhost:8080/#/accountHome')
    },

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
