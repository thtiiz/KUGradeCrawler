// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict'

import { login, getGrades } from './util'
import qs from 'qs'

const saveToLocal = (grades) => {
  chrome.storage.sync.set({ grades: qs.stringify({ values: grades }) }, function () {
    console.log('saved!!')
  })
  chrome.storage.sync.get('grades', function (result) {
    const grades = qs.parse(result['grades'])
  })
}

chrome.runtime.onInstalled.addListener(async function () {
  chrome.storage.sync.set({ color: '#3aa757' }, function () {
    console.log('The color is green.', new Date())
  })
  console.log('onInstalled....')
  await login()
  const grades = await getGrades()
  saveToLocal(grades)
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
