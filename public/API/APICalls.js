export const commonPoint = "http://localhost:3000";


export const postData = async (endPoint = "", data, type = false) => {
  try {
    const url = commonPoint + endPoint;
    const headers = {
          "Content-Type": "application/json",
        };

    const body = type ? data : JSON.stringify(data);

    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    return response.json();
  } catch (error) {
    console.log("Error posting data:");
  }
};

export const getData = async (endPoint = "") => {
  try {
    const url = commonPoint + endPoint;
    const headers = {
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      headers,
      method: "GET",
    });

    return response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};