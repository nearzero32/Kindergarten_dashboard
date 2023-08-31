<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center mb-3 mt-10 subtitle-4 black--text"> التقييم </h1>
        <h3 class="text-center mb-3 subtitle-4 black--text"> {{ $route.params.account_name }} </h3>
        <v-row>
          <v-col md="4" cols="12" align-self="center">
            <v-btn tile color="success" :loading="xlsxData.downloadLoading" @click="handleDownload"> تحميل اكسل <v-icon
                right> fa-download </v-icon>
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
              :items="driversData" :search="table.search" :items-per-page="10" item-key="review_id" class="elevation-1"
              :footer-props="{
                showFirstLastPage: true,
              }">
              <template slot="item.account_id" slot-scope="props"> {{ props.index + 1 }} </template>
              <template v-slot:item.actions="{ item }">
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
          <v-btn color="primary" text @click="dialogData.open = false"> تم </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Api from '../../../../api/api'

export default {
  data() {
    return {
      deletedItem: {},

      deleteItemLoading: false,

      editedItem: {},

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
        filename: `${this.$route.params.account_name} تقييم الطالب`,
        autoWidth: true,
        bookType: 'xlsx',
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
          value: 'account_id',
        },
        {
          text: 'الاسم',
          value: 'account_name',
        },
        { text: 'الهاتف', value: 'account_mobile' },
        { text: 'المستوى العلمي', value: 'review_scientific' },
        { text: 'المستوى السلوكي', value: 'review_behavior' },
        { text: 'المستوى الحضوري', value: 'review_presence' },
        { text: 'التوجيه', value: 'review_guidance' },
        { text: 'الملاحظات', value: 'review_note' },
        { text: 'التاريخ', value: 'review_date' },
        { text: 'العمليات', value: 'actions', sortable: false },
      ],
      driversData: [],
    }
  },
  mounted() {
    this.getData()
  },

  methods: {
    async getData() {
      this.table.loading = true
      const study_year = JSON.parse(localStorage.getItem('study_year'))

      const response = await Api.getReview(
        this.$route.params.account_id,
        study_year,
      )

      if (response.status === 401) {
        this.table.loading = false
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.table.loading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.table.loading = false
        this.driversData = response.data.results
      }
    },
    showDialogfunction(bodyText, color) {
      this.dialogData.open = true
      this.dialogData.bodyText = bodyText
      this.dialogData.color = color
    },

    handleDownload() {
      this.xlsxData.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          'الاسم',
          'الهاتف',
          'المستوى العلمي',
          'المستوى السلوكي',
          'المستوى الحضوري',
          'التوجيه',
          'الملاجظات',
          'التاريخ',
        ]
        const filterVal = [
          'account_name',
          'account_mobile',
          'review_scientific',
          'review_behavior',
          'review_presence',
          'review_guidance',
          'review_note',
          'review_date',
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

    deleteItem(item) {
      this.deletedItem = { ...item }
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      this.deleteItemLoading = true

      const response = await Api.removeReview(this.deletedItem._id)

      if (response.status === 401) {
        this.deleteItemLoading = false
        this.dialogDelete = false
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.deleteItemLoading = false
        this.dialogDelete = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.deleteItemLoading = false
        this.dialogDelete = false
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
