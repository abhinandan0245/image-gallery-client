import { useGetLikedImagesQuery } from "../features/images/imageApi";
import ImageCard from "../components/ImageCard";

const LikedImages = () => {
  const { data: images = [], isLoading } = useGetLikedImagesQuery();

  return (
    <div className="w-[90%] mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">❤️ Your Liked Images</h1>

      {isLoading ? (
        <p>Loading liked images...</p>
      ) : images.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          ❤️
          <p className="mt-2 text-lg">You haven't liked any images yet</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4">  
          {images.map((image) => (
            <ImageCard key={image._id} image={image} forceLiked={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedImages;
