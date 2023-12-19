import {useRouter} from "next/router";
import Image from "next/image";

export function Footer() {
  const router = useRouter()
  return (
    <div className="bg-white-300 pt-18 mx-auto border-solid border-t border-gray-400">
      <div
        className="max-w-screen-xl w-9/12 mx-auto px-6 sm:px-8 lg:px-16 grid grid-rows-6 sm:grid-rows-1 grid-flow-row sm:grid-flow-col grid-cols-3 sm:grid-cols-12 gap-4 pb-16 pt-[32px]">
        <div className="row-span-2 sm:col-span-4 col-start-1 col-end-4 sm:col-end-5 flex flex-col items-start ">
          <div
            className="col-start-1 col-end-2 flex items-center cursor-pointer"
            onClick={() => router.push('/')}
          >
            <Image src={"/assets/Icon/suipanda-logo.png"} alt={"logo"} width={280} height={280}/>
            <span className="self-center text-xl font-bold whitespace-nowrap dark:text-white">
              Biaoqing
            </span>
          </div>
          {" "}
          <p className="mb-4 pl-2 mt-2">Unlock the World of NFT Pandas and Experience Endless Fun!
          </p>
          <div className="flex w-full mt-2 mb-8 -mx-2">
          </div>
          <p className="text-gray-400">
            {/*©{new Date().getFullYear()} - Biaoqing*/}
          </p>
        </div>
        <div className=" row-span-2 sm:col-span-2 sm:col-start-7 sm:col-end-9 flex flex-col">
          <ul className="text-black-500 ">
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Mint
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Mix
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Collection
            </li>
          </ul>
        </div>
        <div className="row-span-2 sm:col-span-2 sm:col-start-9 sm:col-end-11 flex flex-col">
          <ul className="text-black-500">
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Sui Documentation
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Move Documentation
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Join the Discord
            </li>
          </ul>
        </div>
        <div className="row-span-2 sm:col-span-2 sm:col-start-11 sm:col-end-13 flex flex-col">
          <ul className="text-black-500">
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              FAQ
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              About
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}