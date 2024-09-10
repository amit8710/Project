import React, { useState } from 'react';
import ContentWrapper from '../../../components/contentWrapper/ContentWrapper';
import SwitchTabs from '../../../components/switchTabs/SwitchTabs';
import useFetch from './../../../hooks/useFetch';
import Carousel from '../../../components/carousel/Carousel';

const Popular = () => {
  // Create state for endpoint
  const [endpoint, setEndpoint] = useState("movie");

  // Fetch data from the selected endpoint
  const { data, loading } = useFetch(`/${endpoint}/popular`);

  // Handle tab change (only "Movies" available)
  const onTabChange = () => {
    setEndpoint("movie");
  };

  return (
    <div className="carouselSection">
      <ContentWrapper>
        <span className="carouselTitle">What's Popular</span>
      </ContentWrapper>
      <Carousel data={data?.results} loading={loading} endpoint={endpoint} />
    </div>
  );
};

export default Popular;
