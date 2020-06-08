const key = 'overtimetrackr:signupData'

export default class LocalStorageSignupData {
  static get() {
    return JSON.parse(localStorage.getItem(key))
  }

  static set( newData ) {
    // First, get the current value
    const currentData = this.get()

    // Merge the new data and the current ones
    const newDataStr = JSON.stringify({ ...currentData, ...newData })

    // Set the new data
    localStorage.setItem(key, newDataStr)
  }
  
  static remove() {
    localStorage.removeItem(key)
  }
}