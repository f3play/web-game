import cn from "classnames"
import Sidebar from "@/layouts/sidebar/_default"
import dynamic from "next/dynamic"
import Logo from "@/components/ui/logo";

export default function ModernLayout({
  children,
  contentClassName,
}: React.PropsWithChildren<{ contentClassName?: string }>) {
  const Main = dynamic(() => import("./main"), { ssr: false })
  const DevTools = dynamic(() => import("./dev-tools"), { ssr: false })
  const Header = dynamic(() => import("@/layouts/header/header"), {
    ssr: false,
  })

  return (
    <div className="ltr:xl:pl-72 rtl:xl:pr-72 ltr:2xl:pl-80 rtl:2xl:pr-80">
      <Header />
      <Sidebar className="hidden xl:block" />
      <main className={cn("hidden xl:block", contentClassName)}>
        <Main>{children}</Main>
      </main>
      <div
        className={"absolute left-1/2 top-1/2 flex flex-col -translate-x-1/2 -translate-y-16 xl:hidden  justify-center"}
      >
        <div className={'-translate-y-10 flex justify-center'}>
        <Logo/>
        </div>
        <p className={'text-xs text-center'}>
          The Meme World is best optimized on Web Browser for the time being. We will come to Mobile soon.
        </p>
      </div>
      {/*<DevTools position={"bottom-right"} />*/}
    </div>
  )
}
