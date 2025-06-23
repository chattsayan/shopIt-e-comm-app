import { useNavigate } from "react-router-dom";
import UserLayout from "../Layout/UserLayout";
import { useEffect, useState } from "react";
import { useUploadAvatarMutation } from "../../redux/api/userApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import MetaData from "../Layout/MetaData";

const UploadAvatar = () => {
  const { user } = useSelector((state) => state.user);
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar ? user?.avatar?.url : "/images/default_avatar.jpg"
  );
  const navigate = useNavigate();

  const [uploadAvatar, { isLoading, error, isSuccess }] =
    useUploadAvatarMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "Failed to upload avatar");
    }

    if (isSuccess) {
      toast.success("Profile Image Updated Successfully!");
      navigate("/me/profile");
    }
  }, [error, isSuccess]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!avatar) {
      toast.error("Please select an image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", avatar);

      await uploadAvatar(formData).unwrap();
    } catch (error) {
      console.error("Upload error:", error);
      // Error is handled in useEffect
    }
  };

  const onChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      setAvatar(file);

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <UserLayout>
      <MetaData title={"Upload Avatar"} />
      <div className="flex justify-center items-center">
        <div className="w-full p-8">
          <form onSubmit={submitHandler} className="space-y-8">
            <div className="flex items-center gap-6">
              <div>
                <img
                  src={avatarPreview}
                  alt="image"
                  className="rounded-full w-32 h-32 object-cover border-4 border-gray-200"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="customFile"
                  className="font-bold text-gray-600 mb-2 block"
                >
                  Choose Avatar
                </label>
                <input
                  type="file"
                  name="avatar"
                  id="customFile"
                  accept="image/*"
                  onChange={onChange}
                  className="block w-full text-sm text-gray-700 border border-gray-300 cursor-pointer bg-gray-50 p-1 rounded-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum file size: 10MB. Supported formats: JPG, PNG, GIF
                </p>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-orange-500 text-white font-semibold rounded-md shadow hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>
      </div>
    </UserLayout>
  );
};

export default UploadAvatar;
