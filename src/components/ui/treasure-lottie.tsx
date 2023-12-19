import {useState} from "react";
import treasure from "@/assets/images/lottie/treasure.json";
import {useLottie} from "lottie-react";

export default function Treasure() {
  let [direction, setDirection] = useState(-1)

  const options = {
    animationData: treasure,
    autoPlay: false,
    // loop: true,
    // onLoopComplete: () => {
    //   setDirection((prev) => -prev)
    // },
  }
  const style = {
    height: 250,
  }

  const Lottie = useLottie(options, style)
  Lottie.setSpeed(0.02)
  Lottie.playSegments([1, 2])
  Lottie.playSegments([2, 1])
  Lottie.setDirection(direction)
  return Lottie.View
}
