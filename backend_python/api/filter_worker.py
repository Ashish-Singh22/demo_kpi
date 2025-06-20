import pandas as pd
import json
import pandas as pd
from datetime import datetime
from flask import send_file

def process_worker_file(name,uploaded_data, filter_data):
    try:      
        selectionData = filter_data

        # Convert string to datetime
        start = datetime.strptime(selectionData["startDate"], "%Y-%m-%d")
        end = datetime.strptime(selectionData["endDate"], "%Y-%m-%d")

        # Calculate date difference
        diff_date = (end - start).days

        # print("Date Difference in Days:", diff_date)  # Output: 7

        import pickle
        import datetime

        data = []

        for record in uploaded_data:
            entry = {
                "date": datetime.strptime(record["date"], "%Y-%m-%d"),  # Convert string to datetime
                "shift": record["shift"],
                "count_basis": record["count_basis"],
                "time": record["time"],
                "load_data": pd.DataFrame(record["load_data"])  # Convert list of dicts to DataFrame
            }
            data.append(entry)


        final_data = {}

        import pandas as pd

        # Utility function
        def check(dic, name):
            return name in dic

        all_cols = set()
        final_data = {}

        # Main logic
        if diff_date == 0:
            print("1")
            for ob in data:
                for idx, row in ob["load_data"].iterrows():
                    for col in ob["load_data"].columns[1:-1]:  # skip Employee and Total
                        all_cols.add(col)
                        emp = row["Employee"]
                        if check(final_data, emp):
                            if check(final_data[emp], col):
                                final_data[emp][col] += row[col]
                            else:
                                final_data[emp][col] = row[col]
                        else:
                            final_data[emp] = {col: row[col]}

        elif 0 < diff_date <= 13:
            print("2")
            for ob in data:
                for idx, row in ob["load_data"].iterrows():
                    emp = row["Employee"]
                    col = ob["date"]
                    all_cols.add(col)
                    value = row.iloc[-1]
                    if check(final_data, emp):
                        if check(final_data[emp], col):
                            final_data[emp][col] += value
                        else:
                            final_data[emp][col] = value
                    else:
                        final_data[emp] = {col: value}

        elif 13 < diff_date <= 59:
            print("3")
            for ob in data:
                for idx, row in ob["load_data"].iterrows():
                    emp = row["Employee"]
                    curr_week = ((ob["date"] - start.date()).days // 7) + 1
                    week_key = f"Week {int(curr_week)}"
                    value = row.iloc[-1]

                    if check(final_data, emp):
                        if week_key not in final_data[emp]:
                            final_data[emp][week_key] = 0
                        final_data[emp][week_key] += value
                    else:
                        # Prepare all weeks for the employee
                        w_n = (diff_date // 7) + (1 if diff_date % 7 != 0 else 0)
                        cols = [f"Week {i}" for i in range(1, w_n + 1)]
                        week_dict = {col: 0 for col in cols}
                        final_data[emp] = week_dict
                        if curr_week <= w_n:
                            final_data[emp][week_key] += value
                        all_cols.update(cols)

        elif diff_date > 59:
            print("4")
            for ob in data:
                for idx, row in ob["load_data"].iterrows():
                    emp = row["Employee"]
                    curr_month = ((ob["date"] - start.date()).days // 30) + 1
                    month_key = f"Month {int(curr_month)}"
                    value = row.iloc[-1]

                    if check(final_data, emp):
                        if month_key not in final_data[emp]:
                            final_data[emp][month_key] = 0
                        final_data[emp][month_key] += value
                    else:
                        # Prepare all months for the employee
                        m_n = (diff_date // 30) + (1 if diff_date % 30 != 0 else 0)
                        cols = [f"Month {i}" for i in range(1, m_n + 1)]
                        month_dict = {col: 0 for col in cols}
                        final_data[emp] = month_dict
                        if curr_month <= m_n:
                            final_data[emp][month_key] += value
                        all_cols.update(cols)

        # Final DataFrame construction
        send_data = pd.DataFrame(columns=['Employee'] + sorted(all_cols))
        
        if'workerName' in selectionData:
            for employee, hour_data in final_data.items():
                if selectionData['workerName'] != employee:
                    continue
                row = {'Employee': employee}
                for col in all_cols:
                    row[col] = hour_data.get(col, 0)
                send_data = pd.concat([send_data, pd.DataFrame([row])], ignore_index=True)
        else:
            for employee, hour_data in final_data.items():
                row = {'Employee': employee}
                for col in all_cols:
                    row[col] = hour_data.get(col, 0)
                send_data = pd.concat([send_data, pd.DataFrame([row])], ignore_index=True)
        # print(send_data)


        send_data.to_excel("send_data.xlsx", index=False)
        return send_file("send_data.xlsx", as_attachment=True)
    except Exception as e:
        return {'success': False, 'message': str(e)}





