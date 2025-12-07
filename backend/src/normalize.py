"""
Data Normalization Module
-------------------------
This module handles the ingestion and transformation of raw JSON data.
The raw data is structured in a column format (attributes mapping to indices),
and this module normalizes it into a standard row-oriented list of dictionaries,
which is easier for the frontend and API to consume.
"""

import json
import os


def load_raw_json(path):
    """
    Load a JSON file from the specified path.

    Args:
        path (str): The absolute or relative file path to the JSON file.

    Returns:
        dict: The parsed JSON data as a Python dictionary.
    """
    with open(path, "r", encoding="utf8") as f:
        return json.load(f)

def normalize(data):
    """
    Pivot the dataset from a Column-Oriented format to a Row-Oriented format.

    Args:
        data (dict): The raw dictionary where keys are attributes (columns)
                     and values are maps of index-to-value.

    Returns:
        list[dict]: A list of dictionaries, where each dictionary represents
                    a single row (song) with all its attributes.
    """     
    attributes = list(data.keys())
    first_attr = attributes[0]
    row_count = len(data[first_attr])
    
    normalized_rows = [] 
    
    for i in range(row_count): 
        row = {}
        
        for attr in attributes:
            
            index_key = str(i) # The raw JSON uses string keys ("0", "1") instead of integers.
            row[attr] = data[attr].get(index_key) # Use .get() to handle potential missing keys gracefully, returning None if missing
            
        normalized_rows.append(row) #once inner loop is done for each iteration, the one row will have all attributes of a song, add to the list normalized rows
        
    return normalized_rows

#testing logic
if __name__ == "__main__":
    base_dir = os.path.dirname(__file__)
    json_path = os.path.join(base_dir, "..", "data", "playlist.json")

    raw_data = load_raw_json(json_path)        # load the file
    normalized = normalize(raw_data)           # normalize it

    print("Total rows:", len(normalized))
    print("First row:", normalized[0])
