import { useState, useEffect } from "react";

import Searchbar from "./Searchbar";
import ImageGallery from "./ImageGallery";
import Modal from "./Modal";
import Button from "components/Button";
import Loader from "components/Loader";
import PixabayFetch from "js/Pixabay";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export function App() {
  const [searchString, setSearchString] = useState("");
  const [page, setPage] = useState(1);
  const [modalData, setModalData] = useState({
    showModalImage: false,
    modalImage: undefined,
    modalImageAlt: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imagesFound, setImagesFound] = useState(0);
  const [imageDataArray, setImageDataArray] = useState([]);

  useEffect(() => {
    //skip first render (and any render with empty search term)
    if (searchString === "") {
      return;
    }

    const pixabayFetcher = new PixabayFetch();

    async function fetchImages() {
      await setIsLoading(true);

      try {
        const response = await pixabayFetcher.fetchImages(page);

        //pick from response.hits only the fields we actually use to avoid cluttering state
        const filteredImageDataArray = response.hits.map(({id, largeImageURL, webformatURL, tags}) => {
          return {id, largeImageURL, webformatURL, tags};
        });

        if (page === 1) {
          setImageDataArray(filteredImageDataArray);
          setImagesFound(response.total);
        }
        else {
          setImageDataArray((prevArray) => {
            return [...prevArray, ...filteredImageDataArray]
          });
          setImagesFound(response.total);
        }
        setIsLoading(false);
        //this.setState({ error: null, status: "success" });

        if (response.total === 0) {
          toast.warning("No images found matching this request.");
        }
      } catch (error) {
        setIsLoading(false);
        //this.setState({ error, status: "error" });
        toast.error("Unable to retrieve images from the server. Try again?");
      }
    }

    pixabayFetcher.setSearch(searchString);
    fetchImages(); //await?

    return function abortFetch() {
      pixabayFetcher.abortFetch();
    }
  }, [searchString, page]);

      /*
      //soft scrolling uses Ref assigned to UL element in render()
      const cardHeight = this.galleryElem.firstElementChild.clientHeight;
      //alternative: this.galleryElem.firstElementChild.getBoundingClientRect().height;
      window.scrollBy({ top: cardHeight * 2 * (this.state.page - 1), behavior: "smooth", }); //scrolling down by 2 rows
      */

  const toggleModalImage = (imageID = undefined) => {
    if (imageID !== undefined) {
      const modalImageData = imageDataArray.find((imageData) => {
          return imageData.id === imageID;
      });

      setModalData({
        showModalImage: true,
        modalImage: modalImageData.largeImageURL,
        modalImageAlt: modalImageData.tags,
      });
    }
    else {
      setModalData({
        showModalImage: false,
        modalImage: undefined,
        modalImageAlt: undefined,
      });
    }
  } 

  const nextPage = () => {
      //switch to next page only if there is one
    if (imagesFound > imageDataArray.length) {
      setPage((currentPage) => {
        return currentPage + 1; 
      });
    }  
  }

  const onSearch = (searchString) => {
    setSearchString(searchString);
    setPage(1);
  }

  return (
    <div
      style={{
        height: '100vh',
        fontSize: 20,
        color: '#010101',
      }}
    >
      {/* React homework template */}
      <Searchbar onSubmit={(searchString) => { onSearch(searchString) }}></Searchbar>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      {(imageDataArray.length > 0) && <ImageGallery
        imageDataArray={imageDataArray}
        onModal={toggleModalImage} />}
      
      {isLoading && <Loader />}
    
      {(!isLoading && (imagesFound > 0) ) && <Button onLoadMore={nextPage}
          disabled={!(imagesFound > imageDataArray.length)} />}

      {modalData.showModalImage && <Modal onClose={toggleModalImage}>
          <img src={modalData.modalImage} alt={ modalData.modalImageAlt } loading="lazy"/>
      </Modal>}

    </div>
  );
};
