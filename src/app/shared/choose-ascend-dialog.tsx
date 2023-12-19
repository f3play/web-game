import {NFT} from '@/models/nft'
import {Dialog, Transition} from '@headlessui/react'
import {Fragment} from 'react'
import Image from 'next/image'
import Button from "@/components/ui/button";
import NftGrid from "../../components/my-nfts/nft-grid";

export default function ChooseAscendDialog({listHeroes, setHero, isOpen, setIsOpen, hero}: {
  listHeroes: NFT[],
  setHero: any,
  isOpen: boolean,
  setIsOpen: any,
  hero: NFT | null
}) {
  function checkExisted(id: number) {
    return hero && hero.id === id
  }

  function chosenStyle(id: number) {
    if (checkExisted(id)) {
      return 'opacity-40 grayscale '
    } else {
      return ''
    }
  }

  function onChoose(nft: NFT) {
    if (checkExisted(nft.id)) {
      setHero(null)
    } else {
      setHero(nft)
    }
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={() => {
          setIsOpen(false)
        }}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-[#0D1321] bg-opacity-80'/>
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel
                  className='w-8/12 scale-75 transform overflow-hidden rounded-2xl bg-gray-700 grid grid-cols-1 gap-5 place-content-center
                     align-middle shadow-xl transition-all pb-5'>
                  <div className={'title bg-[#0D1321]/60 p-5'}>
                    <p className={'text-2xl font-semibold'}>Choose Ascend Hero</p>
                  </div>
                  <div
                    className={'w-11/12 grid lg:grid-cols-4 xl:grid-cols-5 h-96 overflow-auto gap-5 p-5 rounded-xl mx-auto text-xs bg-blue-950/60'}>
                    {listHeroes.map((hero, idx) => {
                      return (
                        <div key={hero.id} className={'relative hover:cursor-pointer'}
                             onClick={() => onChoose(hero)}>
                          {checkExisted(hero.id) &&
                              <Image alt={'checked'} src={'/assets/Icon/checked.svg'}
                                     className={'absolute top-1/2 left-1/2 z-30 transform -translate-x-1/2 -translate-y-1/2'}
                                     width={50} height={50}/>
                          }
                          <NftGrid nft={hero} className={checkExisted(hero.id) && 'opacity-25' || ''} detailNavigate={false}/>
                        </div>
                      )
                    })}
                  </div>
                  <div className={'actions flex mx-auto w-full justify-center gap-2'}>
                    <Button shape={"rounded"} size={"large"} onClick={() => setIsOpen(false)}>Confirm</Button>
                    <Button shape={"rounded"} size={"large"} onClick={() => setIsOpen(false)}>Close</Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}