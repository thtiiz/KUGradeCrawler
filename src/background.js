// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict'

import userManager from './util/userManager'

function scheduleRequest() {
  console.log('schedule refresh alarm to 2 minutes...')
  chrome.alarms.create('refresh', { periodInMinutes: 2 })
}

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.clear(function () {
    console.log('clear!!')
  })
  userManager.setIsLogin(false)
  scheduleRequest()
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'refresh') {
    console.log('fetch')
    userManager.fetchGrades()
  }
})

chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    const refererIndex = details.requestHeaders.findIndex((header) => header.name === 'Referer')
    const referer = 'https://stdregis.ku.ac.th/_Student_RptKu.php'
    // not found Referer header
    if (refererIndex === -1) details.requestHeaders.push({ name: 'Referer', value: referer })
    return { requestHeaders: details.requestHeaders }
  },
  { urls: ['https://stdregis.ku.ac.th/_Student_RptKu.php?mode=KU20'] },
  ['requestHeaders', 'blocking', 'extraHeaders']
)
