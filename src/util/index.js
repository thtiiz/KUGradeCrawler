const URL_LOGIN = 'https://stdregis.ku.ac.th/_Login.php'
const URL_KU20 = 'https://stdregis.ku.ac.th/_Student_RptKu.php?mode=KU20'
import qs from 'qs'
// export async function postData(url, data) {
//   // Default options are marked with *
//   const response = await fetch(url, {
//     method: 'POST', // *GET, POST, PUT, DELETE, etc.
//     mode: 'cors', // no-cors, *cors, same-origin
//     Accept: '*/*',
//     'Accept-Encoding': 'gzip, deflate, br',
//     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//     headers: {
//       // 'Content-Type': 'application/json',
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     Connection: 'keep-alive',
//     body: qs.stringify(data), // body data type must match "Content-Type" header
//   })
//   console.log(response)
//   return response // parses JSON response into native JavaScript objects
// }

import axios from 'axios'

async function postData(url, data) {
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(data),
    url,
  }
  console.log(await axios(options))
}

export async function login(username, password) {
  return await postData(URL_LOGIN, {
    form_username: username,
    form_password: password,
  })
}

export async function getKU20() {
  return await axios.get(URL_KU20)
}
