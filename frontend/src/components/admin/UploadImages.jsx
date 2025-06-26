import { useEffect, useRef, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";
import { IoTrashBinSharp } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteProductImageMutation,
  useGetProductDetailsQuery,
  useUploadProductImagesMutation,
} from "../../redux/api/productApi";
import toast from "react-hot-toast";
import MetaData from "../Layout/MetaData";

const UploadImages = () => {
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  const fileInputRef = useRef(null);

  const [uploadProductImages, { isLoading, error, isSuccess }] =
    useUploadProductImagesMutation();

  const [
    deleteProductImage,
    { isLoading: isDeleteLoading, error: deleteError },
  ] = useDeleteProductImageMutation();

  const { data } = useGetProductDetailsQuery(params?.id);

  useEffect(() => {
    if (data?.product) {
      setUploadedImages(data?.product?.images);
    }

    if (error) {
      toast.error(error?.data?.message);
    }

    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }

    if (isSuccess) {
      setImagesPreview([]);
      toast.success("Product Images Uploaded.");
      navigate("/admin/products");
    }
  }, [data, error, deleteError, isSuccess]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    uploadProductImages({ id: params?.id, body: { images } });
  };

  const onChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleResetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImagePreviewDelete = (image) => {
    const filteredImagesPreview = imagesPreview.filter((img) => img !== image);

    setImages(filteredImagesPreview);
    setImagesPreview(filteredImagesPreview);
  };

  const deleteImage = (imgId) => {
    deleteProductImage({ id: params?.id, body: { imgId } });
  };

  return (
    <AdminLayout>
      <MetaData title="Upload Product Image" />
      <div className="flex justify-center items-center">
        <div className="w-full max-w-3xl p-8">
          <form
            className="space-y-6"
            encType="multipart/form-data"
            onSubmit={submitHandler}
          >
            <h2 className="block text-xl font-semibold text-gray-700 mb-2">
              Upload Product Images
            </h2>

            <div className="mb-3">
              <label
                htmlFor="customFile"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Choose Images
              </label>

              <div className="border border-gray-300 rounded-sm">
                <input
                  ref={fileInputRef}
                  type="file"
                  name="product_images"
                  className="block w-full text-sm text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-l-sm file:text-sm file:font-semibold
                     file:bg-black file:text-white hover:file:bg-black"
                  id="customFile"
                  multiple
                  onChange={onChange}
                  onClick={handleResetFileInput}
                />
              </div>

              {/* <!-- New Images --> */}
              {imagesPreview?.length > 0 && (
                <div className="my-4">
                  <p className="block text-sm font-semibold text-gray-700 mb-2">
                    New Images:
                  </p>
                  <div className="flex flex-wrap gap-4 mt-4">
                    {imagesPreview?.map((img, index) => (
                      <div key={index} className="w-24">
                        <div className="border rounded shadow">
                          <img
                            src={img}
                            alt="Card"
                            className="w-full h-20 object-cover p-2"
                          />
                          <button
                            type="button"
                            className="w-full bg-red-600 text-white text-sm py-1 rounded-b hover:bg-red-700 cursor-pointer  flex items-center justify-center"
                            onClick={() => handleImagePreviewDelete(img)}
                          >
                            <RxCross2 size={18} className="" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* <!-- End New Images --> */}

              {/* <!-- Uploaded Images --> */}
              {uploadedImages?.length > 0 && (
                <div className="my-4">
                  <p className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Uploaded Images:
                  </p>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {uploadedImages?.map((img, index) => (
                      <div key={index} className="w-24">
                        <div className="border rounded shadow">
                          <img
                            src={img?.url}
                            alt="Card"
                            className="w-full h-20 object-cover p-2"
                          />
                          <button
                            className={`w-full bg-red-600 text-white text-sm py-1 rounded-b transition-opacity cursor-pointer flex items-center justify-center ${
                              isDeleteLoading
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-red-700"
                            }`}
                            type="button"
                            disabled={isDeleteLoading}
                            onClick={() => deleteImage(img?.public_id)}
                          >
                            <IoTrashBinSharp
                              size={18}
                              className="text-center"
                            />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* <!-- End Uploaded Image 1 --> */}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition-colors"
              disabled={isLoading || isDeleteLoading}
            >
              {isLoading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UploadImages;
