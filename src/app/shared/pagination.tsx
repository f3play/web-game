//@ts-ignore
import Button from "@/components/ui/button"
import { LongArrowLeft } from "@/components/icons/long-arrow-left"
import { LongArrowRight } from "@/components/icons/long-arrow-right"
import React from "react"
import classNames from "classnames"

export default function Pagination({ totalPage, currentPage, setCurrentPage }) {
  return (
    <>
      <div
        className={classNames(
          "mt-3 flex h-fit w-full items-center justify-center rounded-lg bg-white px-5 py-2 text-sm shadow-card dark:bg-light-dark",
          totalPage > 0 ? "flex" : "hidden",
        )}
      >
        <div className="flex items-center gap-x-5 gap-y-2">
          <Button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage == 1}
            title="Previous"
            shape="circle"
            variant="transparent"
            size="small"
            className="text-gray-700 disabled:text-gray-400 dark:text-white disabled:dark:text-gray-400"
          >
            <LongArrowLeft className="h-auto w-4 rtl:rotate-180" />
          </Button>
          <div>
            Page{" "}
            <strong className="font-semibold">
              {currentPage} of {totalPage}
            </strong>{" "}
          </div>
          <Button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage == totalPage}
            title="Next"
            shape="circle"
            variant="transparent"
            size="small"
            className="text-gray-700 disabled:text-gray-400 dark:text-white disabled:dark:text-gray-400"
          >
            <LongArrowRight className="h-auto w-4 rtl:rotate-180 " />
          </Button>
        </div>
      </div>
    </>
  )
}
