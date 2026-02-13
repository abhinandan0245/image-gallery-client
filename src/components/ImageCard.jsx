import { Heart, Eye } from "lucide-react";
import { useLikeImageMutation } from "../features/images/imageApi";
import { useNavigate, Link } from "react-router-dom";
import React, { useState } from "react";

const ImageCard =  React.memo(({ image, forceLiked = false }) => {
  const navigate = useNavigate();
  const [likeImage, { isLoading }] = useLikeImageMutation();
  const [optimisticLiked, setOptimisticLiked] = useState(false);
  const [optimisticLikeCount, setOptimisticLikeCount] = useState(image.likes?.length || 0);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const isLiked = forceLiked || image.likes?.includes(userId);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!userId) {
      navigate("/login");
      return;
    }

    // Optimistic update
    const wasLiked = isLiked || optimisticLiked;
    setOptimisticLiked(!wasLiked);
    setOptimisticLikeCount(prev => wasLiked ? prev - 1 : prev + 1);

    try {
      await likeImage(image._id).unwrap();
    } catch (err) {
      // Rollback optimistic update on error
      console.error("Like failed", err);
      setOptimisticLiked(wasLiked);
      setOptimisticLikeCount(prev => wasLiked ? prev + 1 : prev - 1);
    }
  };

  // Calculate final like status and count
  const finalIsLiked = optimisticLiked !== false ? optimisticLiked : isLiked;
  const finalLikeCount = optimisticLikeCount;

  return (
    <Link 
      to={`/image/${image._id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 block"
    >
      <div className="relative overflow-hidden">
        {/* Image Container */}
        <div className="relative h-64 w-full">
          <img
            src={image.imageUrl}
            alt={image.title}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2">
          {/* View Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate(`/image/${image._id}`);
            }}
            className="bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
            title="View Image"
          >
            <Eye size={16} className="text-gray-700" />
          </button>

          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={isLoading}
            className="bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            title={finalIsLiked ? "Unlike" : "Like"}
          >
            <Heart
              size={18}
              className={
                finalIsLiked 
                  ? "fill-red-500 text-red-500 animate-pulse-once" 
                  : "text-gray-600 group-hover:text-red-400"
              }
            />
          </button>
        </div>

        {/* Badges */}
        {image.tags && image.tags.length > 0 && (
          <div className="absolute bottom-3 left-3 flex gap-1 flex-wrap max-w-[70%]">
            {image.tags.slice(0, 2).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-black/70 text-white text-xs rounded-full backdrop-blur-sm"
              >
                #{tag}
              </span>
            ))}
            {image.tags.length > 2 && (
              <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full backdrop-blur-sm">
                +{image.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-gray-900 text-lg truncate pr-2">
            {image.title}
          </h3>
          <span className="flex items-center text-gray-600 text-sm whitespace-nowrap">
            <Heart 
              size={14} 
              className={finalIsLiked ? "fill-red-500 text-red-500 mr-1" : "mr-1"} 
            />
            {finalLikeCount}
          </span>
        </div>

        {image.description && (
          <p className="text-gray-600 text-sm line-clamp-2">
            {image.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center">
            {image.uploadedByAvatar ? (
              <img
                src={image.uploadedByAvatar}
                alt={image.uploadedBy}
                className="w-6 h-6 rounded-full mr-2"
              />
            ) : (
              <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mr-2 flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {image.uploadedBy?.charAt(0) || "U"}
                </span>
              </div>
            )}
            <p className="text-sm text-gray-700 truncate">
              {image.uploadedBy}
            </p>
          </div>
          
          <span className="text-xs text-gray-500">
            {new Date(image.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
});

export default ImageCard;