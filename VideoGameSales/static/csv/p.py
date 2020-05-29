import pandas as pd
import numpy as np

#creo result_temp
user_df = pd.read_csv('result.csv')
user_df = user_df.rename(columns={'name': 'Name', 'console' : 'Platform','userscore' : 'User_Scoree'})
user_df = user_df.drop(['metascore', 'date'], axis=1)   


diz = {
    'PS3':'PS3', 
    'X360':'X360' ,
    'PC':'PC'     ,
    '3DS':'3DS'   ,
    'PS4':'PS4'   ,
    'DS':'DS'     ,
    'PSP':'PSP'   ,
    'PS2':'PS2'   ,
    'GBA':'GBA'   ,
    'N64':'N64'   ,
    'DC':'DC'     ,
    'GC':'GC'     ,
    'PS':'PS'     ,   
    ' PC':'PC'    ,
    ' VITA': 'PSV',        
    'WIIU':'WiiU' ,
    'VITA':'PSV'  ,
    'XONE':'XOne' ,
    'Switch':'NS' ,
    'WII':'Wii'   ,
    'XBOX':'XB'   
}

user_df["Platform"] = user_df["Platform"].map(diz)

user_df.reset_index(drop=True)
user_df.to_csv("result_temp.csv")

data=pd.read_csv("vgsales.csv", error_bad_lines=False, na_filter=True)
df2 = pd.read_csv('result_temp.csv')
df_final = data.merge(df2, how='left',left_on = ['Name','Platform'], right_on = ['Name','Platform'])
df_final.to_csv("vgsales_temp.csv")
data=pd.read_csv("vgsales_temp.csv", error_bad_lines=False, na_filter=True)
data = data.drop('User_Score', axis=1)
data = data.drop('Unnamed: 0', axis=1)
data.drop(data.columns[data.columns.str.contains('unnamed',case = False)],axis = 1, inplace = True)
data.rename(columns={'User_Scoree':'User_Score'}, inplace=True)
data.Global_Sales.replace(np.nan,0,inplace=True)
data.NA_Sales.replace(np.nan,0,inplace=True)
data.PAL_Sales.replace(np.nan,0,inplace=True)
data.JP_Sales.replace(np.nan,0,inplace=True)
data.Other_Sales.replace(np.nan,0,inplace=True)
data.Platform.replace(np.nan,"NA",inplace=True)
data.ESRB_Rating.replace(np.nan,"NP",inplace=True)
data.Critic_Score.replace(np.nan,0,inplace=True)
data.User_Score.replace(np.nan,0,inplace=True)
data.Total_Shipped.replace(np.nan,0,inplace=True)
data.User_Score.replace("tbd",0,inplace=True)
data['Global_Sales']+=data['Total_Shipped']
data = data.drop('Total_Shipped', axis=1)
data = data.drop(data[data.Global_Sales == 0.0].index)
data = data.drop(data[(data.Year == 2020.0)].index)
data = data.drop(data[(data.Year < 1978)].index)
data.to_csv("vgsales_total.csv")
print("vgsales_total esportato")
data = data.drop(data[(data.NA_Sales == 0.0) & (data.JP_Sales == 0.0) & (data.PAL_Sales == 0.0) & (data.Other_Sales == 0.0)].index)
data.to_csv("vgsales_map.csv")
print("vgsales_map esportato")
data=pd.read_csv("vgsales_total.csv", error_bad_lines=False)
data = data.drop(data[data.Critic_Score == 0.0].index)
data.to_csv("vgsales_critic.csv")
print("vgsales_critic esportato")
