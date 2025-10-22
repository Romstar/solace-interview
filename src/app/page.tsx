"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Specialty {
  name: string;
  description: string;
}

interface Advocate {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  yearsOfExperience: number;
  phoneNumber: string;
  specialtyName?: string;
  specialtyDescription?: string;
  specialties?: Specialty[]; // Array of specialty objects
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize state from URL parameters
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || "");
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get('limit') || '50'));
  const [totalCount, setTotalCount] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to update URL parameters
  const updateURL = useCallback((query: string, page: number, limit: number) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (page > 1) params.set('page', page.toString());
    if (limit !== 50) params.set('limit', limit.toString());
    
    const newURL = params.toString() ? `?${params.toString()}` : '/';
    router.replace(newURL, { scroll: false });
  }, [router]);

  // Function to fetch advocates from search endpoint
  const fetchAdvocates = async (query = "", page = currentPage, size = pageSize) => {
    setLoading(true);
    try {
      let advocatesData: Advocate[] = [];
      
      // Calculate offset based on current page and page size
      const offset = (page - 1) * size;
      
      // Use search endpoint for specific queries
      const url = `/api/advocates/search?q=${encodeURIComponent(query)}&limit=${size}&offset=${offset}`;
      const response = await fetch(url);
      const jsonResponse = await response.json();
      
      if (response.ok) {
        advocatesData = jsonResponse.advocates || [];
        setTotalCount(jsonResponse.totalCount || 0);
      } else {
        console.error("Error searching advocates:", jsonResponse.error);
        return;
      }
      
      setAdvocates(advocatesData);
      setFilteredAdvocates(advocatesData);
      
      // Update URL parameters
      updateURL(query, page, size);
    } catch (error) {
      console.error("Error fetching advocates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const query = searchParams.get('q') || "";
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    fetchAdvocates(query, page, limit);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback((query: string) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchAdvocates(query, 1, pageSize);
    }, 300);
  }, [pageSize, updateURL]); // eslint-disable-line react-hooks/exhaustive-deps

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    const searchTermElement = document.getElementById("search-term");
    if (searchTermElement) {
      searchTermElement.innerHTML = newSearchTerm;
    }

    // Use debounced search
    debouncedSearch(newSearchTerm);
  };

  const onClick = () => {
    console.log("resetting search...");
    setSearchTerm("");
    setCurrentPage(1);
    const searchTermElement = document.getElementById("search-term");
    if (searchTermElement) {
      searchTermElement.innerHTML = "";
    }
    fetchAdvocates("", 1, pageSize);
  };

  // Pagination functions
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchAdvocates(searchTerm, newPage, pageSize);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    fetchAdvocates(searchTerm, 1, newPageSize);
  };

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / pageSize);
  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalCount);

  return (
    <main className="m-6 flex flex-col items-center min-h-screen">
      <h1 className="text-center text-3xl font-bold mb-8">Solace Advocates</h1>
      
      <div className="text-center mb-5">
        <p className="text-lg mb-2">Search</p>
        <p className="mb-4">
          Searching for: <span id="search-term" className="font-semibold text-blue-600"></span>
        </p>
        <input 
          className="border border-gray-300 rounded px-3 py-2 mx-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          onChange={onChange} 
          value={searchTerm}
          placeholder="Search advocates..."
        />
        <button 
          onClick={onClick} 
          className="mx-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Reset Search
        </button>
        {loading && <p className="mt-2 text-gray-600">Loading...</p>}
      </div>

      {/* Page Size Selector */}
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="page-size" className="text-sm font-medium text-gray-700">
          Records per page:
        </label>
        <select
          id="page-size"
          value={pageSize}
          onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={200}>200</option>
        </select>
      </div>
      
      <div className="w-full flex justify-center">
        <div className="w-11/12 max-w-6xl border border-gray-300 shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 grid grid-cols-7 gap-0">
            <div className="border-r border-gray-300 p-3 text-left font-semibold">First Name</div>
            <div className="border-r border-gray-300 p-3 text-left font-semibold">Last Name</div>
            <div className="border-r border-gray-300 p-3 text-left font-semibold">City</div>
            <div className="border-r border-gray-300 p-3 text-left font-semibold">Degree</div>
            <div className="border-r border-gray-300 p-3 text-left font-semibold">Specialties</div>
            <div className="border-r border-gray-300 p-3 text-left font-semibold">Years of Experience</div>
            <div className="p-3 text-left font-semibold">Phone Number</div>
          </div>
          
          {/* Body */}
          {filteredAdvocates.length > 0 ? (
            filteredAdvocates.map((advocate) => {
              return (
                <div key={advocate.id} className="bg-white hover:bg-gray-50 transition-colors grid grid-cols-7 gap-0 border-t border-gray-300">
                  <div className="border-r border-gray-300 p-3">{advocate.firstName}</div>
                  <div className="border-r border-gray-300 p-3">{advocate.lastName}</div>
                  <div className="border-r border-gray-300 p-3">{advocate.city}</div>
                  <div className="border-r border-gray-300 p-3">{advocate.degree}</div>
                  <div className="border-r border-gray-300 p-3">
                    {advocate.specialtyName ? (
                      <div>{advocate.specialtyName}</div>
                    ) : advocate.specialties && advocate.specialties.length > 0 ? (
                      advocate.specialties.map((specialty, index) => (
                        <div key={index} className="mb-1">
                          <div className="font-medium">{specialty.name}</div>
                          {specialty.description && (
                            <div className="text-sm text-gray-600">{specialty.description}</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 italic">No specialties</div>
                    )}
                  </div>
                  <div className="border-r border-gray-300 p-3">{advocate.yearsOfExperience}</div>
                  <div className="p-3">{advocate.phoneNumber}</div>
                </div>
              );
            })
          ) : (
            <div className="text-center p-5 text-gray-500 italic bg-white">
              No advocates found
            </div>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalCount > 0 && (
        <div className="mt-6 flex flex-col items-center gap-4">
          {/* Pagination Info */}
          <div className="text-sm text-gray-600">
            Showing {startRecord} to {endRecord} of {totalCount} records
          </div>
          
          {/* Pagination Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
