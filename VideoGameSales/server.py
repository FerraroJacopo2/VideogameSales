from flask import Flask, render_template, Response
import pandas as pd
import numpy as np
import json
from heatmap import heatmap
from barchart import barcharts
from pca import pca

app = Flask(__name__)

@app.route("/")
def index():
    genres, platforms = heatmap()
    
    #use barcharts() only if vgsales-barchart.csv is not created
    #barcharts()
    pca()
    return render_template("index.html", genres= genres, platforms = platforms)
    
if __name__ == "__main__":
    app.run(debug=True)
