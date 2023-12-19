import Image from "next/image"
import { motion } from "framer-motion"
import classNames from "classnames"
import Button from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTicket } from "@fortawesome/free-solid-svg-icons"

export default function GameResult({
  result,
  hasLottery,
}: {
  result: boolean
  hasLottery: boolean
}) {
  const router = useRouter()

  const backToTournament = () => {
    router.back()
  }

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
      <motion.div
        className="box"
        animate={{
          scale: [0.5, 1.2, 1],
          rotate: [0, 0, 0],
        }}
        transition={{
          duration: 1.3,
          ease: "easeInOut",
          times: [0, 0.4, 0.7],
        }}
      >
        <Image
          src={result ? "/assets/game/victory.png" : "/assets/game/defeat.png"}
          alt={""}
          width={200}
          height={200}
        ></Image>
        <div className="mt-[16px] grid grid-cols-4 px-[16px]">
          <div
            className={classNames(
              "text-md col-span-3 mt-[16px] text-center text-start font-bold uppercase text-white",
            )}
          >
            Battle Point
          </div>
          <div
            className={classNames(
              "text-md mt-[16px] text-center text-end font-bold uppercase text-green-500",
              result ? "text-green-500" : "text-red-500",
            )}
          >
            {result ? "+" : "-"}15
          </div>
          {hasLottery && (
            <div
              className={classNames(
                "text-md col-span-3 text-center text-start font-bold uppercase text-white",
              )}
            >
              Lottery ticket
            </div>
          )}
          {hasLottery && (
            <div className={"flex items-center text-sm "}>
              <div className="grow"></div>
              <p className={"mr-[4px] font-bold text-amber-400"}>1</p>
              <FontAwesomeIcon
                icon={faTicket}
                className={"h-5 w-5 text-amber-400"}
              />
            </div>
          )}
        </div>

        <div className="mx-auto flex">
          <Button
            shape={"rounded"}
            className="mx-auto mt-[32px] w-full uppercase"
            onClick={() => {
              backToTournament()
            }}
            size="small"
          >
            BACK TO TOURNAMENT
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
