import axios from 'axios';

export const commonPoint = import.meta.env.VITE_VERCEL_BACKEND_URL;

export const postData = async (endPoint = "", data, type = false) => {
  try {
    const url = commonPoint + endPoint;
    
    // If type is false, stringify the data
    const body = type ? data : JSON.stringify(data);

    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data; // Return the data directly from the response
  } catch (error) {
    console.error("Error posting data:", error);
    throw error; // Rethrow the error for further handling if needed
  }
};

export const getData = async (endPoint = "") => {
  try {
    const url = commonPoint + endPoint;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data; // Return the data directly from the response
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error for further handling if needed
  }
};