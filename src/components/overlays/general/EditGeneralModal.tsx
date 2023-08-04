import Modal from "../../general/Modal";
import { useAppState } from "../../general/AppStateContext";
import { List, ListItem, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { disconnect } from "@wagmi/core";
import { Toast } from "../../general/Toasts";

interface EditGeneralModalProps {
  isBoard: boolean;
  isSavedPin: boolean;
}

const EditGeneralModal: React.FC<EditGeneralModalProps> = (
  props: EditGeneralModalProps
) => {
  const { isBoard, isSavedPin } = props;
  const { editModalOpen, setEditModalOpen } = useAppState();
  const {
    setEditBoardModalOpen,
    setEditPinModalOpen,
    setDownloadPin,
    setEditProfileModalOpen,
  } = useAppState();
  const router = useRouter();
  const toast = useToast();

  function handleClickEdit() {
    if (isBoard) {
      setEditBoardModalOpen(true);
    } else if (isSavedPin) {
      setEditPinModalOpen(true);
    }
  }

  function handleMergeDownloadClick() {
    if (isBoard) {
      handleToast("Merge function doesn't exist yet");
    } else if (isSavedPin) {
      setDownloadPin(true);
      setEditModalOpen(false);
    }
  }

  async function handleLogout() {
    await disconnect();
    setEditModalOpen(false);
    handleToast("Logged out successfully", "");
    router.push("/");
  }

  function handleToast(message: string, imageHash?: string) {
    toast({
      position: "top",
      render: () => <Toast text={message} imageHash={imageHash} />,
    });
  }

  return (
    <Modal
      isOpen={editModalOpen}
      isAlternative={true}
      closeModal={() => setEditModalOpen(false)}
      title={isBoard ? "Board Options" : "More Options"}
      height="h-[38%]"
    >
      <List>
        {isBoard || isSavedPin ? (
          <>
            <ListItem onClick={handleClickEdit}>
              <p className="mb-4 text-lg font-bold">
                {isBoard ? "Edit Board" : "Edit Pin"}
              </p>
            </ListItem>
            <ListItem onClick={handleMergeDownloadClick}>
              <p className="mb-4 text-lg font-bold">
                {isBoard ? "Merge" : "Download Image"}
              </p>
            </ListItem>
            <ListItem>
              <p className="mb-4 text-lg font-bold">
                {isBoard ? "Share" : "Copy Link"}
              </p>
            </ListItem>
            {isBoard && (
              <ListItem>
                <p className="mb-4 text-lg font-bold">Archive</p>
              </ListItem>
            )}
          </>
        ) : (
          <>
            <ListItem onClick={() => setEditProfileModalOpen(true)}>
              <p className="mb-4 text-lg font-bold">Edit Profile</p>
            </ListItem>
            <ListItem onClick={handleLogout}>
              <p className="mb-4 text-lg font-bold">Logout</p>
            </ListItem>
            <ListItem>
              <p className="mb-4 text-lg font-bold">Copy profile link</p>
            </ListItem>
          </>
        )}
      </List>
    </Modal>
  );
};

export default EditGeneralModal;
