import axios from 'axios';

class studentBillsApi {
  async get({ isDeleted, start_date, end_date, study_year, student_id }) {
    const response = await axios
      .post(`/counting/studentSalary/getAllInvoice`, {
        isDeleted,
        start_date,
        end_date,
        study_year,
        student_id,
      });

    return response;
  }

  async getPayment({ isDeleted, study_year, invoice_id }) {
    const response = await axios
      .post(`/counting/studentSalary/getInvoice`, {
        isDeleted,
        study_year,
        invoice_id,
      });

    return response;
  }
}

export default new studentBillsApi()