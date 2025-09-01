/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  useDisclosure,
} from "@heroui/react";
import { HiOutlineExternalLink } from "react-icons/hi";
import CustomButton from "../../components/ui/CustomButton";
import {
  BsCart,
  BsCreditCard,
  BsFileText,
  BsPlus,
} from "react-icons/bs";
import { FiMinus } from "react-icons/fi";
import {
  useFetchAllService,
  useFetchStaff,
  useFetchSubscriptions,
} from "../../hooks/queries/useFetchData";
import moment from "moment";
import Loading from "../../components/ui/Loading";
import { IoBagHandle } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { MdAddBusiness } from "react-icons/md";
import {
  useSubmitAddOnsMutation,
  useSubmitChangeBillingMutation,
  useUpdateAddonsMutation,
} from "../../hooks/mutations/useMembership";
import { useAuth } from "react-oidc-context";
import { CiSettings } from "react-icons/ci";
import { useEffect, useState } from "react";
import { Addon } from "../../types";

export const ManageSubscription = () => {
  const { data: userSubs } = useFetchSubscriptions();
  const [pendingChanges, setPendingChanges] = useState<Record<string, number>>(
    {}
  );
  const [showActions, setShowActions] = useState<Record<string, boolean>>({});

  const { data, isLoading } = useFetchAllService({
    page: 1,
    limit: 1,
  });
  const { data: staffData, isLoading: staffLoading } = useFetchStaff({
    page: 1,
    limit: 1,
  });
  const auth = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenAddon,
    onOpen: onOpenAddon,
    onOpenChange: onOpenChangeAddon,
  } = useDisclosure();
  const [pendingAddon, setPendingAddon] = useState(null);
  const [pendingQty, setPendingQty] = useState(null);
  const { mutate, isPending } = useSubmitAddOnsMutation();
  const { mutate: changeBillingMutate, isPending: isloading } =
    useSubmitChangeBillingMutation();
  const { mutate: upgradeMutation, isPending: isUpgrading } =
    useUpdateAddonsMutation();
  const totalServices = data?.totalActiveServicers ?? 0;
  const totalStaff = staffData?.totalActiveServicers ?? 0;
  const isFreePlan = userSubs?.plan?.tier === 0;
  const isDisabled = isFreePlan;

  const handleClick = (addons: Addon, total: number) => {
    const filteredAddons = addons.filter((addon) => addon.quantity > 0);
    console.log(filteredAddons, total);

    mutate(
      { addons: filteredAddons, total, customerEmail: auth.user?.profile.email }
      // {
      //   onSettled: () => {
      //     setLoadingPlanId(null);
      //   },
      // }
    );
  };

  const handleConfirmAddonQuantity = (addon: any, newQuantity: number) => {

    upgradeMutation(
      {
        stripeItemId: addon.stripe_subscription_item_id,
        quantity: newQuantity,
        addonId: addon.addon._id,
      },
      {
        onSettled: () => {
          // Hide the buttons after mutation completes
          setShowActions((prev) => ({
            ...prev,
            [addon.addon._id]: false,
          }));
        },
      }
    );
  };

  const handleBillingClick = () => {
    changeBillingMutate();
    // {
    //   onSettled: () => {
    //     setLoadingPlanId(null);
    //   },
    // }
  };

  const calculateAddonTotals = (subscription: any) => {
    if (!subscription?.activeAddons) return { teamMembers: 0, services: 0 };

    return subscription.activeAddons.reduce(
      (totals: { teamMembers: number; services: number }, addon: any) => {
        if (addon.addon.code === "extra_team_member") {
          totals.teamMembers += addon.quantity || 0;
        } else if (addon.addon.code === "extra_service") {
          totals.services += addon.quantity || 0;
        }
        return totals;
      },
      { teamMembers: 0, services: 0 }
    );
  };

  // Get the addon totals
  const addonTotals = calculateAddonTotals(userSubs?.subscription[0]);

  // Calculate total allowed including addons
  const totalAllowedServices =
    (userSubs?.plan?.limits?.services || 0) + addonTotals.services;
  const totalAllowedStaff =
    (userSubs?.plan?.limits?.teamMembers || 0) + addonTotals.teamMembers;

  const totalAddonsCost =
    userSubs?.subscription[0]?.activeAddons?.reduce(
      (total: number, addon: any) =>
        total + addon.quantity * addon.addon.pricing.amount,
      0
    ) || 0;

  const basePlanCost =
    userSubs?.subscription[0]?.billingCycle === "month"
      ? userSubs?.plan?.pricing?.monthly?.price
      : userSubs?.plan?.pricing?.yearly?.price;


  const updateQuantity = (id: string, quantity: number) => {
    setAddons((prev) =>
      prev.map((addon) =>
        addon._id === id
          ? { ...addon, quantity: Math.max(0, quantity) } // Ensure quantity >= 1
          : addon
      )
    );
  };

  const [addons, setAddons] = useState<Addon[]>([]);
  const taxRate = 0.08; // 8% tax

  const subtotal = addons.reduce(
    (sum, addon) => sum + addon.pricing.amount * addon.quantity,
    0
  );
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  useEffect(() => {
    if (userSubs?.plan?.availableAddons) {
      // Clone the addons to local state with default quantities if not set
      const initialized = userSubs.plan.availableAddons.map((addon:any) => ({
        ...addon,
        quantity: 0,
      }));
      setAddons(initialized);
    }
  }, [userSubs]);

  return (
    <>
      {isLoading || staffLoading ? (
        <Loading label="Loading..." />
      ) : (
        <Card radius="none" shadow="none" className="">
          <Card radius="none" shadow="sm" className="mb-4">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-subtitle3 mb-2">Plan & Billing</p>
                  <p className="text-gray-600">Manage your plan and payments</p>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-3 ">
                  <CustomButton
                    label="Additional Servicers"
                    variant="flat"
                    size="md"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    startContent={<MdAddBusiness height={16} width={16} />}
                    onPress={() => {
                      // handleClick();
                      onOpenAddon();
                    }}
                    isDisabled={isDisabled || isPending}
                  />
                  {/* <CustomButton
                    label="Cancel subscription"
                    variant="bordered"
                    size="md"
                    className="border-red-500 text-red-600 hover:bg-red-50 bg-transparent"
                  /> */}
                  <CustomButton
                    label="Manage payments"
                    endContent={
                      <HiOutlineExternalLink className="w-4 h-4 ml-2" />
                    }
                    variant="bordered"
                    size="md"
                    onPress={() => {
                      handleBillingClick();
                    }}
                    isDisabled={isloading}
                    className="border-slate-200 hover:bg-slate-50 bg-transparent"
                  />
                </div>
              </div>
            </CardBody>
          </Card>
          <div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Current Plan - Spans 2 columns */}
              <div className="xl:col-span-1 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-md font-medium">Current Plan</p>
                  <CustomButton
                    label="Change plan"
                    variant="bordered"
                    startContent={<CiSettings className="w-4 h-4" />}
                    className=" text-blue-600 hover:bg-blue-50 bg-transparent"
                  />
                </div>

                <Card shadow="sm">
                  <CardBody className="relative p-3 ">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div>
                            <p className="text-slate-500 text-sm font-medium">
                              {userSubs?.subscription[0]?.billingCycle ===
                              "month"
                                ? "Monthly"
                                : "Yearly"}{" "}
                              plan
                            </p>
                            <h3 className="text-sm font-bold">
                              {userSubs?.subscription[0]?.billingCycle ===
                              "month"
                                ? `${basePlanCost}CAD/monthly`
                                : `${basePlanCost}CAD/yearly`}
                            </h3>
                          </div>
                        </div>
                        <div className="">
                          <p className="text-xs font-medium text-gray-600">
                            Next billing
                          </p>
                          <p className="text-xs font-semibold text-gray-900">
                            {moment(
                              userSubs?.subscription[0]?.currentPeriodEnd
                            ).format("MMMM Do YYYY")}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Chip className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                          {userSubs?.plan?.name}
                        </Chip>
                        <Chip className="bg-green-100 text-green-800 hover:bg-green-100">
                          {userSubs?.plan?.name === "Free Explorer"
                            ? "Active"
                            : userSubs?.subscription[0]?.status}
                        </Chip>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
              {/* Add-ons */}
              <Card shadow="sm">
                <CardHeader className="text-md font-medium text-gray-500">
                  Add-ons
                </CardHeader>
                <CardBody>
                  <div className="bg-gray-50">
                    <div className=" items-center justify-between">
                      {userSubs?.subscription[0]?.activeAddons.length > 0 &&
                        userSubs?.subscription[0]?.activeAddons.map(
                          (addon: any) => {
                            const addonId = addon.addon._id;
                            const currentQty = addon.quantity;
                            const tempQty =
                              pendingChanges[addonId] ?? currentQty;
                            const showConfirm = showActions[addonId] || false;
                            return (
                              <div
                                key={addon.addon._id}
                                className="flex items-center justify-between p-2 border rounded-lg"
                              >
                                <div className="flex-1">
                                  <p className="text-sm font-medium">
                                    {addon.addon.name}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    ${addon.addon.pricing.amount} per{" "}
                                    {addon.unit}
                                  </p>
                                </div>
                                <div className="block">
                                  <div className="flex items-center gap-2">
                                    <CustomButton
                                      variant="bordered"
                                      size="sm"
                                      label=""
                                      onPress={() => {
                                        const updatedQty = Math.max(
                                          0,
                                          tempQty - 1
                                        );
                                        setPendingChanges((prev) => ({
                                          ...prev,
                                          [addonId]: updatedQty,
                                        }));
                                        setShowActions((prev) => ({
                                          ...prev,
                                          [addonId]: true,
                                        }));
                                      }}
                                      isDisabled={addon.addon.quantity === 0}
                                      className="h-8 w-8 p-0"
                                      startContent={
                                        <FiMinus className="h-4 w-4" />
                                      }
                                    />

                                    <span className="w-8 text-center font-medium">
                                      {tempQty}
                                    </span>
                                    <CustomButton
                                      variant="bordered"
                                      size="sm"
                                      onPress={() => {
                                        const updatedQty = tempQty + 1;
                                        setPendingChanges((prev) => ({
                                          ...prev,
                                          [addonId]: updatedQty,
                                        }));
                                        setShowActions((prev) => ({
                                          ...prev,
                                          [addonId]: true,
                                        }));
                                      }}
                                      className="h-8 w-8 p-0"
                                      label=""
                                      startContent={
                                        <BsPlus className="h-4 w-4" />
                                      }
                                    />

                                    <div className="w-16 text-right font-medium">
                                      $
                                      {Number(tempQty) *
                                        Number(addon.addon.pricing.amount)}
                                    </div>
                                  </div>
                                  {/* Confirm/Cancel buttons */}
                                  {showConfirm && !isUpgrading && (
                                    <div className="flex gap-2 ml-4 mt-1">
                                      <CustomButton
                                        label="✔"
                                        variant="bordered"
                                        onPress={() => {
                                          setPendingAddon(addon);
                                          setPendingQty(tempQty);
                                          onOpen();
                                        }}
                                        className="border-green-300 text-white "
                                      />
                                      <CustomButton
                                        label="✖"
                                        variant="bordered"
                                        onPress={() => {
                                          setPendingChanges((prev) => ({
                                            ...prev,
                                            [addonId]: currentQty,
                                          }));
                                          setShowActions((prev) => ({
                                            ...prev,
                                            [addonId]: false,
                                          }));
                                        }}
                                        className="border-red-300"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          }
                        )}
                    </div>
                  </div>
                  <div className="border border-b-1 my-2" />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-sm font-medium text-gray-900">
                      Add-ons Total:
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      ${totalAddonsCost.toFixed(2)}/month
                    </span>
                  </div>
                </CardBody>
              </Card>
              {/* Renewal Card */}
              {/* <div className="space-y-3">
                <Card shadow="sm">
                  <CardHeader className="text-md font-medium flex items-center gap-3 text-gray-500">
                    <BsCalendar className="w-5 h-5" />
                    Renew at
                  </CardHeader>
                  <CardBody className="relative">
                    <p className="text-md font-medium mb-4">
                      {moment(
                        userSubs?.subscription[0]?.currentPeriodEnd
                      ).format("MMMM Do YYYY")}
                    </p>
                    <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-sm mb-1">Total Cost</p>
                      <p className="text-2xl font-bold">${totalMonthly.toFixed(2)} CAD</p>
                    </div>
                  </CardBody>
                </Card>

                <Card shadow="sm">
                  <CardHeader className="text-md font-medium text-slate-800 flex items-center gap-2">
                    <BsCreditCard className="w-5 h-5 text-gray-500" />
                    Payment Summary
                  </CardHeader>
                  <CardBody className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Base Plan</span>
                      <span className="font-medium text-gray-900">
                        ${basePlanCost?.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Add-ons</span>
                      <span className="font-medium text-gray-900">
                        ${totalAddonsCost?.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-md  font-bold">
                      <span>Total</span>
                      <span className="font-bold text-gray-900">
                        ${totalPlanCost.toFixed(2)}
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </div> */}
            </div>
          </div>

          {/* Usage Section */}
          <div className="mt-2">
            <div className="mb-4">
              <h2 className="text-md font-semibold text-gray-900 mb-1">
                Usage
              </h2>
              <p className="text-gray-600">Your usage is renewed every month</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Chat Credits */}
              <Card className="border shadow-none bg-gray-50">
                <div className="p-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg border border-gray-200 mb-2">
                    <IoBagHandle className="w-4 h-4 text-blue-600" />
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Servicers
                    </span>
                  </div>

                  <p className="text-md font-semibold text-gray-900 mb-3">
                    {totalServices} of {totalAllowedServices}
                  </p>
                  <Progress
                    value={(totalServices / (totalAllowedServices || 1)) * 100}
                    className="h-2 "
                  />
                </div>
              </Card>

              {/* Chatbots */}
              <Card className="border shadow-none bg-gray-50">
                <div className="p-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg border border-gray-200 mb-2">
                    <FaUsers className="w-4 h-4 text-green-600" />
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Staff
                    </span>
                  </div>

                  <p className="text-md font-semibold text-gray-900 mb-3">
                    {totalStaff} of {totalAllowedStaff}
                  </p>
                  <Progress
                    value={(totalStaff / (totalAllowedStaff || 1)) * 100}
                    className="h-2"
                  />
                </div>
              </Card>

              {/* Documents Pages */}
              <Card className="border shadow-none bg-gray-50">
                <div className="p-4">
                  <div className="flex items-center justify-center w-10 h-10  rounded-lg border border-gray-200 mb-">
                    <BsFileText className="w-4 h-4 text-gray-600" />
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Documents pages
                    </span>
                  </div>

                  <p className="text-md font-semibold text-gray-900 mb-3">15</p>
                  <Progress value={1.5} className="h-2" />
                </div>
              </Card>
            </div>
          </div>
        </Card>
      )}

      {isOpen && (
        <Modal isOpen={isOpen} onClose={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Confirm Addon Update</ModalHeader>
                <ModalBody>
                  <p>
                    This change will be charged immediately. Do you want to
                    proceed?
                  </p>

                  <ModalFooter>
                    <div className="flex gap-4 mt-4">
                      <CustomButton
                        label="Yes, Continue"
                        color="primary"
                        onPress={() => {
                          handleConfirmAddonQuantity(pendingAddon, pendingQty);
                          onClose();
                        }}
                        className="btn btn-primary"
                      >
                        Yes, Charge Now
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

      {isOpenAddon && (
        <Modal isOpen={isOpenAddon} onClose={onOpenChangeAddon}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>
                  <div className="block ">
                    <div className="flex items-center gap-3">
                      <BsCart className="h-5 w-5" />
                      <p className="text-lg font-semibold">Checkout</p>
                    </div>

                    <p className="text-navlink">
                      Review your order and proceed to payment
                    </p>
                  </div>
                </ModalHeader>
                <ModalBody className="space-y-2">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Order Summary</h3>
                    {addons.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="text-body3">{item.name}</h4>
                          <p className="text-navlink">
                            ${item.pricing.amount.toFixed(2)} each
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <CustomButton
                              label="-"
                              variant="bordered"
                              size="sm"
                              onPress={() =>
                                updateQuantity(item._id, item.quantity - 1)
                              }
                            />
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <CustomButton
                              label="+"
                              variant="bordered"
                              size="sm"
                              onPress={() =>
                                updateQuantity(item._id, item.quantity + 1)
                              }
                            />
                          </div>
                          <div className="w-20 text-right font-medium">
                            ${(item.pricing.amount * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 px-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax ({(taxRate * 100).toFixed(0)}%):</span>
                      <span>${taxAmount.toFixed(2)}</span>
                    </div>
                    <Divider />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <CustomButton
                    label="Proceed to Payment"
                    onPress={() => {
                      handleClick(addons, total);
                      onClose();
                    }}
                    startContent={<BsCreditCard className="mr-2 h-4 w-4" />}
                    className="w-full"
                    size="lg"
                  />
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
};
