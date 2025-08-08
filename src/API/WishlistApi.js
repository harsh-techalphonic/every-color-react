import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import config from '../Config/config.json';
import { wishlistAction } from '../store/Products/wishlistSlice';

export default function WishlistApi() {
  const dispatch = useDispatch();
  const wishlist = useSelector((store) => store.wishlist);
  const products = useSelector((store) => store.products);
  const AuthCheck = useSelector((store) => store.authcheck);

  console.log("wishlist", wishlist)
  console.log("products", products)
  console.log("AuthCheck", AuthCheck)

  useEffect(() => {
    if (wishlist.products && wishlist.products.length > 0) return;

    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.API_URL}/bag/get-wishlist`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data?.data) {
          const wishlistItems = response.data.data;
          const productIds = wishlistItems.map((item) => item.product_id);

          const idsSet = new Set(productIds);
          const filteredProducts = (products.data || []).filter((product) =>
            idsSet.has(product.id)
          );

          dispatch(
            wishlistAction.setWishlist({
              ids: productIds,
              products: filteredProducts,
            })
          );
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };

    if (AuthCheck.status && products.status) {
      fetchWishlist();
    }
  }, [wishlist.products, products.status, AuthCheck.status]);
}
