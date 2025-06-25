from flask import Blueprint, request, jsonify
from .inventory_excel_to_data import process_inventory_file

uploadInventoryController_bp = Blueprint('uploadInventoryController_bp', __name__)

@uploadInventoryController_bp.route('/upload-inventory', methods=['POST'])
def calculate_uploadInventoryController():
    try:
        if 'scheduleReport' not in request.files or 'exceptionReport' not in request.files:
            return jsonify({'success': False, 'message': 'Missing files in request'}), 400

        schedule_file = request.files['scheduleReport']
        exception_file = request.files['exceptionReport']
        week = request.form.get("week")
        month = request.form.get("month")
        print("Week:", week)
        print("Month:", month)

        # You can now process files independently
        scheduleData = process_inventory_file(schedule_file)
        exceptionData = process_inventory_file(exception_file)
        print("Schedule Data:", scheduleData)
        print("Exception Data:", exceptionData)
        Total_Storage_Location_Name = scheduleData["Count of Storage Location Name"]+ exceptionData["Count of Storage Location Name"]
        Total_Adjustment_Date = scheduleData["Count of Adjustment Date"] + exceptionData["Count of Adjustment Date"]
        Total_Adjustment_Amount = scheduleData["Sum of Adjustment Amount"] + exceptionData["Sum of Adjustment Amount"]
        Total_Gross_Amount = scheduleData["Sum of Gross Amount"] + exceptionData["Sum of Gross Amount"]
        Total_Total_Cost = scheduleData["Sum of Total Cost"] + exceptionData["Sum of Total Cost"]
        Total_Gross_Qty = scheduleData["Sum of Gross Qty"] + exceptionData["Sum of Gross Qty"]
        Total_System_Inventory_Quantity = scheduleData["Sum of System Inventory Quantity"] + exceptionData["Sum of System Inventory Quantity"]
        Difference = Total_Storage_Location_Name - Total_Adjustment_Date

        return jsonify({
            'success': True,
            'data': {
                'scheduleData': scheduleData,
                'exceptionData': exceptionData,
                'week': week,
                'month': month,
                'Total_Storage_Location_Name': Total_Storage_Location_Name,
                'Total_Adjustment_Date': Total_Adjustment_Date,
                'Total_Adjustment_Amount': Total_Adjustment_Amount,
                'Total_Gross_Amount': Total_Gross_Amount,
                'Total_Total_Cost': Total_Total_Cost,
                'Total_Gross_Qty': Total_Gross_Qty,
                'Total_System_Inventory_Quantity': Total_System_Inventory_Quantity,
                'Difference': Difference
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
