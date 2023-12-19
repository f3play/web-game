import Loader from "@/components/ui/loader"
import classNames from "classnames"

export default function PageLoading({ className }: {className?: string}) {
  return (
    <div className={classNames("flex flex-col items-center justify-center gap-4 ",
      !className ? 'h-[80vh]' : className
    )}>
      <Loader size="large" variant="blink"></Loader>
      <h2>Loading, please wait...</h2>
    </div>
  )
}
