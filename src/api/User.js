import Request from "../utils/Request";

export const getUserInfo = (id) => {
    return Request.get(`/user/info/${id}`);
}