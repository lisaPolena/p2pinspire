import Link from "next/link";
import { useRouter } from "next/router";
import {
  IoHome,
  IoSearch,
  IoAdd,
  IoChatbubbleEllipses,
  IoPersonCircle,
} from "react-icons/io5";
import CreateBoardModal from "../overlays/board/CreateBoardModal";
import CreatePinModal from "../overlays/pin/CreatePinModal";
import NavbarModal from "../overlays/general/NavbarModal";
import { useAppState } from "./AppStateContext";

export const Navbar = () => {
  const { setNavbarModalOpen, loadDeleteBoardTransaction, navbarModalOpen } =
    useAppState();
  const router = useRouter();

  const isActive = (pathname: string) => {
    return router.pathname === pathname;
  };

  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 flex justify-between bg-black ${
          loadDeleteBoardTransaction ? "z-20" : ""
        }`}
      >
        <Link
          href={"/home"}
          className="flex justify-center w-full px-3 py-5 ml-10 align-center"
        >
          <div className="text-2xl">
            <IoHome size={25} color={isActive("/home") ? "white" : "grey"} />
          </div>
        </Link>
        <Link
          href={"/search"}
          className="flex justify-center w-full px-3 py-5 align-center"
        >
          <div className="text-2xl">
            <IoSearch size={25} color={isActive("") ? "white" : "grey"} />
          </div>
        </Link>
        <Link
          href={""}
          className="flex justify-center w-full px-3 py-5 align-center"
          onClick={() => setNavbarModalOpen(true)}
        >
          <div className="text-2xl">
            <IoAdd size={30} color={navbarModalOpen ? "white" : "grey"} />
          </div>
        </Link>
        <Link
          href={""}
          className="flex justify-center w-full px-3 py-5 align-center"
        >
          <div className="text-2xl">
            <IoChatbubbleEllipses
              size={25}
              color={isActive("") ? "white" : "grey"}
            />
          </div>
        </Link>
        <Link
          href={"/profile"}
          className="flex justify-center w-full px-3 py-5 mr-10 align-center"
        >
          <div className="text-2xl">
            <IoPersonCircle
              size={26}
              color={isActive("/profile") ? "white" : "grey"}
            />
          </div>
        </Link>
      </div>
      <NavbarModal />
      <CreateBoardModal />
      <CreatePinModal />
    </>
  );
};
