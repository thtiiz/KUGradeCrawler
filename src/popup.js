import { login } from './util'
import qs from 'qs'
// document.getElementById('btn-login').addEventListener('click', onLogin)

appendGradeElems()

function appendGradeElems() {
  chrome.storage.sync.get('grades', function (result) {
    const grades = qs.parse(result['grades'])
    const table = document.getElementById('table-grades')
    grades.values.map((grade) => {
      table.appendChild(createGradeRow(grade))
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
  const res = await login(username, password)
}
