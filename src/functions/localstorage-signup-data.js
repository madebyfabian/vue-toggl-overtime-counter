export default class LocalStorageSignupData {
  key = 'overtimetrackr:signupData'

  static get() {
    return JSON.parse(localStorage.getItem(this.key))
  }

  static set( newData ) {
    // First, get the current value
    const currentData = this.get()

    // Merge the new data and the current ones
    const newDataStr = JSON.stringify({ ...currentData, ...newData })

    // Set the new data
    localStorage.setItem(this.key, newDataStr)
  }
  
  static remove() {
    localStorage.removeItem(this.key)
  }
}