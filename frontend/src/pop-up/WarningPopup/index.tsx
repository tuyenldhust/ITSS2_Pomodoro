import React from "react";
import { CloseOutlined } from "@ant-design/icons";
import WarningPopupBg from "../../assets/images/warningPopup.png";
import { useAppDispatch } from "../../redux/hook";
import { setCloseWarningPopup } from "../../redux/reducers/popupReducer";

const WarningPopup = () => {
  const dispatch = useAppDispatch();
  const handleCloseWarningPopup = () => {
    dispatch(setCloseWarningPopup());
  };

  return (
    <div className="w-screen h-screen fixed inset-0 bg-[rgba(0,0,0,0.5)] z-[101]">
      <div
        style={{ backgroundImage: `url(${WarningPopupBg})` }}
        className="relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-cover bg-no-repeat bg-center w-[884px] h-[461px]"
      >
        <button
          className="absolute top-2 right-12 bg-[#DDDDE3] w-[40px] h-[40px] rounded-full border border-white"
          onClick={handleCloseWarningPopup}
        >
          <CloseOutlined />
        </button>
      </div>
    </div>
  );
};

export default WarningPopup;
