import { postData } from "./APICalls"

export const postTransactions = (artifactID,data) => {
    return postData(`/api/v1/transactions/${artifactID}`, data)
}