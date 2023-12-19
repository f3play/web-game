import React from "react"
import {
  useFlexLayout,
  usePagination,
  useResizeColumns,
  useSortBy,
  useTable,
} from "react-table"
import { startAndEnd } from "@/utils"
import Scrollbar from "@/components/ui/scrollbar";
import {ChevronDown} from "@/components/icons/chevron-down";
import classNames from "classnames";
import Button from "@/components/ui/button";
import {LongArrowLeft} from "@/components/icons/long-arrow-left";
import {LongArrowRight} from "@/components/icons/long-arrow-right";
import {ethers} from "ethers";
import dayjs from "dayjs";
import Image from "next/image";
import Token from "@/components/ui/token";

const COLUMNS = [
  {
    Header: "ADDRESS",
    accessor: "ref",
    minWidth: 30,
    maxWidth: 40,
    Cell: ({ cell: { value } }) => <p>{startAndEnd(value)}</p>,
  },
  {
    Header: "AMOUNT",
    accessor: "balance",
    minWidth: 20,
    maxWidth: 30,
    Cell: ({ cell: { value } }) => (
      <div className={'flex items-center gap-2'}>
        <p>{ethers.formatEther(value)}</p>
        <Token className={'h-4 w-4'}/>
      </div>
    ),
  },
  {
    Header: "REFERRED AT",
    accessor: "refAt",
    minWidth: 20,
    maxWidth: 30,
    Cell: ({ cell: { value } }) => (
      <p>
        {dayjs(parseInt(value.toString()) * 1000).format("MMMM D, YYYY h:mm A")}
      </p>
    ),
  },
]

export default function ReferralTable({data}: {data: []}) {
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
      <div className="rounded-tl-lg rounded-tr-lg bg-white px-4 pt-6 dark:bg-light-dark md:px-8 md:pt-8">
        <div className="flex flex-col items-center justify-between border-b border-dashed border-gray-200 pb-5 dark:border-gray-700 md:flex-row">
          <h2 className="mb-3 shrink-0 text-lg font-medium uppercase text-black dark:text-white sm:text-xl md:mb-0 md:text-xl">
            My Rewards
          </h2>
        </div>
      </div>
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
      <div className={classNames("mt-3 items-center justify-center rounded-lg bg-white px-1 py-2 text-sm shadow-card dark:bg-light-dark",
        data.length > 0 ? "flex" : "hidden"
        )}>
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
