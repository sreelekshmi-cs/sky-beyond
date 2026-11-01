
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart, faMagnifyingGlass, faXmark, faDownload,
  faArrowLeft, faArrowRight, faBars, faImages
} from "@fortawesome/free-solid-svg-icons";
import ImageCard from "./ImageCard";
import { images } from "./images";

function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("skyFavorites")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("skyFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const categories = ["All", ...new Set(images.map(img => img.category))];

  const filteredImages = images.filter(img =>
    (img.title.toLowerCase().includes(search.toLowerCase()) ||
     img.description.toLowerCase().includes(search.toLowerCase())) &&
    (category === "All" || img.category === category) &&
    (!showFavorites || favorites.includes(img.id))
  );

  const toggleFavorite = id => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const changeImage = direction => {
    const index = filteredImages.findIndex(img => img.id === selectedImage?.id);
    if (index < 0) return;
    const next = (index + direction + filteredImages.length) % filteredImages.length;
    setSelectedImage(filteredImages[next]);
  };

  const selectCategory = item => {
    setCategory(item);
    setShowFavorites(false);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#101113] text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-5 py-5 lg:hidden">
        <span className="font-bold uppercase tracking-[0.18em]">SKY & BEYOND</span>
        <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <FontAwesomeIcon icon={faBars} />
        </button>
      </header>

      <div className="lg:flex">
        <aside className={`border-r border-white/10 bg-[#101113] px-7 py-10 lg:sticky lg:top-0 lg:block lg:h-screen lg:w-64 lg:shrink-0 lg:px-9 ${menuOpen ? "block" : "hidden"}`}>
          <div className="mb-16 hidden lg:block">
            <h2 className="text-xl font-extrabold tracking-[0.14em]">SKY & BEYOND</h2>
            <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-gray-500">Celestial Photography</p>
          </div>

          <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-500">Collections</p>
          <nav className="space-y-6">
            {categories.map(item => (
              <button
                key={item}
                onClick={() => selectCategory(item)}
                className={`block text-left text-xs font-semibold uppercase tracking-[0.15em] transition hover:text-white ${
                  category === item && !showFavorites ? "text-white" : "text-gray-500"
                }`}
              >
                {item === "All" ? "All Photography" : item}
              </button>
            ))}
          </nav>

          <div className="my-10 border-t border-white/10" />

          <button
            onClick={() => { setShowFavorites(true); setMenuOpen(false); }}
            className={`flex items-center gap-3 text-xs uppercase tracking-widest ${showFavorites ? "text-white" : "text-gray-500"}`}
          >
            <FontAwesomeIcon icon={faHeart} />
            Favorites ({favorites.length})
          </button>

          <div className="mt-16 space-y-5 text-xs text-gray-500">
            <p>ABOUT THE COLLECTION</p>
            <p>A JOURNEY ABOVE THE EARTH</p>
          </div>
          <p className="mt-16 text-[10px] text-gray-600">
            © {new Date().getFullYear()} Sky & Beyond
          </p>
        </aside>

        <main className="min-w-0 flex-1 px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
          <div className="mb-12 flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <div>
              <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-gray-500">
                A COLLECTION OF THE SKY
              </p>
              <h1 className="text-4xl font-semibold uppercase tracking-tight sm:text-5xl lg:text-6xl">
                {showFavorites ? "FAVORITES" : category === "All" ? "BEYOND THE SKY" : category.toUpperCase()}
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-gray-400">
                Explore the beauty of the sky through a carefully curated
                collection of moonlight, clouds, stars and sunsets.
              </p>
            </div>

            <div className="relative w-full md:w-64">
              <FontAwesomeIcon icon={faMagnifyingGlass}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-sm text-gray-500" />
              <input
                placeholder="Search photographs"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border-b border-white/20 bg-transparent py-3 pl-7 pr-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-white"
              />
            </div>
          </div>

          <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-[11px] uppercase tracking-[0.2em] text-gray-400">
              {filteredImages.length} Photographs
            </span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-gray-500">
              <FontAwesomeIcon icon={faImages} className="mr-2" /> Gallery
            </span>
          </div>

          {filteredImages.length ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredImages.map(img => (
                <ImageCard
                  key={img.id}
                  image={img}
                  onPreview={setSelectedImage}
                  isFavorite={favorites.includes(img.id)}
                  onFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <p className="py-24 text-center text-gray-500">No photographs found.</p>
          )}
        </main>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-y-auto bg-[#191a1c] lg:flex-row"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              aria-label="Close image details"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center bg-black/70"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <div className="flex min-h-64 items-center justify-center bg-black lg:w-2/3">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-h-[65vh] w-full object-contain"
              />
            </div>

            <div className="flex flex-col justify-between p-7 lg:w-1/3 lg:p-9">
              <div>
                <p className="mb-4 text-[11px] uppercase tracking-[0.25em] text-gray-500">
                  {selectedImage.category}
                </p>
                <h2 className="text-3xl font-semibold">{selectedImage.title}</h2>
                <p className="mt-6 text-sm leading-7 text-gray-400">
                  {selectedImage.description}
                </p>
                <div className="mt-9 border-t border-white/10 pt-6">
                  <p className="text-[11px] uppercase tracking-widest text-gray-500">Collection</p>
                  <p className="mt-2 text-sm">{selectedImage.category}</p>
                </div>
              </div>

              <div className="mt-10">
                <div className="flex items-center gap-5">
                  <button onClick={() => toggleFavorite(selectedImage.id)} className="text-sm">
                    <FontAwesomeIcon
                      icon={faHeart}
                      className={`mr-2 ${favorites.includes(selectedImage.id) ? "text-pink-500" : ""}`}
                    />
                    Favorite
                  </button>
                  <a href={selectedImage.src} download className="text-sm">
                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                    Download
                  </a>
                </div>

                <div className="mt-8 flex justify-between border-t border-white/10 pt-5">
                  <button onClick={() => changeImage(-1)} aria-label="Previous image">
                    <FontAwesomeIcon icon={faArrowLeft} />
                  </button>
                  <span className="text-xs uppercase tracking-widest text-gray-500">
                    Explore Collection
                  </span>
                  <button onClick={() => changeImage(1)} aria-label="Next image">
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </div>
              </div>
            </div>
          
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
