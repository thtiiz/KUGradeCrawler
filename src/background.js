// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict'

import userManagement from './util/userManagement'

function scheduleRequest() {
  console.log('schedule refresh alarm to 30 minutes...')
  chrome.alarms.create('refresh', { periodInMinutes: 0.1 })
}

chrome.runtime.onInstalled.addListener(function () {
  scheduleRequest()
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'refresh') console.log('fetch')
  // userManagement.fetchGrades()
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
