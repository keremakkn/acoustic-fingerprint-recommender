from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import json
import pickle
import numpy as np
import librosa
from sklearn.metrics.pairwise import cosine_similarity
from contextlib import asynccontextmanager
import io
import os

# Global variables to hold loaded artifacts
model = None
feature_extractor = None
min_val = 0.0
max_val = 1.0
library_embeddings = []

SAMPLES_PER_SEGMENT = 22050 * 3
NUM_SEGMENTS = 10

@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, feature_extractor, min_val, max_val, library_embeddings
    print("Loading Acoustic AI artifacts...")
    
    try:
        from tensorflow.keras.models import load_model, Model
        # Load Model
        model = load_model('acoustic_cnn.keras')
        feature_extractor = Model(inputs=model.inputs, 
                                  outputs=model.get_layer('feature_extractor_layer').output)
        
        # Load Scalars
        with open('scaler_config.json', 'r') as f:
            scaler_config = json.load(f)
            min_val = scaler_config['min_val']
            max_val = scaler_config['max_val']
            
        # Load Embeddings
        with open('library_embeddings.pkl', 'rb') as f:
            library_embeddings = pickle.load(f)
            
        print(f"Loaded {len(library_embeddings)} embeddings from library_embeddings.pkl")
    except Exception as e:
        print(f"Warning: Failed to load artifacts during startup. Did you run main.ipynb and precompute_embeddings.py? Error: {e}")
        
    yield
    print("Shutting down Acoustic AI Engine.")

app = FastAPI(
    title="Acoustic AI Engine",
    description="Akustik parmak izi tabanlı müzik öneri sistemi API'si",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve GTZAN .wav files statically at /audio/<genre>/<filename>
app.mount("/audio", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "Data", "genres_original")), name="audio")

def get_audio_url(filename: str) -> str:
    """Derive the static audio URL from a filename like 'blues.00000.wav'"""
    # filename format: genre.NNNNN.wav  (e.g. blues.00000.wav, hiphop.00000.wav)
    genre = filename.split(".")[0]  # 'blues', 'hiphop', etc.
    return f"/audio/{genre}/{filename}"

def preprocess_audio(y, sr):
    """Slices audio, converts to mel-spectrogram, scales and normalizes."""
    X_veri = []
    
    # We will try to get up to NUM_SEGMENTS
    for s in range(NUM_SEGMENTS):
        baslangic = SAMPLES_PER_SEGMENT * s
        bitis = baslangic + SAMPLES_PER_SEGMENT
        y_dilim = y[baslangic:bitis]
        
        if len(y_dilim) == SAMPLES_PER_SEGMENT:
            mel_spect = librosa.feature.melspectrogram(y=y_dilim, sr=sr, n_fft=2048, hop_length=512, n_mels=128)
            mel_spect_db = librosa.power_to_db(mel_spect, ref=np.max)
            X_veri.append(mel_spect_db[..., np.newaxis])
            
    if not X_veri:
        return None
        
    X_veri = np.array(X_veri)
    X_veri_norm = (X_veri - min_val) / (max_val - min_val)
    return X_veri_norm

@app.get("/")
def read_root():
    return {"mesaj": "Acoustic AI API tıkır tıkır çalışıyor kankam!"}

@app.get("/api/v1/recommend/library")
def recommend_from_library(song_id: str):
    if not library_embeddings:
        raise HTTPException(status_code=503, detail="Embeddings not loaded.")
        
    # Find the requested song (frontend might send 'blues.00001' instead of '1')
    query_song = next((song for song in library_embeddings if song['song_id'] == song_id or song['filename'].replace('.wav', '') == song_id), None)
    if not query_song:
        raise HTTPException(status_code=404, detail="Song not found in library.")
        
    query_vector = query_song['embedding'].reshape(1, -1)
    
    # Extract all other embeddings
    all_vectors = np.array([song['embedding'] for song in library_embeddings])
    
    # Compute cosine similarity
    similarities = cosine_similarity(query_vector, all_vectors)[0]
    
    # Get top 6 indices (including the queried song itself)
    top_indices = np.argsort(similarities)[::-1][:6]
    
    recommendations = []
    for idx in top_indices:
        match_song = library_embeddings[idx]
        if match_song['song_id'] == query_song['song_id']:
            continue # Skip the queried song itself
            
        recommendations.append({
            "id": match_song['song_id'],
            "title": match_song['title'],
            "genre": match_song['genre'].capitalize(),
            "match_score": round(float(similarities[idx]) * 100, 1),
            "audio_url": get_audio_url(match_song['filename'])
        })
        
        if len(recommendations) == 5:
            break

    return {
        "queried_song": query_song['title'],
        "queried_audio_url": get_audio_url(query_song['filename']),
        "recommendations": recommendations
    }

@app.post("/api/v1/recommend/upload")
async def recommend_from_upload(file: UploadFile = File(...)):
    if not library_embeddings or feature_extractor is None:
        raise HTTPException(status_code=503, detail="Model or embeddings not loaded.")
        
    # Read the file contents
    content = await file.read()
    
    # Process audio with librosa
    try:
        y, sr = librosa.load(io.BytesIO(content), sr=22050)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading audio file: {e}")
        
    X_veri_norm = preprocess_audio(y, sr)
    if X_veri_norm is None:
        raise HTTPException(status_code=400, detail="Audio file is too short (needs at least 3 seconds).")
        
    # Extract embedding
    embeddings = feature_extractor.predict(X_veri_norm, verbose=0)
    avg_embedding = np.mean(embeddings, axis=0)
    query_vector = avg_embedding.reshape(1, -1)
    
    # Extract all library embeddings
    all_vectors = np.array([song['embedding'] for song in library_embeddings])
    
    # Compute cosine similarity
    similarities = cosine_similarity(query_vector, all_vectors)[0]
    
    # Get top 5 indices
    top_indices = np.argsort(similarities)[::-1][:5]
    
    recommendations = []
    for idx in top_indices:
        match_song = library_embeddings[idx]
        recommendations.append({
            "id": match_song['song_id'],
            "title": match_song['title'],
            "genre": match_song['genre'].capitalize(),
            "match_score": round(float(similarities[idx]) * 100, 1),
            "audio_url": get_audio_url(match_song['filename'])
        })

    return {
        "uploaded_filename": file.filename,
        "message": "Dosya başarıyla analiz edildi.",
        "recommendations": recommendations
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)