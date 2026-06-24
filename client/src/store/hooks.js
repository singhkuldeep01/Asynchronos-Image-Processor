import { useImageProcessorStore } from "./imageStore.js";
import { useShallow } from "zustand/react/shallow";

export const useJobState = () =>
  useImageProcessorStore((state) => state.job);

export const useUploaderState = () =>
  useImageProcessorStore(
    useShallow((state) => ({
      selectedImage: state.selectedImage,
      isUploading: state.isUploading,
    }))
  );

export const useProcessedImages = () =>
  useImageProcessorStore((state) => state.job.images);

export const useImageActions = () =>
  useImageProcessorStore(
    useShallow((state) => ({
      setSelectedImage: state.setSelectedImage,
      clearSelectedImage: state.clearSelectedImage,
      beginUpload: state.beginUpload,
      markQueuedForProcessing: state.markQueuedForProcessing,
      markUploadFailed: state.markUploadFailed,
      setJobProgress: state.setJobProgress,
      setJobCompleted: state.setJobCompleted,
      resetJob: state.resetJob,
    }))
  );