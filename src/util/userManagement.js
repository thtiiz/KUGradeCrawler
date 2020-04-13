import qs from 'qs'
import axios from 'axios'
import { parse } from 'node-html-parser'

class UserManagement {
  constructor() {
    this.URL_LOGIN = 'https://stdregis.ku.ac.th/_Login.php'
    this.URL_KU20 = 'https://stdregis.ku.ac.th/_Student_RptKu.php?mode=KU20'
  }

  extractInfo(tr) {
    return tr.childNodes.map((td) => td.text)
  }

  async login(username, password) {
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify({
        form_username: username,
        form_password: password,
      }),
      url: this.URL_LOGIN,
    }
    await axios(options)
  }

  async fetchGrades() {
    const res = await axios.get(this.URL_KU20)
    const { data } = res
    console.log(data)
    const root = parse(data).removeWhitespace()
    const reverseElems = root.lastChild.querySelectorAll('tr').reverse()
    const titleElemIndex = reverseElems.findIndex((tr) => tr.childNodes.length <= 1)
    const lastTermGrades = reverseElems
      .slice(0, titleElemIndex)
      .map((subject) => this.extractInfo(subject))
      .reverse()
    console.log(lastTermGrades)
    this.saveToLocal(lastTermGrades)
  }

  saveToLocal(grades) {
    chrome.storage.sync.set(
      { grades: qs.stringify({ values: grades, timestamp: new Date().toUTCString() }) },
      function () {
        console.log('saved!!')
      }
    )
    chrome.storage.sync.get('grades', function (result) {
      const grades = qs.parse(result['grades'])
    })
  }
}

export default new UserManagement()
