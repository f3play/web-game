import { useState } from 'react'
import NoBox from './NoBox'
import Image from 'next/image'
import BoxOpenedResult from '@/components/box/inventory/BoxOpenedResult'
import BoxOpenConfirmDialog from '@/components/box/inventory/BoxOpenConfirmDialog'
import { Box } from '@/models/box'

// @ts-ignore
export function BoxItem({ box, isSell }) {
  let [isOpen, setIsOpen] = useState(false)
  let [openBoxConfirm, setOpenBoxConfirm] = useState(false)
  return (
    <>
      <div
        className='bg-gradient-to-br from-text-500/40 to-text-500/10 box-card border-solid  rounded-lg p-[12px] shadow-black-500'>
        <div className='rounded-lg mb-[12px]'>
          <div className='box-image rounded-lg'>
            <Image
              src={box.img}
              alt={''}
              width={0}
              height={0}
              sizes='100vw'
              style={{ width: '100%', height: '50%' }} // optional
              className='rounded-lg max-h-[300px]'
            ></Image>
          </div>
        </div>
        {isSell &&
          <div onClick={() => setIsOpen(true)}
               className='border-solid border-[2px] border-text-500 rounded-lg text-text-500 cursor-pointer flex px-[16px] py-[4px] shadow-black-500 shadow-[1px_1px_0px_#121212] hover:font-bold hover:shadow-[2px_2px_0px_#121212]'>
            <p className='grow py-[8px] text-start text-xl'>Buy</p>
          </div> ||
          <div onClick={() => setOpenBoxConfirm(true)}
               className='border-solid border-[2px] border-text-500 rounded-lg text-text-500 cursor-pointer flex px-[16px] py-[4px] shadow-black-500 shadow-[1px_1px_0px_#121212] hover:font-bold hover:shadow-[2px_2px_0px_#121212]'>
            <p className='grow py-[8px] text-start text-xl'>Open</p>
          </div>
        }
      </div>
      <BoxOpenedResult isOpen={isOpen} setIsOpen={setIsOpen} />
      <BoxOpenConfirmDialog openBoxConfirm={openBoxConfirm} setOpenBoxConfirm={setOpenBoxConfirm} setIsOpen={setIsOpen}
                            box={box} />
    </>
  )
}

export default function BoxInventory(props: any) {
  let boxes: Box[] = [
    {
      uid: 1,
      img: '/assets/box/box-1.png',
      name: 'Pack 1',
      price: 2,
    }, {
      uid: 2,
      img: '/assets/box/box-2.png',
      name: 'Pack 5',
      price: 10,
    }, {
      uid: 3,
      img: '/assets/box/box-1.png',
      name: 'Pack 1',
      price: 2,
    }, {
      uid: 5,
      img: '/assets/box/box-2.png',
      name: 'Pack 5',
      price: 10,
    },
  ]
  const [hasBox, setHasBox] = useState(() => boxes.length > 0)

  const navigateToBuyBox = () => {
    props.buyBoxAction()
  }

  return (
    <div>
      {!hasBox ? (
        <NoBox buyBoxAction={navigateToBuyBox} />
      ) : (
        <div className={'w-11/12 mx-auto gap-y-4 grid'}>
          <div className={'list-box grid grid-cols-5 gap-3 text-xs relative'}>
            {boxes.map((item, idx) => {
              return (
                <>
                  <BoxItem key={idx} box={item} isSell={false} />
                </>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
