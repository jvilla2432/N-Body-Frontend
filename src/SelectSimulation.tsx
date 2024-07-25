import { Select } from '@mantine/core';
export default function SelectSimulation( {options, changeSim} : {options: any, changeSim:any}) {
  return (
    <Select
      label="Choose Sim to display"
      data={options}
      allowDeselect={false}
      onChange={(_value) => changeSim(_value)}
    >
    </Select>
  )
}