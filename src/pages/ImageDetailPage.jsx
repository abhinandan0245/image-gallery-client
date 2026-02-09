import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Heart, 
  ArrowLeft, 
  Calendar, 
  User, 
  Tag, 
  Share2, 
  Download,
  MoreVertical,
  Image as ImageIcon
} from "lucide-react";
import { 
  useGetImageByIdQuery, 
  useLikeImageMutation,
  useGetImagesBySameAdminQuery // 👈 Use the new hook
} from "../features/images/imageApi";

const ImageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Fetch current image
  const { data: image, isLoading, error } = useGetImageByIdQuery(id);
  
  // Fetch more images by same admin using the new API
  const { 
    data: sameAdminImages = [], 
    isLoading: loadingSameAdminImages,
    error: sameAdminError 
  } = useGetImagesBySameAdminQuery(id, {
    skip: !id // Skip if no image ID
  });

  // Debug logs
  useEffect(() => {
    if (image) {
      console.log("Current Image:", {
        id: image._id,
        title: image.title,
        uploadedBy: image.uploadedBy
      });
    }
    if (sameAdminImages.length > 0) {
      console.log("Same Admin Images:", {
        count: sameAdminImages.length,
        images: sameAdminImages.map(img => ({ id: img._id, title: img.title }))
      });
    }
    if (sameAdminError) {
      console.error("Error fetching same admin images:", sameAdminError);
    }
  }, [image, sameAdminImages, sameAdminError]);
  
  const [likeImage, { isLoading: isLiking }] = useLikeImageMutation();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  useEffect(() => {
    if (image) {
      setIsLiked(image.likes?.includes(userId));
      setLikeCount(image.likes?.length || 0);
    }
  }, [image, userId]);

  const handleLike = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;

    setIsLiked(!isLiked);
    setLikeCount(prev => !previousIsLiked ? prev + 1 : prev - 1);

    try {
      await likeImage(id).unwrap();
    } catch (err) {
      console.error("Like failed", err);
      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image.imageUrl;
    link.download = image.title || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!image) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title,
          text: `Check out this image: ${image.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Render same admin images
  const renderSameAdminImages = () => {
    if (loadingSameAdminImages) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    
    if (sameAdminError) {
      console.error("Error loading same admin images:", sameAdminError);
      return (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-sm">Error loading more images</p>
        </div>
      );
    }
    
    if (sameAdminImages.length === 0) {
      return (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500 text-sm">No other images by this admin</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-3 gap-3">
        {sameAdminImages.slice(0, 6).map((adminImage) => (
          <Link
            key={adminImage._id}
            to={`/image/${adminImage._id}`}
            className="group block aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <div className="relative h-full w-full">
              <img
                src={adminImage.imageUrl}
                alt={adminImage.title}
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>
        ))}
        
        {/* View All Link - if you have a user/admin page */}
        {sameAdminImages.length > 6 && (
          <div className="aspect-square bg-gray-100 rounded-lg hover:bg-gray-200 flex flex-col items-center justify-center text-gray-600 transition-colors cursor-pointer">
            <MoreVertical size={24} className="mb-2" />
            <span className="text-xs font-medium">View All</span>
            <span className="text-xs text-gray-500">+{sameAdminImages.length - 6} more</span>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-red-500 text-6xl mb-4">😞</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Image Not Found</h1>
        <p className="text-gray-600 mb-6">The image you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center px-4 py-2 rounded-lg transition ${
                  isLiked 
                    ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart 
                  size={18} 
                  className={`mr-2 ${isLiked ? 'fill-red-600' : ''}`} 
                />
                {isLiked ? 'Liked' : 'Like'} ({likeCount})
              </button>
              
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <Share2 size={20} />
              </button>
              
              <button
                onClick={handleDownload}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <Download size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:w-2/3 bg-gray-900">
              <div className="relative h-[70vh] flex items-center justify-center">
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>

            {/* Details Section */}
            <div className="md:w-1/3 p-6 md:p-8">
              <div className="space-y-6">
                {/* Title & Author */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {image.title}
                  </h1>
                  <div className="flex items-center text-gray-600">
                    <User size={16} className="mr-2" />
                    <span className="font-medium">{image.uploadedBy}</span>
                  </div>
                </div>

                {/* Description */}
                {image.description && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {image.description}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {image.tags && image.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      <Tag size={16} className="inline mr-1" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {image.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Likes</span>
                    <span className="font-semibold">{likeCount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Upload Date</span>
                    <span className="font-semibold flex items-center">
                      <Calendar size={14} className="mr-2" />
                      {formatDate(image.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Views</span>
                    <span className="font-semibold">{image.views || 0}</span>
                  </div>
                </div>

                {/* More Images by Same Admin - Updated Section */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    More by {image.uploadedBy}
                  </h3>
                  
                  {renderSameAdminImages()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDetailPage;