// src/ip.d.ts
declare module 'ip' {
    export function isV4Format(ip: string): boolean;
    export function subnet(ip: string, mask: string): {
      networkAddress: string;
      subnetMaskLength: number;
      networkMaskLength: number;
    };
    export function cidrSubnet(cidr: string): {
      firstAddress: string;
      lastAddress: string;
    };
  }
  