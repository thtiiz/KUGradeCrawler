import { login } from './util'

document.getElementById('btn-login').addEventListener('click', onLogin)

async function onLogin() {
  const username = document.getElementById('input-username').value
  const password = document.getElementById('input-password').value
  const res = await login(username, password)
}
