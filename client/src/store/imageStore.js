import { create } from "zustand";

const createInitialJobState = () => ({
  progress: 0,
  status: "idle",
  images: null,
});

const createSelectedImageState = () => ({
  file: null,
  preview: null,
  name: "",
  size: 0,
  type: "",
});

const revokePreview = (selectedImage) => {
  if (selectedImage?.preview) {
    URL.revokeObjectURL(selectedImage.preview);
  }
};

export const useImageProcessorStore = create((set, get) => ({
  selectedImage: createSelectedImageState(),
  isUploading: false,
  job: createInitialJobState(),

  setSelectedImage: (file) => {
    const currentImage = get().selectedImage;
    revokePreview(currentImage);

    if (!file) {
      set({ selectedImage: createSelectedImageState() });
      return;
    }

    set({
      selectedImage: {
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type,
      },
    });
  },

  clearSelectedImage: () => {
    revokePreview(get().selectedImage);
    set({ selectedImage: createSelectedImageState() });
  },

  beginUpload: () => {
    set({
      isUploading: true,
      job: {
        progress: 0,
        status: "uploading",
        images: null,
      },
    });
  },

  markQueuedForProcessing: () => {
    set((state) => ({
      isUploading: false,
      job: {
        ...state.job,
        status: "processing",
      },
    }));
  },

  markUploadFailed: () => {
    set((state) => ({
      isUploading: false,
      job: {
        ...state.job,
        progress: 0,
        status: "idle",
      },
    }));
  },

  setJobProgress: (progress) => {
    set((state) => ({
      job: {
        ...state.job,
        status: "processing",
        progress,
      },
    }));
  },

  setJobCompleted: (images) => {
    set({
      isUploading: false,
      job: {
        progress: 100,
        status: "completed",
        images,
      },
    });
  },

  resetJob: () => {
    set({ job: createInitialJobState(), isUploading: false });
  },
}));