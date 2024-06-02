'use client';

import React, { useState } from 'react';
import ip from 'ip';
import SubnetTable from './SubnetTable';

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

  function restarOcho(numero: any) {
  
    while (numero >= 8) {
        numero -= 8;
    }
    return numero;
}

  if (maskOrSubnets.includes('/')) {
    subnetMask = maskOrSubnets.replace('/', '');
    const subnetInfo = ip.cidrSubnet(`${ipAddress}/${subnetMask}`);
    const maskBits = subnetMask.split('.').map(octet => parseInt(octet, 10).toString(2).padStart(8, '0')).join('');
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
  }
  else if(maskOrSubnets.includes('.')){
    subnetMask = convertMaskToCIDR(maskOrSubnets).toString();
    const subnetInfo = ip.cidrSubnet(`${ipAddress}/${subnetMask}`);
    const maskBits = subnetMask.split('.').map(octet => parseInt(octet, 10).toString(2).padStart(8, '0')).join('');
    const onesCount = maskBits.split('1').length - 1;
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

  }
     else {
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
  <div>
    <h1>Subnet Calculator</h1>
    <input
      type="text"
      placeholder="Enter IP address"
      value={ipAddress}
      onChange={(e) => setIpAddress(e.target.value)}
    />
    <input
      type="text"
      placeholder="Enter subnet mask or number of subnets"
      value={maskOrSubnets}
      onChange={(e) => setMaskOrSubnets(e.target.value)}
    />
    <button onClick={calculateSubnets}>Calculate</button>
    <SubnetTable subnets={subnets} />
  </div>
);
};

export default SubnetCalculator;