/// <reference types="@sentre/senhub" />

/**
 * Declare import csv
 */
declare module '*.csv' {
  const value: any
  export default value
}

interface Window {
  senUtility: import('@sentre/utility').Utility
}
