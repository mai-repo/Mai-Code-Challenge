from flask import request, jsonify
import math

def pagination(items, per_page=5):

    try:
        page = request.args.get('page', 1, type=int)
        start = (page - 1) * per_page
        end = start + per_page
        total_items = len(items)
        total_pages = math.ceil(total_items / per_page)

        paginated_items = items[start:end]

        return jsonify({
            "data": paginated_items,
            "pagination": {
                "total_items": total_items,
                "total_pages": total_pages,
                "current_page": page,
                "per_page": per_page
            }
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500