export enum SelectMethod {
  auto = 1,
  manual = 2,
}

export enum Step {
  one = 1,
  two = 2,
  three = 3,
}

export enum CollapseAddNew {
  activeKey = 'collapse-upload-csv',
}

export enum State {
  waiting = 'Waiting',
  ready = 'Ready',
  claimed = 'Claimed',
  expired = 'Expired',
  unknown = 'Unknown',
}

export const CURRENT_TIME = new Date().getTime()
