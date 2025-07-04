import pandas as pd

def process_worker_file(file_stream):
    try:
      
      
      # -*- coding: utf-8 -*-
      """DN_productivity_KPI.ipynb

      Automatically generated by Colab.

      Original file is located at
          https://colab.research.google.com/drive/14tYdq8YEL49Q2QXXgb5Qj8MF6JeEAjZ1
      """

      # # Step 1: Upload the Excel file
      # from google.colab import files
      # uploaded = files.upload()
      # # Step 2: Read the Excel file using pandas
      # import pandas as pd

      # # Get the uploaded file name
      # filename = list(uploaded.keys())[0]

      # Load Excel file into a DataFrame
      productivity_data = pd.read_excel(file_stream)
      # productivity_data.head()  # Show the first few rows

      # List of columns you want to keep
      columns_to_keep = ['ORGANIZATION_CODE','DELIVERY_ID', 'SHIPMENT_PRIORITY_CODE', 'DN_CREATION_DATE', 'LOAD_OFF_DATE_MAX',
                        'STAGE_MOVE_DATE', 'INVOICE_DATE_TIME','NO_OF_LINES','HASH_QTY','DN_VALUE']

      # Filter the DataFrame
      productivity_data = productivity_data[columns_to_keep]
      # Remove rows with any NaN values in the selected columns
      productivity_data = productivity_data.dropna()

      # # Show the filtered DataFrame
      # productivity_data.head()

      # for Drop Off time
      import datetime
      obj = {
          "date": None,
          "dn_count":0,
          "ship_priority":{},
          "organization":None,
          "t_c_to_pic_hour":0,
          "t_pic_to_pac_hour":0,
          "t_pac_to_inv_hour":0,
          "t_quantity":0,
          "t_lines":0,
          "t_dn_value":0
      }
      data=[]

      # value=[dn_count,t_c_to_pic_hour,t_pic_to_pac_hour,t_pac_to_inv_hour,quantity,lines,dn_value]

      # 2. Function to insert obj["ship_priority"]
      def insert(new_obj,name, value):
          if name not in new_obj:
              new_obj[name] = value

      # 3. Function to check if name and value exist
      def check(new_obj,name):
          return name in new_obj

      # main code
      # # ship_dn_data['date'] = ship_dn_data['timestamp'].dt.date
      # # Calculate the time difference in seconds
      # time_diff = (ship_dn_data['LOAD_OFF_DATE_MAX'] - ship_dn_data['DN_CREATION_DATE']).dt.total_seconds()

      # # Convert seconds to decimal hours
      # ship_dn_data['HR_TAKEN'] = time_diff / 3600
      # value=[dn_count,t_c_to_pic_hour,t_pic_to_pac_hour,t_pac_to_inv_hour,quantity,lines,dn_value]

      for index,row in productivity_data.iterrows():
        t_c_to_pic_hour = (row['LOAD_OFF_DATE_MAX'] - row['DN_CREATION_DATE']).total_seconds() / 3600
        t_pic_to_pac_hour = (row['STAGE_MOVE_DATE'] - row['LOAD_OFF_DATE_MAX']).total_seconds() / 3600
        t_pac_to_inv_hour = (row['INVOICE_DATE_TIME'] - row['STAGE_MOVE_DATE']).total_seconds() / 3600
        p=0
        for ob in data:
          if row['DN_CREATION_DATE'].date() == ob["date"] and row['ORGANIZATION_CODE'] == ob["organization"]:
              ob["dn_count"]+=1
              ob["t_c_to_pic_hour"] += t_c_to_pic_hour
              ob["t_pic_to_pac_hour"] += t_pic_to_pac_hour
              ob["t_pac_to_inv_hour"] += t_pac_to_inv_hour
              ob["t_quantity"] += row["HASH_QTY"]
              ob["t_lines"]+=row["NO_OF_LINES"]
              ob["t_dn_value"]+=row["DN_VALUE"]
              if (check(ob["ship_priority"],row["SHIPMENT_PRIORITY_CODE"])):
                ob["ship_priority"][row["SHIPMENT_PRIORITY_CODE"]][0] += 1
                ob["ship_priority"][row["SHIPMENT_PRIORITY_CODE"]][1] += t_c_to_pic_hour
                ob["ship_priority"][row["SHIPMENT_PRIORITY_CODE"]][2] += t_pic_to_pac_hour
                ob["ship_priority"][row["SHIPMENT_PRIORITY_CODE"]][3] += t_pac_to_inv_hour
                ob["ship_priority"][row["SHIPMENT_PRIORITY_CODE"]][4] += row["HASH_QTY"]
                ob["ship_priority"][row["SHIPMENT_PRIORITY_CODE"]][5] += row["NO_OF_LINES"]
                ob["ship_priority"][row["SHIPMENT_PRIORITY_CODE"]][6] += row["DN_VALUE"]
              else:
                insert(ob["ship_priority"],row["SHIPMENT_PRIORITY_CODE"],[1,t_c_to_pic_hour,t_pic_to_pac_hour,t_pac_to_inv_hour,row["HASH_QTY"],row["NO_OF_LINES"],row["DN_VALUE"]])
              p=1
              break

        if p==0:
          data.append({
                "date": row['DN_CREATION_DATE'].date(),
                "dn_count":1,
                "ship_priority":{row["SHIPMENT_PRIORITY_CODE"]:[1,t_c_to_pic_hour,t_pic_to_pac_hour,t_pac_to_inv_hour,row["HASH_QTY"],row["NO_OF_LINES"],row["DN_VALUE"]]},
                "organization":row["ORGANIZATION_CODE"],
                "t_c_to_pic_hour":t_c_to_pic_hour,
                "t_pic_to_pac_hour":t_pic_to_pac_hour,
                "t_pac_to_inv_hour":t_pac_to_inv_hour,
                "t_quantity":row["HASH_QTY"],
                "t_lines":row["NO_OF_LINES"],
                "t_dn_value":row["DN_VALUE"]

            })



      print(data)

      print(len(data))

      # Assuming `data` is already created as per your current logic
      ready_to_send = []

      for entry in data:
        record = {
            "date": entry["date"].strftime("%Y-%m-%d"),  # Convert date to string
            "dn_count":entry["dn_count"],
            "ship_priority":entry["ship_priority"],
            "organization":entry["organization"],
            "t_c_to_pic_hour":entry["t_c_to_pic_hour"],
            "t_pic_to_pac_hour":entry["t_pic_to_pac_hour"],
            "t_pac_to_inv_hour":entry["t_pac_to_inv_hour"],
            "t_quantity":entry["t_quantity"],
            "t_lines":entry["t_lines"],
            "t_dn_value":entry["t_dn_value"]
        }
        ready_to_send.append(record)
      return {'success': True, 'data': ready_to_send}
    except Exception as e:
        return {'success': False, 'message': str(e)}