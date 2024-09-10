import React, {useState} from 'react';
import ContentWrapper from '../../../components/contentWrapper/ContentWrapper';
import SwitchTabs from '../../../components/switchTabs/SwitchTabs';
import useFetch from './../../../hooks/useFetch';
import Carousel from '../../../components/carousel/Carousel';

const TopRated = () => {

  //create states
  const [endpoint, setEndpoint] = useState("movie");

  const {data,loading} = useFetch(`/${endpoint}/top_rated`)

  // Remove the onTabChange function as it's no longer needed
  // const onTabChange = (tab) =>{
  //   setEndpoint(tab === "Movies" ? "movie" : "tv")
  // }

  return (
    <div className='carouselSection'>
        <ContentWrapper>
            <span className="carouselTitle">Top Rated</span>
        </ContentWrapper>
        <Carousel data={data?.results} loading={loading} endpoint={endpoint}/>
    </div>
  )
}

export default TopRated