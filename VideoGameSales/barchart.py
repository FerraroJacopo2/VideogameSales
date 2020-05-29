import pandas as pd
import numpy as np
  
def barcharts():
    df = pd.read_csv('static/csv/vgsales.csv').fillna(0)
    genres = df.Genre.unique().tolist()
    
    years = df.Year.unique().tolist()
    years.remove(0)
    years.sort()
    print(years)
    
    result = pd.DataFrame(columns=['Genre','NA_Sales','PAL_Sales','JP_Sales'])
    
    for y in years:
        list_NA=[]
        list_PAL=[]
        list_JP=[]
        
        for i in range(len(genres)):
            tot_NA = df.loc[(df['Genre'] == genres[i]) & (df['Year'] == y), 'NA_Sales'].sum()
            tot_PAL = df.loc[(df['Genre'] == genres[i]) & (df['Year'] == y), 'PAL_Sales'].sum()
            tot_JP = df.loc[(df['Genre'] == genres[i]) & (df['Year'] == y), 'JP_Sales'].sum()
            
            list_NA.append(tot_NA)
            list_PAL.append(tot_PAL)
            list_JP.append(tot_JP)
        
        indices_NA = (-np.asarray(list_NA)).argsort()[:3]
        indices_PAL = (-np.asarray(list_PAL)).argsort()[:3]
        indices_JP = (-np.asarray(list_JP)).argsort()[:3]
        
        z = set(indices_NA).union( set(indices_PAL), set(indices_JP))#, set(indices_OT))
        print(y, z)
        for i in z:
            dict = {
                "Genre" : genres[i],
                "NA_Sales" : 0,
                "PAL_Sales" : 0,
                "JP_Sales": 0,
                "Year": y
            }
            
            if (i in indices_NA):
                dict["NA_Sales"] = list_NA[i]
            if (i in indices_PAL):
                dict["PAL_Sales"] = list_PAL[i]
            if (i in indices_JP):
                dict["JP_Sales"] = list_JP[i]
                    
            result = result.append(dict, ignore_index=True)
    
    result = tot_barchart(result);
    result.to_csv('static/csv/vgsales-barchart.csv')

def tot_barchart(result):
    df = pd.read_csv('static/csv/vgsales.csv').fillna(0)
    genres = df.Genre.unique().tolist()
    list_NA=[]
    list_PAL=[]
    list_JP=[]
    
    for i in range(len(genres)):
        tot_NA = df.loc[df['Genre'] == genres[i], 'NA_Sales'].sum()
        tot_PAL = df.loc[df['Genre'] == genres[i], 'PAL_Sales'].sum()
        tot_JP = df.loc[df['Genre'] == genres[i] , 'JP_Sales'].sum()
        
        list_NA.append(tot_NA)
        list_PAL.append(tot_PAL)
        list_JP.append(tot_JP)
    
    indices_NA = (-np.asarray(list_NA)).argsort()[:3]
    indices_PAL = (-np.asarray(list_PAL)).argsort()[:3]
    indices_JP = (-np.asarray(list_JP)).argsort()[:3]
    
    z = set(indices_NA).union( set(indices_PAL), set(indices_JP))#, set(indices_OT))
    print("tot", z)
    for i in z:
        dict = {
            "Genre" : genres[i],
            "NA_Sales" : 0,
            "PAL_Sales" : 0,
            "JP_Sales": 0,
            "Year": "tot"
        }
        
        if (i in indices_NA):
            dict["NA_Sales"] = list_NA[i]
        if (i in indices_PAL):
            dict["PAL_Sales"] = list_PAL[i]
        if (i in indices_JP):
            dict["JP_Sales"] = list_JP[i]
                
        result = result.append(dict, ignore_index=True)
    return result
