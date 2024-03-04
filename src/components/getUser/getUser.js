import api from "../../axios/api";

export const getUser = async () => {
  const userInSession = sessionStorage.getItem("user");
  console.log(JSON.parse(userInSession));

  if (userInSession) {
    const token = JSON.parse(userInSession).access_token;
    const _id = JSON.parse(userInSession)._id;

    try {
      const response = await api.post("/user-by-id", { _id });

      const user = {
        access_token: token,
        _id: response.data._id,
        logoURL: response.data.logoURL,
        companyName: response.data.companyName,
        role: response.data.role,
        notificationStatus: response.data.notificationStatus,
        task: response.data.task,
       
      };

      return user;
    } catch (err) {
      console.log(err.message);
    }
  }

  return false;
};
