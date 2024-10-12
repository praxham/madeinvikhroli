import { getData } from "./APICalls"

export const getArtifacts = () => {
    const response = getData("/api/v1/artifacts")
    return response
}