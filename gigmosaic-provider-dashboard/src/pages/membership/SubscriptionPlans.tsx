/* eslint-disable @typescript-eslint/no-explicit-any */
import { Check, Star, X } from "lucide-react";
import { useState } from "react";
import {
  useFetchAllMembershipPlans,
  useFetchSubscriptions,
} from "../../hooks/queries/useFetchData";
import { ImCross } from "react-icons/im";
import { useAuth } from "react-oidc-context";
import {
  useCancelMembershipMutation,
  useSubmitMembershipMutation,
  useUpdateMembershipMutation,
} from "../../hooks/mutations/useMembership";
import PricingComparisonTable from "./PricingComparisonTable";
import {
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { BsCart, BsCreditCard } from "react-icons/bs";
import CustomButton from "../../components/ui/CustomButton";

const SubscriptionPlans = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const { data } = useFetchAllMembershipPlans();
  const { data: userSubs } = useFetchSubscriptions();
  const auth = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { mutate, isPending } = useSubmitMembershipMutation();
  const { mutate: upgradeMutation } = useUpdateMembershipMutation();
  const { mutate: cancelMutation } = useCancelMembershipMutation();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const currentSubscription = userSubs?.subscription?.[0];
  const currentPlanId = currentSubscription?.PlanId;
  const isCurrentBillingAnnual = currentSubscription?.billingCycle === "year";
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    name: string;
    tier: string;
    price: number;
  }>({ name: "", tier: "", price: 0 });

  const handleClick = (planId: string, isAnnual: boolean) => {
    setLoadingPlanId(planId);
    const currentPlanId = currentSubscription?.PlanId;
    const isUpgrade = !!currentPlanId;

    if (isUpgrade) {
      console.log("Upgrading subscription...");
      upgradeMutation(
        {
          subscriptionId: currentSubscription?.stripeSubscriptionId,
          planId: currentPlanId,
        },
        {
          onSettled: () => {
            setLoadingPlanId(null);
          },
        }
      );
    } else {
      mutate(
        { planId, isAnnual, customerEmail: auth.user?.profile.email },
        {
          onSettled: () => {
            setLoadingPlanId(null);
          },
        }
      );
    }
  };

  const handleCancelSubscription = (subscriptionId: string) => {
    console.log("Cancelling subscription...");
    cancelMutation(
      { subscriptionId },
      {
        onSuccess: () => {
          window.location.reload();
        },
        onError: (error) => {
          console.error("Cancel failed:", error);
          // Handle error
        },
      }
    );
  };

  const sortedPlans = [...(data?.plans ?? [])].sort((a, b) => a.tier - b.tier);

  const isExactCurrentPlan = (plan: any) => {
    if (!currentPlanId) return false;

    // Check if plan has the required price objects
    if (
      !plan.pricing.monthly.stripe_price_id ||
      !plan.pricing.yearly.stripe_price_id
    )
      return false;

    const currentPriceId = isCurrentBillingAnnual
      ? plan.pricing.yearly.stripe_price_id
      : plan.pricing.monthly.stripe_price_id;
    if (currentPlanId === currentPriceId) {
      return true;
    }
    return false;
  };

  const isSamePlanDifferentCycle = (
    plan: any
  ): { isSame: boolean; cycleType?: "month" | "annual" } => {
    if (
      !currentPlanId ||
      !plan.pricing.monthly.stripe_price_id ||
      !plan.pricing.yearly.stripe_price_id
    ) {
      return { isSame: false };
    }

    const isMonthlyMatch =
      currentPlanId === plan.pricing.monthly.stripe_price_id;
    const isAnnualMatch = currentPlanId === plan.pricing.yearly.stripe_price_id;

    if ((isMonthlyMatch || isAnnualMatch) && isExactCurrentPlan(plan)) {
      return {
        isSame: true,
        cycleType: isAnnualMatch ? "annual" : "month",
      };
    }

    return { isSame: false };
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Select the perfect plan for your needs. Upgrade or downgrade at any
            time.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="bg-gray-900 p-1 rounded-full flex items-center">
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isAnnual
                    ? "bg-purple-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Pay Yearly
                <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                  UP TO 17% OFF 🔥
                </span>
              </button>
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  !isAnnual
                    ? "bg-purple-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Pay Monthly
              </button>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sortedPlans.map((plan: any) => {
            const isExactCurrent = isExactCurrentPlan(plan);
            const { isSame: isSamePlanDiffCycle, cycleType } =
              isSamePlanDifferentCycle(plan);
            const isFreePlan = plan.tier === 0;
            const isCustomPlan = plan.name.toLowerCase().includes("enterprise");

            let buttonText = currentPlanId
              ? `Upgrade to ${plan.name}`
              : `Choose ${plan.name}`;
            let buttonVariant = currentPlanId ? "upgrade" : "choose";

            if (isExactCurrent && !isSamePlanDiffCycle) {
              buttonText = "Cancel Subscription";
              buttonVariant = "cancel";
            } else if (isSamePlanDiffCycle && isExactCurrent) {
              console.log("teert");
              if (isAnnual && cycleType === "annual") {
                console.log("dfsdfss");

                buttonText = isCurrentBillingAnnual
                  ? "Switch to Monthly"
                  : "Cancel Subscription";
                buttonVariant = "cancel";
              } else if (!isAnnual && cycleType === "month") {
                buttonText = isCurrentBillingAnnual
                  ? "Downgrade to Monthly"
                  : "Cancel Subscription";
                buttonVariant = "cancel";
              } else {
                buttonText = "Switch to Annual";
                buttonVariant = "upgrade";
              }
            } else if (isFreePlan) {
              buttonText = currentPlanId
                ? "Downgrade to Free"
                : "Your Current Plan";
              buttonVariant = "free";
            }

            return (
              <div
                key={plan.name}
                className={`relative rounded-lg shadow-sm ${
                  plan.popular
                    ? "border-2 border-blue-500 shadow-lg"
                    : "border border-gray-200"
                } bg-white ${
                  (isExactCurrent &&
                    isSamePlanDiffCycle &&
                    isAnnual &&
                    cycleType === "annual") ||
                  (!isAnnual && cycleType === "month")
                    ? "ring-2 ring-purple-500"
                    : ""
                }`}
              >
                {(isExactCurrent &&
                  isSamePlanDiffCycle &&
                  isAnnual &&
                  cycleType === "annual") ||
                  (!isAnnual && cycleType === "month" && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Current Plan
                      </div>
                    </div>
                  ))}

                {plan.popular && !isExactCurrent && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Card Header */}
                <div className="text-center p-6 pb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {plan.name}
                  </h3>
                  <div className="mt-4">
                    {!isFreePlan && isAnnual && !isCustomPlan && (
                      <p className="text-sm text-gray-900 font-bold mt-1">
                        ${plan.pricing.effectiveMonthly}/month billed annually
                      </p>
                    )}
                    <div className="flex items-baseline justify-center">
                      <span
                        className={`${
                          isAnnual
                            ? "text-gray-500"
                            : " font-bold text-gray-900 "
                        } text-md`}
                      >
                        {isFreePlan
                          ? "CAD0"
                          : isCustomPlan
                          ? "Custom"
                          : `CAD${
                              isAnnual
                                ? plan.pricing.yearly.price
                                : plan.pricing.monthly.price
                            }`}
                      </span>
                      {!isFreePlan && !isCustomPlan && (
                        <span className="text-gray-600 ml-1">
                          /{isAnnual ? "year" : "month"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                {/* <div className="px-6 pb-6">
                  <ul className="space-y-3">
                   
                    {Object.entries(plan.features).map(
                      ([key, value], index) => {
                        const isBooleanFeature = typeof value === "boolean";
                        const featureLabelMap: Record<string, string> = {
                          analytics: "Analytics",
                          bookingCalendar: "Booking Calendar",
                          messaging: "Messaging",
                          branding: "Branding",
                          promoTools: "Promotional Tools",
                        };

                        return (
                          <li
                            key={`feature-${index}`}
                            className="flex items-start gap-2"
                          >
                            {isBooleanFeature ? (
                              value ? (
                                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              ) : (
                                <ImCross className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                              )
                            ) : (
                              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            )}

                            <span className="text-sm text-gray-700">
                              {featureLabelMap[key]}
                              {!isBooleanFeature && `: ${value}`}
                            </span>
                          </li>
                        );
                      }
                    )}

                   
                    {plan.limits &&
                      Object.entries(plan.limits).map(([key, value], index) => {
                        const limitLabelMap: Record<string, string> = {
                          services: "Services Limit",
                          teamMembers: "Team Members",
                          featuredListings: "Featured Listings",
                        };

                        return (
                          <li
                            key={`limit-${index}`}
                            className="flex items-start gap-2"
                          >
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">
                              {limitLabelMap[key]}: {value}
                            </span>
                          </li>
                        );
                      })}
                  </ul>
                </div> */}

                <div className="px-6 pb-6">
                  <ul className="space-y-3">
                    {/* Analytics */}
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">
                        Analytics: {plan.features.analytics}
                      </span>
                    </li>

                    {/* Booking Calendar */}
                    <li className="flex items-start gap-2">
                      {plan.features.bookingCalendar ? (
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <ImCross className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      )}
                      <span className="text-sm text-gray-700">
                        Booking Calendar
                      </span>
                    </li>

                    {/* Services Limit */}
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">
                        Services Limit: {plan.limits.services}
                      </span>
                    </li>

                    {/* Team Members */}
                    <li className="flex items-start gap-2">
                      {plan.limits.teamMembers === 0 ? (
                        <>
                          <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            Team Members: {plan.limits.teamMembers}
                          </span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            Team Members: {plan.limits.teamMembers}
                          </span>
                        </>
                      )}
                    </li>

                    {/* Featured Listings */}
                    <li className="flex items-start gap-2">
                      {plan.limits.featuredListings === "0/month" ? (
                        <>
                          <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            Featured Listings: {plan.limits.featuredListings}
                          </span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            Featured Listings: {plan.limits.featuredListings}
                          </span>
                        </>
                      )}
                    </li>
                  </ul>
                </div>

                {/* Card Footer */}
                <div className="p-6 pt-0">
                  {isCustomPlan ? (
                    <a
                      href="/contact"
                      className="w-full block text-center py-2 px-4 rounded-md font-medium text-sm bg-primary text-white hover:bg-blue-700"
                    >
                      Contact Sales
                    </a>
                  ) : buttonVariant === "cancel" ? (
                    <button
                      onClick={() =>
                        handleCancelSubscription(
                          currentSubscription?.stripeSubscriptionId
                        )
                      }
                      className="w-full py-2 px-4 rounded-md font-medium text-sm bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      {buttonText}
                    </button>
                  ) : (
                    buttonVariant !== "free" && (
                      <button
                        onClick={() =>
                          // handleClick(
                          //   // isAnnual
                          //   //   ? plan.pricing.monthly.stripe_price_id
                          //   //   : plan.pricing.yearly.stripe_price_id,
                          //   plan.tier,
                          //   isAnnual
                          // )
                          {
                            const price = isAnnual
                              ? plan.pricing.yearly.price
                              : plan.pricing.monthly.price;

                            setSelectedPlan({
                              name: plan.name,
                              tier: plan.tier,
                              price,
                            });
                            setShowConfirmation(true);
                            onOpen();
                          }
                        }
                        disabled={
                          loadingPlanId === plan.tier
                          // (isAnnual
                          //   ? plan.pricing.yearly.stripe_price_id
                          //   : plan.pricing.monthly.stripe_price_id)
                        }
                        className={`w-full py-2 px-4 rounded-md font-medium text-sm transition-colors ${
                          isPending
                            ? "bg-gray-300"
                            : "border-primary border hover:bg-purple-50"
                        }`}
                      >
                        {loadingPlanId === plan.tier
                          ? // (isAnnual
                            //   ? plan.pricing.yearly.stripe_price_id
                            //   : plan.pricing.monthly.stripe_price_id)
                            "Processing..."
                          : buttonText}
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {showConfirmation && (
          <Modal isOpen={isOpen} onClose={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader>
                    <div className="block ">
                      <div className="flex items-center gap-3">
                        <BsCart />
                        <p className="text-lg font-semibold">Checkout</p>
                      </div>

                      <p className="text-navlink">
                        Review your order and proceed to payment
                      </p>
                    </div>
                  </ModalHeader>
                  <ModalBody>
                    <h3 className="font-semibold">Order Summary</h3>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{selectedPlan.name}</h4>
                        <p className="text-navlink">
                          ${selectedPlan.price.toFixed(2)} each
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-8 text-center">1</span>
                        </div>
                        <div className="w-20 text-right font-medium">
                          ${(selectedPlan.price * 1).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Price Summary */}
                    <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${selectedPlan.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax 10%:</span>
                        <span>${(selectedPlan.price * 0.1).toFixed(2)}</span>
                      </div>
                      <Divider />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span>${(selectedPlan.price * 1.1).toFixed(2)}</span>
                      </div>
                    </div>

                    <CustomButton
                      label="Proceed to Payment"
                      onPress={() => {
                        setShowConfirmation(false);
                        handleClick(selectedPlan.tier, isAnnual);
                        onClose();
                      }}
                      className="w-full"
                      size="lg"
                      startContent={<BsCreditCard className="mr-2 h-4 w-4" />}
                    ></CustomButton>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        )}

        {/* table */}
        <PricingComparisonTable plans={sortedPlans ?? []} />

        {/* Additional Info */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 mt-2">
            Questions?{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Contact our sales team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
