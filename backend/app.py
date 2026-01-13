
from flask import Flask, request, jsonify
from flask_cors import CORS
import ir_methods

app = Flask(__name__)
CORS(app)  # Allow all CORS by default for dev

@app.route('/api/simulate', methods=['POST'])
def simulate():
    data = request.json
    if not data:
        return jsonify({'error': 'No input data provided'}), 400
    
    method_id = data.get('methodId')
    query = data.get('query', '')
    raw_documents = data.get('documents', '')
    
    # --- Parse Documents ---
    # Supports "--- Document: Name ---" format or distinct lines/blocks
    documents = []
    
    # Check for headers
    if '--- Document:' in raw_documents:
        parts = raw_documents.split('--- Document:')
        for part in parts:
            if not part.strip(): continue
            if '---' not in part: continue
            
            header_end = part.find('---')
            name = part[:header_end].strip()
            content = part[header_end+3:].strip()
            
            if content:
                documents.append({'name': name, 'content': content})
    else:
        # Fallback: Double newline split
        parts = raw_documents.split('\n\n')
        for i, part in enumerate(parts):
            if part.strip():
                documents.append({'name': f'Dokumen {i+1}', 'content': part.strip()})
    
    if not documents:
        return jsonify({'error': 'Harap berikan setidaknya satu dokumen.'}), 400

    # --- Router ---
    try:
        result = {}
        if method_id == 'regex':
            result = ir_methods.regex_search(query, documents)
        elif method_id == 'vsm':
            result = ir_methods.vsm_search(query, documents)
        elif method_id == 'bm25':
            result = ir_methods.bm25_search(query, documents)
        elif method_id == 'boolean':
            result = ir_methods.boolean_search(query, documents)
        elif method_id == 'clustering':
            result = ir_methods.clustering(query, documents) # query is k for clustering
        elif method_id == 'relevance':
             # Initial VSM search for relevance feedback
            vsm_res = ir_methods.vsm_search(query, documents)
            result = {
                **vsm_res,
                'message': "Ini adalah peringkat awal (Backend Python). Di aplikasi nyata, Anda akan memilih dokumen yang relevan.",
            }
        else:
            return jsonify({'error': f'Metode tidak dikenal: {method_id}'}), 400
            
        return jsonify(result)

    except Exception as e:
        return jsonify({'error': f'Internal Server Error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
