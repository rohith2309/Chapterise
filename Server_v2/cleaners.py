import nltk
from sentence_transformers import util
import re


def clean_text(text):
    pattern=r'\b(uh|um|like|you know|uhm)\b'
    cleaned_text = re.sub(r'','',text,re.IGNORECASE)
    cleaned_text = re.sub(r'\s+', ' ', cleaned_text).strip()
    return cleaned_text

def chunk_text(text,max_length=512):
    
    sentences= nltk.sent_tokenize(text)
    chunk=[]
    current_chunk = []
    word_count = 0
    
    for sentence in sentences:
        word=len(sentence.split())
        if word_count + word <= max_length:
            current_chunk.append(sentence)
            word_count += word
        else:
            if current_chunk:
                chunk.append(' '.join(current_chunk))
            current_chunk = [sentence]
            word_count = word
    return chunk if chunk else [' '.join(current_chunk)]

def retrive_context(query,chunks,model,top_k=4):
    question_embedding = model.encode(query, convert_to_tensor=True)
    chunk_embeddings = model.encode(chunks, convert_to_tensor=True)
    similarities = util.cos_sim(question_embedding, chunk_embeddings)[0]
    top_indices = similarities.argsort(descending=True)[:top_k]
    return [chunks[i] for i in top_indices]
            
    
