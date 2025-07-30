import { faCartShopping, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function WishlistMenu() {
    const wishlist = useSelector((store) => store.wishlist);
    return (
        <li>
          <Link to="/wishlist">
            <FontAwesomeIcon icon={faHeart} />
          </Link>
            {wishlist > 0 && <span className="wishlist-count">{wishlist}</span>}
        </li>
    )
}