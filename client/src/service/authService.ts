import { getLocalToken } from "@/utils/auth";
import { client } from "../utils/clients";

export const requestLogin = async (dataLogin: {
    email: string;
    password: string;
}) => {
    const { data } = await client.post("/auth/login", dataLogin);
    return data;
};

export const requestRegister = async (dataRegister: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
}) => {
    const { data } = await client.post("/auth/register", { ...dataRegister });
    return data;
};

export const requestLogout = async () => {
    const accessToken = getLocalToken();
    if (!accessToken) {
        throw new Error("Token not exist");
    }
    const {data} = await client.post("/auth/logout", null, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return data;
};
