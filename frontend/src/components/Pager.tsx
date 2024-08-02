import React, { useEffect, useState, useRef } from "react";
import LoadingWheel from "./LoadingWheel";
import api from "../services/api";

interface PagerProps<T> {
  contentComponent: React.FC<{ items: T[]; refreshData: () => void }>;
  mapDataToItems: (data: any) => T[];
  endpoint: string;
  itemsPerPage: number;
}

const Pager = <T,>({
  contentComponent: ContentComponent,
  mapDataToItems,
  endpoint,
  itemsPerPage,
}: PagerProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pagerRef = useRef<HTMLDivElement>(null);
  const [pageNumbers, setPageNumbers] = useState<(string | number)[]>([]);
  const [currentItems, setCurrentItems] = useState<T[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(endpoint);
      const mappedData = mapDataToItems(response.data);
      setData(mappedData);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [endpoint]);

  const totalPages = () => Math.ceil(data.length / itemsPerPage);

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const newItems = data.slice(indexOfFirstItem, indexOfLastItem);
    setCurrentItems(newItems);
  }, [data, currentPage, itemsPerPage]);

  useEffect(() => {
    const calcPageNumbers = () => {
      let updatedPages: (number | string)[] = [];

      updatedPages.push(1);

      if (currentPage > 3) {
        updatedPages.push("...");
      }

      if (currentPage > 2) {
        updatedPages.push(currentPage - 1);
      }

      if (!updatedPages.includes(currentPage)) {
        updatedPages.push(currentPage);
      }

      if (currentPage < totalPages() - 1) {
        updatedPages.push(currentPage + 1);
      }

      if (currentPage < totalPages() - 2) {
        updatedPages.push("...");
      }

      if (!updatedPages.includes(totalPages())) {
        updatedPages.push(totalPages());
      }

      setPageNumbers(updatedPages);
    };
    calcPageNumbers();
  }, [data, itemsPerPage, endpoint, currentPage]);

  const scrollToTop = (instant: boolean = false) => {
    if (pagerRef.current) {
      var topY = pagerRef.current.getBoundingClientRect().top - 80; //compensation for the navBar sticky behaviour;
      window.scrollTo({ top: topY, behavior: instant ? "auto" : "smooth" });
    }
  };

  const handlePreviousPage = () => {
    scrollToTop();
    const newPage = currentPage === 1 ? currentPage : currentPage - 1;
    setTimeout(() => {
      scrollToTop(true);
      setCurrentPage(newPage);
    }, 150);
  };

  const handleNextPage = () => {
    scrollToTop();
    const newPage =
      currentPage === totalPages() ? currentPage : currentPage + 1;
    setTimeout(() => {
      scrollToTop(true);
      setCurrentPage(newPage);
    }, 150);
  };

  const handlePageClick = (page: number) => {
    scrollToTop();
    setTimeout(() => {
      scrollToTop(true);
      setCurrentPage(page);
    }, 150);
  };

  const renderPageNumbers = () => {
    return pageNumbers.map((page, index) =>
      typeof page === "number" ? (
        <button
          key={index}
          onClick={() => handlePageClick(page)}
          className={`px-4 py-2 rounded ${
            currentPage === page
              ? "bg-blue-500 text-white"
              : "bg-secondary text-secondaryText hover:bg-blue-400 hover:bg-opacity-50"
          }`}
        >
          {page}
        </button>
      ) : (
        <span key={index} className="px-4 py-2">
          {page}
        </span>
      )
    );
  };

  if (loading) {
    return <LoadingWheel />;
  }

  return (
    <div ref={pagerRef} className="w-full p-4">
      <ContentComponent items={currentItems} refreshData={fetchData} />
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 w-24 bg-secondary hover:bg-blue-400 hover:bg-opacity-50 text-secondaryText rounded disabled:opacity-50 disabled:bg-secondary"
        >
          Previous
        </button>
        {renderPageNumbers()}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages()}
          className="px-4 py-2 w-24 bg-secondary hover:bg-blue-400 hover:bg-opacity-50 text-secondaryText rounded disabled:opacity-50 disabled:bg-secondary"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pager;
