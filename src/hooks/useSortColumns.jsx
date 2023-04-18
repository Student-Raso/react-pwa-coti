import React from "react";

export function useSortColumns({
  columnsData = [],
  order = "",
  onHeaderCell = null,
}) {
  const [sortValue, setSortValue] = React.useState(order);
  const [columnsContent, setColumnsContent] = React.useState([]);

  const _onHeaderCell = React.useCallback((column) => ({
    onClick: () => {
      let _sort = sortValue.indexOf("asc") >= 0 ? "desc" : "asc";
      setSortValue(
        `${column?.orden ? column?.orden : column?.dataIndex}-${_sort}`
      );
    }
  }), [sortValue]);

  React.useEffect(() => {
    const columnsDefaultProps = {
      sorter: { multiple: 2 },
      sortOrder: sortValue.indexOf("asc") >= 0 ? "ascend" : "descend",
      onHeaderCell: _onHeaderCell,
      showSorterTooltip: false
    };

    const _columns = columnsData?.map((column) => {
      column.sortOrder = null;
      if(column?.orden === false) {
        return column;
      }
      if (column?.orden) {
        if (sortValue.indexOf(column.orden) >= 0) {
          column.sortOrder = sortValue.indexOf("asc") >= 0 ? "ascend" : "descend";
        }
      } else if (sortValue.indexOf(column.dataIndex) >= 0) {
        column.sortOrder = sortValue.indexOf("asc") >= 0 ? "ascend" : "descend";
      }
      return { ...columnsDefaultProps, ...column };
    });

    setColumnsContent(_columns);
  }, [_onHeaderCell, columnsData, sortValue]);

  return React.useMemo(() => {
    return {
      sortValue,
      columnsContent,
    };
  }, [sortValue, columnsContent]);
}