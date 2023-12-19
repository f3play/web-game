// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import {ConnectButton} from '@mysten/wallet-kit';

export function SuiConnectButton() {
  return (
    <ConnectButton
      style={{
        backgroundColor: '#b91c1c',
        borderRadius: 50,
        padding: 13,
      }}
    />
  );
}
