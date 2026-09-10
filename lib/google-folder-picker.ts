'use client'

type PickerConfiguration = {
  accessToken: string
  apiKey: string
  appId: string
  folderIds: string[]
}
let loading: Promise<void> | undefined
function loadPicker() {
  if (typeof google !== 'undefined' && google.picker) return Promise.resolve()
  if (!loading) {
    loading = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      const timeout = window.setTimeout(() => {
        script.remove()
        reject(
          new Error('Google folder selection timed out. Please try again.'),
        )
      }, 20000)
      const fail = () => {
        clearTimeout(timeout)
        script.remove()
        reject(
          new Error(
            'Google folder selection could not load. Please try again.',
          ),
        )
      }
      script.src = 'https://apis.google.com/js/api.js'
      script.async = true
      script.onerror = fail
      script.onload = () =>
        gapi.load('picker', {
          callback: () => {
            clearTimeout(timeout)
            resolve()
          },
          onerror: fail,
          timeout: 15000,
          ontimeout: fail,
        })
      document.head.appendChild(script)
    }).catch((error) => {
      loading = undefined
      throw error
    })
  }
  return loading
}
export async function selectResultFolders(config: PickerConfiguration) {
  await loadPicker()
  // One folder at a time avoids requiring multi-select on phones.
  for (const folderId of config.folderIds) {
    await new Promise<void>((resolve, reject) => {
      const view = new google.picker.DocsView(google.picker.ViewId.FOLDERS)
        .setIncludeFolders(true)
        .setSelectFolderEnabled(true)
        .setFileIds(folderId)
      const picker = new google.picker.PickerBuilder()
        .setTitle('Select the club results folder to allow uploads')
        .setAppId(config.appId)
        .setDeveloperKey(config.apiKey)
        .setOAuthToken(config.accessToken)
        .setOrigin(window.location.origin)
        .addView(view)
        .setCallback((data) => {
          if (data.action === google.picker.Action.CANCEL) {
            picker.dispose()
            reject(
              new Error(
                'Folder selection cancelled. Your draft is safe and you can still download a PDF.',
              ),
            )
          } else if (data.action === google.picker.Action.PICKED) {
            picker.dispose()
            if (data.docs?.length === 1 && data.docs[0].id === folderId)
              resolve()
            else
              reject(
                new Error(
                  'Select the designated club results folder, then try saving again.',
                ),
              )
          }
        })
        .build()
      picker.setVisible(true)
    })
  }
}
