import apiClient from "../../util/apiClient";

export interface Credentials {
    fin_kod: string;
    password: string;
}

export interface SignUpCredentials {
    name: string;
    surname: string;
    father_name: string;
    fin_kod: string;
    email: string;
    password: string;
    cafedra_code: string;
}

// sign in with fin kod and password

export const signin = async (credentials: Credentials) => {
    try {
        const resposne = await apiClient.post("/auth/signin", credentials);

        if (resposne.data.statusCode === 200) {
            return {
                "token": resposne.data.token,
                "user": resposne.data.user
            };
        } else if (resposne.data.statusCode === 401) {
            return "UNAUTHORIZED";
        } else {
            return "UNAUTHORIZED";
        }
    } catch (err) {
        return "error";
    };
};

// signup with form data

export const signup = async (signUpCredentials: SignUpCredentials) => {
    try {
        const response = await apiClient.post("/auth/signup", signUpCredentials);

        if (response.data.statusCode === 201) {
            return "SUCCESS";
        } else if (response.data.statusCode === 400) {
            return "CONFLICT";
        } else {
            return "ERROR";
        }
    } catch (err) {
        return "ERROR";
    };
};
