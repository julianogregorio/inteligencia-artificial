from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)

# Carregar o modelo treinado
with open("ml/model.pkl", "rb") as f:
    model = pickle.load(f)

N_FEATURES = 16  # número de votos esperados


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": "naive_bayes", "features": N_FEATURES})


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True)

    if not data or "votes" not in data:
        return jsonify({"error": "JSON inválido. Envie {'votes': [0/1,...]}"}), 400

    votes = data["votes"]

    if not isinstance(votes, list) or len(votes) != N_FEATURES:
        return jsonify({"error": f"Lista 'votes' deve ter {N_FEATURES} posições."}), 400

    if any(v not in [0, 1] for v in votes):
        return jsonify({"error": "Os votos devem ser apenas 0 ou 1."}), 400

    X = np.array(votes, dtype=float).reshape(1, -1)
    pred = model.predict(X)[0]

    party_map = {0: "democrat", 1: "republican"}
    return jsonify({
        "prediction": int(pred),
        "party": party_map.get(int(pred), "unknown")
    })


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
