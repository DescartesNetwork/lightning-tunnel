import { TypeDef } from '@project-serum/anchor/dist/cjs/program/namespace/types'

export enum SelectMethod {
  auto = 1,
  manual = 2,
}

export enum Step {
  zero = 0,
  one = 1,
  two = 2,
}

export enum CollapseAddNew {
  activeKey = 'collapse-upload-csv',
}

export type LightningTunnelCore = {
  version: '0.1.0'
  name: 'lightning_tunnel_core'
  instructions: [
    {
      name: 'initializeVault'
      accounts: [
        {
          name: 'authority'
          isMut: true
          isSigner: true
        },
        {
          name: 'vault'
          isMut: true
          isSigner: true
        },
        {
          name: 'mint'
          isMut: true
          isSigner: false
        },
        {
          name: 'treasurer'
          isMut: false
          isSigner: false
        },
        {
          name: 'treasury'
          isMut: true
          isSigner: false
        },
        {
          name: 'srcAssociatedTokenAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'tokenProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'associatedTokenProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'rent'
          isMut: false
          isSigner: false
        },
      ]
      args: [
        {
          name: 'signer'
          type: {
            array: ['u8', 64]
          }
        },
        {
          name: 'amountIn'
          type: 'u64'
        },
      ]
    },
    {
      name: 'deposit'
      accounts: [
        {
          name: 'authority'
          isMut: true
          isSigner: true
        },
        {
          name: 'vault'
          isMut: true
          isSigner: false
        },
        {
          name: 'treasurer'
          isMut: false
          isSigner: false
        },
        {
          name: 'mint'
          isMut: true
          isSigner: false
        },
        {
          name: 'treasury'
          isMut: true
          isSigner: false
        },
        {
          name: 'srcAssociatedTokenAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'tokenProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'associatedTokenProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'rent'
          isMut: false
          isSigner: false
        },
      ]
      args: [
        {
          name: 'amountIn'
          type: 'u64'
        },
      ]
    },
    {
      name: 'withdraw'
      accounts: [
        {
          name: 'authority'
          isMut: true
          isSigner: true
        },
        {
          name: 'vault'
          isMut: true
          isSigner: false
        },
        {
          name: 'treasurer'
          isMut: false
          isSigner: false
        },
        {
          name: 'mint'
          isMut: true
          isSigner: false
        },
        {
          name: 'treasury'
          isMut: true
          isSigner: false
        },
        {
          name: 'dstAssociatedTokenAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'tokenProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'associatedTokenProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'rent'
          isMut: false
          isSigner: false
        },
      ]
      args: [
        {
          name: 'amountOut'
          type: 'u64'
        },
      ]
    },
    {
      name: 'redeem'
      accounts: [
        {
          name: 'authority'
          isMut: true
          isSigner: true
        },
        {
          name: 'vault'
          isMut: true
          isSigner: false
        },
        {
          name: 'treasurer'
          isMut: false
          isSigner: false
        },
        {
          name: 'mint'
          isMut: true
          isSigner: false
        },
        {
          name: 'treasury'
          isMut: true
          isSigner: false
        },
        {
          name: 'dstAssociatedTokenAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'cert'
          isMut: true
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'tokenProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'associatedTokenProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'rent'
          isMut: false
          isSigner: false
        },
      ]
      args: [
        {
          name: 'cheque'
          type: {
            defined: 'ChequeTransferData'
          }
        },
        {
          name: 'signature'
          type: {
            array: ['u8', 64]
          }
        },
        {
          name: 'recoveryId'
          type: 'u8'
        },
      ]
    },
  ]
  accounts: [
    {
      name: 'cert'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'authority'
            type: 'publicKey'
          },
          {
            name: 'vault'
            type: 'publicKey'
          },
          {
            name: 'amount'
            type: 'u64'
          },
          {
            name: 'redeemTime'
            type: 'i64'
          },
        ]
      }
    },
    {
      name: 'chequeTransferData'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'authority'
            type: 'publicKey'
          },
          {
            name: 'vault'
            type: 'publicKey'
          },
          {
            name: 'dst'
            type: 'publicKey'
          },
          {
            name: 'amount'
            type: 'u64'
          },
          {
            name: 'startTime'
            type: 'i64'
          },
          {
            name: 'endTime'
            type: 'i64'
          },
          {
            name: 'vestingTime'
            type: 'i64'
          },
          {
            name: 'vestingNumber'
            type: 'u64'
          },
        ]
      }
    },
    {
      name: 'vault'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'authority'
            type: 'publicKey'
          },
          {
            name: 'signer'
            type: {
              array: ['u8', 64]
            }
          },
          {
            name: 'mint'
            type: 'publicKey'
          },
          {
            name: 'treasury'
            type: 'publicKey'
          },
          {
            name: 'reserve'
            type: 'u64'
          },
        ]
      }
    },
  ]
  errors: [
    {
      code: 6000
      name: 'InvalidPermission'
      msg: 'Not have permission!'
    },
    {
      code: 6001
      name: 'InvalidSigner'
      msg: 'Invalid signer!'
    },
    {
      code: 6002
      name: 'InvalidVault'
      msg: 'Invalid Vault!'
    },
    {
      code: 6003
      name: 'InvalidSrcAddress'
      msg: 'Cant not compare src_address with vault_owner'
    },
    {
      code: 6004
      name: 'InvalidDstAddress'
      msg: 'Cant not compare dst_address with payer'
    },
    {
      code: 6005
      name: 'ChequeExpired'
      msg: 'Cheque expired!'
    },
    {
      code: 6006
      name: 'NotEnoughBalance'
      msg: 'Cheque is not enough balance!'
    },
    {
      code: 6007
      name: 'VaultNotStart'
      msg: 'Vault is not start!'
    },
    {
      code: 6008
      name: 'EarlyRedeem'
      msg: 'Too early to redeem!'
    },
  ]
}

export type ChequeData = {
  transferData: string
  signature: string
  recoveryId: number
}

export type ChequeTransferData = TypeDef<
  LightningTunnelCore['accounts']['1'],
  LightningTunnelCore
>
