'use client';

import React from 'react';
import styled from 'styled-components';

interface SubnetTableProps {
  subnets: Array<{
    subnetNumber: number;
    bits: string; 
    firstAddress: string;
    lastAddress: string;
  }>;
}

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: 1px solid #ddd;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
`;

const SubnetTable: React.FC<SubnetTableProps> = ({ subnets }) => {
  return (
    <Table>
      <thead>
        <tr>
          <TableHeader>Subred</TableHeader>
          <TableHeader>Bits</TableHeader>
          <TableHeader>D. Inicial</TableHeader>
          <TableHeader>D. Final</TableHeader>
        </tr>
      </thead>
      <tbody>
        {subnets.map((subnet) => (
          <TableRow key={subnet.subnetNumber}>
            <TableCell>{subnet.subnetNumber}</TableCell>
            <TableCell>{subnet.bits}</TableCell>
            <TableCell>{subnet.firstAddress}</TableCell>
            <TableCell>{subnet.lastAddress}</TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
};

export default SubnetTable;
