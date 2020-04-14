import qs from 'qs'
import axios from 'axios'
import { parse } from 'node-html-parser'
import badge from './badge'

class userManager {
  constructor() {
    this.URL_LOGIN = 'https://stdregis.ku.ac.th/_Login.php'
    this.URL_KU20 = 'https://stdregis.ku.ac.th/_Student_RptKu.php?mode=KU20'
    this.isLogin = false
    chrome.storage.sync.get('isLogin', (result) => {
      if (result['isLogin']) {
        this.isLogin = true
      } else {
        this.isLogin = false
      }
    })
  }

  extractInfo(tr) {
    return tr.childNodes.map((td) => td.text)
  }

  setIsLogin(isLogin) {
    chrome.storage.sync.set({ isLogin }, function () {
      console.log(`set isLogin to ${isLogin}`)
    })
    this.isLogin = isLogin
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
    const isLogin = !data.includes('Login')
    if (!isLogin) this.setIsLogin(false)
    else {
      this.setIsLogin(true)
      chrome.storage.sync.set({ username, password }, function () {
        console.log(`set username, password to storage`)
      })
    }
    return isLogin
  }

  logout() {
    chrome.storage.sync.clear(function () {
      console.log('clear!!')
    })
    this.setIsLogin(false)
  }

  async getStorage() {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(['username', 'password'], (result) => {
        if ((result['username'], result['password']))
          resolve({ username: result['username'], password: result['password'] })
        else reject("Can't get user from storage")
      })
    })
  }

  async fetchGrades() {
    const res = await axios.get(this.URL_KU20)
    const { data } = res
    if (data.includes('Login')) {
      const { username, password } = await this.getStorage()
      const isLogin = await this.login(username, password)
      if (!isLogin) {
        this.setIsLogin(false)
        console.log('cant fetch!! (require login)')
        return null
      }
    } else this.setIsLogin(true)
    const root = parse(data).removeWhitespace()
    const reverseElems = root.lastChild.querySelectorAll('tr').reverse()
    const titleElemIndex = reverseElems.findIndex((tr) => tr.childNodes.length <= 1)
    const newGrade = reverseElems
      .slice(0, titleElemIndex)
      .map((subject) => this.extractInfo(subject))
      .reverse()
    this.saveToLocal(newGrade)
    badge.updateUnread(newGrade)
  }

  saveToLocal(grades) {
    chrome.storage.sync.set({ grades: { values: grades, timestamp: new Date().toUTCString() } }, function () {
      console.log('saved!!')
    })
    chrome.storage.sync.get('grades', function (result) {
      const grades = result['grades']
    })
  }
}

export default new userManager()
