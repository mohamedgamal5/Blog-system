import "./pagination.css";

const Pagination = ({ pages, currentPage, setCurrentPage }) => {
  const genPages = [];
  for (let index = 0; index < pages; index++) {
    genPages.push(index + 1);
  }
  const prev = () => {
    setCurrentPage((prev) => prev - 1);
  };
  const next = () => {
    setCurrentPage((prev) => prev + 1);
  };
  return (
    <div className="pagination">
      {currentPage === 1 ? (
        <></>
      ) : (
        <div onClick={prev} className="page previous">
          Previous
        </div>
      )}
      {genPages.map((page) => (
        <div
          className={page === currentPage ? "page active" : "page"}
          onClick={() => setCurrentPage(page)}
          key={page}
        >
          {page}
        </div>
      ))}
      {currentPage === pages ? (
        <></>
      ) : (
        <div onClick={next} className="page next">
          Next
        </div>
      )}
    </div>
  );
};

export default Pagination;
