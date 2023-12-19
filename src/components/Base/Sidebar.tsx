import Image from 'next/image'
import { SuiConnectButton } from '@/components/Base/SuiConnectButton'
import React from 'react'
import { useRouter } from 'next/router'

const navbars = [
  {
    name: 'Dashboard',
    route: '/',
    img: '/assets/Icon/game-machine.png',
  },
  {
    name: 'Evolve Heroes',
    route: '/level-up',
    img: '/assets/Icon/level-up.svg',
  },
  {
    name: 'Tournament',
    route: '/tournament',
    img: '/assets/Icon/tournament.svg',
  },
  {
    name: 'Summon',
    route: '/boxes',
    img: '/assets/Icon/chest.png',
  },
  {
    name: 'My NFTs',
    route: '/my-nfts',
    img: '/assets/Icon/nfts.png',
  },
  {
    name: 'Marketplace',
    route: '/marketplace',
    img: '/assets/Icon/marketplace.svg',
  },
]
export default function Sidebar() {
  const router = useRouter()
  return (
    <aside id='default-sidebar'
           className='w-72 py-2 px-2 h-screen transition-transform -translate-x-full sm:translate-x-0 bg-text-500 text-primary-500'
           aria-label='Sidebar'>
      <div className='h-full px-3 py-4'>
        <div
          className={'mx-auto border-b border-[#64748b] pb-2 grid grid-cols-1 items-center gap-y-5'}>
          <div className={'flex flex-nowrap items-center hover:cursor-pointer'} onClick={() => router.push('/')}>
            <Image src={'/assets/Icon/panda-thug.png'} alt={''} width={70} height={70} />
            <p className={'font-bold text-2xl'}>Panda Sui</p>
          </div>
          <div className={'mx-auto'}>
            <SuiConnectButton></SuiConnectButton>
          </div>
        </div>
        <ul className='space-y-3 font-medium min-h-[70vh] mt-14'>
          {navbars.map((item, idx) => {
            return (
              <li key={idx}
                  className={'hover:bg-minor-500/40 bg-transparent/20 transition duration-200 shadow rounded py-2 px-4 flex gap-3 hover:cursor-pointer items-center'}
                  onClick={() => router.push(item.route)}>
                <Image src={item.img} alt={''} height={30} width={30} />
                <span className='ml-3 text-sm'>{item.name}</span>
              </li>
            )
          })}
        </ul>
        <div className={'text-center text-primary-500 fixed w-full bottom-0 left-0 text-xs p-2'}>
          <p>V1.0</p>
        </div>
      </div>
    </aside>
  )
}