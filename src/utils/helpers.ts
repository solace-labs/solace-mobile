import {PublicKeyType} from '../components/screens/wallet/security/Guardian';

export const minifyAddress = (
  address: string | PublicKeyType,
  size: number,
) => {
  if (address.toString().length < size * 2) {
    return address.toString();
  }
  return (
    address.toString().slice(0, size) + '...' + address.toString().slice(-size)
  );
};

export const firstCharacter = (address: string | PublicKeyType) => {
  return address?.toString?.()?.[0]?.toLowerCase?.() ?? 's';
};
