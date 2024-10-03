import React, { useEffect, useState, useRef } from "react";
import LoadingWheel from "./LoadingWheel";
import api from "../services/api";

interface PagerProps<T> {
  contentComponent: React.FC<{ items: T[]; refreshData: () => void }>;
  mapDataToItems?: (data: any) => T[];
  endpoint?: string;
  itemsPerPage: number;
  items?: T[];
  topScrollMargin?: number;
  initialPage?: number;
  pageChangedCallback?: (pageIndex: number, items: T[]) => void;
}

const Pager = <T,>({
  contentComponent: ContentComponent,
  mapDataToItems,
  endpoint,
  itemsPerPage,
  items,
  topScrollMargin = 0,
  initialPage = 1,
  pageChangedCallback,
}: PagerProps<T>) => {
  const [data, setData] = useState<T[]>(items || []);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [loading, setLoading] = useState(!items);
  const [pageNumbers, setPageNumbers] = useState<(string | number)[]>([]);
  const [currentItems, setCurrentItems] = useState<T[]>([]);

  const fetchData = async () => {
    if (endpoint && mapDataToItems) {
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
    }
  };

  useEffect(() => {
    if (!items && endpoint) {
      fetchData();
    }
  }, [endpoint]);

  const totalPages = () => Math.ceil(data.length / itemsPerPage);

  useEffect(() => {
    if (items) {
      setData(items);
    }
  }, [items]);
  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const newItems = data.slice(indexOfFirstItem, indexOfLastItem);
    setCurrentItems(newItems);
  }, [data, currentPage, itemsPerPage]);

  useEffect(() => {
    if (pageChangedCallback) {
      pageChangedCallback(currentPage, currentItems);
    }
  }, [currentItems]);
  useEffect(() => {
    const calcPageNumbers = () => {
      let updatedPages: (number | string)[] = [];

      if (totalPages() < 2) {
        setPageNumbers(updatedPages);
        return;
      }

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
  }, [data, currentPage, itemsPerPage]);

  useEffect(() => {
    scrollToTop(true);
  }, [currentPage]);

  const scrollToTop = (instant: boolean = false) => {
    window.scrollTo({
      top: topScrollMargin,
      behavior: instant ? "auto" : "smooth",
    });
  };

  const handlePreviousPage = () => {
    scrollToTop();
    const newPage = currentPage === 1 ? currentPage : currentPage - 1;
    setTimeout(() => {
      setCurrentPage(newPage);
    }, 150);
  };

  const handleNextPage = () => {
    scrollToTop();
    const newPage =
      currentPage === totalPages() ? currentPage : currentPage + 1;
    setTimeout(() => {
      setCurrentPage(newPage);
    }, 150);
  };

  const handlePageClick = (page: number) => {
    scrollToTop();
    setTimeout(() => {
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
    <div className="w-full h-full px-4 pt-4 pb-14 relative">
      <ContentComponent items={currentItems} refreshData={fetchData} />
      <div className="flex justify-center mt-4 space-x-2 absolute bottom-0 left-1/2 -translate-x-1/2">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 w-24 bg-secondary hover:bg-blue-400 hover:bg-opacity-50 text-secondaryText rounded disabled:opacity-50 disabled:bg-secondary ${
            totalPages() < 2 ? "hidden" : ""
          }`}
        >
          Previous
        </button>
        {renderPageNumbers()}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages()}
          className={`px-4 py-2 w-24 bg-secondary hover:bg-blue-400 hover:bg-opacity-50 text-secondaryText rounded disabled:opacity-50 disabled:bg-secondary ${
            totalPages() < 2 ? "hidden" : ""
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pager;
