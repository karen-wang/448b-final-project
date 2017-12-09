import pandas as pd
import re

df = pd.read_csv('cs_reqs.csv')
result = []

for index, row in df.iterrows():
  raw_title = row['course_title']
  raw_description = row['course_description']
  raw_title_split = raw_title.split(r".  ")
  course_id = raw_title_split[0].replace('\xc2\xa0', ' ')
  if len(raw_title_split) is 3:
    output = [course_id, raw_title_split[1], raw_description]
  result.append(output)

result_df = pd.DataFrame(result, columns=['id','title','description'])
result_df_sorted = result_df.sort_values(by='id')
result_df_sorted.to_csv('parsed_cs_reqs.csv', index=False)