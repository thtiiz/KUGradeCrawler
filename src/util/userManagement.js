import qs from 'qs'
import axios from 'axios'
import { parse } from 'node-html-parser'

class UserManagement {
  constructor() {
    this.URL_LOGIN = 'https://stdregis.ku.ac.th/_Login.php'
    this.URL_KU20 = 'https://stdregis.ku.ac.th/_Student_RptKu.php?mode=KU20'
    this.isLogin = true
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
    const res = await axios(options)
    const { data } = res
    if (data.includes('Login')) this.isLogin = false
    else this.isLogin = true
  }

  logout() {
    chrome.storage.sync.clear(function () {
      console.log('clear!!')
    })
    this.isLogin = false
  }

  async fetchGrades() {
    const res = await axios.get(this.URL_KU20)
    const { data } = res
    if (data.includes('Login')) {
      this.isLogin = false
      console.log('cant fetch!! (require login)')
      return null
    } else this.isLogin = true
    const root = parse(data).removeWhitespace()
    const reverseElems = root.lastChild.querySelectorAll('tr').reverse()
    const titleElemIndex = reverseElems.findIndex((tr) => tr.childNodes.length <= 1)
    const lastTermGrades = reverseElems
      .slice(0, titleElemIndex)
      .map((subject) => this.extractInfo(subject))
      .reverse()
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
