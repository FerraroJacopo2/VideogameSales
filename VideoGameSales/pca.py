import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

def pca():
    df = pd.read_csv('static/csv/vgsales_total.csv').fillna(0)
    
    df = df.loc[df['Critic_Score'] != 0]
    df = df.loc[df['User_Score'] != 0]
    df = df.loc[df['Global_Sales'] != 0]
    
    df = df.drop(['Rank', 'Unnamed: 0'], axis=1)
    df.reset_index(drop= True)
    
    diz = {
        'Sports':1,'Racing':2,'Platform':3,'Misc':4,'Party':5,'Action':6,'Shooter':7,
        'Action-Adventure':8,'Fighting':9,'Simulation':10,'Role-Playing':11,
        'Strategy':12,'Adventure':13,'MMO':14,'Music':15,'Puzzle':16,'Board Game':17,
        'Education':18,'Visual Novel':19
    }
    
    #df["Genre"] = df["Genre"].map(diz)
    #df.to_csv("pca-tdb.csv")
    
    features=["Critic_Score", "User_Score", "Global_Sales"]#"Year"]#,"Genre"]
    columns_to_take = ["Name","Genre","Critic_Score", "User_Score", "Global_Sales", "Year"]
    
    x = df.loc[:, features].values
    x = StandardScaler().fit_transform(x)

    pca = PCA(n_components=2)
    principalComponents = pca.fit_transform(x)
    newdf = pd.DataFrame(data = principalComponents, columns = ["x", "y"])
    
    principalDf = pd.DataFrame(data=principalComponents, columns=['x', 'y'])
    finalDf = pd.concat([principalDf, df[columns_to_take].reset_index(drop=True)], axis=1)
    
    finalDf.to_csv("static/csv/vgsales-pca.csv", sep=',', index=False)
    
    #
    #interDf = pd.concat([newdf, df[["Genre"]]], axis=1)
    #
    #finalDf = pd.concat([interDf, df[["Critic_Score", "User_Score", "Global_Sales" ,"Year"]]], axis=1)
    #
    #finalDf.to_csv("static/csv/vgsales-pca.csv", index=False)
    