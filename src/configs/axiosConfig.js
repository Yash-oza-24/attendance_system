export const getToken = () => {
  const token = localStorage.getItem("TOKEN")
    ? JSON.parse(localStorage.getItem("TOKEN"))
    : null;

  return {
    headers: {
      Authorization: `Bearer ${token !== null && token ? token : ""}`,
      Accept: "application/json",
    },
  };
};




// const getTokenFromLocalStorage = localStorage.getItem("TOKEN")
//   ? JSON.parse(localStorage.getItem("TOKEN"))
//   : null;

// console.log(getTokenFromLocalStorage)

// export const config = {
//   headers: {
//     Authorization: `Bearer ${getTokenFromLocalStorage !== null && getTokenFromLocalStorage
//         ? getTokenFromLocalStorage
//         : ""
//       }`,
//     Accept: "application/json",
//   },
// };
