import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import Image from 'next/image'
import { Button } from '@/components/Base/Button'

// @ts-ignore
export default function BoxOpenConfirmDialog({ openBoxConfirm, setOpenBoxConfirm, box, setIsOpen }) {

  function onOpenBox() {
    setOpenBoxConfirm(false)
    setIsOpen(true)
  }

  return (
    <>
      <Transition appear show={openBoxConfirm} as={Fragment}>
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
                  className='w-4/12 transform overflow-hidden rounded-2xl bg-gray-700 grid grid-cols-1 gap-5 place-content-center
                     align-middle shadow-xl transition-all pb-5'>
                  <div className={'title bg-text-500/20 p-5'}>
                    <p className={'text-2xl font-semibold'}>Do you want to open this box?</p>
                  </div>
                  <Image className={'w-6/12 mx-auto rounded'} src={box.img} alt={'box nft'} width={500} height={500} />
                  <div className={'actions flex mx-auto w-full justify-center gap-2'}>
                    <Button className={'w-2/12'} onClick={onOpenBox}>Open</Button>
                    <Button className={'w-2/12'} onClick={() => setOpenBoxConfirm(false)}>Cancel</Button>
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