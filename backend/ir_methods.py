import re
import math
import numpy as np
from functools import lru_cache
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import KMeans
from rank_bm25 import BM25Okapi

# --- Initialization ---
factory = StemmerFactory()
stemmer = factory.create_stemmer()

# Validation: Stemmer caching
# Sastrawi is slow. We use LRU Cache to memorize stems of common words.
@lru_cache(maxsize=10000)
def cached_stem(word):
    return stemmer.stem(word)

STOPWORDS = set([
    # Indonesian
    'dan', 'atau', 'tetapi', 'tapi', 'namun', 'sedangkan', 'melainkan', 'padahal', 'jika', 'bila',
    'kalau', 'supaya', 'agar', 'untuk', 'guna', 'bagi', 'demi', 'karena', 'sebab', 'maka',
    'sehingga', 'sampai', 'hingga', 'yang', 'ini', 'itu', 'pada', 'di', 'ke', 'dari',
    'oleh', 'dengan', 'secara', 'menurut', 'antara', 'adalah', 'ialah', 'merupakan', 'yaitu',
    'yakni', 'seperti', 'bagai', 'bagaikan', 'laksana', 'bak', 'tentang', 'mengenai', 'terhadap',
    'akan', 'sedang', 'telah', 'sudah', 'belum', 'bisa', 'dapat', 'harus', 'wajib', 'mesti',
    'boleh', 'mungkin', 'barangkali', 'pasti', 'tentu', 'tidak', 'bukan', 'jangan', 'sekali',
    'sangat', 'amat', 'paling', 'lebih', 'kurang', 'cukup', 'terlalu', 'hanya', 'cuma', 'saja',
    'lagi', 'pun', 'juga', 'kan', 'lah', 'kah', 'tah', 'ada', 'tiada', 'saya', 'aku',
    'kita', 'kami', 'anda', 'kamu', 'dia', 'mereka', 'apa', 'siapa', 'kapan', 'dimana',
    'mengapa', 'bagaimana', 'berapa',
    # English
    'and', 'or', 'but', 'if', 'then', 'else', 'when', 'at', 'from', 'by', 'for', 'with',
    'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above',
    'below', 'to', 'of', 'in', 'on', 'off', 'over', 'under', 'again', 'further', 'then',
    'once', 'here', 'there', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few',
    'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
    'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now', 'is', 'are', 'was',
    'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'a', 'an', 'the'
])

def preprocess(text):
    """Tokenize, remove stopwords, and stem using cached stemmer."""
    text = text.lower()
    tokens = re.findall(r'\b\w+\b', text)
    tokens = [t for t in tokens if t not in STOPWORDS and len(t) > 1]
    # Use cached_stem instead of raw stemmer.stem
    return [cached_stem(t) for t in tokens]

# --- Methods ---

def regex_search(query, documents):
    """
    Search using Regular Expressions.
    documents: list of dict {'content': str, 'name': str}
    """
    results = []
    try:
        pattern = re.compile(query, re.IGNORECASE)
        for i, doc in enumerate(documents):
            matches = []
            for m in pattern.finditer(doc['content']):
                matches.append((m.start(), m.end()))
            
            if matches:
                results.append({
                    'docId': i + 1,
                    'name': doc['name'],
                    'content': doc['content'],
                    'highlights': matches
                })
        
        if not results:
            return {'message': 'Tidak ada kecocokan yang ditemukan untuk ekspresi reguler yang diberikan.'}
        
        return {'matches': results}
    except Exception as e:
        return {'error': f'Ekspresi Reguler Tidak Valid: {str(e)}'}

def vsm_search(query, documents):
    """Vector Space Model using TF-IDF and Cosine Similarity."""
    corpus = [doc['content'] for doc in documents]
    
    # Custom tokenizer to use our preprocessing
    vectorizer = TfidfVectorizer(tokenizer=preprocess, token_pattern=None)
    
    try:
        tfidf_matrix = vectorizer.fit_transform(corpus)
        query_vec = vectorizer.transform([query])
        
        cosine_sim = cosine_similarity(query_vec, tfidf_matrix).flatten()
        
        ranked_docs = []
        for i, score in enumerate(cosine_sim):
            if score > 0:
                ranked_docs.append({
                    'docId': i + 1,
                    'name': documents[i]['name'],
                    'content': documents[i]['content'],
                    'score': float(score)
                })
        
        ranked_docs.sort(key=lambda x: x['score'], reverse=True)
        return {'rankedDocuments': ranked_docs}
    except ValueError:
        # Usually happens if vocab is empty after preprocessing
        return {'rankedDocuments': []}

def bm25_search(query, documents, k1=1.5, b=0.75):
    """BM25 Ranking."""
    corpus = [doc['content'] for doc in documents]
    tokenized_corpus = [preprocess(doc) for doc in corpus]
    bm25 = BM25Okapi(tokenized_corpus, k1=k1, b=b)
    
    tokenized_query = preprocess(query)
    scores = bm25.get_scores(tokenized_query)
    
    ranked_docs = []
    for i, score in enumerate(scores):
        if score > 0:
            ranked_docs.append({
                'docId': i + 1,
                'name': documents[i]['name'],
                'content': documents[i]['content'],
                'score': float(score)
            })
            
    ranked_docs.sort(key=lambda x: x['score'], reverse=True)
    return {'rankedDocuments': ranked_docs}

def clustering(num_clusters_str, documents):
    """K-Means Clustering."""
    try:
        k = int(num_clusters_str)
        if k <= 0:
            return {'error': 'Jumlah cluster harus berupa bilangan bulat positif.'}
        if len(documents) < k:
            return {'error': 'Jumlah dokumen harus lebih besar atau sama dengan jumlah cluster.'}
            
        corpus = [doc['content'] for doc in documents]
        vectorizer = TfidfVectorizer(tokenizer=preprocess, token_pattern=None)
        tfidf_matrix = vectorizer.fit_transform(corpus)
        
        kmeans = KMeans(n_clusters=k, init='k-means++', n_init=10)
        kmeans.fit(tfidf_matrix)
        
        labels = kmeans.labels_
        inertia = kmeans.inertia_
        
        clusters = {}
        for i, label in enumerate(labels):
            label_str = str(label)
            if label_str not in clusters:
                clusters[label_str] = []
            
            clusters[label_str].append({
                'docId': i + 1,
                'name': documents[i]['name'],
                'content': documents[i]['content']
            })
            
        return {'clusters': clusters, 'numClusters': k, 'inertia': float(inertia)}
        
    except ValueError as e:
        return {'error': f'Error dalam clustering: {str(e)}'}

def boolean_search(query, documents):
    """
    Boolean Search (AND, OR, NOT).
    Uses a recursive descent parser logic similar to the TS version but in Python.
    """
    corpus_tokens = [set(preprocess(doc['content'])) for doc in documents]
    all_indices = set(range(len(documents)))
    
    query = query.strip().replace('(', ' ( ').replace(')', ' ) ')
    tokens = query.split()
    
    # Recursive parser
    def parse_expression(index):
        left, index = parse_term(index)
        
        while index < len(tokens):
            token = tokens[index]
            if token == 'AND':
                right, index = parse_term(index + 1)
                left = left.intersection(right)
            elif token == 'OR':
                right, index = parse_term(index + 1)
                left = left.union(right)
            elif token == 'NOT':
                 # Implicit AND NOT
                right, index = parse_term(index + 1)
                left = left.difference(right)
            elif token == ')':
                break
            else:
                 # Implicit OR (or Error, but let's assume loose parsing like OR)
                 # Adjusting to match simple recursive logic: if no operator, treat as new term? 
                 # Standard boolean usually requires operators. Let's assume standard logic provided in TS.
                 # The TS logic handles "A NOT B" as "A AND NOT B".
                 break
        return left, index

    def parse_term(index):
        if index >= len(tokens):
            return set(), index
            
        token = tokens[index]
        
        if token == 'NOT':
            operand, idx = parse_term(index + 1)
            return all_indices.difference(operand), idx
        
        if token == '(':
            expr, idx = parse_expression(index + 1)
            if idx < len(tokens) and tokens[idx] == ')':
                return expr, idx + 1
            else:
                # Missing closing parenthesis, return what we have
                return expr, idx
        
        # Leaf term
        term = stemmer.stem(token.lower())
        matches = set()
        for i, doc_tokens in enumerate(corpus_tokens):
            if term in doc_tokens:
                matches.add(i)
        return matches, index + 1

    try:
        result_indices, _ = parse_expression(0)
        matched_docs = []
        for i in sorted(list(result_indices)):
            matched_docs.append({
                'docId': i + 1,
                'name': documents[i]['name'],
                'content': documents[i]['content']
            })
        return {'matchedDocuments': matched_docs}
    except Exception as e:
        return {'error': f'Gagal memproses kueri boolean: {str(e)}'}

