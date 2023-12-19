import MarketplaceOnSale from "@/app/(modern)/marketplace/_components/on-sale"
import PathParamTab from "@/components/ui/path-param-tab"
import { TabPanel } from "@/components/ui/tab"
import MarketplaceHistory from "../_components/history"

export const metadata = {
  title: "F3Play - Marketplace",
  description: "F3Play: Fair - Fun - Fast",
}

export default function Page() {
  return (
    <PathParamTab
      tabMenu={[
        {
          title: "On Sale",
          path: "on-sale",
        },
        {
          title: "History",
          path: "history",
        },
      ]}
    >
      <TabPanel className="focus:outline-none">
        <MarketplaceOnSale />
      </TabPanel>
      <TabPanel className="focus:outline-none">
        <MarketplaceHistory />
      </TabPanel>
    </PathParamTab>
  )
}
