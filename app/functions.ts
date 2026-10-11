export const getCookieData = (key: "authToken") => {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((row) => row.startsWith(key + "="));
  const data = cookie ? cookie.split("=")[1] : null;
  if (data) {
    return data;
  } else {
    console.error("cookie key has no data");
  }
};

export const deleteCookieData = (key: string, path: string = "/") => {
  document.cookie = `${key}=; path=${path}; max-age=0; SameSite=Lax`;
};

export const getServerCookieData = (request: Request, key: string) => {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split("; ");
  const cookie = cookies.find((row) => row.startsWith(key + "="));
  return cookie ? cookie.split("=")[1] : null;
};
