import {
  Accordion,
  AccordionItem,
  Avatar,
  Card,
  CardBody,
  CardHeader,
  cn,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  useDisclosure,
} from "@heroui/react";
import Slider from "react-slick";
import CustomButton from "../../components/ui/CustomButton";
import { IoDocumentTextOutline } from "react-icons/io5";
import { SlLocationPin } from "react-icons/sl";
import { TfiEmail } from "react-icons/tfi";
import { CiCalendarDate } from "react-icons/ci";
import { FaBookmark, FaCalendarAlt, FaStar } from "react-icons/fa";
import { BsCheck2Circle } from "react-icons/bs";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { useEffect, useRef, useState } from "react";
import { useFetchUserDetailsById } from "../../hooks/queries/useFetchData";
import { useAuth } from "react-oidc-context";
import { convertDateToReadble } from "../../utils/convertTime";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../../css/location.css";
import LocationPin from "../../assets/location-pin.png";

const ServicePreview = ({ data, category }) => {
  const auth = useAuth();
  const mapRef = useRef<L.Map | null>(null);
  // const mapRef = useRef<any>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [mainImage, setmainImage] = useState<string>("");
  const [categoryText, setCategoryText] = useState<string>("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const sampleImage = [
    "https://cdn.staging.gigmosaic.ca/common/fallback-image.png",
    "https://cdn.staging.gigmosaic.ca/common/fallback-image.png",
    "https://cdn.staging.gigmosaic.ca/common/fallback-image.png",
    "https://cdn.staging.gigmosaic.ca/common/fallback-image.png",
    "https://cdn.staging.gigmosaic.ca/common/fallback-image.png",
  ];

  const sampleAvailability = [
    {
      day: "Monday",
      slot: "9:00 AM - 5:00 PM",
    },
    {
      day: "Tuesday",
      slot: "9:00 AM - 5:00 PM",
    },
    {
      day: "Wednesday",
      slot: "9:00 AM - 5:00 PM",
    },
    {
      day: "Thursday",
      slot: "9:00 AM - 5:00 PM",
    },
  ];

  const uid = auth.user?.profile?.preferred_username;
  const { data: Profiledata } = useFetchUserDetailsById(uid);
  const userdata = Profiledata?.user || [];

  useEffect(() => {
    const mainImage = data?.gallery?.[0]?.serviceImages?.[0];
    if (!mainImage) return;
    setmainImage(mainImage);
  }, [data]);

  useEffect(() => {
    if (mainImage instanceof File) {
      const objectUrl = URL.createObjectURL(mainImage);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [mainImage]);

  //FIND CATEGORY
  useEffect(() => {
    if (!category?.categories) return;

    const categoryName = category?.categories?.find(
      (item) => item.categoryId === data?.categoryId
    )?.categoryName;
    setCategoryText(categoryName);
  }, [data.categoryId]);

  useEffect(() => {
    setLatitude(data?.location?.[0]?.latitude || 0);
    setLongitude(data?.location?.[0]?.longitude || 0);
  }, [data]);

  //LOCATION
  // useEffect(() => {
  //   const latitude = 40.7128;
  //   const longitude = -74.006;

  //   const map = L.map("map").setView([latitude, longitude], 13);

  //   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  //     attribution: "&copy; OpenStreetMap contributors",
  //   }).addTo(map);

  //   const customIcon = L.icon({
  //     iconUrl: LocationPin,
  //     iconSize: [40, 40],
  //     iconAnchor: [20, 40],
  //     popupAnchor: [0, -40],
  //   });

  //   L.marker([latitude, longitude], { icon: customIcon })
  //     .addTo(map)
  //     .bindPopup("Static Location")
  //     .openPopup();

  //   return () => {
  //     map.remove();
  //   };
  // }, []);

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

  const handleImageClick = (image: File | string) => {
    if (!image) return;
    setmainImage(image);
  };

  return (
    <>
      <CustomButton
        label="Preview"
        type="button"
        color="secondary"
        size="sm"
        variant="solid"
        onPress={onOpen}
      />
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="full"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Preview</ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pt-3 xl:mx-25 xl:my-0 max-w-[1440px] mx-auto">
                  {/* Image Section */}
                  <div className="col-span-2  ">
                    <h1 className="text-heading1 font-bold line-clamp-2">
                      {data?.serviceTitle || "Sample title"}
                    </h1>
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-2 mb-3 mt-1">
                      <p className="text-body1 text-gray-600 flex items-center gap-2 line-clamp-1">
                        <SlLocationPin />
                        {data?.location?.map((loc: any, index: number) => (
                          <span key={index}>
                            {`${loc?.city || "Sample city"}, ${
                              loc?.state || "Sample state"
                            } `.trim()}
                          </span>
                        ))}
                      </p>

                      <div className="grid grid-cols-1 xl:flex xl:items-center gap-2">
                        {/* ⭐ Rating */}
                        <div className="flex justify-between gap-4 items-center flex-initial ">
                          <div className="flex items-center">
                            <FaStar
                              className="text-yellow-500 mr-1"
                              size={16}
                            />
                            <small className="text-body1">
                              4.5{" "}
                              <span className="text-body1"> (366 reviews)</span>
                            </small>
                          </div>

                          {/* 📅 Booking */}
                          <div className="flex items-center">
                            <FaBookmark
                              className="text-purple-500 mr-1"
                              size={16}
                            />
                            <small className="text-body1  ">
                              Booking{" "}
                              <span className="text-body1  "> (36)</span>
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* IMAGE SECTION */}
                    <div className="">
                      <div
                        className={`${
                          mainImage ? "bg-gray-900" : "bg-gray-200"
                        } flex justify-center items-center relative rounded-lg`}
                      >
                        {mainImage ? (
                          <Image
                            src={
                              typeof mainImage === "string"
                                ? mainImage
                                : mainImage instanceof File
                                ? URL.createObjectURL(mainImage)
                                : ""
                            }
                            className="object-cover w-full h-[300px] sm:h-[400px] xl:h-[500px]"
                            alt="Main Image"
                          />
                        ) : (
                          <Image
                            src="https://cdn.staging.gigmosaic.ca/common/fallback-image.png"
                            className="object-cover w-full h-[300px] sm:h-[400px] xl:h-[500px]"
                            alt="Main Image"
                          />
                        )}

                        <div className="absolute top-0 left-0 p-2 z-20">
                          <small className=" bg-gray-300 text-gray-600  px-2 py-1 rounded-md font-medium">
                            {categoryText || "Sample Category"}
                          </small>
                        </div>

                        <div className="absolute top-0 right-0  p-3 z-20 ">
                          <small className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                            <TbRosetteDiscountCheckFilled className="mr-1 text-lg" />
                            Save $30
                          </small>
                        </div>
                      </div>
                      {data?.gallery?.[0]?.serviceImages.length > 0 ? (
                        <div className="slider-container mt-5">
                          <Slider {...settings}>
                            {data?.gallery?.[0]?.serviceImages?.map(
                              (img: File | string, index: number) => {
                                if (!img) return null;
                                console.log("Image val: ", img);
                                const imageSrc =
                                  typeof img === "string"
                                    ? img
                                    : img instanceof File
                                    ? URL.createObjectURL(img)
                                    : "";
                                console.log("Image String: ", imageSrc);
                                return (
                                  <div key={index} className="p-2">
                                    <div
                                      className="bg-gray-900 flex justify-center items-center rounded-lg overflow-hidden cursor-pointer"
                                      onClick={() => handleImageClick(img)}
                                    >
                                      <Image
                                        src={imageSrc}
                                        alt={`Thumbnail ${index}`}
                                        className="object-cover w-full h-[100px] rounded-lg"
                                      />
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </Slider>
                        </div>
                      ) : (
                        <div className="slider-container mt-5">
                          <Slider {...settings}>
                            {sampleImage.map(
                              (img: File | string, index: number) => {
                                if (!img) return null;
                                console.log("Image val: ", img);
                                const imageSrc =
                                  typeof img === "string"
                                    ? img
                                    : img instanceof File
                                    ? URL.createObjectURL(img)
                                    : "";
                                console.log("Image String: ", imageSrc);
                                return (
                                  <div key={index} className="p-2">
                                    <div
                                      className="bg-gray-200 flex justify-center items-center rounded-lg overflow-hidden cursor-pointer"
                                      onClick={() => handleImageClick(img)}
                                    >
                                      <Image
                                        src={imageSrc}
                                        alt={`Thumbnail ${index}`}
                                        className="object-cover w-full h-[100px] rounded-lg"
                                      />
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </Slider>
                        </div>
                      )}

                      {/* <div className="slider-container mt-5 ">
                        <Slider {...settings}>
                          {sampleImage?.map((img, index) => (
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
                      </div> */}
                    </div>
                    {/* END IMAGE */}

                    {/* SERVICE DETAILS */}
                    {data?.serviceOverview ? (
                      <div className="mt-5">
                        <h1 className="text-subtitle3 ">Service Details</h1>
                        <p
                          dangerouslySetInnerHTML={{
                            __html:
                              data?.serviceOverview ||
                              "No details available for this service.",
                          }}
                          className="text-body1 text-gray-800 mt-2"
                        />
                      </div>
                    ) : (
                      <div className="mt-5">
                        <h1 className="text-subtitle3 mb-4">Service Details</h1>

                        <p className="text-body1 text-gray-800 mt-2">
                          <strong> Note this a sample text - </strong>Canada[a]
                          is a country in North America. Its ten provinces and
                          three territories extend from the Atlantic Ocean to
                          the Pacific Ocean and northward into the Arctic Ocean,
                          making it the world's second-largest country by total
                          area, with the world's longest coastline. Its border
                          with the United States is the longest international
                          land border. The country is characterized by a wide
                          range of both meteorologic and geological regions.
                          With a population of over 41 million, it has widely
                          varying population densities, with the majority
                          residing in urban areas and large areas of the country
                          being sparsely populated. Canada's capital is Ottawa
                          and its three largest metropolitan areas are Toronto,
                          Montreal, and Vancouver.
                        </p>

                        <p className="text-body1 text-gray-800 mt-2">
                          Indigenous peoples have continuously inhabited what is
                          now Canada for thousands of years. Beginning in the
                          16th century, British and French expeditions explored
                          and later settled along the Atlantic coast. As a
                          consequence of various armed conflicts, France ceded
                          nearly all of its colonies in North America in 1763.
                          In 1867, with the union of three British North
                          American colonies through Confederation, Canada was
                          formed as a federal dominion of four provinces. This
                          began an accretion of provinces and territories
                          resulting in the displacement of Indigenous
                          populations, and a process of increasing autonomy from
                          the United Kingdom. This increased sovereignty was
                          highlighted by the Statute of Westminster, 1931, and
                          culminated in the Canada Act 1982, which severed the
                          vestiges of legal dependence on the Parliament of the
                          United Kingdom.
                        </p>
                      </div>
                    )}

                    {/* ADDITONAL DETAILS */}
                    {data?.additionalServices &&
                      data?.additionalServices.length > 0 && (
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
                                    <p className="text-body1  ml-3 mb-3">
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
                    {data?.includes &&
                    data?.includes.length > 0 &&
                    data?.includes[0] != "" ? (
                      <div className="mt-7">
                        <h1 className="text-subtitle3">Includes</h1>

                        <div className=" rounded-lg bg-gray-200 dark:bg-darkModeBackgroundSecondary mt-4 p-3 mb-2">
                          <div className="flex flex-wrap gap-4">
                            {data?.includes?.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <BsCheck2Circle className="text-green-500" />
                                <p className="text-body1 text-gray-800">
                                  {item}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-7">
                        <h1 className="text-subtitle3">Includes</h1>

                        <div className=" rounded-lg bg-gray-200 dark:bg-darkModeBackgroundSecondary mt-4 p-3 mb-2">
                          <div className="flex flex-wrap gap-4">
                            {[...Array(7)].map((_, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <BsCheck2Circle className="text-green-500" />
                                <p className="text-body1 text-gray-800">{`Sample Include ${
                                  index + 1
                                } `}</p>
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
                    {data.faq && data.faq?.length > 0 && data.isfaq ? (
                      <div className="mt-7">
                        <h1 className="text-subtitle3">FAQ</h1>
                        <div className=" mt-2">
                          {data.faq?.map((item, index) => (
                            <Accordion>
                              <AccordionItem
                                key={index}
                                aria-label="FAQ"
                                className="text-body1 bg-gray-200 dark:bg-darkModeBackgroundSecondary rounded-lg p-1 px-3 mb-2"
                                title={item?.question}
                              >
                                {item?.answer}
                              </AccordionItem>
                            </Accordion>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-7">
                        <h1 className="text-subtitle3">FAQ</h1>
                        <div className="mt-2">
                          <Accordion>
                            {[...Array(4)].map((_, index) => (
                              <AccordionItem
                                key={index}
                                aria-label={`FAQ-${index}`}
                                className="text-body1 bg-gray-200 dark:bg-darkModeBackgroundSecondary rounded-lg p-1 px-3 mb-2"
                                title={`Sample question ${index + 1}`}
                              >
                                {`Sample answer ${index + 1}`}
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </div>
                      </div>
                    )}

                    {/* REVIEWS*/}
                  </div>

                  {/* Content Section */}
                  <div className=" rounded-lg  flex flex-col shadow-sm  ">
                    <div className="border p-5  rounded-lg bg-[#ffffff] dark:bg-darkModeBackgroundSecondary dark:border-darkModeBackgroundSecondary">
                      {/* <div className="flex items-center space-x-2">
                        <span className="text-heading1 font-bold text-gray-900">
                          ${data?.price || 0}
                        </span>
                        {data?.priceAfterDiscount > 0 && (
                          <p className=" text-body2 text-gray-500 line-through">
                            ${data?.priceAfterDiscount || 0}
                          </p>
                        )}
                      </div> */}
                      {/* <div className="border-b mt-5"></div> */}

                      <RadioGroup
                        description="Selected plan can be changed at any time."
                        label="Plans"
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

                      <CustomButton
                        startContent={<FaCalendarAlt />}
                        label="Book Service"
                        size="md"
                        color="primary"
                        className="mt-5 mb-4 w-full cursor-not-allowed"
                      />

                      <div>
                        <Divider />
                        <h1 className="text-subtitle3 mb-5 mt-3">
                          Service Provider
                        </h1>

                        <div className="grid  items-center  justify-center  dark:bg-darkModeBackgroundSecondary py-5 rounded-t-lg">
                          <Avatar
                            className="w-20 h-20 text-large"
                            src="https://i.pravatar.cc/150?u=a04258114e29026302d"
                          />
                          <p className="text-subtitle3  mt-2">
                            {userdata.name}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center  dark:bg-darkModeBackgroundSecondary p-3 rounded-b-lg gap-4 mb-3">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                            <div className="flex items-center gap-2">
                              <CiCalendarDate size={18} />
                              <p className="text-body1 ">Member Since</p>
                            </div>
                            <p className="text-body1 ">
                              {convertDateToReadble(userdata.createdAt)}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                            <div className="flex items-center gap-2">
                              <TfiEmail size={14} />
                              <p className="text-body1 ">Email</p>
                            </div>
                            <p className="text-body1 ">{userdata.email}</p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                            <div className="flex items-center gap-2">
                              <SlLocationPin className="" />
                              <p className="text-body1 ">Address</p>
                            </div>
                            <p className="text-body1 ">
                              Shire of Macedon, Australia
                            </p>
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
                        <h1 className="text-subtitle3  mt-5">
                          Service Availability
                        </h1>

                        {data?.availability[0]?.day != "" ? (
                          <div className="flex flex-wrap items-center  p-3 rounded-lg gap-3">
                            {data?.availability?.map((item, index: number) => (
                              <div
                                key={index}
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full"
                              >
                                <p className="text-body1 text-gray-800 capitalize">
                                  {item?.day}
                                </p>
                                <ul>
                                  <li key={index}>
                                    <p className="text-body1 text-gray-800">
                                      {item?.timeSlots?.from} -{" "}
                                      {item?.timeSlots?.to}
                                    </p>
                                  </li>
                                  {/* {item?.timeSlots === 0 && <></>}
                                  {item?.timeSlots?.map(
                                    (time: string, index: number) => (
                                      <li key={index}>
                                        <p className="text-body1 text-gray-800">
                                          {time?.from} - {time?.to}
                                        </p>
                                      </li>
                                    )
                                  )} */}
                                </ul>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-wrap items-center  p-3 rounded-lg gap-4">
                            {sampleAvailability?.map((item, index) => (
                              <div
                                key={index}
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full"
                              >
                                <p className="text-body1 text-gray-800 capitalize">
                                  {item.day}
                                </p>
                                <p className="text-body1 text-gray-800 capitalize">
                                  {item.slot}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

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
              </ModalBody>
              <ModalFooter>
                <CustomButton
                  label="Close"
                  type="button"
                  color="danger"
                  size="sm"
                  variant="flat"
                  onPress={onClose}
                />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ServicePreview;

const CustomRadio = (props) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      className={cn(
        "group inline-flex items-center justify-between hover:bg-content2 flex-row-reverse",
        "w-full cursor-pointer border-2 border-default rounded-lg gap-10 p-4",
        "data-[selected=true]:border-primary"
      )}
    >
      {children}
    </Radio>
  );
};
