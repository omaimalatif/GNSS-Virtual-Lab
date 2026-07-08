import numpy as np

MU = 3.986005e14  # Earth's gravitational constant (m^3/s^2)
OMEGA_E = 7.2921151467e-5

def calculate_satellite_position(ephemeris):
    """
    Extract useful orbital parameters from one satellite's ephemeris.
    """

    # Read scalar values (no [0] because time has already been selected)
    sqrtA = float(ephemeris.sqrtA.values)
    A = sqrtA ** 2

    DeltaN = float(ephemeris.DeltaN.values)
    M0 = float(ephemeris.M0.values)
    e = float(ephemeris.Eccentricity.values)

    Toe = float(ephemeris.Toe.values)

    omega = float(ephemeris.omega.values)
    Omega0 = float(ephemeris.Omega0.values)
    OmegaDot = float(ephemeris.OmegaDot.values)

    i0 = float(ephemeris.Io.values)
    IDOT = float(ephemeris.IDOT.values)

    Cuc = float(ephemeris.Cuc.values)
    Cus = float(ephemeris.Cus.values)

    Crc = float(ephemeris.Crc.values)
    Crs = float(ephemeris.Crs.values)

    Cic = float(ephemeris.Cic.values)
    Cis = float(ephemeris.Cis.values)

    # Mean motion
    n0 = np.sqrt(MU / A**3)
     # Corrected mean motion
    n = n0 + DeltaN
    # Current observation time
    t = Toe

# Time difference from ephemeris reference time
    tk = t - Toe
    
# Mean anomaly at observation time
    Mk = M0 + n * tk
# Initial guess
    Ek = Mk
# Solve Kepler's Equation
    for i in range(10):
     Ek = Mk + e * np.sin(Ek)
# Compute True Anomaly
    vk = np.arctan2(
    np.sqrt(1 - e**2) * np.sin(Ek),
    np.cos(Ek) - e
)
    
# Argument of Latitude
    phi = vk + omega 

# Harmonic Corrections

    du = Cuc * np.cos(2 * phi) + Cus * np.sin(2 * phi)

    dr = Crc * np.cos(2 * phi) + Crs * np.sin(2 * phi)

    di = Cic * np.cos(2 * phi) + Cis * np.sin(2 * phi)
    
    uk = phi + du
    
    rk = A * (1 - e * np.cos(Ek)) + dr
    ik = i0 + IDOT * tk + di
    
# Step 10: Satellite coordinates in orbital plane

    xPrime = rk * np.cos(uk)

    yPrime = rk * np.sin(uk)
    
# Step 11: Corrected Longitude of Ascending Node

    OmegaK = Omega0 + (OmegaDot - OMEGA_E) * tk - OMEGA_E * Toe
    
    X = xPrime * np.cos(OmegaK) - yPrime * np.cos(ik) * np.sin(OmegaK)
    Y = xPrime * np.sin(OmegaK) + yPrime * np.cos(ik) * np.cos(OmegaK)
    Z = yPrime * np.sin(ik)

    return {
        "semiMajorAxis": float(A),
        "meanMotion": float(n),
        "eccentricity": float(e),
        "meanAnomaly": float(M0),
        "toe": float(Toe),
        "omega": float(omega),
        "Omega0": float(Omega0),
        "OmegaDot": float(OmegaDot),
        "i0": float(i0),
        "IDOT": float(IDOT),
        "Cuc": float(Cuc),
        "Cus": float(Cus),
        "Crc": float(Crc),
        "Crs": float(Crs),
        "Cic": float(Cic),
        "Cis": float(Cis),
        "tk": float(tk),
        "meanAnomalyAtTime": float(Mk),
        "eccentricAnomaly": float(Ek),
        "trueAnomaly": float(vk),
        "argumentOfLatitude": float(phi),
        "correctedArgumentOfLatitude": float(uk),
        "radius": float(rk),
        "inclination": float(ik),
        "xPrime": float(xPrime),
        "yPrime": float(yPrime),
        "OmegaK": float(OmegaK),
        "x": float(X),
        "y": float(Y),
        "z": float(Z),
    }