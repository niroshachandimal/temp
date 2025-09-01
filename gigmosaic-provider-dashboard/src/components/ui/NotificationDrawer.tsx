import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
  Button,
  AccordionItem,
  Accordion,
  Divider,
  Avatar,
} from "@heroui/react";
import Notification from "./Notification";
import { GoDotFill } from "react-icons/go";
import { sampleNotifications } from "../../data/sampleData";

const NotificationDrawer = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const count = 10;

  const defaultContent =
    "A dark theme should avoid using saturated colors, as they don't pass WCAG's accessibility standard of at least 4.5:1 for body text against dark surfaces. Saturated colors also produce optical vibrations against a dark background, which can induce eye strain.A dark theme should avoid using saturated colors, as they don't pass WCAG's accessibility standard of at least 4.5:1 for body text against dark surfaces. Saturated colors also produce optical vibrations against a dark background, which can induce eye strain.";

  const defaultContentTemplate = (title: string, message: string) => {
    return (
      <div className="flex flex-col gap-2">
        <p className=" text-sm text-bold">{title}</p>
        <p className="text-sm opacity-80 ">{message}</p>
      </div>
    );
  };

  return (
    <>
      <Notification open={onOpen} />
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        radius="sm"
        backdrop="transparent"
        size="lg"
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 ">
                <div>
                  <div className="relative flex items-center justify-start">
                    <p className="text-xl font-semibold">Notification</p>
                    {count > 0 && (
                      <span className="absolute -top-2 left-[113px] bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                        {count}
                      </span>
                    )}
                  </div>
                </div>
              </DrawerHeader>

              <DrawerBody>
                <Divider />
                <Accordion showDivider>
                  {sampleNotifications.map((n) => (
                    <AccordionItem
                      key={n.id}
                      startContent={
                        <Avatar
                          isBordered
                          color="default"
                          radius="full"
                          src={n.avatar}
                        />
                      }
                      classNames={{
                        subtitle: " line-clamp-1",
                        content: "text-body1",
                      }}
                      subtitle={n.subtitle}
                      title={
                        <div className="flex flex-initial justify-between items-center gap-3">
                          <div className="flex flex-rows items-center gap-3">
                            <p className="text-body1 ">{n.title}</p>
                            <p className="text-caption">{n.date}</p>
                          </div>
                          <GoDotFill size={16} color="green" />
                        </div>
                      }
                    >
                      {defaultContentTemplate(n.title, n.subtitle)}
                    </AccordionItem>
                  ))}
                </Accordion>
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default NotificationDrawer;
