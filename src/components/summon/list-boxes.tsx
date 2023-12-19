import {useGridSwitcher} from "@/lib/hooks/use-grid-switcher";
import classNames from "classnames";
import {Box} from "@/models/box";
import BoxGrid from "@/components/summon/box-grid";
import React, {Fragment, useState} from "react";
import {useContractRead} from "wagmi";
import pandaBoxABI from '@/utils/panda-box.json'
import {ADDRESS_0} from "@/utils/tournament";

export default function BoxList({boxes, className}: { boxes: Box[], className?: string }) {
  const {isGridCompact} = useGridSwitcher()
  let [owner, setOwner] = useState('')
  let [boxBalance, setBoxBalance] = useState<number>(0)
  const query = useContractRead({
    abi: pandaBoxABI,
    address: process.env.NEXT_PUBLIC_PANDA_BOX_ADDRESS || ADDRESS_0,
    functionName: 'BOX_PRICE',
    enabled: false
  })


  return (
    <div
      className={classNames(
        'grid gap-5 sm:grid-cols-3 md:grid-cols-4',
        isGridCompact
          ? '3xl:!grid-cols-5 4xl:!grid-cols-5'
          : '3xl:!grid-cols-4 4xl:!grid-cols-5',
        className,
      )}
    >
      {boxes.map((box) => (
        <BoxGrid key={box.uid} box={box}/>
      ))}
    </div>
  )
}