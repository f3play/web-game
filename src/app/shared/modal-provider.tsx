"use client"

import { createContext, useState } from "react"

import { Modal, ModalProps } from "@/components/ui/modal"

export interface ModalOptions {
  title?: string
  centerVertical?: boolean
  dismissable?: boolean
}

function defaultOpen<T>(
  children: React.ReactNode,
  opts: ModalOptions = {},
): Promise<T | undefined> {
  console.log("open modal")
  return new Promise((resolve) => {})
}

function defaultResolve<T>(value?: T) {
  console.log("resolve modal", value)
}

function defaultClose() {
  console.log("close modal")
}

export const ModalContext = createContext<{
  open: typeof defaultOpen
  resolve: typeof defaultResolve
  close: typeof defaultClose
}>({ open: defaultOpen, resolve: defaultResolve, close: defaultClose })

let resolveFunc: ((value?: any) => void) | undefined = undefined

export function ModalContextProvider({ children }: React.PropsWithChildren) {
  const [modal, setModal] = useState<ModalProps | undefined>()

  function resolveModal(value?: unknown) {
    setModal(undefined)
    resolveFunc?.(value)
  }

  function closeModal() {
    setModal(undefined)
    resolveModal?.(undefined)
  }

  function openModal<T>(
    comp: React.ReactNode,
    opts: ModalOptions = {},
  ): Promise<T> {
    const props = {
      ...opts,
      onDismiss: () => {
        if (opts.dismissable !== false) closeModal?.()
      },
      children: comp,
    }

    return new Promise<T>((resolve, reject) => {
      resolveFunc = resolve
      setModal(props)
    })
  }

  return (
    <ModalContext.Provider
      value={{
        open: openModal,
        resolve: resolveModal,
        close: closeModal,
      }}
    >
      {children}
      {modal && <Modal {...modal} />}
    </ModalContext.Provider>
  )
}
