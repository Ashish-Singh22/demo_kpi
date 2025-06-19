from flask import Blueprint, request, jsonify , send_file
from .filter_worker import process_worker_file  # Import your processing logic

filterWorkerController_bp = Blueprint('filterWorkerController_bp', __name__)

@filterWorkerController_bp.route('/filter-worker', methods=['POST'])
def calculate_filterWorkerController():
    try:
        payload = request.get_json()
        if not payload:
            return jsonify({'success': False, 'message': 'No JSON body received'}), 400

        picker_data = payload.get('pickerData', [])
        filter_data = payload.get('filterData', {})

        if not picker_data:
            return jsonify({'success': False, 'message': 'Missing picker data'}), 400

        # Now you can use both picker_data and filter_data
        result = process_worker_file(picker_data, filter_data)  # update your function if needed

        return send_file("send_data.xlsx", as_attachment=True)

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
