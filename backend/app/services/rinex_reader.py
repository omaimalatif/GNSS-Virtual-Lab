from pathlib import Path
import georinex as gr

BASE_DIR = Path(__file__).resolve().parents[3]

DATASET = (
    BASE_DIR
    / "datasets"
    / "navigation"
    / "BRDC00WRD_R_20250030000_01D_GN.rnx"
)


def load_navigation():

    print("Using navigation file:")
    print(DATASET)

    nav = gr.load(DATASET)

    return nav