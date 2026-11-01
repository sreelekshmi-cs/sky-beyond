import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
function ImageCard({ image, onPreview, isFavorite, onFavorite }) {
  return (
    <div className="group overflow-hidden rounded-2xl bg-white/10 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-purple-500/30">

      <div className="relative overflow-hidden">
        <img
          src={image.src}
          alt={image.title}
          className="h-64 w-full cursor-pointer object-cover transition-transform duration-500 group-hover:scale-110"
          onClick={() => onPreview(image)}
        />


        
<button
  type="button"
  onClick={() => onFavorite(image.id)}
  className="absolute right-3 top-3 rounded-full bg-black/60 p-3 text-sm text-white transition hover:bg-black/80"
  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
>
  <FontAwesomeIcon
    icon={faHeart}
    className={isFavorite ? "text-pink-500" : "text-gray-300"}
  />
</button>

      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-white">
          {image.title}
        </h3>

        <p className="mt-2 text-sm text-gray-300">
          {image.description}
        </p>

        <span className="mt-3 inline-block rounded-full bg-purple-500/20 px-3 py-1 text-xs text-purple-200">
          {image.category}
        </span>
      </div>
    </div>
  );
}

export default ImageCard;
