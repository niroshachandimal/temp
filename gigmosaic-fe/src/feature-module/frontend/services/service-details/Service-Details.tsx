/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import BreadCrumb from '../../../components/common/breadcrumb/breadCrumb';
import { FaCalendarAlt } from 'react-icons/fa';
import { CiCalendarDate } from 'react-icons/ci';
import { BsCheck2Circle } from 'react-icons/bs';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { TfiEmail } from 'react-icons/tfi';
import {
  Accordion,
  AccordionItem,
  Avatar,
  cn,
  Image,
  RadioGroup,
  RadioProps,
  useRadio,
  VisuallyHidden,
} from '@heroui/react';
import { useNavigate, useParams } from 'react-router-dom';
import '@geoapify/geocoder-autocomplete/styles/round-borders.css';
import { TbRosetteDiscountCheckFilled } from 'react-icons/tb';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ServiceUpdate } from '../../../../core/models/interface';
import { useFetchServiceDataById } from '../../../../hook/useQueryData';
import HeroSkeleton from '../../../components/common/loading/SkeltonLoader';
import { useTranslation } from 'react-i18next';
import { all_routes } from '../../../../core/data/routes/all_routes';
import { SlLocationPin } from 'react-icons/sl';
import { FaBookmark, FaStar } from 'react-icons/fa6';
import CustomButton from '../../../components/CustomButton';
import { IoDocumentTextOutline } from 'react-icons/io5';
import LocationPin from '../../../../assets/icon/location-pin.png';
import { useAuth } from 'react-oidc-context';
import { resetBooking } from '../../../../core/data/redux/booking/bookingSlice';
import { useDispatch } from 'react-redux';
import MessageModal from '../../../components/common/ui/MessageModal';
import { toast } from 'react-toastify';

// interface BuildSignUpUrlParams {
//   role: string;
// }

const ServiceDetails = () => {
  const auth = useAuth();
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useFetchServiceDataById(id);

  const [, setNav1] = useState<any>(null);
  const [, setNav2] = useState<any>(null);
  const sliderRef1 = useRef<Slider | null>(null);
  const sliderRef2 = useRef<Slider | null>(null);
  const [selected, setSelected] = useState('');
  const [service, setService] = useState<ServiceUpdate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [mainImage, setMainImage] = useState('');
  const mapRef = useRef<L.Map | null>(null);

  const [videoId, setVideoId] = useState<string | undefined>('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  useEffect(() => {
    setService(data?.serviceInfo);
    setMainImage(data?.serviceInfo?.gallery?.[0]?.serviceImages?.[0]);
  }, [data]);

  // useEffect(() => {
  //   if (mapContainerRef.current && !mapInstanceRef.current) {
  //     mapInstanceRef.current = L.map(mapContainerRef.current).setView(
  //       [lat || 0, lon || 0],
  //       lat && lon ? 15 : 2
  //     );
  //     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //       attribution: '© OpenStreetMap contributors',
  //     }).addTo(mapInstanceRef.current);
  //   }

  //   if (lat && lon && mapInstanceRef.current) {
  //     mapInstanceRef.current.setView([lat, lon], 15);

  //     if (marker) {
  //       marker.setLatLng([lat, lon]);
  //     } else {
  //       const newMarker = L.marker([lat, lon], {
  //         icon: L.icon({
  //           iconUrl: '/location-icon.png',
  //           iconSize: [20, 24],
  //           iconAnchor: [10, 24],
  //           popupAnchor: [0, -24],
  //         }),
  //       }).addTo(mapInstanceRef.current);
  //       setMarker(newMarker);
  //     }
  //   }
  // }, [lat, lon, marker]);

  useEffect(() => {
    const videoLink = service?.gallery?.[0]?.videoLink;
    const videoId = videoLink?.split('youtu.be/')[1]?.split('?')[0];
    setVideoId(videoId);
    setLatitude(service?.location?.[0]?.coordinates?.latitude || 0);
    setLongitude(service?.location?.[0]?.coordinates?.longitude || 0);
  }, [service]);

  useEffect(() => {
    // Ensure that the map container is ready
    const mapContainer = document.getElementById('map');

    // If the map container exists and Leaflet map isn't initialized yet, initialize the map
    if (mapContainer && !mapRef.current) {
      mapRef.current = L.map(mapContainer).setView([latitude, longitude], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);
    }

    // If the latitude or longitude change, update the map's center and marker
    if (mapRef.current) {
      mapRef.current.setView([latitude, longitude], 13);
      const customIcon = L.icon({
        iconUrl: LocationPin,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });
      // Remove old marker and add a new one
      if (mapRef.current && service?.location?.[0]?.coordinates) {
        const marker = L.marker([latitude, longitude], {
          icon: customIcon,
        }).addTo(mapRef.current);
        marker
          .bindPopup(service?.location?.[0]?.address || 'Service Location')
          .openPopup();
      }
    }

    // Cleanup map instance when the component is unmounted or if the map needs to be reinitialized
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, service]);

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

  useEffect(() => {
    console.log('sliderRef1.current', sliderRef1.current);
    console.log('sliderRef2.current', sliderRef2.current);

    if (sliderRef1.current && sliderRef2.current) {
      setNav1(sliderRef1.current);
      setNav2(sliderRef2.current);
    }
  }, []);

  const { t } = useTranslation();
  const routes = all_routes;

  const handleNavigate = () => {
    const uid = auth?.user?.profile?.preferred_username || 'No name';
    const providerId = data?.serviceInfo?.providerId || 'No provider ID';

    if (!auth?.isAuthenticated) {
      setIsModalOpen(true);
      return;
    }

    if (uid === providerId) {
      toast.error('You cannot book your own service');
      return;
    }

    dispatch(resetBooking());
    navigate(routes.serviceBooking, {
      state: {
        selectedPlan: selected,
        serviceId: id, // Replace with actual service ID
        serviceTitle: service?.slug, // Replace with actual title
        servicePrice: 100, // Replace with actual price
        serviceimage: mainImage, // Replace with actual image URL
      },
    });
  };

  return (
    <>
      <title>{service?.serviceTitle || 'Gigmosaic'}</title>
      <BreadCrumb
        title="Services"
        item1="Services"
        item1Link={routes.searchList}
        item2={t('service_details.service_details')}
      />
      {isLoading ? (
        // <LoadingSpinner
        // size='lg'
        // color='primary'/>
        <HeroSkeleton />
      ) : (
        <>
          {service?.seo[0] && (
            <>
              <meta
                key="meta-description"
                name="description"
                content={service?.seo[0]?.metaDescription}
              />
              <meta
                key="meta-title"
                name="title"
                content={service?.seo[0]?.metaTitle}
              />
              <meta
                key="meta-keywords"
                name="keywords"
                content={service?.seo[0]?.metaKeywords.join(', ')}
              />
            </>
          )}

          <div className="py-14 font-primary">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-3 xl:mx-25 xl:my-0 max-w-[1440px] mx-auto">
              <div className="lg:col-span-2  ">
                <h1 className="text-heading1 font-bold line-clamp-2">
                  {service?.serviceTitle || 'No title'}
                </h1>
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-2 mb-3 mt-1">
                  <p className="text-body1 text-gray-600 flex items-center gap-2 line-clamp-1">
                    <SlLocationPin />
                    {service?.location?.map((loc: any, index: number) => (
                      <span key={index}>
                        {`${loc?.city || ''} ${loc?.state || ''} `.trim()}
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
                        <FaBookmark
                          className="text-purple-500 mr-1"
                          size={16}
                        />
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
                    <img
                      src={mainImage}
                      // srcSet={`${mainImage}?w=1200 1200w, ${mainImage}?w=1500 1500w, ${mainImage}?w=1920 1920w`}
                      // sizes="(max-width: 600px) 1200px, (max-width: 1024px) 1500px, 1920px"
                      className="object-cover w-full h-[300px] sm:h-[400px] xl:h-[500px]"
                    />

                    {/* <div className="absolute top-0 left-0 p-2 z-20">
                      <small className=" bg-gray-300 text-gray-600  px-2 py-1 rounded-md font-medium">
                        {category || 'Unknown Category'}
                      </small>
                    </div> */}

                    <div className="absolute top-0 right-0  p-3 z-20 ">
                      <small className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                        <TbRosetteDiscountCheckFilled className="mr-1 text-lg" />
                        Save $30
                      </small>
                    </div>
                  </div>
                  <div className="slider-container mt-5 ">
                    <Slider {...settings}>
                      {service?.gallery?.[0]?.serviceImages?.map(
                        (img, index) => (
                          <div key={index} className="p-2">
                            <div
                              className="bg-gray-900 flex justify-center items-center rounded-lg overflow-hidden cursor-pointer"
                              onClick={() => handleImageClick(img)} // Handle image click
                            >
                              <img
                                src={img}
                                alt={`Thumbnail ${index}`}
                                className="object-cover w-full h-[100px] rounded-lg"
                              />
                            </div>
                          </div>
                        )
                      )}
                    </Slider>
                  </div>
                </div>
                {/* END IMAGE */}

                {/* SERVICE DETAILS */}
                <div className="mt-5">
                  <h1 className="text-subtitle3">Service Details</h1>

                  <p className="text-body1 text-gray-800 mt-2 whitespace-pre-line">
                    {service?.serviceOverview ||
                      'No details available for this service.'}
                  </p>
                </div>

                {/* ADDITONAL DETAILS */}
                {service?.additionalServices &&
                  service?.additionalServices.length > 0 && (
                    <div className="mt-5">
                      <h1 className="text-subtitle3">Addtional Service</h1>
                      <div className="mt-5">
                        {service?.additionalServices?.map((item, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 rounded-lg  p-2 mb-2"
                          >
                            <div className="flex justify-start items-start">
                              <div className="bg-gray-900 flex justify-center items-center rounded-lg overflow-hidden">
                                <Image
                                  src={item?.images}
                                  className="object-contain w-[120px] h-[80px] rounded-lg"
                                />
                              </div>
                              <div className="flex flex-col justify-between items-start gap-2 ml-3 mt-4">
                                <p className="text-subtitle4 text-gray-800 font-semibold ml-3">
                                  {item?.serviceItem}
                                </p>
                                <p className="text-subtitle4 text-green-500 font-semibold ml-3 mb-3">
                                  ${item?.price}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* INCLUDE */}
                {service?.includes && service?.includes.length > 0 && (
                  <div className="mt-7">
                    <h1 className="text-subtitle3">Includes</h1>

                    <div className=" rounded-lg bg-gray-50 mt-4 p-3 mb-2">
                      <div className="flex flex-wrap gap-4">
                        {service?.includes?.map((item, index) => (
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
                {service?.gallery?.[0]?.videoLink && (
                  <div className="mt-7">
                    <h1 className="text-subtitle3 mb-5">Video</h1>
                    <div className="mt-2">
                      <div
                        className="bg-gray-50 rounded-lg overflow-hidden relative w-full"
                        style={{ paddingTop: '56.25%' }}
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
                {service?.faq && service?.faq.length > 0 && (
                  <div className="mt-7">
                    <h1 className="text-subtitle3">FAQ</h1>
                    <div className=" mt-2">
                      {service?.faq?.map((item, index) => (
                        <Accordion>
                          <AccordionItem
                            key={index}
                            aria-label="FAQ"
                            className="text-body1 bg-gray-50 rounded-lg p-1 px-3 mb-2"
                            title={item?.question || 'No question'}
                          >
                            <div className="whitespace-pre-line">
                              {item?.answer || 'No answer'}
                            </div>
                          </AccordionItem>
                        </Accordion>
                      ))}
                    </div>
                  </div>
                )}

                {/* REVIEWS*/}
              </div>

              <div className=" rounded-lg  flex flex-col shadow-am ">
                <div className="border p-5  rounded-lg">
                  {/* <div className="flex items-center space-x-2">
                    <span className="text-heading1 font-bold text-gray-900">
                      ${service?.price || 0}
                    </span>
                    {service?.priceAfterDiscount !== undefined &&
                      service.priceAfterDiscount > 0 && (
                        <p className=" text-body2 text-gray-500 line-through">
                          ${service?.priceAfterDiscount || 0}
                        </p>
                      )}
                  </div> */}

                  <RadioGroup
                    label="Plans"
                    value={selected}
                    onValueChange={setSelected}
                  >
                    <CustomRadio description="Up to 20 items" value="free">
                      Free
                    </CustomRadio>
                    <CustomRadio
                      description="Unlimited items. $10 per month."
                      value="pro"
                    >
                      Pro
                    </CustomRadio>
                    <CustomRadio
                      description="24/7 support. Contact us for pricing."
                      value="enterprise"
                    >
                      Enterprise
                    </CustomRadio>
                  </RadioGroup>

                  <div className="border-b mt-5"></div>

                  <CustomButton
                    startContent={<FaCalendarAlt />}
                    label="Book Service"
                    size="md"
                    isDisabled={selected === '' ? true : false}
                    onPress={() => handleNavigate()}
                    color="primary"
                    className="mt-5 mb-4 w-full"
                  />

                  <MessageModal
                    isOpen={isModalOpen}
                    title="Login Required to Continue"
                    onClose={() => setIsModalOpen(false)}
                  >
                    <div>
                      {/* Modal content goes here */}
                      <p className="text-body1 text-gray-800 text-center px-10">
                        Please log in to your account to book a service. Logging
                        in helps us manage your bookings securely.
                      </p>
                    </div>
                  </MessageModal>
                  {/* </div> */}

                  <div>
                    <h1 className="text-subtitle3 mb-5">Service Provider</h1>

                    <div className="grid  items-center  justify-center bg-gray-50 py-5">
                      <Avatar
                        className="w-20 h-20 text-large"
                        src="https://i.pravatar.cc/150?u=a04258114e29026302d"
                      />
                      <p className="text-subtitle3 text-gray-800 mt-2">
                        Harry Mark
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center bg-gray-50 p-3 rounded-lg gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                        <div className="flex items-center gap-2">
                          <CiCalendarDate size={18} />
                          <p className="text-subtitle5 text-gray-800">
                            Member Since
                          </p>
                        </div>
                        <p className="text-subtitle5 text-gray-800">2025</p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                        <div className="flex items-center gap-2">
                          <TfiEmail size={14} />
                          <p className="text-subtitle5 text-gray-800">Email</p>
                        </div>
                        <p className="text-subtitle5 text-gray-800">
                          thomash@example.com
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                        <div className="flex items-center gap-2">
                          <SlLocationPin className="" />
                          <p className="text-subtitle5 text-gray-800">
                            Address
                          </p>
                        </div>
                        <p className="text-subtitle5 text-gray-800">
                          Shire of Macedon, Australia
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                        <div className="flex items-center gap-2">
                          <IoDocumentTextOutline className="" />
                          <p className="text-subtitle5 text-gray-800">
                            No of Listings
                          </p>
                        </div>
                        <p className="text-subtitle5 text-gray-800">10</p>
                      </div>
                    </div>

                    {/* DATE */}
                    <h1 className="text-subtitle3 mb-5 mt-5">
                      Service Availability
                    </h1>

                    <div className="flex flex-wrap items-center bg-gray-50 p-3 rounded-lg gap-4">
                      {service?.availability?.map((item, index: number) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full"
                        >
                          <p className="text-subtitle5 text-gray-800 capitalize">
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
                      <h1 className="text-subtitle3">Location</h1>
                      <div className=" mt-2">
                        <div
                          id="map"
                          style={{
                            height: '400px',
                            width: '100%',
                            border: '2px solid #ccc',
                            zIndex: 0,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ServiceDetails;

export const CustomRadio = (props: RadioProps) => {
  const {
    Component,
    children,
    description,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        'group inline-flex items-center justify-between hover:bg-content2 flex-row-reverse',
        'cursor-pointer border-2 border-default rounded-lg gap-4 p-4',
        'data-[selected=true]:border-primary/50 data-[selected=true]:bg-primary/10'
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <span {...getWrapperProps()}>
        <span {...getControlProps()} />
      </span>
      <div {...getLabelWrapperProps()}>
        {children && <span {...getLabelProps()}>{children}</span>}
        {description && (
          <span className="text-small text-foreground opacity-70">
            {description}
          </span>
        )}
      </div>
    </Component>
  );
};
