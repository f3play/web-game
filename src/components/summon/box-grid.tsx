import {Box} from "@/models/box";
import classNames from "classnames";
import AnchorLink from "@/components/ui/links/anchor-link";
import Image from "next/image";
import Button from "@/components/ui/button";
import {useState} from "react";
import BoxOpenConfirmDialog from "@/components/summon/open-box-confirm";
import OpenBoxResultDialog from "@/components/summon/open-box-result";

type BoxGridProps = {
  box: Box
}
export default function BoxGrid(props: BoxGridProps) {
  let [openBoxConfirm, setOpenBoxConfirm] = useState(false)
  let [openBoxResult, setOpenBoxResult] = useState(false)
  return (
    <div
      className={classNames('relative overflow-hidden rounded-lg bg-white transition-all duration-200 hover:shadow-large dark:bg-light-dark shadow')}>
      <Image className={'relative block w-full'} src={props.box.img} width={450} height={450} alt='' priority={true}/>
      <div className='p-5'>
        <AnchorLink
          href='/nft-details'
          className='text-lg font-medium text-black dark:text-white'
        >
          {props.box.name}
        </AnchorLink>
      </div>
      <div className={'mt-5 p-2'}>
        <Button
          size="medium"
          shape="rounded"
          fullWidth={true}
          className="uppercase"
          onClick={() => setOpenBoxConfirm(true)}
        >
          Open
        </Button>
      </div>
    </div>
  )
}