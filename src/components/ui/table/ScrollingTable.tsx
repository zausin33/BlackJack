import React from "react";
import { Table } from "react-bootstrap";
import "./ScrollingTable.css";

type Cell = {
  value: string | number;
  style?: object;
}

type Row = {
  cells: Cell[];
  style?: object;
  onClick?:() => void;
}

type Data = {
  header: Row;
  body: Row[];
}

type ScrollingTablePops = {
  data: Data;
}

function ScrollingTable({ data }: ScrollingTablePops): JSX.Element {
  const { header, body } = data;

  return (
    <Table striped hover className="scrolling-table">
      <thead className="scrolling-table-head">
        <tr style={header.style}>
          {header.cells.map((cell) => (
            <th style={cell.style} key={cell.value}>{cell.value}</th>
          ))}
        </tr>
      </thead>
      <tbody className="scrolling-table-body">
        {body.map((row) => (
          <tr
            style={row.style}
            key={JSON.stringify(row.cells)}
            onClick={() => (row.onClick ? row.onClick() : {})}
          >
            {row.cells.map((cell) => (
              <th style={cell.style} key={cell.value}>{cell.value}</th>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default ScrollingTable;
