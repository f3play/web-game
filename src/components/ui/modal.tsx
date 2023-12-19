"use client"

import { Fragment } from "react"
import { Dialog } from "@/components/ui/dialog"
import { Transition } from "@/components/ui/transition"
import Button from "@/components/ui/button"
import { Close } from "@/components/icons/close"
import classNames from "classnames"

export interface ModalProps extends React.PropsWithChildren {
  title?: string
  centerVertical?: boolean
  onDismiss?: () => void
}

export function Modal({
  children,
  title,
  centerVertical = true,
  onDismiss,
}: ModalProps) {
  const dismiss = () => {
    onDismiss?.()
  }

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 h-full w-full overflow-y-auto overflow-x-hidden p-4 text-center sm:p-6 lg:p-8 xl:p-10 3xl:p-12"
        onClose={dismiss}
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
          <Dialog.Overlay className="fixed inset-0 z-40 cursor-pointer bg-gray-700 bg-opacity-80 backdrop-blur" />
        </Transition.Child>

        {/* This element is to trick the browser into centering the modal contents. */}
        {centerVertical && (
          <span className="inline-block h-full align-middle" aria-hidden="true">
            &#8203;
          </span>
        )}

        {/* This element is need to fix FocusTap headless-ui warning issue */}
        <div className="sr-only">
          <Button
            size="small"
            color="gray"
            shape="circle"
            onClick={dismiss}
            className="opacity-50 hover:opacity-80"
          >
            <Close className="h-auto w-[13px]" />
          </Button>
        </div>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-105"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-105"
        >
          <div className="relative z-50 inline-block w-full text-left align-middle xs:w-auto">
            {title && (
              <div
                className={"title rounded-t-xl bg-[#0D1321]/60 p-5 text-center"}
              >
                <p className={"font-semibold"}>{title}</p>
              </div>
            )}
            <div
              className={classNames(
                "mx-auto  bg-blue-950/60 p-5",
                title ? "rounded-b-xl" : "rounded-xl",
              )}
            >
              {children}
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}
