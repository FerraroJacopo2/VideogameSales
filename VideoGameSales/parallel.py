import pandas as pd
import numpy as np

def parallel():
    df = pd.read_csv('static/csv/modified.csv').fillna(0)
    
    user_df = pd.read_csv('result.csv')
    user_df = user_df.rename(columns={'name': 'Name', 'console': 'Platform', 'userscore' : 'User_Score'})
    user_df = user_df.drop(['metascore', 'date'], axis=1)   
    
    df.reset_index(drop=True)
    df.to_csv("test.csv")
    