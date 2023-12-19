import { Button } from '@/components/Base/Button'

//@ts-ignore
export default function Pagination({ totalPage, currentPage, setCurrentPage }) {

  return (
    <>
      <div className={'pagination flex items-center mx-auto gap-2'}>
        <p>Page</p>
        <Button
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage(currentPage - 1)
          }>
          {'<'}
        </Button>
        {currentPage}
        <Button
          disabled={currentPage === totalPage}
          onClick={() =>
            setCurrentPage(currentPage + 1)
          }>
          {'>'}
        </Button>
        <p>of {totalPage}</p>
      </div>
    </>
  )
}