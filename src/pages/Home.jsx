import { useState } from "react";
import { useGetImagesQuery } from "../features/images/imageApi";
import ImageCard from "../components/ImageCard";
import ImageCardSkeleton from "../components/ImageCardSkeleton";

const Home = () => {
  const [sort, setSort] = useState("newest");

  const { data: images = [], isLoading } = useGetImagesQuery({ sort });

  return (
    <div className="w-[90%] mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Explore Images
        </h1>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="mt-4 sm:mt-0 border rounded-lg px-4 py-2 text-sm"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="popular">Most Liked</option>
        </select>
      </div>

      {/* Content */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <ImageCardSkeleton key={i} />
            ))
          : images.length === 0
          ? <p className="text-gray-500">No images found</p>
          : images.map((image) => (
              <ImageCard key={image._id} image={image} />
            ))}
      </div>
    </div>
  );
};

export default Home;
