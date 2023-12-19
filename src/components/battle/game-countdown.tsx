import { formatTimeNumber } from "@/utils/strings"
import classNames from "classnames"
import { useEffect, useState } from "react"

const useCountdown = (targetDate) => {
  const countDownDate = !!targetDate
    ? new Date(targetDate).getTime()
    : new Date().getTime()

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime(),
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime())
    }, 1000)

    return () => clearInterval(interval)
  }, [countDownDate])

  return getReturnValues(countDown)
}

const getReturnValues = (countDown) => {
  // calculate time left
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24))
  const hours = Math.floor(countDown / (1000 * 60 * 60))
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000)

  return [days, hours, minutes, seconds]
}

const CountdownTimer = ({ targetDate, className, size, preText }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate)

  if (days + hours + minutes + seconds < 0) {
    return (
      <ShowCounter
        className={className}
        preText={preText}
        size={size}
        days={0}
        hours={0}
        minutes={0}
        seconds={0}
      />
    )
  } else {
    return (
      <ShowCounter
        className={className}
        preText={preText}
        size={size}
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    )
  }
}

const ExpiredNotice = () => {
  return (
    <div className="expired-notice">
      <span>Expired!!!</span>
      <p>Please select a future date and time.</p>
    </div>
  )
}

export const getSizeStyle = (size) => {
  if (!size) {
    size = "medium"
  }
  const styleMap = {
    mini: "text-xs",
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  }

  return styleMap[size]
}

const ShowCounter = ({
  days,
  hours,
  minutes,
  seconds,
  className,
  size,
  preText,
}) => {
  return (
    <div className={classNames("show-counter", className, getSizeStyle(size))}>
      <div className="uppercase">
        {preText} {formatTimeNumber(hours)}:{formatTimeNumber(minutes)}:
        {formatTimeNumber(seconds)}
      </div>
    </div>
  )
}

export default CountdownTimer
