export const extractColumns = (columns, searchColumn, isDesktop) => {
    const filteredColumns = columns.filter((column) => {
        return isDesktop ? !column.onlyInIpad : !column.onlyInDesktop;
    });

    let modifiedColumns = [];
    //Loop through the columns configuration and create required column structure
    filteredColumns.forEach((column, index) => {
        const { innerCells, accessor, sortValue } = column;
        const isInnerCellsPresent = innerCells && innerCells.length > 0;

        //Add column Id
        column.columnId = `column_${index}`;

        //Add logic to sort column if sort is not disabled
        if (!column.disableSortBy) {
            if (isInnerCellsPresent) {
                //If there are inner cells and a sort value specified, do sort on that value
                if (sortValue) {
                    column.sortType = (rowA, rowB) => {
                        return rowA.original[accessor][sortValue] > rowB.original[accessor][sortValue] ? -1 : 1;
                    };
                } else {
                    column.disableSortBy = true;
                }
            } else if (!innerCells) {
                //If no inner cells are there, just do sort on column value
                column.sortType = (rowA, rowB) => {
                    return rowA.original[accessor] > rowB.original[accessor] ? -1 : 1;
                };
            }
        }

        //Add logic to filter column if column filter is not disabled
        if (!column.disableFilters) {
            column.filter = (rows, id, filterValue) => {
                const searchText = filterValue ? filterValue.toLowerCase() : "";
                return rows.filter((row) => {
                    //Find original data value of each row
                    const { original } = row;
                    //Do search for the column
                    return searchColumn(column, original, searchText);
                });
            };
        }

        modifiedColumns.push(column);
    });
    return modifiedColumns;
};