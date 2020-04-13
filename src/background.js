// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict'

import { login, getKU20 } from './util'

chrome.runtime.onInstalled.addListener(async function () {
  chrome.storage.sync.set({ color: '#3aa757' }, function () {
    console.log('The color is green.', new Date())
  })
  console.log('onInstalled....')
  await login()
  const ku20 = await getKU20()
})

chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    const refererIndex = details.requestHeaders.findIndex((header) => header.name === 'Referer')
    const referer = 'https://stdregis.ku.ac.th/_Student_RptKu.php'
    // not found Referer header
    if (refererIndex === -1) details.requestHeaders.push({ name: 'Referer', value: referer })
    console.log(details.requestHeaders)
    return { requestHeaders: details.requestHeaders }
  },
  { urls: ['https://stdregis.ku.ac.th/_Student_RptKu.php?mode=KU20'] },
  ['requestHeaders', 'blocking', 'extraHeaders']
)
