import Vue from 'vue'
import sha512 from 'js-sha512'

export async function login(
  account_email,
  account_password,
  auth_phone_details,
  auth_ip,
  auth_city,
  auth_lat,
  auth_lon,
) {
  return Vue.axios
    .post('/login', {
      account_email: account_email,
      account_password: sha512(account_password),
      auth_phone_details: auth_phone_details,
      auth_ip: auth_ip,
      auth_city: auth_city,
      auth_lat: auth_lat,
      auth_lon: auth_lon,

      // auth_phone_id: authData.firebaseToken,
      // auth_firebase: authData.firebaseToken,
    })
    .then(Response => {
      return { error: false, response: Response }
    })
    .catch(() => {
      return { error: true, response: [] }
    })
}

export async function logout() {}
