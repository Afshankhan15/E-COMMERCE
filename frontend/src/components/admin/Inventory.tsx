// import ProgressBar from "@ramonak/react-progress-bar";

interface inventoryProps {
  label: string;
  percentage: number;
  color: string;
}
// this  comp is only laptop -> (progres) -> 40% simple
const Inventory: React.FC<inventoryProps> = ({ label, percentage, color }) => {
  return (
    <div className="flex lg:gap-2 text-sm items-center justify-around">
      <h1 className="text-gray-800">{label}</h1>
      {/* <ProgressBar
        completed={percentage}
        className="w-[50%] text-sm"
        height="0.5rem"
        bgColor={color}
        isLabelVisible={false}
      /> */}
      <p>{percentage}%</p>
    </div>
  );
};

export default Inventory;
