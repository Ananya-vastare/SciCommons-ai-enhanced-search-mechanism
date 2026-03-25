from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import UserSearch
from .search_query_summarization import get_dummy_paper_data

@csrf_exempt
def server(request):
    if request.method == "GET":
        user_query = request.GET.get("query", "").strip()

        if not user_query:
            return JsonResponse({"error": "No query provided"}, status=400)

        try:
            # Save the query to the database
            saved_query = UserSearch.objects.create(query_text=user_query)

            # Get data from your AI function
            result = get_dummy_paper_data(user_query)

            return JsonResponse({
                "status": "success",
                "saved_id": saved_query.id,
                "paper": result["paper_details"],
                # Convert numpy arrays to lists so JSON can serialize them
                "query_embeddings": result["query_embeddings"].tolist(),
                "summary_embeddings_shape": list(result["summary_embeddings_shape"]),
            })

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)