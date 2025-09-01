import {
  Accordion,
  AccordionItem,
  Avatar,
  Card,
  Divider,
  Image,
} from "@heroui/react";
import Slider from "react-slick";
import { TfiEmail } from "react-icons/tfi";
import { FaBookmark, FaCalendarAlt } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaStar } from "react-icons/fa";
import { SlLocationPin } from "react-icons/sl";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { BsCheck2Circle } from "react-icons/bs";
import CustomButton from "../../components/ui/CustomButton";
import { IoDocumentTextOutline } from "react-icons/io5";
import { CiCalendarDate } from "react-icons/ci";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../../css/location.css";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import LocationPin from "../../assets/location-pin.png";

const SingleService = () => {
  const { state } = useLocation();
  const data = state?.serviceData;
  const category = state?.category;
  const mapRef = useRef<L.Map | null>(null);
  const [videoId, setVideoId] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [mainImage, setMainImage] = useState(
    data?.gallery?.[0]?.serviceImages?.[0]
  );

  useEffect(() => {
    const videoLink = data?.gallery?.[0]?.videoLink;
    const videoId = videoLink?.split("youtu.be/")[1]?.split("?")[0];
    setVideoId(videoId);
    setLatitude(data?.location?.[0]?.coordinates?.latitude || 0);
    setLongitude(data?.location?.[0]?.coordinates?.longitude || 0);
  }, [data]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.remove();
    }

    mapRef.current = L.map("map").setView([latitude, longitude], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapRef.current);

    const customIcon = L.icon({
      iconUrl: LocationPin,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });

    L.marker([latitude, longitude], { icon: customIcon })
      .addTo(mapRef.current)
      .bindPopup(data?.location?.[0]?.address || "Service Location")
      .openPopup();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 400,
        settings: { slidesToShow: 3 },
      },
    ],
  };

  const handleImageClick = (imageUrl: string) => {
    setMainImage(imageUrl);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pt-3 xl:mx-25 xl:my-0 max-w-[1440px] mx-auto">
      {/* Image Section */}
      <div className="col-span-2  ">
        <h1 className="text-heading1 font-bold line-clamp-2">
          {data?.serviceTitle || "No title"}
        </h1>
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-2 mb-3 mt-1">
          <p className="text-body1 text-gray-600 flex items-center gap-2 line-clamp-1">
            <SlLocationPin />
            {data?.location?.map((loc: any, index: number) => (
              <span key={index}>
                {`${loc?.city || ""} ${loc?.state || ""} `.trim()}
              </span>
            ))}
          </p>

          <div className="grid grid-cols-1 xl:flex xl:items-center gap-2">
            {/* ⭐ Rating */}
            <div className="flex justify-between gap-4 items-center flex-initial ">
              <div className="flex items-center">
                <FaStar className="text-yellow-500 mr-1" size={16} />
                <small className="text-body1">
                  4.5 <span className="text-body1"> (366 reviews)</span>
                </small>
              </div>

              {/* 📅 Booking */}
              <div className="flex items-center">
                <FaBookmark className="text-purple-500 mr-1" size={16} />
                <small className="text-body1  ">
                  Booking <span className="text-body1  "> (36)</span>
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* IMAGE SECTION */}
        <div className="">
          <div className="bg-gray-900 flex justify-center items-center relative rounded-lg">
            {/* <Image
              src={mainImage}
              className="object-cover w-full h-[300px] sm:h-[400px] xl:h-[500px] "
            /> */}
            <Image
              src={mainImage}
              srcSet={`${mainImage}?w=1200 1200w, ${mainImage}?w=1500 1500w, ${mainImage}?w=1920 1920w`}
              sizes="(max-width: 600px) 1200px, (max-width: 1024px) 1500px, 1920px"
              className="object-cover w-full h-[300px] sm:h-[400px] xl:h-[500px]"
            />

            <div className="absolute top-0 left-0 p-2 z-20">
              <small className=" bg-gray-300 text-gray-600  px-2 py-1 rounded-md font-medium">
                {category || "Unknown Category"}
              </small>
            </div>

            <div className="absolute top-0 right-0  p-3 z-20 ">
              <small className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                <TbRosetteDiscountCheckFilled className="mr-1 text-lg" />
                Save $30
              </small>
            </div>
          </div>
          <div className="slider-container mt-5 ">
            <Slider {...settings}>
              {data?.gallery?.[0]?.serviceImages?.map((img, index) => (
                <div key={index} className="p-2">
                  <div
                    className="bg-gray-900 flex justify-center items-center rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => handleImageClick(img)} // Handle image click
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index}`}
                      className="object-cover w-full h-[100px] rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
        {/* END IMAGE */}

        {/* SERVICE DETAILS */}
        <div className="mt-5">
          <h1 className="text-subtitle3">Service Details</h1>

          <p
            dangerouslySetInnerHTML={{
              __html:
                data?.serviceOverview ||
                "No details available for this service.",
            }}
            className="text-body1 text-gray-800 mt-2"
          />
        </div>

        {/* ADDITONAL DETAILS */}
        {data?.additionalServices && data?.additionalServices.length > 0 && (
          <div className="mt-5">
            <h1 className="text-subtitle3">Addtional Service</h1>
            <div className="mt-5">
              {data?.additionalServices?.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-200 dark:bg-darkModeBackgroundSecondary rounded-lg  p-2 mb-2"
                >
                  <div className="flex justify-start items-start">
                    <div className="bg-gray-900 flex justify-center items-center rounded-lg overflow-hidden">
                      <Image
                        src={item?.images}
                        className="object-contain w-[120px] h-[80px] rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col justify-between items-start gap-2 ml-3 mt-4">
                      <p className="text-subtitle1  ml-3">
                        {item?.serviceItem}
                      </p>
                      <p className="text-body1  ml-3 mb-3">${item?.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INCLUDE */}
        {data?.includes && data?.includes.length > 0 && (
          <div className="mt-7">
            <h1 className="text-subtitle3">Includes</h1>

            <div className=" rounded-lg bg-gray-200 dark:bg-darkModeBackgroundSecondary mt-4 p-3 mb-2">
              <div className="flex flex-wrap gap-4">
                {data?.includes?.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <BsCheck2Circle className="text-green-500" />
                    <p className="text-body1 text-gray-800">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIDEO-Youtube*/}
        {data?.gallery?.[0]?.videoLink && (
          <div className="mt-7">
            <h1 className="text-subtitle3 mb-5">Video</h1>
            <div className="mt-2">
              <div
                className="bg-gray-50 rounded-lg overflow-hidden relative w-full"
                style={{ paddingTop: "56.25%" }}
              >
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="fullscreen"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}

        {/* FAQ*/}
        {data?.faq && data?.faq.length > 0 && (
          <div className="mt-7">
            <h1 className="text-subtitle3">FAQ</h1>
            <div className=" mt-2">
              {data?.faq?.map((item, index) => (
                <Accordion>
                  <AccordionItem
                    key={index}
                    aria-label="FAQ"
                    className="text-body1 bg-gray-200 dark:bg-darkModeBackgroundSecondary rounded-lg p-1 px-3 mb-2"
                    title={item?.question || "No question"}
                  >
                    {item?.answer || "No question"}
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          </div>
        )}

        {/* REVIEWS*/}
      </div>

      {/* Content Section */}
      <div className=" rounded-lg  flex flex-col shadow-sm  ">
        <div className="border p-5  rounded-lg bg-[#ffffff] dark:bg-darkModeBackgroundSecondary dark:border-darkModeBackgroundSecondary">
          <div className="flex items-center space-x-2">
            <span className="text-heading1 font-bold text-gray-900">
              ${data?.price || 0}
            </span>
            {data?.priceAfterDiscount > 0 && (
              <p className=" text-body2 text-gray-500 line-through">
                ${data?.priceAfterDiscount || 0}
              </p>
            )}
          </div>

          {/* <div className="border-b mt-5"></div> */}

          <CustomButton
            startContent={<FaCalendarAlt />}
            label="Book Service"
            size="md"
            color="primary"
            className="mt-5 mb-4 w-full cursor-not-allowed"
          />

          <div>
            <Divider />
            <h1 className="text-subtitle3 mb-5 mt-3">Service Provider</h1>

            <div className="grid  items-center  justify-center  dark:bg-darkModeBackgroundSecondary py-5 rounded-t-lg">
              <Avatar
                className="w-20 h-20 text-large"
                src="https://i.pravatar.cc/150?u=a04258114e29026302d"
              />
              <p className="text-subtitle3  mt-2">Harry Mark</p>
            </div>

            <div className="flex flex-wrap items-center  dark:bg-darkModeBackgroundSecondary p-3 rounded-b-lg gap-4 mb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                <div className="flex items-center gap-2">
                  <CiCalendarDate size={18} />
                  <p className="text-body1 ">Member Since</p>
                </div>
                <p className="text-body1 ">2025</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                <div className="flex items-center gap-2">
                  <TfiEmail size={14} />
                  <p className="text-body1 ">Email</p>
                </div>
                <p className="text-body1 ">thomash@example.com</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                <div className="flex items-center gap-2">
                  <SlLocationPin className="" />
                  <p className="text-body1 ">Address</p>
                </div>
                <p className="text-body1 ">Shire of Macedon, Australia</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                <div className="flex items-center gap-2">
                  <IoDocumentTextOutline className="" />
                  <p className="text-body1 ">No of Listings</p>
                </div>
                <p className="text-body1 ">10</p>
              </div>
            </div>

            {/* DATE */}
            <Divider />
            <h1 className="text-subtitle3 mb-5 mt-5">Service Availability</h1>

            <div className="flex flex-wrap items-center  p-3 rounded-lg gap-4">
              {data?.availability?.map((item, index: number) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full"
                >
                  <p className="text-body1 text-gray-800 capitalize">
                    {item?.day}
                  </p>
                  <ul>
                    {item?.timeSlots?.map((time, index: number) => (
                      <li key={index}>
                        <p className="text-body1 text-gray-800">
                          {time?.from} - {time?.to}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* LOCATION*/}
            <div className="mt-7">
              <Divider />
              <h1 className="text-subtitle3 mt-3">Location</h1>
              <div className=" mt-2">
                <div
                  id="map"
                  style={{
                    height: "400px",
                    width: "100%",
                    border: "2px solid #ccc",
                    zIndex: 0,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleService;
