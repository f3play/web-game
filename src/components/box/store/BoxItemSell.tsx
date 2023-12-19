import Image from 'next/image'

export interface IBoxItemInfo {
  name: string
}

export default function BoxItemSell({ itemInfo, ...props }: { itemInfo: any }) {
  return (
    <div
      className='bg-gradient-to-br from-text-500/40 to-text-500/10 box-card border-solid border-[2px] shadow-[1px_1px_0px_#121212] border-text-500 rounded-lg p-[12px] shadow-black-500 hover:shadow-[2px_2px_0px_#121212]'>
      <div className='font-bold text-lg mb-[8px]'>
        {itemInfo.name}
      </div>
      <div className='rounded-lg mb-[12px]'>
        <div className='box-image rounded-lg'>
          <Image
            src={itemInfo.image}
            alt={''}
            width={0}
            height={0}
            sizes='100vw'
            style={{ width: '100%', height: '50%' }} // optional
            className='rounded-lg max-h-[300px]'
          ></Image>
        </div>
      </div>
      <div
        className='border-solid border-[2px] border-text-500 rounded-lg text-text-500 cursor-pointer flex px-[16px] py-[4px] shadow-black-500 shadow-[1px_1px_0px_#121212] hover:font-bold hover:shadow-[2px_2px_0px_#121212]'>
        <p className='grow py-[8px] text-start text-xl'>Buy Now</p>
        <div className='box-price py-[8px] flex'>
          <Image
            src='/assets/tokens/sui.png'
            alt={''}
            width={0}
            height={0}
            sizes='100vw'
            style={{ width: '100%', height: 'auto' }} // optional
            className='max-w-[24px] mr-[4px]'
          ></Image>
          <span className='text-xl'>{itemInfo.price}</span>
        </div>
      </div>
    </div>
  )
}
