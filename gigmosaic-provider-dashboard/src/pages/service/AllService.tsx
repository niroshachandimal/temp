import CustomButton from "../../components/ui/CustomButton";
import ServiceCard from "../../components/ui/ServiceCard";
import { MdAddCircleOutline } from "react-icons/md";
import { FaList } from "react-icons/fa6";
import { IoGridOutline } from "react-icons/io5";
import CustomInput from "../../components/ui/CustomInput";
import { IoSearchSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../../components/ui/CustomPagination";
import { useMemo, useState } from "react";
import ServiceCardList from "../../components/ui/ServiceCardList";
import {
  useFetchAllService,
  useFetchSubscriptions,
} from "../../hooks/queries/useFetchData";
import Loading from "../../components/ui/Loading";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";

const AllService = () => {
  const navigate = useNavigate();
  const [isListView, setIsListView] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: userSubs } = useFetchSubscriptions();
  const { data, isLoading } = useFetchAllService({
    page: currentPage,
    limit: 8,
  });


  const totalServices = data?.totalActiveServicers ?? 0;
  const allowedServices = userSubs?.plan?.limits?.services ?? 0;
  const isFreePlan = userSubs?.plan?.tier === 0;
  const hasReachedLimit = totalServices >= allowedServices;
  const isDisabled = isFreePlan && hasReachedLimit;
  const shouldShowOverLimitModal = !isFreePlan && hasReachedLimit;


  const apiData = useMemo(() => data?.services || [], [data]);
  const totalPage = useMemo(() => data?.pages || 1, [data]);

  return (
    <>
      {isLoading ? <Loading label="Loading..." /> : <></>}
      <div className="grid sm:grid-cols-2 gap-2 md:gap-5">
        <div className="flex justify-start items-center gap-2 md:gap-4 mb-8 ">
          <CustomInput
            placeholder="Search..."
            type="text"
            size="sm"
            endContent={<IoSearchSharp size={20} />}
            className="sm:max-w-[300px]"
          />
        </div>

        <div className="flex justify-end items-center gap-4 mb-8 ">
          <CustomButton
            isIconOnly={true}
            size="sm"
            startContent={<IoGridOutline size={18} />}
            onPress={() => setIsListView(false)}
            className="hidden sm:flex"
          />
          <CustomButton
            isIconOnly={true}
            size="sm"
            startContent={<FaList size={18} />}
            onPress={() => setIsListView(true)}
            className="hidden sm:flex"
          />
          <CustomButton
            label="Add Service"
            type="button"
            size="sm"
            color="primary"
            isDisabled={isDisabled || isLoading}
            startContent={<MdAddCircleOutline size={20} />}
            // onPress={() => navigate("/service/add-service")}
            onPress={() => {
              if (shouldShowOverLimitModal) {
                onOpen(); // trigger confirmation modal
              } else {
                navigate("/service/add-service"); // proceed
              }
            }}
            className="-mt-6 sm:mt-0"
          />
        </div>
      </div>

      {/* Content */}
      {isListView ? (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-col-3 gap-3">
            <ServiceCardList data={apiData} />
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          <ServiceCard data={apiData} />
        </div>
      )}

      <div className="flex justify-end items-end py-5 mt-7">
        <CustomPagination
          page={currentPage}
          initialPage={1}
          total={totalPage}
          size="md"
          onChange={setCurrentPage}
        />
      </div>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Service Limit Exceeded</ModalHeader>
                <ModalBody>
                  <p>
                    You've exceeded your service limit. Adding more services may
                    incur additional charges. Do you want to continue?
                  </p>

                  <ModalFooter>
                    <div className="flex gap-4 mt-4">
                      <CustomButton
                        label="Yes, Continue"
                        color="primary"
                        onPress={() => {
                          onClose();
                          navigate("/user/profile/plan");
                        }}
                        className="btn btn-primary"
                      >
                        Yes, Continue
                      </CustomButton>
                      <CustomButton
                        label="Cancel"
                        color="danger"
                        onPress={() => onClose()}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </CustomButton>
                    </div>
                  </ModalFooter>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default AllService;
