import { FaCircleCheck } from "react-icons/fa6";
import {
  convertDateToReadble,
  convertTimeTo12ClockWithAmPm,
} from "../../utils/convertTime";
import { BookingStatus } from "../../types";

interface AuditLog {
  action: string;
  performedBy: string;
  timestamp: string;
}

interface CustomStepperProps {
  status: "Pending" | "Confirmed" | "Inprogress" | "Completed" | "Cancelled";
  auditLogs: AuditLog[];
}

const stepMap: Record<string, number> = {
  Pending: 1,
  Confirmed: 2,
  Inprogress: 3,
  Completed: 4,
  Cancelled: 0,
};

const findAuditForStep = (step: string, auditLogs: AuditLog[]) => {
  if (step === BookingStatus.PENDING) {
    return auditLogs.find((log) =>
      log.action.toLowerCase().includes("created booking")
    );
  }
  return auditLogs.find((log) =>
    log.action.toLowerCase().includes(step.toLowerCase())
  );
};

const steps = [
  BookingStatus.PENDING,
  BookingStatus.CONFIRMED,
  BookingStatus.INPROGRESS,
  BookingStatus.COMPLETED,
];

const CustomStepper = ({ status, auditLogs }: CustomStepperProps) => {
  const currentStep = stepMap[status];

  return (
    <ol
      className={` items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse$ ${
        status == BookingStatus.COMPLETED ? "" : "md:gap-10"
      }`}
    >
      {steps.map((step, index) => {
        const stepNumber = stepMap[step];
        const isCompleted = currentStep >= stepNumber;
        const audit = findAuditForStep(step, auditLogs);
        return (
          <li
            key={index}
            className="flex items-center  space-x-2.5 rtl:space-x-reverse"
          >
            <FaCircleCheck
              size={22}
              className={`flex items-center justify-center w-[26px] h-[26px]  rounded-full ${
                isCompleted ? " text-green-500" : " text-gray-300"
              }`}
            />
            <span>
              <h3
                className={`text-body2 ${
                  isCompleted ? "text-green-500" : "text-gray-300"
                }`}
              >
                {step}
              </h3>
              <p
                className={`text-caption text-center ${
                  isCompleted ? "text-gray-500" : "text-gray-300"
                }`}
              >
                {audit
                  ? `${convertDateToReadble(audit.timestamp)}
                     at ${convertTimeTo12ClockWithAmPm(audit.timestamp)}`
                  : "--"}
              </p>
            </span>
          </li>
        );
      })}
    </ol>
  );
};

export default CustomStepper;
