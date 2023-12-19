import { startAndEnd } from "@/utils"
import Image from "next/image"
import classNames from "classnames"
import React from "react"
import { MappingRarityToSmallCard } from "@/components/summon/history"
import {
  useFlexLayout,
  usePagination,
  useResizeColumns,
  useSortBy,
  useTable,
} from "react-table"
import Scrollbar from "@/components/ui/scrollbar"
import { ChevronDown } from "@/components/icons/chevron-down"
import Button from "@/components/ui/button"
import { LongArrowLeft } from "@/components/icons/long-arrow-left"
import { LongArrowRight } from "@/components/icons/long-arrow-right"
import { parseRarity, parseType } from "@/utils/nft"
import dayjs from "dayjs"
import {AddressHyperLink} from "@/components/ui/scan-hyperlink";

const COLUMNS = [
  {
    Header: "ADDRESS",
    accessor: "owner",
    minWidth: 30,
    maxWidth: 40,
    Cell: ({ cell: { value } }) => <AddressHyperLink address={value}/> ,
    disableSortBy: true
  },
  {
    Header: "AMOUNT",
    accessor: "amount",
    minWidth: 20,
    maxWidth: 30,
    Cell: ({ cell: { value } }) => (
      <div className={"flex items-center gap-x-3"}>
        <Image
          src={"/assets/Icon/treasure.png"}
          alt={"medal"}
          height={20}
          width={20}
        />
        <p className={"text-xs"}>
          {"x"}
          {value}
        </p>
      </div>
    ),
    disableSortBy: true
  },
  {
    Header: "RESULT",
    accessor: "nfts",
    minWidth: 100,
    maxWidth: 100,
    Cell: ({ cell: { value } }) => (
      <div className={"flex select-none items-center justify-start gap-2"}>
        {value.map((item, idx) => {
          return (
            <div
              className={classNames(
                "grid rounded border-2 py-2",
                MappingRarityToSmallCard.get(item.attribute.rarity),
              )}
            >
              <Image
                className={"place-self-center"}
                src={
                  "/assets/characters/" +
                  parseType(item.attribute.element.toString()) +
                  "-" +
                  parseRarity(item.attribute.rarity.toString()) +
                  ".png"
                }
                alt={""}
                width={30}
                height={30}
              />
            </div>
          )
        })}
      </div>
    ),
    disableSortBy: true
  },
  {
    Header: "REWARD",
    accessor: "reward",
    minWidth: 20,
    maxWidth: 20,
    Cell: ({ cell: { value } }) => (
      <div className={"flex items-center"}>
        <p className={"text-center text-xs text-amber-400"}>{value}</p>
        <Image
          className={"rounded-full"}
          src={"/assets/Icon/logo.svg"}
          alt={"logo"}
          width={20}
          height={20}
        />
      </div>
    ),
    disableSortBy: true
  },
  {
    Header: "TIME",
    accessor: "openedAt",
    minWidth: 60,
    maxWidth: 80,
    Cell: ({ cell: { value } }) => (
      <p>
        {dayjs(parseInt(value.toString()) * 1000).format("MMMM D, YYYY h:mm A")}
      </p>
    ),
    disableSortBy: true
  },
]
export default function RecentTable({
  data,
  totalPage,
  currentPage,
  setCurrentPage,
}: {
  data: any
  totalPage: number
  currentPage: number
  setCurrentPage: any
}) {
  const columns = React.useMemo(() => COLUMNS, [])
  const {
    getTableProps,
    getTableBodyProps,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state,
    headerGroups,
    page,
    nextPage,
    previousPage,
    prepareRow,
  } = useTable(
    {
      // @ts-ignore
      columns,
      data: data,
      initialState: {
        pageSize: 50,
        sortBy: [
          {
            id: "openedAt",
            desc: true,
          },
        ],
      },
    },
    useSortBy,
    useResizeColumns,
    useFlexLayout,
    usePagination,
  )

  const { pageIndex } = state

  return (
    <div className="">
      <div className="-mx-0.5 dark:[&_.os-scrollbar_.os-scrollbar-track_.os-scrollbar-handle:before]:!bg-white/50">
        <Scrollbar style={{ width: "100%" }} autoHide="never" className="">
          <div className="px-0.5">
            <table
              {...getTableProps()}
              className="transaction-table w-full border-separate border-0"
            >
              <thead className="text-base text-gray-500 dark:text-gray-300">
                {headerGroups.map((headerGroup, idx) => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={idx}>
                    {headerGroup.headers.map((column, idx) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps(),
                        )}
                        key={idx}
                        className="group bg-white px-2 py-5 font-normal first:rounded-bl-lg last:rounded-br-lg
                         ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4"
                      >
                        <div className="flex items-center">
                          {column.render("Header")}
                          {column.canResize && (
                            <div
                              {...column.getResizerProps()}
                              className={`resizer ${
                                column.isResizing ? "isResizing" : ""
                              }`}
                            />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody
                {...getTableBodyProps()}
                className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm"
              >
                {page.map((row, idx) => {
                  prepareRow(row)
                  return (
                    <tr
                      {...row.getRowProps()}
                      key={idx}
                      className="mb-3 items-center rounded-lg bg-white shadow-card last:mb-0 dark:bg-light-dark"
                    >
                      {row.cells.map((cell, idx) => {
                        return (
                          <td
                            {...cell.getCellProps()}
                            key={idx}
                            className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8 3xl:py-5"
                          >
                            {cell.render("Cell")}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Scrollbar>
      </div>
      <div
        className={classNames(
          "mt-3 items-center justify-center rounded-lg bg-white px-5 py-4 text-sm shadow-card dark:bg-light-dark lg:py-6",
          totalPage > 0 ? "flex" : "hidden",
        )}
      >
        <div className={classNames("items-center gap-5 flex")}>
          <Button
            onClick={() => setCurrentPage((prev) => prev - 1)}
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
            onClick={() => setCurrentPage((prev) => prev + 1)}
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
    </div>
  )
}
