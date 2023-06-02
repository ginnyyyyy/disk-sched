import { Select } from "antd";
import { useState } from "react";

const { Option } = Select;

const SelectAlgorithm = ({ algorithm, setAlgorithm }) => {
  // const algorithmOptions = ["fifo", "sstf", "scan", "cscan", "look", "clook"];
  // const [algorithm, setAlgorithm] = useState("");

  const onSearch = (value) => {
    console.log("search:", value);
  };
  const onChange = (value) => {
    setAlgorithm(value);
  };
  console.log(algorithm, "wew");

  return (
    <div className='flex flex-col items-center'>
      <label
        htmlFor='algorithm'
        className='block mb-2 text-lg font-medium text-[#0A090C] dark:text-white text-center'
      >
        Choose Algorithm
      </label>
      <Select
        showSearch
        placeholder='Select an algorithm'
        optionFilterProp='children'
        value={algorithm}
        onChange={onChange}
        onSearch={onSearch}
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        options={[
          {
            value: "fifo",
            label: "First In First Out",
          },
          {
            value: "sstf",
            label: "Shortest Seek Time First",
          },
          {
            value: "scan",
            label: "Scan",
          },
          {
            value: "cscan",
            label: "C-Scan",
          },
          {
            value: "clook",
            label: "C-Look",
          },
        ]}
        className='border hover:border-[#8C86AA] border-[#7E3F8F] border-4 rounded-lg w-80 focus:border-[#8C86AA]'
        dropdownClassName='border border-gray-300 bg-[#8C86AA] dark:border-gray-600 dark:bg-gray-800 custom-dropdown '
      />
      {/* <Option value='fifo'>FIFO - First In First Out</Option>
        <Option value='sstf'>SSTF - Shortest Seek Time First</Option>
        <Option value='scan'>SCAN</Option>
        <Option value='cscan'>C-SCAN</Option>
        <Option value='look'>LOOK</Option>
        <Option value='clook'>C-LOOK</Option>
      </Select> */}
    </div>
  );
};

export default SelectAlgorithm;
