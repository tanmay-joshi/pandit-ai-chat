/**
 * Simple logger utility for debugging
 */

// Debug level determines what logs are shown
// 0 = errors only, 1 = warnings, 2 = info, 3 = debug, 4 = verbose
const DEBUG_LEVEL = 4;

export const logger = {
  error: (message: string, ...args: any[]) => {
    if (DEBUG_LEVEL >= 0) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  },
  
  warn: (message: string, ...args: any[]) => {
    if (DEBUG_LEVEL >= 1) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  
  info: (message: string, ...args: any[]) => {
    if (DEBUG_LEVEL >= 2) {
      console.log(`[INFO] ${message}`, ...args);
    }
  },
  
  debug: (message: string, ...args: any[]) => {
    if (DEBUG_LEVEL >= 3) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  },
  
  verbose: (message: string, ...args: any[]) => {
    if (DEBUG_LEVEL >= 4) {
      console.log(`[VERBOSE] ${message}`, ...args);
    }
  }
}; 