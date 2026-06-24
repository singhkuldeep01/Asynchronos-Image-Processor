import axiosInstance from "./axios";


export const uploadImage = async (formData) => {
  const response = await axiosInstance.post(
    "/image/upload",
    formData,
    {
  headers: {
    "Content-Type": "multipart/form-data",
  },
}
  );

  console.log("Upload response:", response.data);

  return response.data;
};

export default uploadImage;