import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function WishlistMenu() {
  const wishlistItems = useSelector((store) => store.wishlist.items);

  return (
    <li>
      <Link to="/wishlist">
        <FontAwesomeIcon icon={faHeart} />
      </Link>
      {wishlistItems?.length > 0 && (
        <span className="wishlist-count">{wishlistItems.length}</span>
      )}
    </li>
  );
}
