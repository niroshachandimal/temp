import {
  convertDateToReadble,
  convertTimeTo12ClockWithAmPm,
} from "../../utils/convertTime";
import { MdCancel } from "react-icons/md";
import { BookingStatus } from "../../types";

const steps = [
  BookingStatus.PENDING,
  BookingStatus.CONFIRMED,
  BookingStatus.INPROGRESS,
  BookingStatus.CANCELLED,
];

interface AuditLog {
  action: string;
  performedBy: string;
  timestamp: string;
}

interface Props {
  auditLogs: AuditLog[];
}

const findAuditForStep = (step: string, logs: AuditLog[]) => {
  if (step === BookingStatus.PENDING) {
    return logs.find((log) =>
      log.action.toLowerCase().includes("created booking")
    );
  }
  return logs.find((log) =>
    log.action.toLowerCase().includes(step.toLowerCase())
  );
};

const CancelledStepper = ({ auditLogs }: Props) => (
  <ol className="items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse md:gap-10">
    {steps.map((step, index) => {
      const isCancelledStep = step === BookingStatus.CANCELLED;
      const audit = findAuditForStep(step, auditLogs);

      return (
        <li
          key={index}
          className="flex items-center space-x-2.5 rtl:space-x-reverse"
        >
          <MdCancel
            size={22}
            className={`w-[26px] h-[26px] border rounded-full ${
              isCancelledStep ? "border-red-500 text-red-500" : "text-gray-300"
            }`}
          />
          <span>
            <h3
              className={`text-sm font-semibold ${
                isCancelledStep ? "text-red-500" : "text-gray-300"
              }`}
            >
              {step}
            </h3>
            <p
              className={`text-xs ${
                isCancelledStep ? "text-red-400" : "text-gray-300"
              }`}
            >
              {audit
                ? `${convertDateToReadble(
                    audit.timestamp
                  )} at ${convertTimeTo12ClockWithAmPm(audit.timestamp)}`
                : "--"}
            </p>
          </span>
        </li>
      );
    })}
  </ol>
);

export default CancelledStepper;
