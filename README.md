# 🎵 Acoustic Fingerprint Music Recommender

<div align="center">

[![TÜBİTAK](https://img.shields.io/badge/TÜBİTAK-Granted_Research_Project-red?style=for-the-badge)](https://www.tubitak.gov.tr/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://tensorflow.org)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.x-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white)](https://scikit-learn.org)

**A TÜBİTAK-granted research project that identifies the acoustic "fingerprint" of a song and recommends musically similar tracks using deep learning.**

[Overview](#-overview) · [Architecture](#-system-architecture) · [Tech Stack](#-tech-stack) · [Setup](#-setup) · [API Reference](#-api-reference) · [Dataset](#-dataset)

</div>

---

## 📌 Overview

This project is a **TÜBİTAK-granted academic research system** that applies Convolutional Neural Network (CNN)-based acoustic fingerprinting to build a content-based music recommendation engine. The system converts raw audio into **Mel-spectrograms**, passes them through a trained CNN to extract **256-dimensional acoustic embedding vectors**, and uses **cosine similarity** to find the most acoustically similar tracks in a library.

Users can either:
- **Select a song** from the pre-indexed GTZAN library and receive instant recommendations
- **Upload their own audio file** (`.wav`, `.mp3`, etc.) and have it analyzed on-the-fly against the entire library

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE (Next.js)                    │
│   ┌─────────────────────────┐   ┌──────────────────────────────┐   │
│   │  Track Selector          │   │  Drag-and-Drop Audio Upload  │   │
│   │  (GTZAN Library)         │   │  (User's own audio file)      │   │
│   └────────────┬────────────┘   └───────────────┬──────────────┘   │
└────────────────┼─────────────────────────────────┼──────────────────┘
                 │  GET /api/v1/recommend/library   │  POST /api/v1/recommend/upload
                 ▼                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        FastAPI Backend (api.py)                     │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Audio Preprocessing                       │   │
│  │  1. Load audio @ 22,050 Hz sample rate                       │   │
│  │  2. Slice into 3-second segments (up to 10 segments)         │   │
│  │  3. Compute Mel-Spectrogram (n_mels=128, n_fft=2048,         │   │
│  │     hop_length=512)                                          │   │
│  │  4. Convert to dB scale (power_to_db)                        │   │
│  │  5. Apply Min-Max Normalization [0, 1]                       │   │
│  └──────────────────────────┬──────────────────────────────────┘   │
│                             │                                       │
│  ┌──────────────────────────▼──────────────────────────────────┐   │
│  │                   CNN Feature Extractor                      │   │
│  │  Input: (128, 130, 1) Mel-spectrogram image                  │   │
│  │  Conv2D(32) → MaxPool → Dropout(0.2)                         │   │
│  │  Conv2D(64) → MaxPool → Dropout(0.2)                         │   │
│  │  Conv2D(128) → MaxPool → Dropout(0.2)                        │   │
│  │  Flatten → Dense(256, relu) ← "feature_extractor_layer"     │   │
│  │  Output: 256-dimensional embedding vector                    │   │
│  └──────────────────────────┬──────────────────────────────────┘   │
│                             │                                       │
│  ┌──────────────────────────▼──────────────────────────────────┐   │
│  │              Cosine Similarity Matching                      │   │
│  │  sklearn.metrics.pairwise.cosine_similarity                  │   │
│  │  Query vector (256-d) vs. all library embeddings            │   │
│  │  Returns Top-5 most similar tracks with match scores        │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### Pipeline Summary

| Stage | Tool / Method | Output |
|---|---|---|
| Audio ingestion | `librosa.load` @ 22,050 Hz | Raw waveform |
| Segmentation | 3-second sliding windows | Up to 10 segments per track |
| Feature extraction | Mel-spectrogram (128 mel bands, 2048 FFT) | `(128, 130, 1)` image |
| Normalization | Min-Max Scaler (train-set derived) | Values ∈ [0, 1] |
| Embedding | CNN `feature_extractor_layer` | 256-d float vector |
| Aggregation | Mean of all segment embeddings | Single 256-d track vector |
| Similarity | Scikit-Learn Cosine Similarity | Similarity score ∈ [0, 1] |
| Recommendation | Top-5 ranked results | JSON response to frontend |

---

## 🧠 CNN Model Architecture

The CNN is trained as a **10-class music genre classifier** on the GTZAN dataset. The classification head is discarded at inference time; only the penultimate `feature_extractor_layer` (256 neurons) is used to produce the acoustic fingerprint.

```
Layer (type)                  Output Shape          Param #
─────────────────────────────────────────────────────────
conv2d (Conv2D)               (None, 126, 128, 32)    320
max_pooling2d                 (None, 63, 64, 32)         0
dropout                       (None, 63, 64, 32)         0
─────────────────────────────────────────────────────────
conv2d_1 (Conv2D)             (None, 61, 62, 64)     18,496
max_pooling2d_1               (None, 30, 31, 64)         0
dropout_1                     (None, 30, 31, 64)         0
─────────────────────────────────────────────────────────
conv2d_2 (Conv2D)             (None, 28, 29, 128)    73,856
max_pooling2d_2               (None, 14, 14, 128)        0
dropout_2                     (None, 14, 14, 128)        0
─────────────────────────────────────────────────────────
flatten                       (None, 25,088)              0
─────────────────────────────────────────────────────────
dense [feature_extractor]     (None, 256)          6,422,784
dropout_3                     (None, 256)                 0
─────────────────────────────────────────────────────────
dense_1 [classification]      (None, 10)               2,570
─────────────────────────────────────────────────────────
```

- **Optimizer:** Adam
- **Loss:** Categorical Cross-Entropy
- **Epochs:** 30
- **Batch Size:** 32
- **Train/Test Split:** 80/20 (song-level stratified to prevent data leakage)

---

## 💻 Tech Stack

### Backend
| Library | Role |
|---|---|
| **FastAPI** | Async REST API server |
| **TensorFlow / Keras** | CNN model loading and inference |
| **librosa** | Audio loading, Mel-spectrogram computation |
| **scikit-learn** | Cosine similarity calculation |
| **NumPy** | Numerical operations and array handling |
| **Uvicorn** | ASGI server |

### Frontend
| Library | Role |
|---|---|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type-safe frontend development |
| **Tailwind CSS v4** | Utility-first styling |
| **Radix UI** | Accessible, headless UI primitives |
| **Lucide React** | Icon library |
| **concurrently** | Runs frontend + backend dev servers together |

---

## ⚙️ Setup

### Prerequisites
- Python 3.10+
- Node.js 18+ and [pnpm](https://pnpm.io/)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/keremakkn/acoustic-fingerprint-recommender.git
cd acoustic-fingerprint-recommender
```

### 2. Install Python dependencies

```bash
pip install -r requirements.txt
```

### 3. Install Node.js dependencies

```bash
pnpm install
```

### 4. Prepare the dataset and model artifacts

> ⚠️ The trained model (`acoustic_cnn.keras`), pre-computed embeddings (`library_embeddings.pkl`), and the GTZAN audio dataset are **not included in this repository** due to file size constraints.

**Step A — Train the model:**

Open and run `main.ipynb` in Jupyter. This will:
- Load the GTZAN dataset from `Data/genres_original/`
- Process audio into Mel-spectrograms
- Train the CNN and save `acoustic_cnn.keras` + `scaler_config.json`

**Step B — Pre-compute library embeddings:**

```bash
python precompute_embeddings.py
```

This processes all GTZAN audio files through the trained CNN and saves `library_embeddings.pkl`.

### 5. Run the application

```bash
# Run both frontend (Next.js) and backend (FastAPI) concurrently
pnpm run dev:all
```

Or run them separately:

```bash
# Terminal 1 — FastAPI backend
py -m uvicorn api:app --reload --port 8000

# Terminal 2 — Next.js frontend
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Reference

The FastAPI backend auto-generates interactive documentation at [http://localhost:8000/docs](http://localhost:8000/docs).

### `GET /api/v1/recommend/library`

Find similar tracks for a song already in the GTZAN library.

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `song_id` | `string` | The song ID or filename (e.g., `blues.00001`) |

**Response:**

```json
{
  "queried_song": "Blues.00001",
  "queried_audio_url": "/audio/blues/blues.00001.wav",
  "recommendations": [
    {
      "id": "42",
      "title": "Blues.00042",
      "genre": "Blues",
      "match_score": 94.7,
      "audio_url": "/audio/blues/blues.00042.wav"
    }
  ]
}
```

---

### `POST /api/v1/recommend/upload`

Upload an arbitrary audio file and find similar tracks in the library.

**Request:** `multipart/form-data` with a `file` field containing the audio.

**Supported formats:** `.wav`, `.mp3`, `.flac`, `.ogg`

**Response:**

```json
{
  "uploaded_filename": "my_song.wav",
  "message": "Dosya başarıyla analiz edildi.",
  "recommendations": [
    {
      "id": "17",
      "title": "Jazz.00017",
      "genre": "Jazz",
      "match_score": 87.3,
      "audio_url": "/audio/jazz/jazz.00017.wav"
    }
  ]
}
```

---

## 📂 Project Structure

```
acoustic-fingerprint-recommender/
│
├── api.py                    # FastAPI backend — inference & recommendation endpoints
├── precompute_embeddings.py  # Script to batch-embed the entire GTZAN library
├── extracted.py              # Utility extraction helpers
├── check_embeddings.py       # Sanity-check script for the .pkl embedding file
├── scaler_config.json        # Min-Max scaler bounds (saved from training)
├── requirements.txt          # Python dependencies
│
├── main.ipynb                # 📓 Model training notebook (Jupyter)
│
├── app/                      # Next.js App Router pages
│   ├── page.tsx              # Main Discover page (track selector + upload)
│   ├── layout.tsx            # Root layout with theme provider
│   ├── globals.css           # Global styles
│   └── analysis/            # Analysis sub-page
│
├── components/               # Reusable React components
│   ├── sidebar.tsx
│   ├── track-selector.tsx
│   ├── audio-player-card.tsx
│   ├── recommendations-list.tsx
│   └── upload-dropzone.tsx
│
├── hooks/                    # Custom React hooks
├── lib/                      # Utility functions
├── public/                   # Static assets
├── styles/                   # Additional CSS
│
├── package.json              # Node.js dependencies & scripts
├── next.config.mjs           # Next.js configuration
├── tsconfig.json             # TypeScript configuration
└── .gitignore
```

---

## 📊 Dataset

This system is trained and evaluated on the **GTZAN Music Genre Dataset**, a widely-used benchmark in Music Information Retrieval (MIR) research.

| Property | Value |
|---|---|
| Total tracks | 1,000 audio clips |
| Genres | 10 (Blues, Classical, Country, Disco, Hip-Hop, Jazz, Metal, Pop, Reggae, Rock) |
| Tracks per genre | 100 |
| Duration per clip | 30 seconds |
| Sample rate | 22,050 Hz |

The dataset can be downloaded from [Marsyas / Kaggle](https://www.kaggle.com/datasets/andradaolteanu/gtzan-dataset-music-genre-classification).
Place audio files under `Data/genres_original/<genre>/` (e.g., `Data/genres_original/blues/blues.00000.wav`).

---

## 🔬 Research Context

This project was developed as part of a **TÜBİTAK (The Scientific and Technological Research Council of Turkey)** research grant. The research investigates content-based music retrieval using deep acoustic fingerprinting — a technique that captures the raw timbral and spectral identity of a track as a compact numerical vector, enabling similarity search without relying on metadata, lyrics, or user listening history.

---

## 📄 License

This project is intended for academic and research use only. All rights reserved.

---

<div align="center">
Made with ❤️ — Supported by <a href="https://www.tubitak.gov.tr/">TÜBİTAK</a>
</div>
