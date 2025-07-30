import { faCartShopping, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
export default function CartMenu() {
  const addToCart = useSelector((store) => store.cart);
  // console.log(addToCart)
    return (
      <li><Link to="/cart"><FontAwesomeIcon icon={faCartShopping}/></Link>{addToCart.length > 0 && <span className="wishlist-count">{addToCart.length}</span>}</li>
    )
}