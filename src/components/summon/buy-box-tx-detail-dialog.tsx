import { Dialog, Transition } from "@headlessui/react"
import {Fragment, useCallback, memo, useState, useEffect} from "react"
import { ethers } from "ethers"
import {formatDecimalString, CHAIN_TX_URL} from "@/utils"
import {addEdge, Background, Controls, MiniMap, ReactFlow, useEdgesState, useNodesState} from "reactflow";
import TxHyperLink from "@/components/ui/scan-hyperlink";
import {Close} from "@/components/icons/close";



const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Node 0' },
    position: { x: 250, y: 5 },
    className: 'light',
  },
  {
    id: '2',
    data: { label: 'Group A' },
    position: { x: 100, y: 100 },
    className: 'light',
    style: { backgroundColor: 'rgba(255, 0, 0, 0.2)', width: 200, height: 200 },
  },
  {
    id: '2a',
    data: { label: 'Node A.1' },
    position: { x: 10, y: 50 },
    parentNode: '2',
  },
  { id: '3', data: { label: 'Node 1' }, position: { x: 320, y: 100 }, className: 'light' },
  {
    id: '4',
    data: { label: 'Group B' },
    position: { x: 320, y: 200 },
    className: 'light',
    style: { backgroundColor: 'rgba(255, 0, 0, 0.2)', width: 300, height: 300 },
  },
  {
    id: '4a',
    data: { label: 'Node B.1' },
    position: { x: 15, y: 65 },
    className: 'light',
    parentNode: '4',
    extent: 'parent',
  },
  {
    id: '4b',
    data: { label: 'Group B.A' },
    position: { x: 15, y: 120 },
    className: 'light',
    style: { backgroundColor: 'rgba(255, 0, 255, 0.2)', height: 150, width: 270 },
    parentNode: '4',
  },
  {
    id: '4b1',
    data: { label: 'Node B.A.1' },
    position: { x: 20, y: 40 },
    className: 'light',
    parentNode: '4b',
  },
  {
    id: '4b2',
    data: { label: 'Node B.A.2' },
    position: { x: 100, y: 100 },
    className: 'light',
    parentNode: '4b',
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e2a-4a', source: '2a', target: '4a' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e3-4b', source: '3', target: '4b' },
  { id: 'e4a-4b1', source: '4a', target: '4b1' },
  { id: 'e4a-4b2', source: '4a', target: '4b2' },
  { id: 'e4b1-4b2', source: '4b1', target: '4b2' },
];


export default function BuyBoxTxDetailDialog({
  isOpen,
  setIsOpen,
  totalAmount,
  txHash,
}: {
  isOpen: boolean
  setIsOpen: any
  totalAmount: bigint
  txHash: string
}) {
  const poolReward =  (BigInt(totalAmount) * BigInt(94)) / BigInt(100) 
  const feeReward = totalAmount - poolReward
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[#0D1321] bg-opacity-80" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="grid w-5/12 transform grid-cols-1 place-content-center gap-5 overflow-hidden rounded-2xl pb-5
                     align-middle shadow-xl transition-all dark:bg-gray-700"
              >
                <div className={"title bg-[#0D1321]/60 p-5 relative"}>
                  <p className={"text-2xl font-semibold"}>
                    Transaction Summary
                  </p>
                  <Close
                    className={
                      "absolute right-4 top-4 h-5 w-5 text-slate-400 opacity-80 hover:scale-105 hover:opacity-100"
                    }
                    onClick={() => {
                      setIsOpen(false)
                    }}
                  ></Close>
                </div>
                <div className={"w-full px-5 pb-5 text-sm uppercase"}>
                  <div className={"mx-auto text-slate-100 text-lg"}>
                    <p className={'text-xl'}>Total Amount</p>
                    <p className={'text-amber-400/90'}>{ethers.formatEther(totalAmount)}</p>
                    <TxHyperLink txHash={txHash}/>
                  </div>
                  <div className={"grid grid-cols-2 mt-3 text-xs border-t border-slate-500 py-3 w-8/12 mx-auto"}>
                    <p className={'text-slate-400'}>Pool Reward</p>
                    <p className={'text-slate-400'}>Fee</p>
                    <p className={'text-amber-400/90 subpixel-antialiased'}>{ethers.formatEther(poolReward)}</p>
                    <p className={'text-amber-400/90 subpixel-antialiased'}>{ethers.formatEther(feeReward)}</p>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
