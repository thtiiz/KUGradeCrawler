import userManagement from './util/userManagement'
import qs from 'qs'

document.getElementById('login-form').addEventListener('submit', handleForm)
document.getElementById('btn-logout').addEventListener('click', onLogout)
document.getElementById('grades-refresh').addEventListener('click', refresh)
handleGrades()

function handleForm(e) {
  e.preventDefault()
  onLogin()
}

function handleGrades() {
  const gradesElem = document.getElementById('grades')
  if (userManagement.isLogin) {
    gradesElem.setAttribute('class', 'active')
  } else {
    gradesElem.setAttribute('class', 'inactive')
  }
}

function refresh() {
  userManagement.fetchGrades()
}

function onLogout() {
  userManagement.logout()
  handleGrades()
}

function appendGradeElems() {
  chrome.storage.sync.get('grades', function (result) {
    const grades = qs.parse(result['grades'])
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
  return tr
}

async function onLogin() {
  const username = document.getElementById('input-username').value
  const password = document.getElementById('input-password').value
  await userManagement.login(username, password)
  await userManagement.fetchGrades()
  appendGradeElems()
  handleGrades()
}
