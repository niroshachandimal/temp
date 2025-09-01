import CustomAutocomplete from "../components/ui/CustomAutocomplete";
import { useState } from "react";

const Dashboard = () => {
  const [valuew, setValue] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  console.log("selectedKey", selectedKey);
  console.log("value", valuew);

  const options = [
    {
      label: "Cat",
      id: "1",
      description: "The second most popular pet in the world",
    },
    { label: "Dog", id: "2", description: "The most popular pet in the world" },
    { label: "Elephant", id: "3", description: "The largest land animal" },
    { label: "Lion", id: "4", description: "The king of the jungle" },
    { label: "Tiger", id: "5", description: "The largest cat species" },
    { label: "Giraffe", id: "6", description: "The tallest land animal" },
  ];

  return (
    <>
      <p>Dashboard</p>
      <CustomAutocomplete
        label="Select a pet"
        placeholder="Enter pet name"
        defaultItems={options}
        onSelectionChange={setSelectedKey}
        onInputChange={setValue}
      />
    </>
  );
};

export default Dashboard;
