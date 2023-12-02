import time
from flask import Flask, request, jsonify
from db import Database, DB_URL
from kanji import Predictor

db = Database(DB_URL)
app = Flask(__name__)
predictor = Predictor()

# @app.route('/save-card', methods=['POST'])
# def save_card():
#     data = request.get_json()
#     front = data['text']
#     db.add_card(front, "back not implemented", 0)

#     return 'Text saved', 200

# @app.route('/get-saved-card', methods=['GET'])
#     def get_saved_card():
#     return jsonify({'text': saved_text})

@app.route('/save-tuple', methods=['POST'])
def save_tuple():
    data = request.get_json()
    card_data = data['cardTuple']
    front = card_data[0]
    back = card_data[1]
    tag_id = data['tagId']
    db.add_card(front, back, tag_id)
    return 'Card saved', 200

@app.route('/edit-card', methods=['POST'])
def edit_card():
    data = request.get_json()
    card_data = data['cardTuple']
    front = card_data[0]
    back = card_data[1]
    card_id = data['id']
    tag_id = data['tagId']
    db.edit_card(front, back, card_id, tag_id)
    return 'Card saved', 200


@app.route('/retrieve-all-cards', methods=['GET'])
def retrieve_all_cards():
    cards = db.retrieve_cards()
    return jsonify(cards), 200

@app.route('/add-new-tag', methods=['POST'])
def add_new_tag():
    data = request.get_json()
    tag_name = data['tagName']  # Deserialize the tag name from the JSON data
    db.add_tag(tag_name)
    return 'Tag added', 200

@app.route('/retrieve-all-tags', methods=['GET'])
def retrieve_all_tags():
    tags = db.retrieve_tags()
    return jsonify(tags), 200

@app.route('/retrieve-cards-tag', methods=['GET'])
def retrieve_cards_tag():
    data = request.get_json()
    tag_name = data['tagName']
    cards = db.retrieve_cards_tag(tag_name)
    return jsonify(cards), 200

@app.route('/retrieve-kanji', methods=['POST'])
def retrieve_kanji():
    data = request.get_json()
    image = data['image']
    kanji = predictor.predict(image, 1)
    return jsonify(kanji), 200

# @app.route('/get-saved-text', methods=['GET'])
# def get_saved_text():
#     return jsonify({'text': saved_text})s

if __name__ == '__main__':
    app.run()