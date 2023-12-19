"use client"
import {
  useNFTUpgradeCost,
  useNFTUpgradeRequirement,
} from "@/hooks/useNFTUpgradeRequirement"
import Button from "@/components/ui/button"
import { MaterialNFT } from "./material-nft"
import {
  parseRarityToInt,
  useNFTAttribute,
  useNFTUpgradePreview,
} from "@/hooks/useNFT"
import Image from "next/image"
import { NftUpgradeStats } from "./nft-upgrade-stats"
import { SelectUpgradeNFTDialog } from "./select-upgrade-nft-dialog"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"
import { toast } from "react-hot-toast"
import { parseRarity } from "@/utils/nft"
import NftGrid from "@/app/shared/nft-grid"
import { useERC20ApprovalStatus } from "@/hooks/useERC20ApprovalStatus"
import { ethers } from "ethers"
import {
  PandaNFTAddress,
  PandaNFTContract,
  PandaTokenAddress,
  PandaTokenContract,
} from "@/config/contracts"
import { useERC20Balance } from "@/hooks/useERC20Balance"

export default function Evolve() {
  const params = useParams()
  const nftId = params.id

  const { nft: nftInfo, refetch } = useNFTAttribute(nftId)

  const { address: account } = useAccount()
  let [selectNFTDialog, setSelectNFTDialog] = useState(false)
  const upgradeRequirement = useNFTUpgradeRequirement(
    nftInfo?.level,
    nftInfo?.rarity,
  )
  const { data: upgradeCost, refetch: refetchCost } = useNFTUpgradeCost(
    nftInfo?.level,
  )
  let [materialSelected, setMaterialSelected] = useState([0, 0, 0, 0, 0])
  let [materialNFTs, setMaterialNFTs] = useState([])
  const [upgradeButtonText, setUpgradeButtonText] = useState("Upgrade")
  const { data: f3Balance } = useERC20Balance(PandaTokenAddress, account)

  const isEnoughF3 = () => {
    return f3Balance >= upgradeCost
  }

  const isEnough = () => {
    for (let i = 0; i < upgradeRequirement?.length; i++) {
      if (upgradeRequirement[i] !== materialSelected[i]) {
        return false
      }
    }
    return true
  }

  const getMaterialParam = () => {
    return materialNFTs
      .sort((a, b) =>
        parseRarityToInt(a.rarity) > parseRarityToInt(b.rarity) ? 1 : -1,
      )
      .map((item) => item.id)
  }

  const isApproveERC20 = useERC20ApprovalStatus(
    account,
    PandaNFTAddress,
    upgradeCost,
  )

  const checkUpgradeText = () => {
    if (!isApproveERC20) {
      setUpgradeButtonText("Approve")
    }
  }

  //---------- DEFINE CALL APPROVE ERC20 ------------
  const { config: approveERC20Config } = usePrepareContractWrite({
    ...PandaTokenContract,
    functionName: "approve",
    args: [PandaNFTAddress, ethers.MaxUint256],
  })

  const { data: approveData, write: callApproveERC20 } =
    useContractWrite(approveERC20Config)

  const { isLoading: approveLoading } = useWaitForTransaction({
    hash: approveData?.hash,
    onSuccess: (receipt) => {
      if (receipt.status == "success") {
        refetch()
        toast.success("Approve successfully")
      } else {
        toast.error("Failed to approve")
      }
    },
    onError: (error) => {
      console.log("approve error", error)
      toast.error("Failed to approve")
    },
  })
  //---------- END CALL APPROVE ERC20 ------------

  //---------- DEFINE CALL UPGRADE NFT ------------
  const { config: upgradeNftConfig } = usePrepareContractWrite({
    ...PandaNFTContract,
    functionName: "upgrade",
    args: [nftId, getMaterialParam()],
    enabled: isEnough() && isApproveERC20,
  })

  const { data: upgradeTxData, write: callUpgradeNft } =
    useContractWrite(upgradeNftConfig)

  const { isLoading: upgradeLoading } = useWaitForTransaction({
    hash: upgradeTxData?.hash,
    onSuccess: (receipt) => {
      if (receipt.status == "success") {
        refetch()
        setMaterialNFTs([])
        setMaterialSelected([0, 0, 0, 0, 0])
        toast.success("Upgrade successfully")
      } else {
        toast.error("Failed to upgrade")
      }
    },
    onError: (error) => {
      console.log("update defense team error", error)
      toast.error("Failed to upgrade")
    },
  })

  //---------- END CALL UPGRADE NFT ------------

  const { data: newAttribute } = useNFTUpgradePreview(
    account,
    BigInt(nftId),
    getMaterialParam(),
    isEnough(),
  )

  return (
    <div className="mx-auto w-9/12 rounded-lg bg-white px-[32px] py-[32px] shadow-card dark:bg-light-dark">
      <div className={"title mb-[16px] flex justify-center"}>
        <p className={"text-2xl font-semibold uppercase"}>Upgrade</p>
      </div>
      <div className="grid grid-cols-2 gap-[16px]">
        <div className="align-items-center">
          {nftInfo && (
            <NftGrid
              nft={nftInfo}
              className={"mx-auto h-full w-10/12"}
              nftId={nftId}
              detailNavigate={true}
              showActions={false}
              showAttribute={false}
            ></NftGrid>
          )}
        </div>
        <div className="col-span-1">
          <div className="mb-[16px] text-center text-2xl font-bold uppercase">
            {nftInfo.element} #{nftInfo.id?.toString()}
          </div>
          <div className="mx-auto mb-[16px] flex justify-center">
            {upgradeRequirement?.map((item, idx) => {
              return item > 0 ? (
                <MaterialNFT
                  key={idx}
                  rarity={parseRarity((idx + 1).toString())}
                  element={nftInfo?.element}
                  neededAmount={item}
                  availableAmount={materialSelected[idx]}
                  onClick={() => setSelectNFTDialog(true)}
                ></MaterialNFT>
              ) : (
                <div key={idx}></div>
              )
            })}
          </div>
          <div className="flex justify-center">
            <Image
              alt={"checked"}
              src={"/assets/Icon/plus.svg"}
              // className={'-translate-x-1/2 -translate-y-1/2 transform '}
              color={"green"}
              width={20}
              height={20}
            />
          </div>
          <div className="mb-[32px] mt-[16px] flex justify-center">
            <Image
              alt={"checked"}
              src={"/assets/Icon/logo.svg"}
              className={"mr-[8px] h-[48px] w-[48px]"}
              color={"green"}
              width={48}
              height={48}
            />
            <div className="my-auto items-center">
              <p className="text-2xl font-semibold">
                {parseFloat(ethers.formatEther(upgradeCost || "0")).toFixed(0)}
              </p>
            </div>
          </div>
          <div className="mb-[16px] mt-[64px]">
            <NftUpgradeStats
              attribute={"Level"}
              oldIndex={nftInfo?.level}
              newIndex={parseInt(nftInfo?.level || 0) + 1}
            ></NftUpgradeStats>
            <NftUpgradeStats
              attribute={"Attack"}
              oldIndex={nftInfo?.attack}
              newIndex={newAttribute?.attack || 0}
            ></NftUpgradeStats>
            <NftUpgradeStats
              attribute={"Defense"}
              oldIndex={nftInfo?.defense}
              newIndex={newAttribute?.defense || 0}
            ></NftUpgradeStats>
          </div>
          <div className="mx-auto mt-[32px] flex justify-center">
            <Button
              shape={"rounded"}
              size={"small"}
              onClick={() => {
                if (!isApproveERC20) {
                  return callApproveERC20()
                }
                if (!isEnoughF3()) {
                  return toast.error("Insufficient Balance")
                }
                callUpgradeNft()
              }}
              disabled={!isEnough() || upgradeLoading || approveLoading}
              isLoading={upgradeLoading || approveLoading}
              onMouseEnter={() => {
                checkUpgradeText()
              }}
              onMouseLeave={() => {
                setUpgradeButtonText("Upgrade")
              }}
            >
              {upgradeButtonText}
            </Button>
          </div>
          <SelectUpgradeNFTDialog
            nft={nftInfo}
            isOpen={selectNFTDialog}
            setIsOpen={setSelectNFTDialog}
            requirement={upgradeRequirement}
            materialSelected={materialSelected}
            updateMaterialSelected={(value: number[]) =>
              setMaterialSelected(value)
            }
            materialNFTs={materialNFTs}
            setMaterialNFTs={(value: any[]) => setMaterialNFTs(value)}
          ></SelectUpgradeNFTDialog>
        </div>
      </div>
    </div>
  )
}
