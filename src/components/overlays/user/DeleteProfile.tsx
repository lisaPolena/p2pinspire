import React from "react";
import OutsideAlerter from "../../general/OutsideClickAlerter";
import { Button } from "@chakra-ui/react";

interface DeleteProfileModalProps {
  isOpen: boolean;
  closeModal: () => void;
  handleDeleteProfile: () => void;
}

const DeleteProfileModal: React.FC<DeleteProfileModalProps> = ({
  isOpen,
  closeModal,
  handleDeleteProfile,
}) => {
  return (
    <>
      {isOpen && (
        <OutsideAlerter action={closeModal}>
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-900 rounded-t-[40px] z-[18] h-[20%">
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold text-white">
                Are you sure?
              </h2>
              <p className="opacity-60">
                All of your boards and pins will be gone forever. Everyone who
                saved a pin, can't view it anymore.
              </p>
            </div>
            <div className="flex pt-4 justify-evenly">
              <Button
                colorScheme="secondary"
                borderRadius={"50px"}
                variant="solid"
                onClick={closeModal}
              >
                Cancel
              </Button>
              <Button
                colorScheme="primary"
                borderRadius={"50px"}
                variant="solid"
                onClick={handleDeleteProfile}
              >
                Delete
              </Button>
            </div>
          </div>
        </OutsideAlerter>
      )}
    </>
  );
};

export default DeleteProfileModal;
