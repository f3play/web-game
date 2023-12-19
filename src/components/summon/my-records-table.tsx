import { startAndEnd } from "@/utils"
import Image from "next/image"
import classNames from "classnames"
import { MappingRarityToSmallCard } from "@/components/summon/history"
import React from "react"
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

const COLUMNS = [
  {
    Header: "ADDRESS",
    accessor: "owner",
    minWidth: 30,
    maxWidth: 40,
    Cell: ({ cell: { value } }) => <p>{startAndEnd(value)}</p>,
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
  },
  {
    Header: "REWARD",
    accessor: "reward",
    minWidth: 20,
    maxWidth: 20,
    Cell: ({ cell: { value } }) => (
      <p className={"mx-auto text-center text-amber-400 subpixel-antialiased"}>
        +10
      </p>
    ),
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
  },
]
export default function MyRecordsTable({ data }: { data: any }) {
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
        pageSize: 10,
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
                        className="group bg-white px-2 py-5 font-normal first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4"
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
                          <span className="ltr:ml-1 rtl:mr-1">
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <ChevronDown />
                              ) : (
                                <ChevronDown className="rotate-180" />
                              )
                            ) : (
                              <ChevronDown className="rotate-180 opacity-0 transition group-hover:opacity-50" />
                            )}
                          </span>
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
      <div className="mt-3 flex items-center justify-center rounded-lg bg-white px-5 py-4 text-sm shadow-card dark:bg-light-dark lg:py-6">
        <div className="flex items-center gap-5">
          <Button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
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
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </div>
          <Button
            onClick={() => nextPage()}
            disabled={!canNextPage}
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
