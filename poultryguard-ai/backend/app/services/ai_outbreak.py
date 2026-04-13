import numpy as np
from scipy.integrate import odeint

class OutbreakPredictor:
    def sir_model(self, y, t, N, beta, gamma):
        S, I, R = y
        dSdt = -beta * S * I / N
        dIdt = beta * S * I / N - gamma * I
        dRdt = gamma * I
        return dSdt, dIdt, dRdt

    def predict(self, N, I0, days=30, beta=0.3, gamma=0.1):
        # N: Total population
        # I0: Initial infected
        # R0: Initial recovered (usually 0)
        # beta: contact rate, gamma: recovery rate
        R0 = 0
        S0 = N - I0 - R0
        
        t = np.linspace(0, days, days)
        y0 = S0, I0, R0
        
        # Integrate the SIR equations over the time grid, t.
        ret = odeint(self.sir_model, y0, t, args=(N, beta, gamma))
        S, I, R = ret.T
        
        daily_data = []
        for i in range(len(t)):
            daily_data.append({
                "day": int(i),
                "susceptible": float(S[i]),
                "infected": float(I[i]),
                "recovered": float(R[i])
            })
            
        peak_day = int(np.argmax(I))
        total_affected = int(N - float(S[-1]))
        r0_val = beta / gamma
        
        return daily_data, peak_day, total_affected, r0_val

outbreak_predictor = OutbreakPredictor()
