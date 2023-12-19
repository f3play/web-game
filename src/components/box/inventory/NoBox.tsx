import { Button } from '@/components/Base/Button'

import Image from 'next/image'

export default function NoBox(props: any) {
  const navigateToBuyBox = () => {
    props.buyBoxAction()
  }

  return (
    <div className="text-center">
      <div className="no-box-imf">
        <Image
          className="mx-auto"
          src={'/assets/opps.png'}
          alt=""
          width={350}
          height={350}
        ></Image>
      </div>
      <div className="text-xl font-bold">{'Oops, you don\'t have BOX yet!'}</div>
      <div className="mt-[16px]">
        <Button
          className="px-[48px] py-[8px] font-bold"
          onClick={navigateToBuyBox}
        >
          Buy BOX
        </Button>
      </div>
    </div>
  )
}
