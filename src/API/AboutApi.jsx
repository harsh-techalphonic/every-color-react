import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import config from '../Config/config.json';
import { AboutAction } from '../store/About/AboutSlice';

export default function AboutApi() {
    const About = useSelector((store) => store.About);
    const AuthCheck = useSelector((store) => store.AuthCheck);
    const dispatch = useDispatch();
    
    // Use ref to track if request is in progress
    const requestInProgress = useRef(false);
    // Cache the data to prevent multiple calls
    const cacheKey = 'aboutDataCache';

    useEffect(() => {
        // Skip if data already exists or request is in progress
        if (About.status || requestInProgress.current) {
            return;
        }

        // Check cache first
        const cachedData = localStorage.getItem(cacheKey);
        const cacheTime = localStorage.getItem(`${cacheKey}_time`);
        
        // Use cache if less than 5 minutes old (300000 ms)
        if (cachedData && cacheTime && Date.now() - parseInt(cacheTime) < 300000) {
            try {
                const parsedData = JSON.parse(cachedData);
                dispatch(AboutAction.getInfo(parsedData));
                return;
            } catch (error) {
                console.warn('Failed to parse cached data:', error);
                localStorage.removeItem(cacheKey);
                localStorage.removeItem(`${cacheKey}_time`);
            }
        }

        const fetchAboutData = async () => {
            if (requestInProgress.current) return;
            
            requestInProgress.current = true;
            
            try {
                const response = await axios.get(`${config.API_URL}/web/section/about-main/about-page`, {
                    timeout: 10000, // 10 second timeout
                    headers: {
                        'Cache-Control': 'no-cache'
                    },
                    // Accept 429 as a valid status to handle gracefully
                    validateStatus: function (status) {
                        return status < 500; // Accept all status codes less than 500
                    }
                });

                if (response.status === 429) {
                    console.warn('Rate limited for About API, will retry later');
                    // Set a retry timeout
                    setTimeout(() => {
                        requestInProgress.current = false;
                    }, 5000); // Retry after 5 seconds
                    return;
                }

                if (response.status === 200 && response.data) {
                    // Cache the successful response
                    localStorage.setItem(cacheKey, JSON.stringify(response.data));
                    localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
                    
                    dispatch(AboutAction.getInfo(response.data));
                } else {
                    console.warn('About API returned non-200 status:', response.status);
                    // Use fallback data
                    dispatch(AboutAction.getInfo({
                        status: true,
                        title: 'About Us',
                        content: 'Default about content...',
                        sections: []
                    }));
                }
            } catch (error) {
                console.error('Error fetching About data:', error);
                
                // Use cached data even if expired, as fallback
                if (cachedData) {
                    try {
                        const parsedData = JSON.parse(cachedData);
                        dispatch(AboutAction.getInfo(parsedData));
                    } catch (parseError) {
                        console.warn('Failed to use expired cache:', parseError);
                        // Use hardcoded fallback
                        dispatch(AboutAction.getInfo({
                            status: true,
                            title: 'About Us',
                            content: 'Default about content...',
                            sections: []
                        }));
                    }
                } else {
                    // No cache available, use hardcoded fallback
                    dispatch(AboutAction.getInfo({
                        status: true,
                        title: 'About Us',
                        content: 'Default about content...',
                        sections: []
                    }));
                }
            } finally {
                requestInProgress.current = false;
            }
        };

        // Add a small delay to prevent immediate firing
        const timeoutId = setTimeout(() => {
            fetchAboutData();
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [About.status, dispatch]);

    return null; // This component doesn't render anything
}