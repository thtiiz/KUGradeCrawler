import qs from 'qs'
import axios from 'axios'
import { parse } from 'node-html-parser'

const URL_LOGIN = 'https://stdregis.ku.ac.th/_Login.php'
const URL_KU20 = 'https://stdregis.ku.ac.th/_Student_RptKu.php?mode=KU20'

async function postData(url, data) {
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(data),
    url,
  }
  await axios(options)
}

export async function login(username, password) {
  return await postData(URL_LOGIN, {
    form_username: username,
    form_password: password,
  })
}

const extractInfo = (tr) => {
  return tr.childNodes.map((td) => td.text)
}

export async function getGrades() {
  const res = await axios.get(URL_KU20)
  const { data } = res
  const root = parse(data).removeWhitespace()
  const reverseElems = root.lastChild.querySelectorAll('tr').reverse()
  const titleElemIndex = reverseElems.findIndex((tr) => tr.childNodes.length <= 1)
  const lastTermGrades = reverseElems
    .slice(0, titleElemIndex)
    .map((subject) => extractInfo(subject))
    .reverse()
  console.log(lastTermGrades)
  return lastTermGrades
}
