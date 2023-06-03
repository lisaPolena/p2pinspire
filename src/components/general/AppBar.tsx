import { IoChevronBack, IoFilter } from "react-icons/io5";
import { IoIosMore } from "react-icons/io";
import { useRouter } from "next/router";
import { useAppState } from "./AppStateContext";
import EditGeneralModal from "../overlays/EditGeneralModal";
import EditBoardModal from "../overlays/EditBoardModal";
import { useEffect, useState } from "react";

interface AppBarProps {
  isBoard: boolean;
  title?: string;
  showTitle?: boolean;
  board?: any;
}

//TODO: add shadow if scroll position is > 0 (showtitle is true)

export const AppBar = (props: AppBarProps) => {
  const { isBoard, title, showTitle, board } = props;
  const { setEditModalOpen } = useAppState();
  const [longTitle, setLongTitle] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    console.log(title?.length);
    if (title && title.length > 17) {
      setLongTitle(true);
    }
  }, [title])

  const back = () => {
    router.back();
  };

  return (
    <>
      <div className={`fixed inset-x-0 top-0 grid grid-cols-3 bg-black h-[50px] pt-3 px-2 z-10`}>
        <div className='text-2xl' onClick={back}><IoChevronBack /></div>
        <div className={`text-center ${longTitle ? 'mt-[-0.5rem]' : ''}`}>{showTitle && title ? title : ''}</div>
        <div className="flex justify-end gap-6">
          <div className='text-2xl'><IoFilter /></div>
          <div className='text-2xl' onClick={() => setEditModalOpen(true)}><IoIosMore /></div>
        </div>
      </div>
      <EditGeneralModal />
      <EditBoardModal board={board} />
    </>
  );
};