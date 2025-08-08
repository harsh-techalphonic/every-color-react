import React, { useEffect, useState } from 'react';
import './HotOffer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function HotOffer() {
  const bannersStore = useSelector((store) => store.banners);
  const categoriesStore = useSelector((store) => store.categories);
  const { category } = useParams();

  const [sectionData, setSectionData] = useState({});

  const bannerItems = Array.isArray(bannersStore?.data) ? bannersStore.data : [];
  const categoryItems = Array.isArray(categoriesStore?.data) ? categoriesStore.data : [];

  useEffect(() => {
    const matchedCategory = categoryItems.find((c) => String(c.slug) === String(category));

    if (matchedCategory && matchedCategory.banner) {
      setSectionData({
        banner: matchedCategory.banner,
        title: matchedCategory.name || '',
        discount: matchedCategory.discount || '',
        description: matchedCategory.description || '',
        button_text: 'Shop Now',
        slug: matchedCategory.slug || '',
      });
      return;
    }

    if (bannersStore?.status !== false) {
      const hotBanners = bannerItems.filter((b) => String(b.type) === '1');
      if (hotBanners.length > 0) {
        const first = hotBanners[0];
        setSectionData({
          ...first,
          banner: first.banner || first.image || first.url || '',
        });
        return;
      }
    }

    setSectionData({});
  }, [bannersStore, categoryItems, category]);

  return (
    <section className="Hot_offers py-5">
      <div className="container">
        <div className="row justify-content-between align-items-center">
          <div className="col-lg-5">
            <div className="Hot_offer-Content">
              {sectionData?.discount && <span>{sectionData.discount}</span>}
              {sectionData?.title && <h2>{sectionData.title}</h2>}
              {sectionData?.description && <p>{sectionData.description}</p>}
              <div className="button-dark mt-4">
                <Link to={`/product/${sectionData?.slug || ''}`}>
                  {sectionData?.button_text || 'Shop Now'}{' '}
                  <FontAwesomeIcon icon={faArrowRightLong} />
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="Hot_offer-image">
              {sectionData.banner ? (
                <img src={sectionData.banner} alt={sectionData.title || 'Hot offer'} />
              ) : (
                <div className="placeholder-image">No banner available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
