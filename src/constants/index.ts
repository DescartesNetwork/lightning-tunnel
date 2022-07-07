export enum SelectMethod {
  auto = 1,
  manual = 2,
}

export enum Step {
  SelectMethod = 1,
  AddRecipient = 2,
  ConfirmTransfer = 3,
}

export enum CollapseAddNew {
  activeKey = 'collapse-upload-csv',
}

export enum State {
  waiting = 'Waiting',
  ready = 'Ready',
  claimed = 'Claimed',
  expired = 'Expired',
  loading = 'Loading',
}
export type Allocation = {
  name: string
  symbol: string
  amountToken: string
  usdValue: number
  ratio: number
}

export enum SIDE_BAR_ITEMS {
  Vesting = 'vesting',
  Dashboard = 'dashboard',
  Airdrop = 'airdrop',
}

export enum RecipientFileType {
  valid = 'valid',
  invalid = 'invalid',
}

export const ONE_DAY = 24 * 60 * 60 * 1000

export const FORMAT_DATE = 'MMM DD, YYYY HH:mm'

export const ALL = 'all'
