import matplotlib.colors as mcolors

def validColors(color: str):
    try:
        rgba = mcolors.to_rgba(color)
        return mcolors.to_hex(rgba)
    except ValueError:
        return "#FFFFFF"
