import { IoChevronBack, IoFilter } from "react-icons/io5";
import { IoIosMore } from "react-icons/io";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAppState } from "./AppStateContext";
import EditGeneralModal from "../overlays/EditGeneralModal";
import EditBoardModal from "../overlays/EditBoardModal";

interface AppBarProps {
  isBoard: boolean;
  title?: string;
  showTitle?: boolean;
}

//TODO: add shadow if scroll position is > 0 (showtitle is true)

export const AppBar = (props: AppBarProps) => {
  const { isBoard, title, showTitle } = props;
  const { setEditModalOpen } = useAppState();
  const router = useRouter();

  const back = () => {
    router.back();
  };

  return (
    <>
      <div className={`fixed inset-x-0 top-0 grid grid-cols-3 bg-black h-[50px] pt-3 px-2 z-10`}>
        <div className='text-2xl' onClick={back}><IoChevronBack /></div>
        <div className="text-center">{showTitle && title ? title : ''}</div>
        <div className="flex justify-end gap-6">
          <div className='text-2xl'><IoFilter /></div>
          <div className='text-2xl' onClick={() => setEditModalOpen(true)}><IoIosMore /></div>
        </div>
      </div>
      <EditGeneralModal />
      <EditBoardModal />
    </>
  );
};