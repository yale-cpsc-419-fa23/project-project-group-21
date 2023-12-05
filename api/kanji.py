# handles all kanji related tasks.
# partially taken from https://github.com/CaptainDario/DaKanji-Desktop

import os, sys, ast
import base64

from io import BytesIO
from PIL import Image, ImageOps
import numpy as np
import tflite_runtime.interpreter as tflite

hiragana_list = ['あ', 'い', 'う', 'え', 'お',
                'か', 'き', 'く', 'け', 'こ',
                'さ', 'し', 'す', 'せ', 'そ',
                'た', 'ち', 'つ', 'て', 'と',
                'な', 'に', 'ぬ', 'ね', 'の',
                'は', 'ひ', 'ふ', 'へ', 'ほ',
                'ま', 'み', 'む', 'め', 'も',
                'や', 'ゆ', 'よ',
                'ら', 'り', 'る', 'れ', 'ろ',
                'わ', 'を', 'ん']

# Extended hiragana characters for voiced consonants
hiragana_list.extend(['が', 'ぎ', 'ぐ', 'げ', 'ご',
                     'ざ', 'じ', 'ず', 'ぜ', 'ぞ',
                     'だ', 'ぢ', 'づ', 'で', 'ど',
                     'ば', 'び', 'ぶ', 'べ', 'ぼ',
                     'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'])

# checks if a word has kanji in it. only works for japanese input.
def kanji_check(word):
    for letter in word:
        if letter not in hiragana_list:
            return True
    return False

def get_furigana(kanji, furigana):
    # should return ?う and [会、あ]
    kanji_pairs = []
    replaced_kanji = ""

    offset = 0
    for moji in kanji:
        if moji not in hiragana_list:
            # kanji found, so add ? to replaced_kanji
            replaced_kanji += "?"

            # get the rest of word.
            # print("Looking at kanji/furigana pair" + kanji + ", " + furigana)
            rest = kanji[1:]
            # print("The rest of the kanji string is: " + rest)

            # # get up until the part that lines up with the next furigana
            # if kanji_check(rest):
            #     # found more kanji.
            #     if rest[0] not in hiragana_list:
            #         # compound kanji
            #         pass
            #     else:
            #         # furigana in between.

            # print(furigana[:-len(rest)]) # get the part from the beginning to the start of furigana
            definition = furigana[:-len(rest)]

            pair = [moji, definition]
            kanji_pairs.append(pair)

            kanji = kanji[1:]
            furigana = furigana[len(definition):]
            # print ("cut furigana to " + furigana)
            offset += 1
        else:
            # start truncating from the front. truncation ratio is 1:1 b/c moji == kana.
            replaced_kanji += kanji[0]
            kanji = kanji[1:]
            furigana = furigana[1:]
            offset += 1

    return [replaced_kanji, kanji_pairs]

def convert_image_to_array(image):
    # print(image.split(',')[1])

    # note: at this point, image data is transparent background + black strokes
    # we need white strikes and black background for NN model
    image_data = base64.b64decode(image.split(',')[1])

    # converting to numpy array
    image = Image.open(BytesIO(image_data)).convert('RGBA')
    white_background = Image.new('RGBA', image.size, (255, 255, 255, 255))
    composite_image = Image.alpha_composite(white_background, image).convert('L')

    resized_image = composite_image.resize((64, 64))

    image_array = np.array(resized_image, dtype=np.float32) / 255.0  # Normalize to [0, 1]
    image_array = 1 - image_array

    reshaped_array = image_array.reshape(1, 64, 64, 1)

    return reshaped_array


# function to convert paths for pyinstaller onefile-mode
def resource_path(relative_path):
    """ Get absolute path to resource."""
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")

    return os.path.join(base_path, relative_path)

class Predictor():
    """ Can predict hand drawn Kanji characters from images using tf_lite.

    Attributes:
        kanji_interpreter  (Interpreter) : The tf_lite interpreter which is used to predict characters
        input_details             (dict) : The input details of 'kanji_interpreter'.
        output_details            (dict) : The output details of 'kanji_interpreter'.
        labels          (LabelBinarizer) : A list of all labels the CNN can recognize (ordered).
    """

    def __init__(self) -> None:
        self.kanji_interpreter = None
        self.input_details     = None
        self.output_details    = None
        self.labels   = None

        self.init_labels()
        self.init_tf_lite_model()

    def init_labels(self):
        """ Load the list of labels which the CNN can recognize
        """

        with open(resource_path(os.path.join("data", "kanji")), "r", encoding="utf8") as f:
            self.labels = ast.literal_eval(f.read())

    def init_tf_lite_model(self):
        """ Load the tf_lite model from the 'data'-folder.
        """

        # load model
        path_to_model = resource_path(os.path.join("data", "model.tflite"))
        self.kanji_interpreter = tflite.Interpreter(model_path=path_to_model)
        self.kanji_interpreter.allocate_tensors()

        # get in-/output details
        self.input_details = self.kanji_interpreter.get_input_details()
        self.output_details = self.kanji_interpreter.get_output_details()


    def predict(self, image, cnt_predictions : int) -> [str]:
        """ Predict a character from an input image.

        Args:
            image      (np.array) : A numpy array with shape (1, 64, 64, 1) and dtype 'float32'
            cnt_predictions (int) : How many predictions should be returned ('cnt_predictions' most likely ones)

        Returns:
            A list with the 'cnt_predictions' most confident predictions.
        """

        # make prediction

        # for testing
        # self.kanji_interpreter.set_tensor(self.input_details[0]["index"], image)

        image_array = convert_image_to_array(image)
        assert(image_array.shape == (1, 64, 64, 1))

        self.kanji_interpreter.set_tensor(self.input_details[0]["index"], image_array)

        self.kanji_interpreter.invoke()
        output_data = self.kanji_interpreter.get_tensor(self.output_details[0]["index"])
        out_np = np.array(output_data)

        # get the 'cnt_predictions' most confident predictions
        preds = []
        for i in range(cnt_predictions):
            pred = self.labels[out_np.argmax()]
            preds.append(pred[0])

            # 'remove' this prediction from all
            out_np[out_np.max() == out_np] = 0.0

        return preds


# testing!
# predictor = Predictor()
# my_image_path = "./fire.png"
# image = Image.open(my_image_path).convert('L')
# resized_image = image.resize((64, 64))
# image_array = 1 - (np.array(resized_image, dtype=np.float32) / 255.0)  # Normalize to [0, 1]
# reshaped_array = image_array.reshape(1, 64, 64, 1)

# prediction = predictor.predict(reshaped_array, 3)
# print(prediction)