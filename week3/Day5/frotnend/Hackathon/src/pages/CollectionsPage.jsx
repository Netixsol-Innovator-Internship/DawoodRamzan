"use client";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetTeasQuery } from "../features/api/apiSlice"; // ✅ RTK Query
import Header from "../components/Header";
import Footer from "../components/Footer";
import image from "../assets/h2.jpg";

// fallback images
const getFallbackImage = (teaId) => {
  const fallbackImages = [
    "/assets/t2.jpg",
    "/assets/t3.jpg",
    "/assets/t4.jpg",
    "/assets/t5.jpg",
    "/assets/t6.jpg",
    "/assets/t7.jpg",
    "/assets/t8.jpg",
  ];

  const hash = teaId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return fallbackImages[hash % fallbackImages.length];
};

const CollectionPage = () => {
  const { collectionName } = useParams();
  const navigate = useNavigate();

  // ✅ Use RTK Query instead of manual fetch
  const { data: teasData = [], isLoading, isError } = useGetTeasQuery();

  const [filteredTeas, setFilteredTeas] = useState([]);

  const [expandedSections, setExpandedSections] = useState({
    collections: true,
    origin: false,
    flavours: false,
    quality: false,
    caffeine: false,
    allergens: false,
    organic: false,
  });

  const [filters, setFilters] = useState({
    collections: [],
    origin: [],
    flavours: [],
    quality: [],
    caffeine: [],
    allergens: [],
    organic: false,
  });

  const [showFilters, setShowFilters] = useState(false);

  const filterOptions = {
    collections: [
      "Black tea",
      "Green tea",
      "White tea",
      "Chai",
      "Matcha",
      "Herbal teas",
      "Oolong",
      "Rooibos",
      "Tisane",
    ],
    origin: ["India", "Japan", "Sri Lanka", "South Africa"],
    flavours: [
      "Spicy",
      "Sweet",
      "Citrus",
      "Smooth",
      "Fruity",
      "Floral",
      "Grassy",
      "Minty",
      "Bitter",
      "Creamy",
    ],
    quality: ["Detox", "Energy", "Relax", "Digestion"],
    caffeine: [
      "No Caffeine",
      "Low Caffeine",
      "Medium Caffeine",
      "High Caffeine",
    ],
    allergens: ["Lactose-free", "Gluten-free", "Nut-free", "Soy-free"],
    organic: ["Yes", "No"],
  };

  // ✅ Filter when teas or filters change
  useEffect(() => {
    if (!teasData.length) return;

    let filtered = teasData.filter(
      (tea) => tea.collection && tea.collection.includes(collectionName)
    );

    if (filters.collections.length > 0) {
      filtered = filtered.filter((tea) =>
        filters.collections.some(
          (collection) => tea.collection && tea.collection.includes(collection)
        )
      );
    }

    if (filters.origin.length > 0) {
      filtered = filtered.filter((tea) =>
        filters.origin.some(
          (origin) => tea.origin && tea.origin.includes(origin)
        )
      );
    }

    if (filters.flavours.length > 0) {
      filtered = filtered.filter((tea) =>
        filters.flavours.some(
          (flavor) => tea.flavour && tea.flavour.includes(flavor)
        )
      );
    }

    if (filters.quality.length > 0) {
      filtered = filtered.filter((tea) =>
        filters.quality.some((q) => tea.quality && tea.quality.includes(q))
      );
    }

    if (filters.caffeine.length > 0) {
      filtered = filtered.filter((tea) =>
        filters.caffeine.includes(tea.caffeine)
      );
    }

    if (filters.allergens.length > 0) {
      filtered = filtered.filter((tea) =>
        filters.allergens.some(
          (allergen) => tea.allergens && tea.allergens.includes(allergen)
        )
      );
    }

    if (filters.organic) {
      filtered = filtered.filter((tea) => tea.organic === "Yes");
    }

    setFilteredTeas(filtered);
  }, [filters, teasData, collectionName]);

  const toggleFilter = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
  };

  const toggleOrganicFilter = () => {
    setFilters((prev) => ({
      ...prev,
      organic: !prev.organic,
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      collections: [],
      origin: [],
      flavours: [],
      quality: [],
      caffeine: [],
      allergens: [],
      organic: false,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="relative w-full">
        <div
          className="h-48 sm:h-64 md:h-80 lg:h-96 w-full bg-cover bg-center rounded-lg shadow-md"
          style={{ backgroundImage: `url(${image})` }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">{collectionName} Collection</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden bg-white border border-gray-300 px-4 py-2 rounded-md"
          >
            Filters
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div
            className={`lg:w-1/4 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            {/* FILTER PANEL */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear All
                </button>
              </div>

              {Object.keys(filterOptions).map((key) => (
                <div key={key} className="mb-4 border-b pb-4">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection(key)}
                  >
                    <h4 className="font-medium text-gray-800">
                      {key.toUpperCase()}
                    </h4>
                    <span className="text-gray-500">
                      {expandedSections[key] ? "-" : "+"}
                    </span>
                  </div>
                  {expandedSections[key] && (
                    <div className="mt-3 space-y-2">
                      {key === "organic" ? (
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.organic}
                            onChange={toggleOrganicFilter}
                            className="mr-2 rounded"
                          />
                          <span className="text-sm text-gray-600">Organic</span>
                        </label>
                      ) : (
                        filterOptions[key].map((option) => (
                          <label key={option} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters[key].includes(option)}
                              onChange={() => toggleFilter(key, option)}
                              className="mr-2 rounded"
                            />
                            <span className="text-sm text-gray-600">
                              {option}
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-3/4">
            {isLoading ? (
              <p className="text-center text-gray-600 py-12">Loading teas...</p>
            ) : isError ? (
              <p className="text-center text-red-600 py-12">
                Failed to load teas.
              </p>
            ) : filteredTeas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">
                  No teas found matching your filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">
                    Showing {filteredTeas.length} of {teasData.length} products
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTeas.map((tea) => (
                    <div
                      key={tea._id}
                      onClick={() => navigate(`/product/${tea._id}`)}
                      className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col cursor-pointer"
                    >
                      <img
                        src={getFallbackImage(tea._id)}
                        alt={tea.name}
                        className="h-48 w-full object-cover rounded-md mb-4"
                      />

                      <h3 className="font-semibold text-lg mb-2">{tea.name}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {tea.description}
                      </p>
                      <div className="mt-auto">
                        <span className="text-green-700 font-semibold text-lg">
                          ${tea.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CollectionPage;
