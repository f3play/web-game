import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Button } from '@/components/Base/Button'
import Image from 'next/image'
import { useRouter } from 'next/router'

// @ts-ignore
export default function BuyBoxConfirmDialog({ isOpen, setIsOpen, box }) {
  const router = useRouter()
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={() => {
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
            <div className='fixed inset-0 bg-text-500 bg-opacity-50' />
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
                  className='w-5/12 transform overflow-hidden rounded-2xl bg-primary-500 grid grid-cols-1 gap-5 place-content-center
                     align-middle shadow-xl transition-all pb-5'>
                  <div className={'title bg-text-500/20 p-5'}>
                    <p className={'text-2xl font-semibold'}>Do you want to buy this pack collection?</p>
                  </div>
                  <Image className={'mx-auto w-5/12 rounded-xl'} src={box.img} alt={'pack nfts'} width={500}
                         height={50} />
                  <div className={'actions flex w-full justify-center gap-2'}>
                    <Button onClick={() => {
                      setIsOpen(false)
                      router.reload()
                    }}>Buy</Button>
                    <Button onClick={() => setIsOpen(false)}>Close</Button>
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