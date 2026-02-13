import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useGetImagesQuery } from "../features/images/imageApi";
import ImageCard from "../components/ImageCard";
import ImageCardSkeleton from "../components/ImageCardSkeleton";

const LIMIT = 12;

const Home = () => {
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [allImages, setAllImages] = useState([]);

  const { data, isLoading, isFetching } = useGetImagesQuery({
    sort,
    page,
    limit: LIMIT,
  });

  // Append new data when page changes
  useEffect(() => {
    if (!data) return;

    if (page === 1) {
      // Reset on first page
      setAllImages(data.images);
    } else {
      setAllImages((prev) => {
        // Prevent duplicates using _id
        const existingIds = new Set(prev.map((img) => img._id));
        const newImages = data.images.filter(
          (img) => !existingIds.has(img._id)
        );
        return [...prev, ...newImages];
      });
    }
  }, [data, page]);

  const fetchNextPage = () => {
    if (data && page < data.totalPages && !isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  const handleSortChange = (value) => {
    setSort(value);
    setPage(1);
    setAllImages([]); // reset
  };

  return (
    <div className="w-[90%] mx-auto px-4 py-8">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-0">
          Explore Images
        </h1>

        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="mt-4 sm:mt-0 border rounded-lg px-4 py-2 text-sm dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="popular">Most Liked</option>
        </select>
      </div>

      {isLoading && page === 1 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <ImageCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <InfiniteScroll
          dataLength={allImages.length}
          next={fetchNextPage}
          hasMore={data ? page < data.totalPages : false}
          loader={
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <ImageCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {allImages.map((image) => (
              <ImageCard key={image._id} image={image} />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Home;
