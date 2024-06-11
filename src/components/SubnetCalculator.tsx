'use client';

import React, { useState } from 'react';
import ip from 'ip';
import SubnetTable from './SubnetTable';
import styled from 'styled-components';
import { Console } from 'console';

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

const InputGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  flex: 1;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ClearButton = styled(Button)`
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
  }
`;

const SubnetCalculator: React.FC = () => {
  const [ipAddress, setIpAddress] = useState('');
  const [subnetMask, setSubnetMask] = useState('');
  const [numSubnets, setNumSubnets] = useState('');
  const [subnets, setSubnets] = useState<any[]>([]);

  const validateIpAddress = (address: string): boolean => {
    return ip.isV4Format(address);
  };

  const validateSubnetMask = (mask: string): boolean => {
    if (mask.includes('/')) {
      const maskLength = parseInt(mask.replace('/', ''));
      return maskLength >= 0 && maskLength <= 32;
    } else if (ip.isV4Format(mask)) {
      const octets = mask.split('.').map(Number);
      return octets.every(octet => octet >= 0 && octet <= 255);
    }
    return false;
  };

  const handleIpAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^[0-9.]*$/;
    if (regex.test(value)) {
      setIpAddress(value);
    }
  };

  const handleSubnetMaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^[0-9./]*$/;
    if (regex.test(value)) {
      setSubnetMask(value);
    }
  };

  const handleNumSubnetsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^[0-9]*$/;
    if (regex.test(value)) {
      setNumSubnets(value);
    }
  };

  const calculateSubnets = () => {
    if (!validateIpAddress(ipAddress)) {
      alert('La dirección IP es inválida');
      return;
    }

    if (subnetMask && !validateSubnetMask(subnetMask)) {
      alert('La máscara de subred es inválida');
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

    const CalcularBits = (numero: number): number => {
      return Math.ceil(Math.log2(numero));
    };

    function cidrToSubnetMask(maskBits: any) {
      const mask = (0xFFFFFFFF << (32 - maskBits)) >>> 0;
      const subnetMask = [
          (mask >>> 24) & 0xFF,
          (mask >>> 16) & 0xFF,
          (mask >>> 8) & 0xFF,
          mask & 0xFF
      ].join('.');
      
      setSubnetMask(subnetMask);
  }

    let parsedSubnets: any[] = [];
    let subnetInfo;

    if (subnetMask) {
      const maskLength = subnetMask.includes('/') ? parseInt(subnetMask.replace('/', '')) : convertMaskToCIDR(subnetMask);
      subnetInfo = ip.cidrSubnet(`${ipAddress}/${maskLength}`);
      const bits = restarOcho(maskLength);
      const numSubnets = Math.pow(2, bits);

      let i = 0;
      let subnetCount = 0;

      while (subnetCount < numSubnets) {
        const subnetBase = ip.toLong(subnetInfo.networkAddress) + (i * subnetInfo.numHosts);
        const newSubnet = ip.cidrSubnet(ip.fromLong(subnetBase) + '/' + maskLength);
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
    } else if (numSubnets) {
      const numSubnetsValue = parseInt(numSubnets);
      if (isNaN(numSubnetsValue) || numSubnetsValue <= 0) {
        alert('El número de subredes es inválido');
        return;
      }

      const octetos = ipAddress.split('.').map(Number);
      const primerOcteto = octetos[0];
      let maskLength = 0;

      if (primerOcteto >= 1 && primerOcteto <= 126) {
        maskLength =  8; // Clase A
      } else if (primerOcteto >= 128 && primerOcteto <= 191) {
        maskLength = 16; // Clase B
      } else if (primerOcteto >= 192 && primerOcteto <= 223) {
        maskLength = 24; // Clase C
      }

      const maskLengt = maskLength + CalcularBits(numSubnetsValue);
      subnetInfo = ip.cidrSubnet(`${ipAddress}/${maskLengt}`);
      cidrToSubnetMask(maskLengt);
      const bits = CalcularBits(numSubnetsValue);
      const numSubnet = Math.pow(2, bits);

      let i = 0;
      let subnetCount = 0;

      while (subnetCount < numSubnetsValue) {
        const subnetBase = ip.toLong(subnetInfo.networkAddress) + (i * subnetInfo.numHosts);
        const newSubnet = ip.cidrSubnet(ip.fromLong(subnetBase) + '/' + maskLengt);
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

    setSubnets(parsedSubnets);
    console.log(parsedSubnets);
  };

  const clearFields = () => {
    setIpAddress('');
    setSubnetMask('');
    setNumSubnets('');
    setSubnets([]);
  };

  return (
    <Container>
      <Title>Calculadora de Subredes</Title>
      <Input
        type="text"
        placeholder="Ingrese la dirección IP"
        value={ipAddress}
        onChange={handleIpAddressChange}
      />
      <InputGroup>
        <Input
          type="text"
          placeholder="Ingrese la máscara de subred"
          value={subnetMask}
          onChange={handleSubnetMaskChange}
          disabled={!!numSubnets}
        />
        <Input
          type="text"
          placeholder="Ingrese el número de subredes"
          value={numSubnets}
          onChange={handleNumSubnetsChange}
          disabled={!!subnetMask}
        />
      </InputGroup>
      <ButtonGroup>
        <Button onClick={calculateSubnets}>Calcular</Button>
        <ClearButton onClick={clearFields}>Limpiar</ClearButton>
      </ButtonGroup>
      <SubnetTable subnets={subnets} />
    </Container>
  );
};

export default SubnetCalculator;
