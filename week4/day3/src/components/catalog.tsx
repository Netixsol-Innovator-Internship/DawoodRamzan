export function Catalog() {
  return (
    <section className="bg-[#121212] text-white">
      <div className="container mx-auto px-4 py-10 ">
        <div className="flex flex-col md:flex-row items-center md:items-stretch rounded-lg overflow-hidden shadow-lg">
          {/* Banner Image */}
          <div className="w-full md:w-1/2">
            <img
              src="/catalog.jpg"
              alt="Catalog Banner"
              className="w-full h-64 md:h-full object-cover"
            />
          </div>

          {/* Overlay Content */}
          <div className="w-full md:w-1/2  bg-opacity-50 flex items-center justify-center p-6 text-white">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-4xl font-bold mb-4">
                Explore our Catalog
              </h1>
              <p className="text-base md:text-xl">
                Browse by genre, features, price, and more to find your next
                favorite game.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
