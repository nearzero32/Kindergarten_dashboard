import axios from 'axios'

class adminApi {
    async getDashboard() {

        axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
        return axios
            .get("/admin/dashboard")
            .then(Response => Response)
            .catch(error => {
                console.log('error', error)

                return error.response
            })
    }

    // join us
    async getJoinUs(page, limit) {

        axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
        return axios
            .get(`/admin/joinUs/page/${page}/limit/${limit}`)
            .then(Response => Response)
            .catch(error => {
                console.log('error', error)

                return error.response
            })
    }

    async removeJoinUs(id) {

        axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
        return axios
            .delete(`/admin/joinUs/remove/id/${id}`)
            .then(Response => Response)
            .catch(error => {
                console.log('error', error)

                return error.response
            })
    }

    // contact us
    async getContactUs() {

        axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
        return axios
            .get(`/admin/contactUs/get`)
            .then(Response => Response)
            .catch(error => {
                console.log('error', error)

                return error.response
            })
    }

    async editContactUs(formData) {

        axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
        return axios
            .put(`/admin/contactUs/edit`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(Response => Response)
            .catch(error => {
                console.log('error', error)

                return error.response
            })
    }


    // schools
    async getSchools(page, limit, search) {

        axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
        return axios
            .post("/admin/schools/get", {
                page,
                limit,
                search
            })
            .then(Response => Response)
            .catch(error => {
                console.log('error', error)

                return error.response
            })
    }

    async getOneSchools(school_id) {

        axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
        return axios
            .get(`/admin/schools/getOne/school_id/${school_id}`)
            .then(Response => Response)
            .catch(error => {
                console.log('error', error)

                return error.response
            })
    }

    async getAllSchools() {

        axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
        return axios
            .get("/admin/schools/getAll")
            .then(Response => Response)
            .catch(error => {
                console.log('error', error)

                return error.response
            })
    }

    async addSchools(formData) {

        axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
        return axios
            .post(`/admin/schools/add`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(Response => Response)
            .catch(error => {
                console.log('error', error)

                return error.response
            })
    }

    async editSchools(formData) {

        axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
        return axios
            .put(`/admin/schools/edit`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(Response => Response)
            .catch(error => {
                console.log('error', error)

                return error.response
            })
    }

    async editNoteSchool(_id, school_admin_note) {

        axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
        return axios
            .put("/admin/schools/editNote", {
                school_admin_note,
                _id
            })
            .then(Response => Response)
            .catch(error => {
                console.log('error', error)

                return error.response
            })
    }

    // manager
    async getManager(school_id) {

        axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
        return axios
            .get(`/admin/manager/get/school_id/${school_id}`)
            .then(Response => Response)
            .catch(error => {
                console.log('error', error)

                return error.response
            })
    }

    async getOneManage(manager_id) {
        axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

        return axios
            .get(`/admin/manager/getOne/manager_id/${manager_id}`)
            .then(Response => Response)
            .catch(error => {
                console.log('error', error)

                return error.response
            })
    }

    async addManager(data) {
        axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

        return axios
            .post(`/admin/manager/add`, {
                data
            })
            .then(Response => Response)
            .catch(error => {
                console.log('error', error)

                return error.response
            })
    }

    async editManager(data) {
        axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

        return axios
            .put(`/admin/manager/edit`, {
                data
            })
            .then(Response => Response)
            .catch(error => {
                console.log('error', error)

                return error.response
            })
    }

    async removeManager(account_id) {
        axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

        return axios
            .delete(`/admin/manager/remove/account_id/${account_id}`)
            .then(Response => Response)
            .catch(error => {
                console.log('error', error)

                return error.response
            })
    }
}

export default new adminApi()