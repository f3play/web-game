"use client"

import cn from "classnames"
import Logo from "@/components/ui/logo"
import { MenuItem } from "@/components/ui/collapsible-menu"
import Scrollbar from "@/components/ui/scrollbar"
import Button from "@/components/ui/button"
import { useDrawer } from "@/components/drawer-views/context"
import { Close } from "@/components/icons/close"
import { menuItems } from "@/layouts/sidebar/_menu-items"
import { WhitePaper } from "@/components/icons/brands/docs";

export default function Sidebar({ className }: { className?: string }) {
  const { closeDrawer } = useDrawer()
  return (
    <aside
      className={cn(
        "top-0 z-40 h-full w-full max-w-full border-dashed border-gray-200 bg-body" +
        " ltr:left-0 ltr:border-r rtl:right-0 rtl:border-l dark:border-gray-700 dark:bg-dark xs:w-80 xl:fixed  xl:w-72 2xl:w-80 relative",
        className,
      )}
    >
      <div className="relative flex h-24 items-center justify-between overflow-hidden px-6 py-4 2xl:px-8">
        <Logo />
        <div className="md:hidden">
          <Button
            title="Close"
            color="white"
            shape="circle"
            variant="transparent"
            size="small"
            onClick={closeDrawer}
          >
            <Close className="h-auto w-2.5" />
          </Button>
        </div>
      </div>

      <Scrollbar className={'flex-col justify-between hidden xl:flex'} style={{ height: "calc(100% - 96px)" }}>
        <div className="px-6 pb-5 2xl:px-8">

          <div className="mt-4">
            {menuItems.map((item, index) => (
              <MenuItem
                key={"default" + item.name + index}
                name={item.name}
                href={item.href}
                icon={item.icon}
                target={item?.target}
                dropdownItems={item.dropdownItems}
              />
            ))}
          </div>
        </div>
      </Scrollbar>

      <div className="pb-5 2xl:px-8 absolute bottom-2 w-full">
        <div className={'w-full grid grid-cols-5 gap-2 justify-items-center'}>
          <a className={'w-fit'} target={'#'} href={"https://ljie19175s-organization.gitbook.io/f3play/about-f3play"}>
            <span className="text-md flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-all hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 xl:h-10 xl:w-10">
              <WhitePaper className="h-5 w-5 lg:h-6 lg:w-6 hover:text-[#6c8bef] hover:scale-110" />
            </span>
          </a>
        </div>
      </div>
    </aside>
  )
}
