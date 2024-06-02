'use client';

import React, { useState } from 'react';
import ip from 'ip';
import SubnetTable from './SubnetTable';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
`;

const Input = styled.input`
  width: calc(100% - 22px);
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const SubnetCalculator: React.FC = () => {
  const [ipAddress, setIpAddress] = useState('');
  const [maskOrSubnets, setMaskOrSubnets] = useState('');
  const [subnets, setSubnets] = useState<any[]>([]);

  const validateIpAddress = (address: string): boolean => {
    return ip.isV4Format(address);
  };

  let parsedSubnets: any[] = [];
  let subnetMask = '';
  let numSubnets = 0;
  let subnetInfo

  const calculateSubnets = () => {
    if (!validateIpAddress(ipAddress)) {
      alert('IP address is invalid');
      return;
    }

    const convertMaskToCIDR = (subnetMask: string): number => {
      return subnetMask
        .split('.')
        .map(Number)
        .map(octet => octet.toString(2).padStart(8, '0'))
        .join('')
        .split('1').length - 1;
    };

    const restarOcho = (numero: any) => {
      while (numero >= 8) {
        numero -= 8;
      }
      return numero;
    };

    if (maskOrSubnets.includes('/')) {
      subnetMask = maskOrSubnets.replace('/', '');
      subnetInfo = ip.cidrSubnet(`${ipAddress}/${subnetMask}`);
      const bits = restarOcho(subnetMask);
      const numSubnets = Math.pow(2, bits);

      let i = 0;
      let subnetCount = 0;

      while (subnetCount < numSubnets) {
        const subnetBase = ip.toLong(subnetInfo.networkAddress) + (i * subnetInfo.numHosts);
        const newSubnet = ip.cidrSubnet(ip.fromLong(subnetBase) + '/' + subnetMask);
        const isDuplicate = parsedSubnets.some(subnet =>
          subnet.firstAddress === newSubnet.firstAddress && subnet.lastAddress === newSubnet.lastAddress
        );

        if (!isDuplicate) {
          const binarySuffix = subnetCount.toString(2).padStart(bits, '0');

          parsedSubnets.push({
            subnetNumber: subnetCount + 1,
            bits: binarySuffix,
            firstAddress: newSubnet.firstAddress,
            lastAddress: newSubnet.lastAddress,
          });
          subnetCount++;
        }
        i++;
      }
    } else if (maskOrSubnets.includes('.')) {
      subnetMask = convertMaskToCIDR(maskOrSubnets).toString();
       subnetInfo = ip.cidrSubnet(`${ipAddress}/${subnetMask}`);
      const bits = restarOcho(subnetMask);
      const numSubnets = Math.pow(2, bits);

      for (let i = 0; i < numSubnets; i++) {
        const subnetBase = ip.toLong(subnetInfo.networkAddress) + (i * subnetInfo.numHosts);
        const newSubnet = ip.cidrSubnet(ip.fromLong(subnetBase) + '/' + subnetMask);
        parsedSubnets.push({
          subnetNumber: i + 1,
          bits: subnetMask,
          firstAddress: newSubnet.firstAddress,
          lastAddress: newSubnet.lastAddress,
        });
      }
    } else {
      numSubnets = parseInt(maskOrSubnets);
      if (isNaN(numSubnets) || numSubnets <= 0) {
        alert('Number of subnets is invalid');
        return;
      }

      const originalSubnetInfo = ip.cidrSubnet(`${ipAddress}/18`);
      const additionalBits = Math.ceil(Math.log2(numSubnets));
      const newSubnetMaskLength = originalSubnetInfo.subnetMaskLength + additionalBits;
      const subnetSize = Math.pow(2, 32 - newSubnetMaskLength);

      for (let i = 0; i < numSubnets; i++) {
        const subnetBase = ip.toLong(originalSubnetInfo.networkAddress) + (i * subnetSize);
        const newSubnet = ip.cidrSubnet(ip.fromLong(subnetBase) + '/' + newSubnetMaskLength);
        parsedSubnets.push({
          subnetNumber: i + 1,
          bits: newSubnetMaskLength,
          firstAddress: newSubnet.firstAddress,
          lastAddress: newSubnet.lastAddress,
        });
      }
    }

    setSubnets(parsedSubnets);
    console.log(parsedSubnets);
  };

  return (
    <Container>
      <Title>Subnet Calculator</Title>
      <Input
        type="text"
        placeholder="Enter IP address"
        value={ipAddress}
        onChange={(e) => setIpAddress(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Enter subnet mask or number of subnets"
        value={maskOrSubnets}
        onChange={(e) => setMaskOrSubnets(e.target.value)}
      />
      <Button onClick={calculateSubnets}>Calculate</Button>
      <SubnetTable subnets={subnets} />
    </Container>
  );
};

export default SubnetCalculator;
