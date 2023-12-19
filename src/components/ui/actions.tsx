"use client"

import Image from "@/components/ui/image"
import { ArrowUp } from "@/components/icons/arrow-up"
import { A11y, Scrollbar } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import { useRouter } from "next/navigation"

export type ActionCardProp = {
  name: string
  img: string
  route: string
}

export function CoinCard({
  name,
  symbol,
  logo,
  balance,
  usdBalance,
  change,
  isChangePositive,
  color = "#FDEDD4",
}: ActionCardProp) {
  return (
    <div
      className="relative rounded-lg p-6 xl:p-8"
      style={{ backgroundColor: color }}
    >
      <h4 className="mb-8 text-sm font-medium uppercase tracking-wider text-gray-900">
        {name}
      </h4>
      <div className="relative h-20 lg:h-24 xl:h-28 3xl:h-36">
        <Image src={logo} alt={name} height={112} priority />
      </div>
      <div className="mb-2 mt-8 text-sm font-medium tracking-wider text-gray-900 lg:text-lg 2xl:text-xl 3xl:text-2xl">
        {balance}
        <span className="uppercase"> {symbol}</span>
      </div>
      <div className="flex items-center justify-between text-xs font-medium 2xl:text-sm">
        <span className="tracking-wider text-gray-600">{usdBalance} USD</span>
        <span
          className={`flex items-center  ${
            isChangePositive ? "text-green-500" : "text-red-500"
          }`}
        >
          <span
            className={`ltr:mr-2 rtl:ml-2 ${
              !isChangePositive ? "rotate-180" : ""
            }`}
          >
            <ArrowUp />
          </span>
          {change}
        </span>
      </div>
    </div>
  )
}

interface ActionSliderProps {
  coins: ActionCardProp[]
}

export default function ActionSlider() {
  const router = useRouter()
  const sliderBreakPoints = {
    640: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 2,
      spaceBetween: 24,
    },
    1280: {
      slidesPerView: 2,
      spaceBetween: 24,
    },
    1536: {
      slidesPerView: 4,
      spaceBetween: 24,
    },
    1700: {
      slidesPerView: 4,
      spaceBetween: 24,
    },
    2200: {
      slidesPerView: 4,
      spaceBetween: 24,
    },
  }

  return (
    <div>
      <Swiper
        modules={[Scrollbar, A11y]}
        spaceBetween={24}
        slidesPerView={1}
        scrollbar={{ draggable: true }}
        breakpoints={sliderBreakPoints}
        observer={true}
        dir="ltr"
        className="dark:[&_.swiper-scrollbar_>_.swiper-scrollbar-drag]:bg-body/50"
      >
        <SwiperSlide>
          <div
            className="relative h-56 w-56 rounded-lg bg-white p-6 shadow-card
             dark:bg-light-dark xl:p-8 2xl:h-72 2xl:w-72 3xl:h-[350px] 3xl:w-[350px]"
          >
            <div className={"mx-auto w-fit grid gap-y-5 font-semibold"}>
              {/*<Image*/}
              {/*  alt={"summon action"}*/}
              {/*  className={*/}
              {/*    "absolute left-1/2 top-1/2 z-30 w-8/12 -translate-x-1/2 -translate-y-1/2 transform" +*/}
              {/*    " mx-auto hover:scale-105"*/}
              {/*  }*/}
              {/*  src={"/assets/Icon/chest.svg"}*/}
              {/*  height={250}*/}
              {/*  width={250}*/}
              {/*/>*/}
              {/*<h4 className={"mx-auto w-fit font-semibold tracking-wider"}>*/}
              {/*  RANKING*/}
              {/*</h4>*/}
              <p className={'uppercase'}><span className={'text-green-600'}>Your rank:</span> 123</p>
              <p>Current tournament reward: 123</p>
              <p>Next tournament reward: 123</p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div
            className="relative h-56 w-56 rounded-lg bg-white p-6 shadow-card hover:cursor-pointer dark:bg-light-dark xl:p-8 2xl:h-72 2xl:w-72 3xl:h-[350px] 3xl:w-[350px]"
            onClick={() => router.push("/summon")}
          >
            <h4 className={"mx-auto w-fit font-semibold tracking-wider"}>
              SUMMON HEROES
            </h4>
            <Image
              alt={"summon action"}
              className={
                "absolute left-1/2 top-1/2 z-30 w-7/12 -translate-x-1/2 -translate-y-1/2 transform" +
                " mx-auto hover:scale-105"
              }
              src={"/assets/Icon/treasure.png"}
              height={250}
              width={250}
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div
            className="relative h-56 w-56 rounded-lg bg-white p-6 shadow-card hover:cursor-pointer dark:bg-light-dark xl:p-8 2xl:h-72 2xl:w-72 3xl:h-[350px] 3xl:w-[350px]"
            onClick={() => router.push("/tournament")}
          >
            <h4 className={"mx-auto w-fit font-semibold tracking-wider"}>
              BATTLE
            </h4>
            <Image
              alt={"tournament action"}
              className={
                "absolute left-1/2 top-1/2 z-30 mx-auto w-6/12 -translate-x-1/2 -translate-y-1/2 transform hover:scale-105"
              }
              src={"/assets/Icon/battle.svg"}
              height={250}
              width={250}
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div
            className="relative h-56 w-56 rounded-lg bg-white p-6 shadow-card hover:cursor-pointer dark:bg-light-dark xl:p-8 2xl:h-72 2xl:w-72 3xl:h-[350px] 3xl:w-[350px]"
            onClick={() => router.push("/marketplace")}
          >
            <h4 className={"mx-auto w-fit font-semibold tracking-wider"}>
              MARKETPLACE
            </h4>
            <Image
              alt={"ascend action"}
              className={
                "absolute left-1/2 top-1/2 z-30 transform" +
                " mx-auto w-6/12 -translate-x-1/2 -translate-y-1/2 hover:scale-105"
              }
              src={"/assets/Icon/marketplace.svg"}
              height={250}
              width={250}
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  )
}
