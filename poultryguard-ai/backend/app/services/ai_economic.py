from sklearn.linear_model import LinearRegression
import numpy as np

class EconomicPredictor:
    def __init__(self):
        # Mock training data: [days_detected, flock_size, treatment_status (0/1)]
        # Target: mortality_rate
        X = np.array([
            [1, 1000, 1], [3, 1000, 1], [5, 1000, 1],
            [1, 1000, 0], [3, 1000, 0], [5, 1000, 0],
            [1, 5000, 1], [3, 5000, 1], [5, 5000, 1]
        ])
        y = np.array([0.01, 0.03, 0.05, 0.05, 0.15, 0.30, 0.01, 0.04, 0.06])
        
        self.model = LinearRegression()
        self.model.fit(X, y)

    def predict_loss(self, days, flock_size, treatment, revenue_per_bird):
        treatment_val = 1 if treatment else 0
        input_data = np.array([[days, flock_size, treatment_val]])
        
        pred_mortality_rate = self.model.predict(input_data)[0]
        # Clip to realistic bounds
        pred_mortality_rate = max(0, min(1, pred_mortality_rate))
        
        projected_deaths = int(flock_size * pred_mortality_rate)
        revenue_loss = projected_deaths * revenue_per_bird
        percent_loss = pred_mortality_rate * 100
        
        return projected_deaths, percent_loss, revenue_loss

economic_predictor = EconomicPredictor()
