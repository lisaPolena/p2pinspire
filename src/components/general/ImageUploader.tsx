import {
  AspectRatio,
  Box,
  BoxProps,
  CircularProgress,
  Container,
  forwardRef,
  Heading,
  Input,
  Progress,
  Stack,
  Text,
} from "@chakra-ui/react";
import { motion, useAnimation } from "framer-motion";
import { IoCloudUploadOutline } from "react-icons/io5";
import { AiOutlineLoading } from "react-icons/ai";

interface ImageUploaderProps {
  handleUpload: (image: File | null) => void;
  isLoading: boolean;
}

export default function ImageUploader({
  handleUpload,
  isLoading,
}: ImageUploaderProps) {
  return (
    <Container>
      <AspectRatio width="50" ratio={1}>
        <Box
          borderColor="gray.300"
          borderStyle="dashed"
          borderWidth="2px"
          rounded="md"
          shadow="sm"
          role="group"
          transition="all 150ms ease-in-out"
          _hover={{
            shadow: "md",
          }}
          as={motion.div}
          initial="rest"
          animate="rest"
          whileHover="hover"
        >
          <Box position="relative" height="100%" width="100%">
            <Box
              position="absolute"
              top="0"
              left="0"
              height="100%"
              width="100%"
              display="flex"
              flexDirection="column"
            >
              <Stack
                height="100%"
                width="100%"
                display="flex"
                alignItems="center"
                justify="center"
                spacing="4"
              >
                <Box height="12" width="12" position="relative"></Box>
                {isLoading ? (
                  <div className="flex flex-col items-center m-auto">
                    <AiOutlineLoading size={50} className="animate-spin" />
                    <h2 className="mt-4 text-lg font-bold">Uploading...</h2>
                  </div>
                ) : (
                  <div className="flex flex-col items-center m-auto">
                    <IoCloudUploadOutline
                      size={50}
                      className="animate-bounce"
                    />
                    <h2 className="mt-4 text-base">Upload Image here</h2>
                  </div>
                )}
              </Stack>
            </Box>
            <Input
              type="file"
              height="100%"
              width="100%"
              position="absolute"
              top="0"
              left="0"
              opacity="0"
              aria-hidden="true"
              accept="image/*"
              onChange={(e) =>
                handleUpload(e.target.files ? e.target.files[0] : null)
              }
            />
          </Box>
        </Box>
      </AspectRatio>
    </Container>
  );
}
