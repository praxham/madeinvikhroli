import { postData } from "./APICalls"

export const postTransactions = (data) => {
    return postData(`/api/v1/transactions/`, data)
}