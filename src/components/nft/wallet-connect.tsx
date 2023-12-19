"use client"

import { useWeb3Modal } from "@web3modal/react"
import { useAccount, useBalance, useDisconnect } from "wagmi"
import cn from "classnames"
import Button from "@/components/ui/button"
import { Menu } from "@/components/ui/menu"
import { Transition } from "@/components/ui/transition"
import { PowerIcon } from "@/components/icons/power"
import {formatDecimalString, CHAIN_SCAN_URL, startAndEnd} from "@/utils"
import { Copy } from "@/components/icons/copy"
import {useCopyToClipboard} from "react-use";
import toast from "react-hot-toast";

const attributeMapping = {
  element: 0,
  rarity: 1,
  attack: 2,
  defense: 3,
  exp: 4,
  level: 5,
}

export default function WalletConnect({
  btnClassName,
  anchorClassName,
}: {
  btnClassName?: string
  anchorClassName?: string
}) {
  const { address } = useAccount()
  const { open } = useWeb3Modal()
  const { data } = useBalance({
    address,
  })
  const { disconnect } = useDisconnect()
  const balance = data?.formatted
  const [_, copyToClipboard] = useCopyToClipboard()
  
  function onCopyAddress() {
    copyToClipboard(address as string)
    toast.success('Copied address')
  }
  return (
    <>
      {address ? (
        <div className="flex items-center gap-3 sm:gap-6 lg:gap-8">
          <div className="relative flex-shrink-0">
            <Menu>
              <Menu.Button
                className="block h-10 w-10 overflow-hidden rounded-full border-3 border-solid border-white
               bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-main transition-all
                hover:-translate-y-0.5 hover:shadow-large dark:border-gray-700 sm:h-12 sm:w-12"
              ></Menu.Button>
              <Transition
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-300"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-4"
              >
                <Menu.Items
                  className="absolute -right-0 mt-3 w-72 origin-top-right rounded-lg bg-white
                 shadow-large dark:bg-gray-900"
                >
                  <Menu.Item>
                    <Menu.Item>
                      <div className="border-b border-dashed border-gray-200 px-6 py-5 dark:border-gray-700">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-2 py-1 text-sm tracking-tighter dark:bg-gray-800 subpixel-antialiased">
                            <a href={CHAIN_SCAN_URL + address} target={'#'} className={"font-mono underline hover:text-blue-700"}>
                              {startAndEnd(address)}
                            </a>
                            <span onClick={onCopyAddress} className={'hover:text-blue-700'}>
                              <Copy />
                            </span>
                          </div>
                          {formatDecimalString(balance ? balance : "0")} BNB
                        </div>
                      </div>
                    </Menu.Item>
                  </Menu.Item>
                  <Menu.Item>
                    <div className="p-3">
                      <div
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900 transition hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800"
                        onClick={() => disconnect()}
                      >
                        <PowerIcon />
                        <span className="grow uppercase">Disconnect</span>
                      </div>
                    </div>
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => open()}
          className={cn("shadow-main hover:shadow-large", btnClassName)}
        >
          CONNECT
        </Button>
      )}
    </>
  )
}
