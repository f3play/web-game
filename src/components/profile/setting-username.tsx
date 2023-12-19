import { Transition } from "@/components/ui/transition"
import { Fragment, useState } from "react"
import { Dialog } from "@/components/ui/dialog"
import Button from "@/components/ui/button"
import { ethers } from "ethers"
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi"
import { F3CenterContract } from "@/config/contracts"
import toast from "react-hot-toast"
import {Address} from "@/models";

export default function SettingUsername({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: any
}) {
  const { address } = useAccount()
  let [username, setUsername] = useState("")
  
  const {data: updateFee} = useContractRead({
    ...F3CenterContract,
    functionName: "UPDATE_NICKNAME_FEE",
  })

  const usernameQuery = useContractRead({
    ...F3CenterContract,
    functionName: "addressToName",
    args: [address as Address],
    onSuccess: (result) => {
      setUsername(ethers.decodeBytes32String(result))
    }
  })


  const {
    write,
    isLoading: openLoading,
    data: buyData,
  } = useContractWrite({
    ...F3CenterContract,
    functionName: "setNickname",
    args: [ethers.encodeBytes32String(username) as Address],
  })

  const { isLoading: handleTxLoading, isSuccess: openSuccess } =
    useWaitForTransaction({
      hash: buyData?.hash,
      onSuccess: () => {},
    })

  function onUpdateUserName() {
    if (!username || username === "") {
      toast.error("username input is empty")
      return
    }
    write?.()
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40"
          onClose={() => {
            // setIsOpen(false)
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[#0D1321] bg-opacity-80" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-1.5 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="grid w-4/12 transform grid-cols-1 place-content-center rounded-2xl
                     bg-gray-700 pb-5 align-middle shadow-xl transition-all"
                >
                  <div className={"title bg-[#0D1321]/60 p-5"}>
                    <p className={"text-2xl font-semibold"}>Update username</p>
                  </div>
                  <div>
                    <div className={"mx-auto mt-5 w-10/12"}>
                      <label
                        htmlFor="last_name"
                        className="mb-2 block text-left font-medium text-gray-900 dark:text-white"
                      >
                        New Username
                      </label>
                      <input
                        type="text"
                        id="last_name"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3.5 text-gray-900
                         focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white
                          dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        placeholder="New username..."
                        required
                      />
                    </div>
                  </div>
                  <div
                    className={
                      "actions mx-auto mt-5 flex items-center justify-center gap-2"
                    }
                  >
                    <Button
                      shape={"rounded"}
                      size={"small"}
                      className={"w-4/12"}
                      disabled={handleTxLoading || openLoading}
                      isLoading={handleTxLoading || openLoading}
                      onClick={() => onUpdateUserName()}
                    >
                      Update
                    </Button>
                    <Button
                      shape={"rounded"}
                      size={"small"}
                      onClick={() => {}}
                      color={'danger'}
                      className={"w-4/12"}
                      disabled={handleTxLoading || openLoading}
                      isLoading={handleTxLoading || openLoading}
                    >
                      Cancel
                    </Button>
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
