import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import "tippy.js/themes/light.css";
import "../../css/calendar.css";

const EventCalender = ({
  data,
  // aspectRatio,
  // height,
  initialView,
  dayMaxEventRows,
  isBooking,
  handleEventClick,
}: {
  data: any[];
  aspectRatio?: number;
  height?: string;
  initialView?: string;
  dayMaxEventRows?: number;
  isBooking?: boolean;
  handleEventClick?: (e: string) => void;
}) => {
  return (
    <div className="calendar-wrapper dark">
      <FullCalendar
        plugins={[
          listPlugin,
          dayGridPlugin,
          multiMonthPlugin,
          timeGridPlugin,
          interactionPlugin,
        ]}
        initialView={initialView}
        events={data}
        eventDidMount={(info) => {
          tippy(info.el, {
            content: info.event.extendedProps.description || "No Data",
            placement: "top",
            animation: "scale",
            theme: "dark",
          });
        }}
        eventClick={(info) => {
          if (isBooking) {
            if (handleEventClick) {
              handleEventClick(info.event.id);
            }
          }
        }}
        nowIndicator={true}
        height={"89vh"}
        navLinks={true}
        now={new Date()}
        dayMaxEventRows={dayMaxEventRows}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: isBooking
            ? "dayGridMonth,dayGridWeek,dayGridDay"
            : "dayGridMonth,dayGridWeek,dayGridDay,dayGridWeek",
        }}
        // timeGridWeek,timeGridDay,
        views={{
          // listDay: { buttonText: "list day" },
          today: { buttonText: "Today" },
          listWeek: { buttonText: "list week" },
          listMonth: { buttonText: "list month" },
          dayGridDay: { buttonText: "Day" },
          dayGridWeek: { buttonText: "Week" },
          dayGridMonth: { buttonText: "Month" },
          timeGridDay: { buttonText: "Time Day" },
          timeGridWeek: { buttonText: "Time Week" },
        }}
        eventTimeFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: "short",
        }}
      />
    </div>
  );
};

export default EventCalender;
