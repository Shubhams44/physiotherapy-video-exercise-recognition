/**
 * Video Validation Utilities
 * Validates uploaded video files for physiotherapy movement recognition.
 * Strictly checks file type, size, and extracts duration.
 */

export const MAX_FILE_SIZE_MB = 100;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const SUPPORTED_VIDEO_FORMATS = [
  'video/mp4',
  'video/webm',
  'video/quicktime', // .mov
  'video/x-m4v',
];

export const SUPPORTED_EXTENSIONS = ['.mp4', '.mov', '.webm', '.m4v'];

/**
 * Validates an uploaded video file
 * @param {File} file 
 * @param {Object} options 
 * @returns {{ isValid: boolean, error: string | null }}
 */
export function validateVideoFile(file, options = {}) {
  const maxBytes = options.maxBytes || MAX_FILE_SIZE_BYTES;

  if (!file) {
    return { isValid: false, error: 'No video file selected.' };
  }

  // Check file type
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  
  const hasValidType = SUPPORTED_VIDEO_FORMATS.includes(fileType);
  const hasValidExtension = SUPPORTED_EXTENSIONS.some(ext => fileName.endsWith(ext));

  if (!hasValidType && !hasValidExtension) {
    return {
      isValid: false,
      error: `Unsupported video format. Please upload an MP4, MOV, or WebM video file.`
    };
  }

  // Check file size
  if (file.size > maxBytes) {
    return {
      isValid: false,
      error: `File size exceeds the ${MAX_FILE_SIZE_MB}MB limit (File is ${formatFileSize(file.size)}). Please trim or compress your video.`
    };
  }

  if (file.size === 0) {
    return {
      isValid: false,
      error: 'The selected file is empty (0 bytes). Please choose a valid video.'
    };
  }

  return { isValid: true, error: null };
}

/**
 * Formats file size in bytes to human-readable string (KB, MB, GB)
 * @param {number} bytes 
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Formats duration in seconds to mm:ss
 * @param {number} seconds 
 * @returns {string}
 */
export function formatDuration(seconds) {
  if (isNaN(seconds) || seconds === null || seconds === undefined) {
    return '--:--';
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Asynchronously extracts video metadata (duration, width, height) using native HTML5 Video
 * @param {File} file 
 * @returns {Promise<{ duration: number, width: number, height: number }>}
 */
export function getVideoMetadata(file) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    const objectUrl = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight
      });
    };

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not read video metadata. The video file might be corrupted or in an unsupported codec.'));
    };

    video.src = objectUrl;
  });
}
