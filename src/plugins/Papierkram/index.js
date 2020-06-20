import PapierkramHelpers from '@/plugins/Papierkram/helpers/PapierkramHelpers'

import { authenticate } from '@/plugins/Papierkram/authenticate'
import { getTrackerEntries } from '@/plugins/Papierkram/trackerEntries'
import { getProjects, getProject } from '@/plugins/Papierkram/projects'
import { getTasks } from '@/plugins/Papierkram/tasks'


/**
 * Wrapper for Papierkram's inofficial API.
 * @see https://github.com/SimonIT/timetracker/blob/master/lib/api.dart
 */
class Papierkram {
  static authenticate = authenticate

  static getTrackerEntries = getTrackerEntries

  static getProjects = getProjects
  static getProject = getProject

  static getTasks = getTasks
}


export { Papierkram, PapierkramHelpers }