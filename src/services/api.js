import axios from 'axios';

/**
 * Backend API Service
 * 
 * Target Architecture: Python FastAPI Backend
 * Base URL configured via VITE_API_BASE_URL environment variable.
 * Default: http://localhost:8000
 * 
 * Proposed FastAPI Endpoint Contract:
 * POST /api/analyze-video
 * Content-Type: multipart/form-data
 * Form fields:
 *   - video: File (MP4, MOV, WebM)
 *   - exercise_type: string ('squat', 'bicep_curl', 'shoulder_flexion', 'knee_extension', 'other')
 *   - notes: string (optional)
 * 
 * Expected JSON Response:
 * {
 *   "status": "completed",
 *   "recognized_exercise": "Squat",
 *   "posture_assessment": "Good Form with Minor Knee Deviation",
 *   "processing_duration_sec": 3.8,
 *   "rep_count": 4,
 *   "feedback": {
 *     "correct_observations": ["Good depth reached", "Spine remained neutral"],
 *     "form_issues": ["Slight inward knee collapse during ascent"],
 *     "joint_alignment": ["Hip-knee-ankle tracking was 88% within normal bounds"],
 *     "actionable_suggestions": ["Focus on pushing knees outward over toes during ascent"]
 *   },
 *   "joint_angles": {
 *     "max_knee_flexion": 88,
 *     "hip_angle": 92,
 *     "trunk_inclination": 18,
 *     "angle_series": [ ... ]
 *   },
 *   "annotated_video_url": null,
 *   "annotated_frames": []
 * }
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60s timeout for video processing
  headers: {
    'Accept': 'application/json',
  },
});

/**
 * Tests backend connection health
 * @returns {Promise<{ isOnline: boolean, message: string }>}
 */
export async function checkBackendHealth() {
  try {
    const response = await apiClient.get('/api/health', { timeout: 3000 });
    return {
      isOnline: true,
      message: response.data?.message || 'FastAPI backend is connected.',
    };
  } catch (error) {
    // Also try root /
    try {
      const rootRes = await apiClient.get('/', { timeout: 3000 });
      return {
        isOnline: true,
        message: 'Backend server is reachable.',
      };
    } catch (e) {
      return {
        isOnline: false,
        message: `Backend offline at ${API_BASE_URL}. Ensure FastAPI is running.`,
      };
    }
  }
}

/**
 * Submits an uploaded video and exercise type to the FastAPI backend for analysis
 * 
 * @param {Object} params
 * @param {File} params.videoFile - The selected video file
 * @param {string} params.exerciseType - The chosen exercise identifier
 * @param {string} [params.notes] - Optional user description
 * @param {Function} [params.onUploadProgress] - Axios upload progress callback
 * @param {AbortSignal} [params.signal] - Abort controller signal for cancellation
 * @returns {Promise<Object>} The assessment response from the AI backend
 */
export async function analyzeVideo({ videoFile, exerciseType, notes = '', onUploadProgress, signal }) {
  if (!videoFile) {
    throw new Error('A video file must be provided for analysis.');
  }

  const formData = new FormData();
  formData.append('video', videoFile);
  formData.append('exercise_type', exerciseType || 'other');
  if (notes) {
    formData.append('notes', notes);
  }

  try {
    const response = await apiClient.post('/api/analyze-video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(percentCompleted);
        }
      },
      signal,
    });

    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      throw new Error('Video upload was cancelled by user.');
    }

    // Distinguish between network failure (backend offline) and HTTP errors
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        throw new Error(`Video processing timed out. The backend server at ${API_BASE_URL} took too long to respond.`);
      }
      throw new Error(
        `Backend server unreachable at ${API_BASE_URL}. Please ensure your Python FastAPI server is running (e.g., uvicorn main:app --reload --port 8000).`
      );
    }

    const status = error.response.status;
    const detail = error.response.data?.detail || error.response.data?.message;

    if (status === 404) {
      throw new Error(
        `FastAPI endpoint POST /api/analyze-video was not found on ${API_BASE_URL}. Please verify the backend route definition.`
      );
    } else if (status === 422) {
      throw new Error(`Validation error from backend: ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`);
    } else if (status >= 500) {
      throw new Error(`Backend processing error (${status}): ${detail || 'Internal server error in AI analysis pipeline.'}`);
    }

    throw new Error(detail || `Server returned error (${status}).`);
  }
}

/**
 * Sample assessment data structure strictly for frontend demonstration & UI inspection
 * when the Python backend is in development.
 * Explicitly tagged as mock demo data.
 */
export const SAMPLE_ASSESSMENT_DATA = {
  isDemoData: true,
  status: 'completed',
  recognized_exercise: 'Squat',
  confidence_score: 0.94,
  posture_assessment: 'Adequate Depth with Minor Knee Valgus',
  processing_duration_sec: 4.2,
  rep_count: 5,
  feedback: {
    correct_observations: [
      'Adequate squat depth achieved with hip crease passing knee joint level.',
      'Torso inclination stayed within healthy physiotherapy boundaries (15° - 25° forward lean).',
      'Smooth, controlled eccentric descent speed across all 5 recorded repetitions.'
    ],
    form_issues: [
      'Mild inward knee collapse (knee valgus) observed at the start of the upward concentric phase.',
      'Slight heel elevation detected during the lowest phase of repetitions 3 and 4.'
    ],
    joint_alignment: [
      'Left knee angle reached minimum 84° flexion (Target: 80° - 90° for clinical rehabilitation).',
      'Right knee angle reached minimum 87° flexion.',
      'Hip-to-ankle coronal alignment shifted 4.2 cm medially under peak load.'
    ],
    actionable_suggestions: [
      'Push your knees outward in line with your second toe as you drive up from the bottom.',
      'Maintain full foot contact with the ground; ensure weight is balanced across heels and midfoot.',
      'Consider placing a light resistance band above knees to provide tactile feedback against valgus collapse.'
    ]
  },
  joint_angles: {
    max_knee_flexion: 86,
    target_knee_flexion: 90,
    trunk_inclination: 21,
    hip_flexion: 94,
    angle_series: [
      { time: '0.0s', kneeAngle: 175, hipAngle: 178, trunkAngle: 5 },
      { time: '0.8s', kneeAngle: 140, hipAngle: 145, trunkAngle: 12 },
      { time: '1.6s', kneeAngle: 102, hipAngle: 110, trunkAngle: 18 },
      { time: '2.4s', kneeAngle: 86,  hipAngle: 94,  trunkAngle: 21 },
      { time: '3.2s', kneeAngle: 115, hipAngle: 125, trunkAngle: 16 },
      { time: '4.0s', kneeAngle: 172, hipAngle: 176, trunkAngle: 6 },
      { time: '4.8s', kneeAngle: 135, hipAngle: 140, trunkAngle: 13 },
      { time: '5.6s', kneeAngle: 85,  hipAngle: 92,  trunkAngle: 22 },
      { time: '6.4s', kneeAngle: 174, hipAngle: 177, trunkAngle: 5 }
    ]
  },
  annotated_video_url: null, // Left null to respect real API behavior unless backend provides
  annotated_frames: []
};
