import { IoChevronBack, IoFilter } from "react-icons/io5";
import { IoIosMore } from "react-icons/io";
import { useRouter } from "next/router";
import { useAppState } from "./AppStateContext";
import EditGeneralModal from "../overlays/EditGeneralModal";
import EditBoardModal from "../overlays/EditBoardModal";
import { useEffect, useState } from "react";
import EditPinModal from "../overlays/EditPinModal";

interface AppBarProps {
  isBoard: boolean;
  isSavedPin: boolean;
  title?: string;
  showTitle?: boolean;
  board?: any;
  pin?: any;
}

//TODO: add shadow if scroll position is > 0 (showtitle is true)

export const AppBar = (props: AppBarProps) => {
  const { isBoard, isSavedPin, title, showTitle, board, pin } = props;
  const { setEditModalOpen } = useAppState();
  const [longTitle, setLongTitle] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (title && title.length > 17) {
      setLongTitle(true);
    }
  }, [title])


  return (
    <>
      <div className={`fixed inset-x-0 top-0 grid grid-cols-3 ${isBoard ? 'bg-black' : 'bg-transparent'} h-[50px] pt-3 px-2 z-10`}>
        <div className={`text-2xl ${isBoard ? '' : 'pt-[0.5rem] pr-[0.5rem]'}`} onClick={() => router.back()}><IoChevronBack /></div>
        <div className={`text-center ${longTitle ? 'mt-[-0.5rem]' : ''}`}>{showTitle && title ? title : ''}</div>
        <div className={`flex justify-end gap-6 ${isBoard ? '' : 'pt-[0.5rem] pr-[0.5rem]'} `}>
          {isBoard && <div className='text-2xl'><IoFilter /></div>}
          <div className='text-2xl' onClick={() => setEditModalOpen(true)}><IoIosMore /></div>
        </div>
      </div>
      <EditGeneralModal isBoard={isBoard} isSavedPin={isSavedPin} />
      <EditBoardModal board={board} />
      <EditPinModal pin={pin} />
    </>
  );
};