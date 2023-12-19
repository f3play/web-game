import { ModalContext } from "@/app/shared/modal-provider"
import { useContext } from "react"

export const useModalContext = () => useContext(ModalContext)
