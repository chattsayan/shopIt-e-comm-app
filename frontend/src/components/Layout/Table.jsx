import { useState } from "react";
import { Card, CardBody, Input, CardFooter } from "@material-tailwind/react";

export function TransactionsTable({ rows = [], headers = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const filteredRows = rows.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));

  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const startEntry =
    filteredRows.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endEntry = Math.min(currentPage * rowsPerPage, filteredRows.length);
  const totalEntries = filteredRows.length;

  return (
    <div className="flex flex-col items-center w-full px-4">
      <Card className="w-full max-w-4xl lg:max-w-7xl mx-auto shadow-none">
        {/* Top controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 pt-6 pb-2 gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="show-entries" className="text-sm font-medium">
              Show entries
            </label>
            <input
              id="show-entries"
              type="number"
              min={1}
              max={100}
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="w-16 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
            />
          </div>
          <div className="flex w-full md:w-44">
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-gray-300"
            />
          </div>
        </div>

        <CardBody className="px-0 pb-0">
          <div className="w-full overflow-x-auto">
            <table className="min-w-full table-auto text-left border border-gray-200">
              <thead>
                <tr>
                  {headers.map((head) => (
                    <th
                      key={head}
                      className="border-b border-gray-200 bg-white px-4 py-2 text-center align-middle font-bold text-base"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={headers.length}
                      className="text-center py-6 text-gray-500"
                    >
                      No entries found.
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row, rowIndex) => (
                    <tr
                      key={row.id || rowIndex}
                      className={
                        rowIndex % 2 === 0 ? "bg-white" : "bg-gray-100"
                      }
                    >
                      {headers.map((head, colIndex) => {
                        const key = head.toLowerCase().replace(/ /g, "");
                        return (
                          <td
                            key={colIndex}
                            className="px-4 py-2 text-center align-middle whitespace-nowrap"
                          >
                            {/* Only render the main action button in Actions column */}
                            {key === "actions" ? (
                              <div className="flex justify-center gap-2">
                                {row[key]}
                              </div>
                            ) : (
                              row[key] || ""
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardBody>

        {/* Showing entries and pagination */}
        <div className="flex flex-col items-center gap-2 py-4">
          <div className="text-sm text-gray-700">
            {`Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`}
          </div>
          <CardFooter className="flex flex-wrap items-center justify-center bg-transparent">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="border px-2 h-8 border-gray-300 text-sm"
            >
              Previous
            </button>
            {/* Always render at least one page number */}
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`h-8 w-8 flex items-center justify-center font-semibold text-sm
                  ${
                    currentPage === i + 1
                      ? "bg-orange-500 text-white border border-orange-500"
                      : "bg-white text-gray-800 border border-gray-300"
                  }
                `}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="border px-2 h-8 border-gray-300 text-sm"
            >
              Next
            </button>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
