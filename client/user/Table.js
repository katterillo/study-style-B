
import React, {useState, useEffect, useMemo } from 'react'

    import {Link} from 'react-router-dom'
    import { makeStyles } from '@material-ui/core/styles'
    import {list} from './api-user.js'
    import regeneratorRuntime from "regenerator-runtime";

    import { useTable, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table'
    


const useStyles = makeStyles(theme => ({
    root: theme.mixins.gutters({
      padding: theme.spacing(1),
      margin: theme.spacing(5)
    }),
    title: {
      margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
      color: theme.palette.openTitle
    }
  }))
  
  // Define a default UI for filtering
function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
  }) {
    const count = preGlobalFilteredRows.length
    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
      setGlobalFilter(value || undefined)
    }, 200)
  
    return (
      <span>
        Search:{' '}
        <input
          value={value || ""}
          onChange={e => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
          placeholder={`${count} users...`}
          style={{
            fontSize: '1.1rem',
            border: '0',
          }}
        />
      </span>
    )
  }
  
  // Define a default UI for filtering
  function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
  }) {
    const count = preFilteredRows.length
  
    return (
      <input
        value={filterValue || ''}
        onChange={e => {
          setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
        }}
        placeholder={`Search ${count} users...`}
      />
    )
  }

  export function SelectColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id },
  }) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
      const options = new Set()
      preFilteredRows.forEach(row => {
        options.add(row.values[id])
      })
      return [...options.values()]
    }, [id, preFilteredRows])
  
    // Render a multi-select box
    return (
      <select
        value={filterValue}
        onChange={e => {
          setFilter(e.target.value || undefined)
        }}
      >
        <option value="">All</option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    )
  }

  function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
  }
  
  // Let the table remove the filter if the string is empty
  fuzzyTextFilterFn.autoRemove = val => !val

  
    export default function Table({ columns, data }) {
        // Use the useTable Hook to send the columns and data to build the table
        const filterTypes = React.useMemo(
          () => ({
            // Add a new fuzzyTextFilterFn filter type.
            fuzzyText: fuzzyTextFilterFn,
            // Or, override the default text filter to use
            // "startWith"
            text: (rows, id, filterValue) => {
              return rows.filter(row => {
                const rowValue = row.values[id]
                return rowValue !== undefined
                  ? String(rowValue)
                      .toLowerCase()
                      .startsWith(String(filterValue).toLowerCase())
                  : true
              })
            },
          }),
          []
        )
        const defaultColumn = React.useMemo(
          () => ({
            // Let's set up our default Filter UI
            Filter: DefaultColumnFilter,
          }),
          []
        )
        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow,
            state,
            visibleColumns,
            setGlobalFilter,
            preGlobalFilteredRows,
            setFilter // The useFilter Hook provides a way to set the filter
          } = useTable(
            {
              columns,
              data,
              defaultColumn, // Be sure to pass the defaultColumn option
              filterTypes,
            },
            useFilters,
            useGlobalFilter // Adding the useFilters Hook to the table
            // You can add as many Hooks as you want. Check the documentation for details. You can even add custom Hooks for react-table here
            
          );
        const classes = useStyles()
        const [users, setUsers] = useState([])
      
        useEffect(() => {
          const abortController = new AbortController()
          const signal = abortController.signal
      
          list(signal).then((data) => {
            if (data && data.error) {
              console.log(data.error)
            } else {
              setUsers(data)
            }
          })
      
          return function cleanup(){
            abortController.abort()
          }
        }, [])

        const [filterInput, setFilterInput] = useState("");

// Update the state when input changes
const handleFilterChange = e => {
    const value = e.target.value || undefined;
    setFilter("name", value); // Update the show.name filter. Now our table will filter and show only the rows which have a matching value
    setFilterInput(value);
  };
      
        /* 
          Render the UI for your table
          - react-table doesn't have UI, it's headless. We just need to put the react-table props from the Hooks, and it will do its magic automatically
        */
        return (
            <div>
          <table {...getTableProps()}>
          
          <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
                  {column.render('Header')}
                  {/* Render the columns filter UI */}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
          <tr>
            <th
              colSpan={visibleColumns.length}
              style={{
                textAlign: 'left',
              }}
            >
        
            </th>
          </tr>
        </thead>
            {/* // </Link> */}
            {/* }) */}
          
            <tbody {...getTableBodyProps()}>
                   {/* {users.map((item, i) => {
          return <Link to={"/userprofile/" + item._id} key={i}> */}
              {rows.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                    })}
                  </tr>
                );
              })}
              {/* </Link>
                   })
                } */}
            </tbody>
          </table>
          </div>
        );
      }
