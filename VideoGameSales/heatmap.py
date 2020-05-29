import pandas as pd
import numpy as np
import json

def heatmap():
    df = pd.read_csv('static/csv/vgsales.csv')
    
    platGenre = pd.crosstab(df.Platform,df.Genre)
    
    platfTot = platGenre.sum(axis=1).reset_index().rename(columns={0:'tot'})
    genreTot = platGenre.sum(axis=0).reset_index().rename(columns={0:'tot'})
    dfPlatforms = platfTot[platfTot['tot']>1007]
    dfGenres = genreTot[genreTot['tot']>1000]
    
    platforms = dfPlatforms.Platform.to_list()
    genres = dfGenres.Genre.to_list()
    
    eo = pd.crosstab(df.Genre,df.Platform).replace(0,np.nan).stack().reset_index().rename(columns={0:'tot'})
    eo = eo[eo['Platform'].isin(platforms)]
    eo = eo[eo['Genre'].isin(genres)]
    
    eo.to_csv("static/csv/vgsales-heatmap-pc.csv")
    
    platforms.remove('PC')
    eo = eo[eo['Platform']!='PC']
        
    genres = json.dumps(eo['Genre'].unique().tolist())
    platforms = json.dumps(eo['Platform'].unique().tolist())
    
    eo.to_csv("static/csv/vgsales-heatmap-no-pc.csv")
    return genres,platforms
