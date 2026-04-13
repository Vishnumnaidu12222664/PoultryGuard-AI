import tensorflow as tf
from tensorflow.keras import layers, models
import pickle
import numpy as np
import os

MODELS_DIR = os.path.join(os.path.dirname(__file__), "../ml_models")
os.makedirs(MODELS_DIR, exist_ok=True)

def create_mock_efficientnet():
    print("Creating mock EfficientNetB3 model...")
    model = models.Sequential([
        layers.Input(shape=(224, 224, 3)),
        layers.Conv2D(32, 3, activation='relu'),
        layers.GlobalAveragePooling2D(),
        layers.Dense(5, activation='softmax') # 5 classes
    ])
    model.compile(optimizer='adam', loss='categorical_crossentropy')
    model.save(os.path.join(MODELS_DIR, "efficientnet_poultry.h5"))
    print("Saved: efficientnet_poultry.h5")

def create_mock_economic_model():
    from sklearn.linear_model import LinearRegression
    print("Creating mock Economic model...")
    X = np.random.rand(100, 3)
    y = np.random.rand(100)
    model = LinearRegression()
    model.fit(X, y)
    with open(os.path.join(MODELS_DIR, "economic_model.pkl"), "wb") as f:
        pickle.dump(model, f)
    print("Saved: economic_model.pkl")


if __name__ == "__main__":
    create_mock_efficientnet()
    create_mock_economic_model()
