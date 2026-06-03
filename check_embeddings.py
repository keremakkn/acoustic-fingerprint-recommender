import pickle
with open('library_embeddings.pkl', 'rb') as f:
    data = pickle.load(f)
print(f'Total embeddings: {len(data)}')
print('First 15 entries:')
for d in data[:15]:
    print(f"  song_id={d['song_id']!r}  filename={d['filename']!r}  title={d['title']!r}")
