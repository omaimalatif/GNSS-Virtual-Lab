from pathlib import Path
import georinex as gr

BASE_DIR = Path(__file__).resolve().parents[3]

DATASET = BASE_DIR / "datasets" / "navigation" / "BRDC00WRD_R_20250030000_01D_GN.rnx"

def load_navigation():
    print("Base directory:", BASE_DIR)
    print("Dataset path:", DATASET)
    print("Exists:", DATASET.exists())

    nav = gr.load(DATASET)
    return nav