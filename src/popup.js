import userManager from './util/userManager'
import badge from './util/badge'

document.getElementById('login-form').addEventListener('submit', handleForm)
document.getElementById('btn-logout').addEventListener('click', onLogout)
document.addEventListener('DOMContentLoaded', (event) => {
  handleGrades()
  badge.setAllRead()
  setInterval(() => {
    const tableElem = document.getElementById('grades-table')
    tableElem.innerHTML = ''
    handleGrades()
  }, 2 * 60000)
})

function handleForm(e) {
  e.preventDefault()
  onLogin()
}

function handleGrades() {
  const gradesElem = document.getElementById('grades')
  const btnLogin = document.getElementById('btn-logout')
  const loginSection = document.getElementById('login-section')
  chrome.storage.sync.get('isLogin', (result) => {
    const isLogin = result['isLogin']
    console.log('islogin', isLogin)
    if (isLogin) {
      appendGradeElems()
      loginSection.setAttribute('class', 'inactive')
      gradesElem.setAttribute('class', 'active')
      btnLogin.setAttribute('class', 'btn btn-danger')
    } else {
      loginSection.setAttribute('class', 'active')
      gradesElem.setAttribute('class', 'inactive')
      btnLogin.setAttribute('class', 'inactive')
    }
  })
}

function refresh() {
  userManager.fetchGrades()
}

function onLogout() {
  const tableElem = document.getElementById('grades-table')
  tableElem.innerHTML = ''
  userManager.logout()
  handleGrades()
}

function appendGradeElems() {
  chrome.storage.sync.get('grades', function (result) {
    const grades = result['grades']
    const tableElem = document.getElementById('grades-table')
    const timestampElem = document.getElementById('grades-timestamp')
    timestampElem.innerHTML = new Date(grades.timestamp)
    grades.values.map((grade) => {
      tableElem.appendChild(createGradeRow(grade))
    })
  })
}

function createGradeRow(grade) {
  let tr = document.createElement('tr')
  let tdArr = []
  tdArr = grade.map((detail) => {
    let td = document.createElement('td')
    td.innerHTML = detail
    return td
  })
  tdArr.map((td) => {
    tr.appendChild(td)
  })
  if (tdArr[2].innerHTML !== 'N') {
    tr.setAttribute('class', 'announced')
  }
  return tr
}

async function onLogin() {
  const username = document.getElementById('input-username').value
  const password = document.getElementById('input-password').value
  await userManager.login(username, password)
  await userManager.fetchGrades()
  handleGrades()
}
