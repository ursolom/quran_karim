import { useNavigate } from "react-router-dom";
import Mosque from "../../public/img_site/Prayer/bg_mosque.jpg";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-black size-full absolute flex justify-center items-center">
      <span className="size-full z-10 absolute"></span>
      <img
        src={Mosque}
        className="size-full object-cover absolute"
        alt="Mosque"
      />
      <div
        className="relative bg-neutral-500 bg-clip-padding backdrop-filter 
        backdrop-blur bg-opacity-10 backdrop-saturate-100 backdrop-contrast-100 md:py-10 md:px-52 
        md:w-fit w-full py-5 text-white z-10 rounded-lg flex flex-col gap-4 justify-center items-center md:text-[35px] text-[20px]"
      >
        <p>الصفحة غير موجودة</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-neutral-500 bg-clip-padding backdrop-filter 
          backdrop-blur bg-opacity-10 backdrop-saturate-100 backdrop-contrast-100 p-3 rounded-lg 
          hover:bg-neutral-800 transition-all duration-150"
        >
          الرجوع للصفحة السابقة
        </button>
      </div>
    </div>
  );
};

export default NotFound;
