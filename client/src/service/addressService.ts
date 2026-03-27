import { client } from "@/utils/clients";

export interface Address {
  _id?: string;
  id: string;
  name: string;
  country: string;
  address: string;
  mobileNumber: string;
  alternativeMobileNumber?: string;
  pincode: string;
  city: string;
  state: string;
  isDefault: boolean;
}

export interface Country {
  name: string;
  code: string;
}

export interface AddressPayload {
  name: string;
  country: string;
  address: string;
  mobileNumber: string;
  alternativeMobileNumber?: string;
  pincode: string;
  city: string;
  state: string;
  isDefault?: boolean;
}

export const getAddresses = async (): Promise<{ addresses: Address[] }> => {
  const { data } = await client.get("/addresses");
  return data;
};

export const addAddress = async (
  payload: AddressPayload,
): Promise<{ address: Address }> => {
  const { data } = await client.post("/addresses", payload);
  return data;
};

export const updateAddress = async (
  addressId: string,
  payload: AddressPayload,
): Promise<{ address: Address }> => {
  const { data } = await client.put(`/addresses/${addressId}`, payload);
  return data;
};

export const deleteAddress = async (
  addressId: string,
): Promise<{ message: string }> => {
  const { data } = await client.delete(`/addresses/${addressId}`);
  return data;
};

export const setDefaultAddress = async (
  addressId: string,
): Promise<{ address: Address }> => {
  const { data } = await client.patch(`/addresses/${addressId}/default`);
  return data;
};

export const getCountries = async (): Promise<{ countries: Country[] }> => {
  const { data } = await client.get("/countries");
  return data;
};

export const getCountryDetail = async (
  code: string,
): Promise<{ country: { name: string; code: string; states: string[] } }> => {
  const { data } = await client.get(`/countries/${code}`);
  return data;
};
