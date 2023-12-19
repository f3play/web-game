import classNames from "classnames"
import Scrollbar from "@/components/ui/scrollbar"
import { useMemo } from "react"
import Pagination from "@/app/shared/pagination"
import { startAndEnd } from "@/utils"
import { formatTokenAmount } from "@/utils/token"
import MiniNft from "@/app/shared/mini-nft"
import dayjs from "dayjs"
import Image from "next/image"
import Token from "@/components/ui/token";
import TxHyperLink, {AddressHyperLink} from "@/components/ui/scan-hyperlink";

const COLUMNS = [
  {
    header: "Buyer",
    field: "buyer",
    value: (row: any) => <AddressHyperLink address={row.buyer}/> ,
  },
  {
    header: "Seller",
    field: "seller",
    value: (row: any) => <AddressHyperLink address={row.seller}/>,
  },
  {
    header: "NFT",
    value: (row: any) =>
      row.nftIds.map((id: any) => <MiniNft key={id} nftId={id} className="" />),
  },
  {
    header: `Price`,
    field: "price",
    value: (row: any) => (
      <div className="flex justify-end gap-x-2 items-center">
        <p>{formatTokenAmount(row.price)}</p>
        <Token className={'w-4 h-4'}/>
      </div>
    ),
    headerClassName: "text-right",
  },
  {
    header: `Fee`,
    field: "fee",
    value: (row: any) => (
      <div className="flex justify-end gap-x-2 items-center">
        <p>{formatTokenAmount(row.fee)}</p>
        <Token className={'w-4 h-4'}/>
      </div>
    ),
    headerClassName: "text-right",
  },
  {
    header: "Datetime",
    field: "timestamp",
    value: (row: any) =>
      dayjs(Number(row.timestamp) * 1000).format("YYYY-MM-DD HH:mm"),
    className: "text-center",
    headerClassName: "text-center",
  },
]

type ColumnType = (typeof COLUMNS)[0]

function renderCellValue(column: ColumnType, row: any) {
  if (typeof column.value === "function") {
    return column.value(row)
  }
  return column.field ? row[column.field] : "-"
}

export default function TradeTable({
  data,
  currentPage,
  totalPage,
  setCurrentPage,
  onRefresh,
}: {
  data: any
  currentPage: number
  totalPage: number
  setCurrentPage: (page: number) => void
  onRefresh?: () => void
}) {
  const columns = useMemo(() => COLUMNS, [])

  if (totalPage === 0) {
    return (
      <div>
        No trades have been made so far. Would you mind initiating the first
        one?
      </div>
    )
  }

  return (
    <div className="">
      <div className="-mx-0.5 dark:[&_.os-scrollbar_.os-scrollbar-track_.os-scrollbar-handle:before]:!bg-white/50">
        <Scrollbar style={{ width: "100%" }} autoHide="never" className="">
          <div className="px-0.5">
            <table className="transaction-table w-full border-separate border-0">
              <thead className="text-base text-gray-500 dark:text-gray-300">
                <tr>
                  {columns.map((col: ColumnType, idx) => (
                    <th
                      key={idx}
                      className={classNames(
                        "group bg-white px-2 py-5 font-normal first:rounded-tl-lg first:pl-8 last:rounded-tr-lg last:pr-8 dark:bg-light-dark md:px-4",
                      )}
                    >
                      <div
                        className={classNames(
                          "font-semibold uppercase",
                          col.headerClassName,
                        )}
                      >
                        {col.header}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm">
                {data.map((row: any, idx: number) => {
                  return (
                    <tr
                      key={idx}
                      className={classNames(
                        "mb-3 items-center rounded-lg bg-white shadow-card last:mb-0 dark:bg-light-dark",
                      )}
                    >
                      {columns.map((col: ColumnType, idx) => (
                        <td
                          key={idx}
                          className={classNames(
                            "px-2 py-2 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4  md:ltr:first:pl-8 md:ltr:last:pr-8",
                            col.className,
                          )}
                        >
                          {renderCellValue(col, row)}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Scrollbar>
      </div>

      {totalPage > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPage={totalPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  )
}
