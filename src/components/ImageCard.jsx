import { Heart } from "lucide-react";
import { useLikeImageMutation } from "../features/images/imageApi";
import { useNavigate } from "react-router-dom";

const ImageCard = ({ image, forceLiked = false }) => {
  const navigate = useNavigate();
  const [likeImage, { isLoading }] = useLikeImageMutation();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const isLiked = forceLiked || image.likes?.includes(userId);

  const handleLike = async () => {
    // 🔐 Auth Guard (VERY IMPORTANT)
    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      await likeImage(image._id).unwrap();
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all">
      <div className="relative">
        <img
          src={image.imageUrl}
          alt={image.title}
          className="h-56 w-full object-cover group-hover:scale-105 transition"
        />

        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={isLoading}
          className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow disabled:opacity-60"
        >
          <Heart
            size={18}
            className={
              isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
            }
          />
        </button>
      </div>

      <div className="p-4 space-y-1">
        <h3 className="font-semibold text-gray-800 truncate">
          {image.title}
        </h3>

        <p className="text-sm text-gray-500">
          Uploaded by {image.uploadedBy}
        </p>

        <Heart className="inline mr-1" size={14} />
        <p className="text-sm text-gray-600 inline">
          {image.likes.length} likes
        </p>
      </div>
    </div>
  );
};

export default ImageCard;
