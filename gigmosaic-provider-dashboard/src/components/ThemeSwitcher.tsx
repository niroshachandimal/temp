import { useTheme } from "@heroui/use-theme";
import CustomButton from "./ui/CustomButton";
import { MdOutlineLightMode } from "react-icons/md";
import { LuMoon } from "react-icons/lu";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <div>
        {theme === "dark" ? (
          <CustomButton
            isIconOnly
            variant="bordered"
            startContent={<MdOutlineLightMode size={20} />}
            onPress={() => setTheme("light")}
          />
        ) : (
          <CustomButton
            isIconOnly
            variant="bordered"
            startContent={<LuMoon size={20} />}
            onPress={() => setTheme("dark")}
          />
        )}
      </div>
    </>
  );
};

export default ThemeSwitcher;
