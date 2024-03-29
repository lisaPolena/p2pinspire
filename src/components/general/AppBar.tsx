import { IoChevronBack, IoFilter } from "react-icons/io5";
import { IoIosMore } from "react-icons/io";
import { useRouter } from "next/router";
import { useAppState } from "./AppStateContext";
import EditGeneralModal from "../overlays/general/EditGeneralModal";
import EditBoardModal from "../overlays/board/EditBoardModal";
import { useEffect, useState } from "react";
import EditPinModal from "../overlays/pin/EditPinModal";
import FilterBoardModal from "../overlays/board/FilterBoardModal";
import { Board, Pin } from "@/common/types/structs";
import EditProfileModal from "../overlays/user/EditProfileModal";

interface AppBarProps {
  isBoard: boolean;
  isSavedPin: boolean;
  isProfile: boolean;
  title?: string;
  showTitle?: boolean;
  board?: Board | null;
  pin?: Pin;
  hideBackButton?: boolean;
  pins?: Pin[] | null;
}

export const AppBar = (props: AppBarProps) => {
  const {
    isBoard,
    isSavedPin,
    isProfile,
    title,
    showTitle,
    board,
    pin,
    hideBackButton,
    pins,
  } = props;
  const { setEditModalOpen, setFilterBoardModalOpen, createPinModalOpen } =
    useAppState();
  const [longTitle, setLongTitle] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (title && title.length > 17) {
      setLongTitle(true);
    }
  }, [title]);

  return (
    <>
      <div
        className={`fixed inset-x-0 top-0 grid grid-cols-3 ${
          isBoard ? "bg-black" : "bg-transparent"
        } h-[50px] pt-3 px-2 z-10`}
      >
        {!hideBackButton && (
          <div
            className={`text-2xl ${isBoard ? "" : "pt-[0.5rem] pr-[0.5rem]"}`}
            onClick={() => (!createPinModalOpen ? router.back() : null)}
          >
            {!createPinModalOpen && <IoChevronBack />}
          </div>
        )}
        {hideBackButton && <div></div>}
        <div className={`text-center ${longTitle ? "mt-[-0.5rem]" : ""}`}>
          {showTitle && title ? title : ""}
        </div>
        <div
          className={`flex justify-end gap-6 ${
            isBoard ? "" : "pt-[0.5rem] pr-[0.5rem]"
          } `}
        >
          {isBoard && (
            <div
              className="text-2xl"
              onClick={() =>
                !createPinModalOpen ? setFilterBoardModalOpen(true) : null
              }
            >
              {!createPinModalOpen && <IoFilter />}
            </div>
          )}
          <div
            className="text-2xl"
            onClick={() =>
              !createPinModalOpen ? setEditModalOpen(true) : null
            }
          >
            {!createPinModalOpen && (isBoard || isSavedPin || isProfile) && (
              <IoIosMore />
            )}
          </div>
        </div>
      </div>
      <EditGeneralModal isBoard={isBoard} isSavedPin={isSavedPin} />
      <EditBoardModal board={board ?? null} pins={pins ?? null} />
      <EditPinModal pin={pin ?? null} />
      <FilterBoardModal />
      <EditProfileModal />
    </>
  );
};
