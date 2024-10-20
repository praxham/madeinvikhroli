import { getData } from "./APICalls"

export const getArtifacts = () => {
    return getData("/api/v1/artifacts")
}