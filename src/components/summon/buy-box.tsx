import Image from 'next/image'
import {useState} from 'react'
import {Box} from '@/models/box'
import BuyBoxConfirmDialog from "@/components/summon/buy-box-confirm";
import {useMutation} from "react-query";
import Button from "@/components/ui/button";

export function SellBox({box}: { box: Box }) {
  let [buyBoxConfirm, setBuyBoxConfirm] = useState(false)
  return (
    <>
      <div className={'buy-box grid place-content-center gap-y-5'}>
        <Image className={'mx-auto rounded-xl shadow'} src={box.img}
               alt={'box-img'}
               width={250}
               height={50} priority={true}/>
        <Button className={'uppercase'} onClick={() => setBuyBoxConfirm(true)} shape={"rounded"} size={"medium"}>Buy
          Box</Button>
        <BuyBoxConfirmDialog isOpen={buyBoxConfirm} setIsOpen={setBuyBoxConfirm} box={box}/>
        {/*<Button onClick={() => {*/}
        {/*}} className={'rounded-xl mx-auto'}>2 SUI</Button>*/}
      </div>
    </>
  )
}

export default function BuyBox() {
  const packs: Box[] = [
    {
      uid: 1,
      name: 'Pack 2',
      price: 1,
      img: '/assets/box/box-1.png',
    }
  ]

  return (
    <div className={'grid grid-cols-1 gap-4'}>
      <div className='w-7/12 mx-auto dark:bg-light-dark  shadow p-5 rounded-xl'>
        <p className={'text-3xl font-semibold p-5 text-center mb-7 bt-3'}>Box Collections</p>
        <div className={'flex items-center justify-around mx-auto'}>
          {packs.map((pack, idx) => {
            return (
              <SellBox key={idx} box={pack}/>
            )
          })}
          {/*<div className={'buy-box grid place-content-center gap-y-5'}>*/}
          {/*  <Image className={'mx-auto rounded-xl shadow hover:scale-105'} src={'/assets/box/box-2.png'} alt={'box-img'}*/}
          {/*         width={250}*/}
          {/*         height={50} />*/}
          {/*  /!*<Button onClick={() => {*!/*/}
          {/*  /!*}} className={'rounded-xl mx-auto'}>10 SUI</Button>*!/*/}
          {/*  <div className={'flex items-center mx-auto gap-x-2'}>*/}
          {/*    <p className={''}>10 SUI</p>*/}
          {/*    <Image src={'/assets/tokens/sui.png'} alt={''} width={20} height={20} />*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  )
}
