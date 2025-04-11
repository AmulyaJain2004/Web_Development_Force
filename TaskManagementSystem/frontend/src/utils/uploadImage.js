import {API_PATHS} from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
    const formData = new FormData();

    // Append image file to form data
    formData.append("image", imageFile);

    try {
        const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
            headers: {
                "Content-Type": "multipart/form-data", // Set header for file upload
            },
        });

        return response.data; // Assuming the API returns the image URL in the response
    }
    catch (error) {
        console.error("Error uploading image:", error);
        throw error; // Rethrow the error for handling in the calling function
    }
};

export default uploadImage;
