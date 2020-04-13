import userManagement from './util/userManagement'
import qs from 'qs'

document.getElementById('btn-login').addEventListener('click', onLogin)

appendGradeElems()

function appendGradeElems() {
  // chrome.storage.sync.clear(function () {
  //   console.log('clear!!')
  // })
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
}