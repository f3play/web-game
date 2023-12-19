// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import {SuiConnectButton} from './SuiConnectButton';
import Image from "next/image";
import pandaThug from "../../../public/assets/Icon/panda-thug.png"
import {useRouter} from "next/navigation";

const headers = [
  {
    name: "Marketplace",
    route: "/marketplace"
  },
  {
    name: "Mint NFT",
    route: "/mint-nft"
  },
  {
    name: "Vesting",
    route: "/vesting"
  },
  {
    name: "About",
    route: "/about"
  },
]

export function Header() {
  // const navigate = useNavigate();
  const router = useRouter()

  // const location = useLocation();
  const isHome = true;

  return (
    <div className="border-b border-gray-400">
      <div className={"md:flex items-center gap-2 container py-4 mx-auto"}>
        <div className={"flex"}>
          <Image className={"px-3"} src={pandaThug} alt={"logo"} width={90} height={90}/>
          <button
            className="text-2xl font-bold text-center mr-3 bg-transparent ease-in-out duration-300 rounded border border-transparent py-2 bg-gray-200"
            onClick={() => router.push('/')}
          >
            Panda Sui
          </button>
        </div>
        <div className={"flex flex-nowrap gap-10 font-bold text-lg text-center items-center mx-auto"}>
          {headers.map((item, idx) => {
            return (
              <a key={idx} className={"hover:text-red-600 hover:cursor-pointer"}
                 onClick={() => router.push(item.route)}>{item.name}</a>
            )
          })}
        </div>
        <div className="ml-auto my-3 md:my-1">
          <SuiConnectButton></SuiConnectButton>
        </div>
      </div>
    </div>
  );
}
