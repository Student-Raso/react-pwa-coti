import React from "react";

export function usePagination(props) {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [total, setTotal] = React.useState(0);

  const onSetPageCallback = React.useCallback(async (page, size) => {
    setPage(page);
    setLimit(size);
  }, []);

  const configPagination = React.useMemo(() => {
    let size = limit;

    return {
      total: total,
      pageSize: limit,
      current: parseInt(page),
      onShowSizeChange: (_, newSize) => (size = newSize),
      onChange: async (v) => await onSetPageCallback(v, size),
      showTotal: (total, range) => `Total: ${total}`,
      locale: { items_per_page: "/ página" },
      pageSizeOptions: [10, 20, 30].filter((val) => val <= total),
      showSizeChanger: true,
    };
  }, [limit, onSetPageCallback, page, total]);

  return React.useMemo(() => {
    return {
      configPagination,
      page,
      limit,
      total,
      setPage,
      setLimit,
      setTotal,
    };
  }, [configPagination, limit, page, total]);
}