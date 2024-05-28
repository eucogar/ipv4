// src/components/SubnetTable.tsx
"use client";

import React from 'react';

interface SubnetTableProps {
  subnets: Array<{
    subnetNumber: number;
    bits: number;
    firstAddress: string;
    lastAddress: string;
  }>;
}

const SubnetTable: React.FC<SubnetTableProps> = ({ subnets }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Subnet Number</th>
          <th>Bits</th>
          <th>Start IP</th>
          <th>End IP</th>
        </tr>
      </thead>
      <tbody>
        {subnets.map((subnet) => (
          <tr key={subnet.subnetNumber
          }>
            <td>{subnet.subnetNumber}</td>
            <td>{subnet.bits}</td>
            <td>{subnet.firstAddress}</td>
            <td>{subnet.lastAddress}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SubnetTable;
