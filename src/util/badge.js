class Badge {
  constructor() {
    this.badge = chrome.browserAction
  }

  setAllRead() {
    chrome.storage.sync.get('grades', function (result) {
      const grades = result['grades']
      if (grades) {
        chrome.storage.sync.set({ seenGrades: grades.values }, function () {
          console.log('saved!!')
        })
      }
    })

    this.badge.setBadgeText({ text: '' }) // <-- set text to '' to remove the badge
  }

  setUnread(unreadItemCount) {
    if (unreadItemCount <= 0) {
      this.badge.setBadgeText({ text: '' })
    } else {
      this.badge.setBadgeBackgroundColor({ color: '#e15554' })
      this.badge.setBadgeText({ text: '' + unreadItemCount })
    }
  }

  updateUnread(newGrade) {
    chrome.storage.sync.get('seenGrades', (result) => {
      const seenGrades = result['seenGrades']
      let unreadCount
      if (!seenGrades) {
        unreadCount = newGrade.filter((detail) => detail[2] !== 'N').length
      } else {
        unreadCount = seenGrades.filter((detail, i) => detail[2] !== newGrade[i][2]).length
      }
      this.setUnread(unreadCount)
    })
  }
}

export default new Badge()
