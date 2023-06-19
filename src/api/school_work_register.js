import axios from 'axios'

class school_work_register_api {
  async get({ page, limit, search }) {
    return await axios.get(`/school/work_register?page=${page}&limit=${limit}&search=${search}`)
  }

  async remove(id) {
    return await axios.delete(`/school/work_register/id/${id}`)
  }
}


export default new school_work_register_api()
