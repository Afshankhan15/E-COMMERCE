import React from "react";
import AddIcon from "@mui/icons-material/Add";
import clsx from "clsx";
interface ProductCardProps {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handler: () => void;
}
const ProductCard: React.FC<ProductCardProps> = React.memo(({
  productId,
  photo,
  name,
  price,
  stock,
  handler,
}) => {
  return (
    <div className="max-w-[280px] flex flex-col relative bg-white p-6 text-center border rounded shadow transition duration-300 group hover:shadow-[0px_7px_10px_rgba(0,0,0,0.5)]">
      {/* <img src={photo} alt="" className="w-full h-56" /> */}
      
      {/* using it to display backend photo upload using localhost:4000/upload.... */}
      <img src={`${import.meta.env.VITE_SERVER}/${photo}`} alt="" className="w-full h-56" />
      <p className="text-gray-600 text-sm mt-2">{name}</p>
      <h1 className="font-bold text-sm">${price}</h1>
      <p
        className={clsx(
          "text-sm hidden group-hover:block",
          stock === 0 ? "text-red-500" : "text-green-600"
        )}
      >
        {stock === 0 ? "Out of Stock" : `${stock} available`}
      </p>
      {/* show icon when user hover using group hover */}
      {/* <p onClick={handler} className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-blue-500 text-white mx-auto border rounded-full p-1 opacity-0 group-hover:opacity-100 duration-300'> */}
      <p
        onClick={handler}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-blue-500 text-white mx-auto border rounded-full p-1 opacity-0 group-hover:opacity-100 duration-300"
      >
        <AddIcon />
      </p>
    </div>
  );
});

export default ProductCard;

// you can make use of Tailwind's group utility, along with the group-hover variant. This allows you to control the visibility of child elements when the parent element is hovered.
// You can start by hiding the icon initially (using opacity-0), and then reveal it on hover (using group-hover:opacity-100).
