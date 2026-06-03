import os
import json
import pickle
import numpy as np
import librosa
from tensorflow.keras.models import load_model, Model
from tqdm import tqdm

DATASET_PATH = "Data/genres_original"
SAMPLES_PER_SEGMENT = 22050 * 3
NUM_SEGMENTS = 10

def main():
    print("Loading model and artifacts...")
    try:
        model = load_model('acoustic_cnn.keras')
    except Exception as e:
        print(f"Error loading model: {e}")
        print("Please ensure you run main.ipynb to generate acoustic_cnn.keras first.")
        return

    # Extract feature extractor layer
    feature_extractor = Model(inputs=model.inputs, 
                              outputs=model.get_layer('feature_extractor_layer').output)

    try:
        with open('scaler_config.json', 'r') as f:
            scaler_config = json.load(f)
            min_val = scaler_config['min_val']
            max_val = scaler_config['max_val']
    except Exception as e:
        print(f"Error loading scaler config: {e}")
        print("Please ensure you run main.ipynb to generate scaler_config.json first.")
        return

    # Find all wav files
    genres = ['blues', 'classical', 'country', 'disco', 'hiphop', 'jazz', 'metal', 'pop', 'reggae', 'rock']
    file_paths = []
    labels = []
    for genre in genres:
        genre_dir = os.path.join(DATASET_PATH, genre)
        if os.path.exists(genre_dir):
            for filename in os.listdir(genre_dir):
                if filename.endswith('.wav'):
                    file_paths.append(os.path.join(genre_dir, filename))
                    labels.append(genre)

    print(f"Found {len(file_paths)} audio files. Generating embeddings...")

    library_data = []

    for i, dosya_yolu in enumerate(tqdm(file_paths, desc="Processing Audio Files")):
        try:
            y, sr = librosa.load(dosya_yolu, sr=22050)
            
            X_veri = []
            for s in range(NUM_SEGMENTS):
                baslangic = SAMPLES_PER_SEGMENT * s
                bitis = baslangic + SAMPLES_PER_SEGMENT
                y_dilim = y[baslangic:bitis]
                
                if len(y_dilim) == SAMPLES_PER_SEGMENT:
                    mel_spect = librosa.feature.melspectrogram(y=y_dilim, sr=sr, n_fft=2048, hop_length=512, n_mels=128)
                    mel_spect_db = librosa.power_to_db(mel_spect, ref=np.max)
                    X_veri.append(mel_spect_db[..., np.newaxis])
            
            if not X_veri:
                continue
                
            X_veri = np.array(X_veri)
            # Normalize
            X_veri_norm = (X_veri - min_val) / (max_val - min_val)
            
            # Predict
            embeddings = feature_extractor.predict(X_veri_norm, verbose=0)
            
            # Average the embeddings for the track
            avg_embedding = np.mean(embeddings, axis=0)
            
            song_id = str(i + 1)
            filename = os.path.basename(dosya_yolu)
            
            library_data.append({
                'song_id': song_id,
                'filename': filename,
                'title': filename.replace('.wav', '').replace('_', ' ').title(),
                'genre': labels[i],
                'embedding': avg_embedding
            })
            
        except Exception as e:
            print(f"Error processing {dosya_yolu}: {e}")

    # Save library embeddings
    output_file = 'library_embeddings.pkl'
    with open(output_file, 'wb') as f:
        pickle.dump(library_data, f)
        
    print(f"Successfully saved {len(library_data)} track embeddings to {output_file}.")

if __name__ == "__main__":
    main()
