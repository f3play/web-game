import { Suspense } from "react"
import { Fira_Code } from "next/font/google"
import cn from "classnames"
import { QueryClientProvider } from "@/app/shared/query-client-provider"
import { ThemeProvider } from "@/app/shared/theme-provider"
import ModalsContainer from "@/components/modal-views/container"
import DrawersContainer from "@/components/drawer-views/container"
// base css file
import "overlayscrollbars/overlayscrollbars.css"
import "swiper/css"
import "swiper/css/pagination"
import "@/assets/css/scrollbar.css"
import "@/assets/css/globals.css"
import "@/assets/css/range-slider.css"
import WagmiConfig from "@/config/wagmi"
import { Toaster } from "react-hot-toast"
import { ModalContextProvider } from "./shared/modal-provider"
import HowToPlay from "@/components/ui/button/how-to-play";

const fira_code = Fira_Code({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" className={cn("dark", fira_code.className)}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1 maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" type="image/png" sizes="64x64" />
        <meta name="description" content="F3Play: Fair - Fun - Fast" />
      </head>
      <body>
        <QueryClientProvider>
          <ThemeProvider>
            <WagmiConfig>
              {/*<SettingsButton />*/}
              {/*<SettingsDrawer />*/}
              <HowToPlay/>
              <Suspense fallback={null}>
                <ModalsContainer />
                <DrawersContainer />
              </Suspense>
              <ModalContextProvider>{children}</ModalContextProvider>
            </WagmiConfig>
          </ThemeProvider>
          <Toaster position="bottom-center" gutter={5} />
        </QueryClientProvider>
      </body>
    </html>
  )
}
