import CustomButton from "./CustomButton";
import {
  Avatar,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  User,
} from "@heroui/react";

const CustomerDetailsModal = ({ data }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <User
        onClick={onOpen}
        avatarProps={{
          // src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
          name: `${data?.firstName} ${data?.lastName}`,
        }}
        description={data?.email || "No email"}
        name={`${data?.firstName} ${data?.lastName} `}
        className="cursor-pointer hover:text-primary"
      />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Customer Details
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center gap-3 mb-6">
                  <Avatar
                    className="w-[110px] h-[110px] text-large"
                    name={data?.firstName || "No Name"}
                    // src="https://i.pravatar.cc/150?u=a04258114e29026708c"
                  />
                  <div className="text-center">
                    <p className="font-bold text-lg">{`${data?.firstName} ${data?.lastName} `}</p>
                    <p className="text-gray-500 text-sm">Customer</p>
                  </div>
                </div>

                <div className="">
                  <div className="flex flex-initial justify-between items-center gap-2 mt-4">
                    <p className="text-gray-500">Phone:</p>
                    <p>{data?.phone || "No data"}</p>
                  </div>
                  <div className="flex flex-initial justify-between items-center gap-2 mt-4">
                    <p className="text-gray-500">Email:</p>
                    <p>{data?.email || "No email"}</p>
                  </div>
                  <div className="flex flex-initial justify-between items-center gap-2 mt-4">
                    <p className="text-gray-500">Address:</p>
                    <p>
                      {`${data?.address?.postalCode} ${data?.address?.street} ${data?.address?.city} ${data?.address?.state}`}{" "}
                    </p>
                  </div>
                  {/* <div className="flex flex-initial justify-between items-center gap-2 mt-4">
                    <p className="text-gray-500">Join:</p>
                    <p>2025-11-10</p>
                  </div>
                  <div className="flex flex-initial justify-between items-center gap-2 mt-4">
                    <p className="text-gray-500">Last Booking:</p>
                    <p>2025-05-14</p>
                  </div>
                  <div className="flex flex-initial justify-between items-center gap-2 mt-4">
                    <p className="text-gray-500">Total Booking:</p>
                    <p>31</p>
                  </div> */}
                </div>
              </ModalBody>
              <ModalFooter>
                <CustomButton
                  label="Close"
                  color="danger"
                  variant="bordered"
                  onPress={onClose}
                >
                  Close
                </CustomButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CustomerDetailsModal;
