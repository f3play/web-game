// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from 'react'
import { Spinner } from './Spinner'
import classNames from 'classnames'

export function Button({
                         children,
                         loading,
                         className,
                         disabled,
                         onClick,
                         ...props
                       }: {
  children: ReactNode
  loading?: boolean
  className?: string
  onClick: () => Promise<void> | void
  disabled?: boolean
}) {
  return (
    <button
      className={classNames(
        className,
        'ease-in-out duration-300 disabled:opacity-30 rounded border py-2 px-4 bg-gray-200 border-text-500 shadow-black-500 shadow-[1px_1px_0px_#121212] hover:text-white hover:bg-text-500',
      )}
      onClick={onClick}
      disabled={!!disabled}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  )
}
