"use client"

import Image from "next/image"
import { Titan_One } from "next/font/google"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEllipsis } from "@fortawesome/free-solid-svg-icons"

const skranji = Titan_One({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
})

export default function HowToPlay() {
  function onNavigate() {
    window.open("https://ljie19175s-organization.gitbook.io/f3play/about-f3play/how-to-play", "_blank")
  }

  return (
    <>
      <div className="fixed bottom-2 z-40 h-14 w-fit -translate-y-1/2 pr-3 ltr:right-0 rtl:left-0 subpixel-antialiased">
        <button
          onClick={() => onNavigate()}
          data-tooltip={"HOW TO PLAY"}
          className={"tooltip h-14 w-14 rounded-lg bg-blue-600 hover:bg-blue-800 outline outline-gray-700 outline-offset-2"}
        >
          <Image
            className={"mx-auto h-8 w-8"}
            src={"/assets/Icon/question.svg"}
            alt={"question"}
            width={50}
            height={50}
          />
        </button>
      </div>
      {/*<div className="fixed bottom-2 z-40 h-14 w-fit -translate-y-1/2 pr-3 ltr:right-0 rtl:left-0">*/}
      {/*  <button*/}
      {/*    className={*/}
      {/*      "h-12 w-12 rounded-lg bg-blue-600 outline outline-offset-2 outline-gray-700"*/}
      {/*    }*/}
      {/*  >*/}
      {/*    <FontAwesomeIcon className={"text-xl"} icon={faEllipsis} />*/}
      {/*  </button>*/}
      {/*</div>*/}
    </>
  )
}
